import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; // ✅ เรียกจาก lib เพื่อกัน Database connection เต็ม
import { messagingApi } from '@line/bot-sdk'; // ✅ เพิ่มตัวส่งข้อความ LINE
import { GoogleGenerativeAI } from "@google/generative-ai"; // ✅ เพิ่ม AI

// ตั้งค่า LINE Client
const client = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
});

// ตั้งค่า AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { lineId, profile, dateKey, score, comment } = body;

    // 1. หา User หรือสร้างใหม่ถ้ายังไม่มี
    let user = await prisma.user.findUnique({ where: { lineId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          lineId,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl,
        }
      });
    }

    // 2. บันทึก/อัปเดตอารมณ์
    const mood = await prisma.moodLog.upsert({
      where: {
        userId_dateKey: { userId: user.id, dateKey },
      },
      update: { score, comment, updatedAt: new Date() },
      create: {
        userId: user.id,
        dateKey,
        score,
        comment,
      },
    });

    // 🚀 3. ระบบ AI ทักไลน์เมื่อเศร้า (คะแนน 1 หรือ 2)
    if (score <= 2) {
      try {
        // ให้ AI คิดคำปลอบใจสั้นๆ
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
          เพื่อนชื่อ ${user.nickname || 'เธอ'} เพิ่งบันทึกอารมณ์ว่า "แย่" (คะแนน ${score}/5)
          และเขียนระบายว่า: "${comment || 'ไม่ได้เขียนอะไร'}"
          ช่วยคิดข้อความทักไลน์ไปหาเขาหน่อย สั้นๆ 1 ประโยค แบบเพื่อนที่เป็นห่วงมากๆ และชวนคุยต่อ
          (ไม่ต้องใส่เครื่องหมายคำพูด)
        `;
        
        const result = await model.generateContent(prompt);
        const aiMessage = result.response.text();

        // ส่งเข้า LINE ทันที (Push Message)
        await client.pushMessage({
          to: lineId, // ส่งหาคนนี้
          messages: [{ type: 'text', text: aiMessage }]
        });
        
        // บันทึกว่าบอททักไปแล้วลงประวัติแชทด้วย
        await prisma.chatHistory.create({
           data: {
             userId: user.id,
             role: 'assistant',
             message: aiMessage
           }
        });

      } catch (err) {
        console.error("Failed to send LINE push:", err);
        // ไม่ต้อง return error เพื่อให้การบันทึกอารมณ์ยังทำงานต่อได้
      }
    }

    return NextResponse.json({ success: true, data: mood });

  } catch (error) {
    console.error("Mood API Error:", error);
    return NextResponse.json({ error: 'Failed to save mood' }, { status: 500 });
  }
}

// ...ส่วน GET (ดึงข้อมูล) ปล่อยไว้เหมือนเดิมก็ได้ครับ หรือถ้าหาไม่เจอเดี๋ยวผมส่งให้ครบชุด
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lineId = searchParams.get('lineId');

  if (!lineId) return NextResponse.json({ error: 'Line ID required' }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { lineId },
    include: { moods: true }
  });

  return NextResponse.json({ data: user ? user.moods : [] });
}