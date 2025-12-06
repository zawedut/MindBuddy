import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; // ✅ เรียกจาก lib เพื่อกัน Database connection เต็ม

// 1. ดึงข้อมูล (GET)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lineId = searchParams.get("lineId");
  const month = searchParams.get("month"); 

  if (!lineId) return NextResponse.json({ error: "No Line ID" }, { status: 400 });

  // หา User คนนี้จาก Line ID
  const user = await prisma.user.findUnique({ where: { lineId } });
  
  if (!user) {
    return NextResponse.json({ data: [] });
  }

  // ดึงประวัติ
  const moods = await prisma.moodLog.findMany({
    where: {
      userId: user.id,
      dateKey: { startsWith: month || "" } 
    }
  });

  return NextResponse.json({ data: moods });
}

// 2. บันทึกข้อมูล (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // รับค่า profile เข้ามาด้วย (displayName, pictureUrl)
    const { lineId, profile, dateKey, score, comment } = body;

    if (!lineId) return NextResponse.json({ error: "Missing Line ID" }, { status: 400 });

    // เช็ค user (ถ้าไม่มี สร้างใหม่)
    let user = await prisma.user.findUnique({ where: { lineId } });
    
    if (!user) {
      console.log("Creating new user:", profile?.displayName);
      user = await prisma.user.create({
        data: {
          lineId,
          displayName: profile?.displayName || "Unknown",
          pictureUrl: profile?.pictureUrl || ""
        }
      });
    }

    // Upsert mood log
    const log = await prisma.moodLog.upsert({
      where: {
        userId_dateKey: { userId: user.id, dateKey } // ต้องตรงกับ @@unique ใน schema
      },
      update: { score, comment },
      create: {
        userId: user.id,
        dateKey,
        score,
        comment
      }
    });

    return NextResponse.json({ success: true, data: log });

  } catch (error) {
    console.error("Error saving mood:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}