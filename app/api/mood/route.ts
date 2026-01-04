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
        console.log('📤 Mood API: Calling Typhoon...');

        const response = await fetch('https://api.opentyphoon.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.TYPHOON_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'typhoon-v2.1-12b-instruct',
            messages: [
              {
                role: 'system',
                content: `คุณคือ "น้องเรียนดี" เพื่อนสนิทวัยรุ่น ตอบสั้นๆ 1-2 ประโยค ใช้ภาษาเป็นกันเอง (เรา/แก) ให้กำลังใจ`
              },
              {
                role: 'user',
                content: `เพื่อน${user.nickname ? `ชื่อ "${user.nickname}"` : ''} บันทึกอารมณ์ระดับ ${score}/5 (ยิ่งน้อยยิ่งแย่)${comment ? ` เขาเขียนว่า: "${comment}"` : ''}\n\nช่วยคิดข้อความทักไปให้กำลังใจหน่อย`
              }
            ],
            max_tokens: 500,
            temperature: 0.8,
          }),
        });

        const data = await response.json();
        let aiMessage = "เห้ยแก... วันนี้เป็นไงบ้าง? 💙";

        if (response.ok && data.choices?.[0]?.message?.content) {
          aiMessage = data.choices[0].message.content;
          console.log('✅ Mood AI Response:', aiMessage.substring(0, 50));
        } else {
          console.error('❌ Mood Typhoon Error:', JSON.stringify(data));
        }

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