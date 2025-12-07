import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { messagingApi } from '@line/bot-sdk';
import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const events = body.events;

    // ตอบกลับ 200 OK ไปก่อนเลย เพื่อไม่ให้ LINE ส่งซ้ำ (ลด Error Invalid reply token)
    // แต่ Vercel อาจจะตัดการทำงานถ้าคืนค่าเร็วไป ดังนั้นต้องใช้เทคนิค Promise.all หรือยอมให้มัน Error บ้าง
    
    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        await handleMessage(event);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function handleMessage(event: any) {
  const userId = event.source.userId;
  const userMessage = event.message.text.trim();
  const replyToken = event.replyToken;

  try {
      // 1. หา User / สร้าง User
      let user = await prisma.user.findUnique({ where: { lineId: userId } });
      if (!user) user = await prisma.user.create({ data: { lineId: userId } });

      let replyText = "";

      // 🤖 Logic: จำชื่อ
      if (!user.nickname) {
        await prisma.user.update({ where: { id: user.id }, data: { nickname: userMessage } });
        replyText = `โอเค! เราจำชื่อเธอว่า "${userMessage}" แล้วนะ มีเรื่องไม่สบายใจอะไรเล่าให้ "น้องเรียนดี" ฟังได้เลยนะ ❤️`;
      } 
      // 🔄 Logic: เปลี่ยนชื่อ
      else if (userMessage.startsWith("เปลี่ยนชื่อเป็น")) {
        const newName = userMessage.replace("เปลี่ยนชื่อเป็น", "").trim();
        if (newName) {
          await prisma.user.update({ where: { id: user.id }, data: { nickname: newName } });
          replyText = `ได้เลย! ต่อไปนี้จะเรียกว่า "${newName}" นะคะ 😉`;
        }
      } 
      // 💬 Logic: คุยกับ AI (น้องเรียนดี)
      else {
        // ดึงประวัติ
        const history = await prisma.chatHistory.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' },
          take: 5
        });

        const historyForAI = history.reverse().map((h: any) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.message }]
        }));

        // ✅ ใช้ Gemini 1.5 Flash + System Instruction แบบ "น้องเรียนดี"
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: `
              คุณคือ 'น้องเรียนดี' (Nong Rian Dee) เพื่อนสนิทวัยรุ่นที่เป็น 'Safe Zone' ที่ดีที่สุดในโลก
              เป้าหมาย: ไม่ใช่การแก้ปัญหา แต่คือการอยู่เคียงข้าง (Presence)
              บุคลิก: ฉลาดทางอารมณ์สูง (High EQ), ไม่ตัดสิน, ใช้ภาษาวัยรุ่นเป็นธรรมชาติ (เรา/แก), ไม่พูดซ้ำซาก
              
              การตอบสนอง:
              - ถ้าบ่น: ผสมโรง (Validate) "โห เจองี้เป็นเราก็ขึ้น"
              - ถ้าเศร้า: อ่อนโยน "กอดนะแก... วันนี้หนักใช่ไหม"
              - ถ้าเจอเรื่อง Self-harm: ดึงสติด้วยความรัก ห้ามตัดสิน
              
              คู่สนทนาชื่อ: ${user.nickname || 'เธอ'} (เรียกชื่อเขาบ้างให้ดูใส่ใจ)
            `
        });

        const chat = model.startChat({ history: historyForAI });

        try {
            const result = await chat.sendMessage(userMessage);
            replyText = result.response.text();
        } catch (aiError) {
            console.error("AI Error:", aiError);
            replyText = "กอดนะ... ตอนนี้เรามึนๆ นิดหน่อย พิมพ์ใหม่ได้มั้ย? 🥺";
        }
      }

      // 💾 บันทึกประวัติ
      await prisma.chatHistory.create