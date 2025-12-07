import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; // ✅ ใช้ Path เดิมของคุณ
import { messagingApi } from '@line/bot-sdk';
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    // 🚀 3. (ส่วนที่เพิ่ม) ส่งไลน์ยืนยันคะแนน "ทุกครั้ง" (เพื่อ Test)
    try {
        // ใช้ 1.5 Flash เพื่อความชัวร์เรื่องโควต้า
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const prompt = `
          ผู้ใช้ชื่อ ${user.nickname || 'เพื่อน'} กดบันทึกอารมณ์มา
          คะแนน: ${score} เต็ม 5
          ข้อความ: "${comment || '-'}"
          
          ช่วยพูดทวนสั้นๆ ว่า "ได้รับบันทึกคะแนน ${score}/5 แล้วครับ" 
          แล้วต่อด้วยคำพูดให้กำลังใจสั้นๆ 1 ประโยค
        `;
        
        const result = await model.generateContent(prompt);
        const aiMessage = result.response.text();

        // ส่งเข้า LINE ทันที
        await client.pushMessage({
          to: lineId,
          messages: [{ type: 'text', text: `[TEST System] ${aiMessage}` }]
        });
        
        // บันทึกประวัติ
        await prisma.chatHistory.create({
           data: {
             userId: user.id,
             role: 'assistant',
             message: aiMessage
           }
        });

    } catch (err) {
        console.error("Failed to send LINE push:", err);
    }

    return NextResponse.json({ success: true, data: mood });

  } catch (error) {
    console.error("Mood API Error:", error);
    return NextResponse.json({ error: 'Failed to save mood' }, { status: 500 });
  }
}

// ...ส่วน GET ปล่อยไว้เหมือนเดิม
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