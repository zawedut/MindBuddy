import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { messagingApi } from '@line/bot-sdk';
import { GoogleGenerativeAI } from "@google/generative-ai";

// ตั้งค่า LINE (เดี๋ยวไปเอา Token มาใส่ใน .env)
const client = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
});

// ตั้งค่า Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const events = body.events;

    // วนลูปทุก event ที่ส่งเข้ามา (ปกติจะมาทีละ 1)
    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        await handleMessage(event);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function handleMessage(event: any) {
  const userId = event.source.userId;
  const userMessage = event.message.text.trim();
  const replyToken = event.replyToken;

  // 1. หา User ใน Database
  let user = await prisma.user.findUnique({ where: { lineId: userId } });

  // ถ้ายังไม่มี User ให้สร้างใหม่ (กรณีเขาแอดไลน์มาแต่ยังไม่เคยเข้า LIFF)
  if (!user) {
    user = await prisma.user.create({ data: { lineId: userId } });
  }

  let replyText = "";

  // 🤖 Logic: ระบบจำชื่อ
  if (!user.nickname) {
    // ถ้ายังไม่มีชื่อเล่น -> ถือว่าข้อความที่ส่งมาคือ "ชื่อ" (หรือจะถามก่อนก็ได้)
    // แต่วิธีนี้ง่ายกว่า: ถ้ายังไม่มีชื่อ บังคับให้พิมพ์ชื่อก่อน
    await prisma.user.update({
      where: { id: user.id },
      data: { nickname: userMessage }
    });
    replyText = `ยินดีที่ได้รู้จักนะคุณ "${userMessage}"! \nเราจำชื่อคุณแล้วนะ อยากคุยอะไรบอกได้เลย ❤️`;
  } 
  // 🔄 Logic: ขอเปลี่ยนชื่อ
  else if (userMessage.startsWith("เปลี่ยนชื่อเป็น")) {
    const newName = userMessage.replace("เปลี่ยนชื่อเป็น", "").trim();
    if (newName) {
      await prisma.user.update({
        where: { id: user.id },
        data: { nickname: newName }
      });
      replyText = `โอเค! ต่อไปนี้เราจะเรียกคุณว่า "${newName}" นะครับ 😉`;
    } else {
      replyText = "พิมพ์ว่า 'เปลี่ยนชื่อเป็น [ชื่อใหม่]' ได้เลยนะ";
    }
  } 
  // 💬 Logic: คุยกับ AI (Gemini)
  else {
    // 1. ดึงประวัติการคุยล่าสุด 5 ข้อความ (เพื่อให้มันจำบทสนทนาได้)
    const history = await prisma.chatHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // แปลงประวัติให้ Gemini เข้าใจ
    const historyForAI = history.reverse().map((h: any) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.message }]
    }));

    // 2. เรียก Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `คุณคือ MindBuddy เพื่อน AI ที่น่ารัก. 
          คู่สนทนาชื่อ: ${user.nickname} (เรียกชื่อเขาบ่อยๆ นะ). 
          ถ้าเขาเศร้า ให้กำลังใจ. คุยสั้นๆ เป็นกันเอง.` }]
        },
        { role: "model", parts: [{ text: "รับทราบค่ะ! จะดูแลคุณ " + user.nickname + " อย่างดีเลย" }] },
        ...historyForAI
      ]
    });

    try {
      const result = await chat.sendMessage(userMessage);
      replyText = result.response.text();
    } catch (e) {
      replyText = "ขอโทษที ตอนนี้เรามึนๆ พิมพ์ใหม่ได้มั้ย? 😵‍💫";
    }
  }

  // 💾 บันทึกบทสนทนาลง Database (เพื่อให้จำได้ในครั้งหน้า)
  await prisma.chatHistory.createMany({
    data: [
      { userId: user.id, role: 'user', message: userMessage },
      { userId: user.id, role: 'assistant', message: replyText }
    ]
  });

  // 🚀 ส่งข้อความตอบกลับไปที่ LINE
  await client.replyMessage({
    replyToken: replyToken,
    messages: [{ type: 'text', text: replyText }],
  });
}