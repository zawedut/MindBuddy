import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Typhoon AI Client (OpenAI-compatible)
const typhoon = new OpenAI({
  apiKey: process.env.TYPHOON_API_KEY || '',
  baseURL: 'https://api.opentyphoon.ai/v1',
});

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // แปลง history format
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

⚠️ ถ้าเจอสัญญาณซึมเศร้าหนักหรืออยากทำร้ายตัวเอง:
- อยู่เคียงข้างด้วยความรัก ไม่ตัดสิน
- แนะนำสายด่วนสุขภาพจิต 1323`
      }
    ];

    // เพิ่มประวัติแชท
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        if (h.parts && h.parts[0]?.text) {
          messages.push({
            role: h.role === 'user' ? 'user' : 'assistant',
            content: h.parts[0].text
          });
        }
      });
    }

    // เพิ่มข้อความปัจจุบัน
    messages.push({ role: 'user', content: message });

    const completion = await typhoon.chat.completions.create({
      model: 'typhoon-v2-70b-instruct',
      messages: messages,
      max_tokens: 150,
      temperature: 0.8,
    });

    const reply = completion.choices[0]?.message?.content || "อือ... งง ลองพิมพ์ใหม่ได้มั้ย?";

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ reply: "เดี๋ยวนะ... มึนๆ อยู่ ลองพิมพ์ใหม่ได้มั้ย? 🥺" });
  }
}