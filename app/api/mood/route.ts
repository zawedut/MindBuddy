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

    // 2. บันทึก/อัปเดตอารมณ์ลง Database
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

    // 🚀 3. MindBuddy AI: ทักไลน์ไปปลอบใจเมื่อรู้สึกไม่ดี (คะแนน 1-3)
    // เงื่อนไข: ถ้าคะแนน <= 3 (โกรธ, เศร้า, เบื่อ) ให้ AI ทักไปหา
    if (score <= 3) {
      try {
        // ✅ ใช้ Gemma-3-27b-it (โควต้าเยอะ + ฉลาด)
        const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });
        
        // Prompt สั่งให้รับบทเป็น MindBuddy
        const prompt = `
          คุณคือ "MindBuddy" (หรือน้องเรียนดี) เพื่อนสนิทวัยรุ่นที่เป็น Safe Zone ที่ดีที่สุด
          บุคลิก: อบอุ่น, รับฟังเก่ง, ไม่ตัดสิน, ใช้ภาษาเป็นกันเอง (แทนตัวเองว่า "เรา" เรียกเขาว่า "แก" หรือชื่อเล่น)

          สถานการณ์: เพื่อนของคุณชื่อ "${user.nickname || 'เธอ'}" เพิ่งกดบันทึกอารมณ์มา
          - ระดับอารมณ์: ${score} เต็ม 5 (ยิ่งน้อยยิ่งแย่)
          - สิ่งที่เขาระบายมา: "${comment || 'ไม่ได้เขียนอะไรมา'}"

          โจทย์: ช่วยคิดข้อความทักไลน์ไปหาเขาหน่อย (สั้นๆ ไม่เกิน 2-3 ประโยค)
          - เป้าหมาย: ให้กำลังใจ ปลอบโยน หรือทำให้เขารู้สึกว่ามีคนอยู่ข้างๆ
          - ห้ามทำ: ห้ามสั่งสอน ห้ามบอกให้สู้ๆ แบบส่งเดช
          - ถ้าเขาเขียนระบายมา ให้อ่านแล้วตอบให้ตรงประเด็นที่เขาระบาย
        `;
        
        const result = await model.generateContent(prompt);
        const aiMessage = result.response.text();

        // ส่งเข้า LINE (Push Message)
        // ตัด [TEST] ออกแล้ว ให้เนียนเหมือนเพื่อนทักมาจริง
        await client.pushMessage({
          to: lineId,
          messages: [{ type: 'text', text: aiMessage }]
        });
        
        // บันทึกประวัติลง Chat History (เพื่อให้คุยต่อในไลน์ได้รู้เรื่อง)
        await prisma.chatHistory.create({
           data: {
             userId: user.id,
             role: 'assistant',
             message: aiMessage
           }
        });

      } catch (err) {
        console.error("Failed to send LINE push:", err);
        // ไม่ต้อง throw error เพื่อให้การบันทึกอารมณ์ยังทำงานสำเร็จ
      }
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