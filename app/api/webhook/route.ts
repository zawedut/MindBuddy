import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { messagingApi } from '@line/bot-sdk';
import OpenAI from 'openai';

// LINE Client
const client = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
});

// Typhoon AI Client (OpenAI-compatible)
const typhoon = new OpenAI({
  apiKey: process.env.TYPHOON_API_KEY || '',
  baseURL: 'https://api.opentyphoon.ai/v1',
});

// 🔒 Deduplication: ป้องกัน LINE ส่งซ้ำ (เก็บ messageId 5 นาที)
const processedMessages = new Map<string, number>();
const DEDUP_TTL = 5 * 60 * 1000; // 5 minutes

function isDuplicate(messageId: string): boolean {
  const now = Date.now();
  // Clean up old entries
  for (const [id, timestamp] of processedMessages.entries()) {
    if (now - timestamp > DEDUP_TTL) processedMessages.delete(id);
  }
  if (processedMessages.has(messageId)) return true;
  processedMessages.set(messageId, now);
  return false;
}

// 🧠 Smart Name Detection: ตรวจสอบว่าข้อความมีชื่อหรือไม่
function extractName(message: string): string | null {
  const patterns = [
    /ชื่อ\s*(.{1,20}?)(?:\s|ครับ|ค่ะ|นะ|$)/i,
    /เรียก(?:ว่า|ผม|ฉัน|เรา)?\s*(.{1,20}?)(?:\s|ครับ|ค่ะ|นะ|ได้|$)/i,
    /(?:ผม|ฉัน|เรา|หนู)\s*ชื่อ\s*(.{1,20}?)(?:\s|ครับ|ค่ะ|นะ|$)/i,
    /^(.{1,15})(?:ครับ|ค่ะ|นะคะ|จ้า)$/i, // "โอมครับ" -> "โอม"
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim();
      // ตรวจสอบว่าไม่ใช่คำทั่วไป
      const commonWords = ['อะไร', 'ยังไง', 'ทำไม', 'ไหม', 'มั้ย', 'หรอ', 'เหรอ', 'นะ', 'ครับ', 'ค่ะ'];
      if (name.length >= 1 && name.length <= 20 && !commonWords.includes(name)) {
        return name;
      }
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const events = body.events;

    // ตอบ 200 OK ทันที
    const processes = events.map(async (event: any) => {
      if (event.type === 'message' && event.message.type === 'text') {
        // 🔒 Skip duplicate messages
        if (isDuplicate(event.message.id)) {
          console.log('⏭️ Skipping duplicate message:', event.message.id);
          return;
        }
        await handleMessage(event);
      }
    });

    await Promise.allSettled(processes);
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

    // 🧠 Smart Name Detection
    const detectedName = extractName(userMessage);

    // 🔄 Logic: เปลี่ยนชื่อ (explicit)
    if (userMessage.startsWith("เปลี่ยนชื่อเป็น")) {
      const newName = userMessage.replace("เปลี่ยนชื่อเป็น", "").trim();
      if (newName) {
        await prisma.user.update({ where: { id: user.id }, data: { nickname: newName } });
        replyText = `ได้เลย! ต่อไปเรียก "${newName}" นะ 😊`;
      }
    }
    // 🧠 ตรวจจับชื่อจากข้อความ
    else if (detectedName && !user.nickname) {
      await prisma.user.update({ where: { id: user.id }, data: { nickname: detectedName } });
      replyText = `โอเค จำได้แล้วว่าชื่อ "${detectedName}" นะ ยินดีที่ได้รู้จักเลย! มีอะไรเล่าให้ฟังได้นะ 💕`;
    }
    // 💬 Logic: คุยกับ AI
    else {
      // ดึงประวัติ
      const history = await prisma.chatHistory.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      // แปลง format สำหรับ OpenAI/Typhoon
      const messages: OpenAI.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: `คุณคือ "น้องเรียนดี" เพื่อนสนิทวัยรุ่นที่เป็น Safe Zone ให้ปรึกษาทุกเรื่อง

🎯 บุคลิก:
- พูดเหมือนเพื่อนสนิท ใช้ "เรา/แก" หรือ "เรา/เธอ"
- ภาษาวัยรุ่นไทยเนียนๆ (โห, อือ, จริงแก, เห้อออ)
- ไม่สั่งสอน ไม่ตัดสิน แค่อยู่เคียงข้าง

📝 กฎการตอบ (สำคัญมาก!):
- ตอบสั้นๆ 1-3 ประโยคเท่านั้น เหมือนแชทจริง
- ห้ามใช้ bullet points หรือลิสต์
- ห้ามตอบยาวเป็นย่อหน้า
- ใช้ emoji น้อยๆ แค่ 1-2 ตัว

${user.nickname ? `👤 เพื่อนชื่อ: ${user.nickname}` : '👤 ยังไม่รู้จักชื่อ'}`
        }
      ];

      // เพิ่มประวัติแชท (reverse เพราะดึงมา desc)
      history.reverse().forEach((h: any) => {
        messages.push({
          role: h.role === 'user' ? 'user' : 'assistant',
          content: h.message
        });
      });

      // เพิ่มข้อความปัจจุบัน
      messages.push({ role: 'user', content: userMessage });

      try {
        console.log('📤 Calling Typhoon API...');
        console.log('Messages count:', messages.length);

        const response = await fetch('https://api.opentyphoon.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.TYPHOON_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'typhoon-v2.1-12b-instruct',
            messages: messages,
            max_tokens: 150,
            temperature: 0.8,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          replyText = data.choices?.[0]?.message?.content || "อือ... งง ลองพิมพ์ใหม่ได้มั้ย?";
          console.log('✅ AI Response:', replyText.substring(0, 50));
        } else {
          console.error('❌ Typhoon Error:', JSON.stringify(data));
          replyText = "เดี๋ยวนะแก... มึนๆ อยู่ ลองใหม่อีกทีได้มั้ย? 🥺";
        }
      } catch (aiError) {
        console.error("AI Error:", aiError);
        replyText = "เดี๋ยวนะแก... มึนๆ อยู่ ลองใหม่อีกทีได้มั้ย? 🥺";
      }
    }

    // 💾 บันทึกประวัติ
    await prisma.chatHistory.createMany({
      data: [
        { userId: user.id, role: 'user', message: userMessage },
        { userId: user.id, role: 'assistant', message: replyText }
      ]
    });

    // 🚀 ส่งข้อความตอบกลับ
    if (replyToken) {
      await client.replyMessage({
        replyToken: replyToken,
        messages: [{ type: 'text', text: replyText }],
      });
    }

  } catch (err: any) {
    if (err.originalError?.response?.data?.message === "Invalid reply token") {
      return;
    }
    console.error("Handle Message Error:", err);
  }
}