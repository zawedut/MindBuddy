import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { messagingApi } from '@line/bot-sdk';
import OpenAI from 'openai';

// ตั้งค่า LINE Client
const client = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
});

// Typhoon AI Client (OpenAI-compatible)
const typhoon = new OpenAI({
  apiKey: process.env.TYPHOON_API_KEY || '',
  baseURL: 'https://api.opentyphoon.ai/v1',
});

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
    if (score <= 3) {
      try {
        const completion = await typhoon.chat.completions.create({
          model: 'typhoon-v2.1-12b-instruct',
          messages: [
            {
              role: 'system',
              content: `คุณคือ "MindBuddy" (หรือน้องเรียนดี) เพื่อนสนิทวัยรุ่นที่เป็น Safe Zone
บุคลิก: อบอุ่น, รับฟังเก่ง, ไม่ตัดสิน, ใช้ภาษาเป็นกันเอง (แทนตัวเองว่า "เรา" เรียกเขาว่า "แก")

📝 กฎการตอบ:
- ตอบสั้นๆ 1-2 ประโยคเท่านั้น เหมือนเพื่อนทักมา
- ห้ามใช้ bullet points
- ใช้ emoji น้อยๆ แค่ 1 ตัว`
            },
            {
              role: 'user',
              content: `เพื่อนชื่อ "${user.nickname || 'แก'}" บันทึกอารมณ์ระดับ ${score}/5 (ยิ่งน้อยยิ่งแย่)
${comment ? `เขาเขียนมาว่า: "${comment}"` : 'ไม่ได้เขียนอะไรมา'}

ช่วยคิดข้อความทักไปหาเขาหน่อย ให้กำลังใจแบบเพื่อนทักมา ห้ามสั่งสอน`
            }
          ],
          max_tokens: 100,
          temperature: 0.8,
        });

        const aiMessage = completion.choices[0]?.message?.content || "เห้ยแก... วันนี้เป็นไงบ้าง? 💙";

        // ส่งเข้า LINE (Push Message)
        await client.pushMessage({
          to: lineId,
          messages: [{ type: 'text', text: aiMessage }]
        });

        // บันทึกประวัติลง Chat History
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