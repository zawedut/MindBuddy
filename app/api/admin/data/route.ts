import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  // ดึงข้อมูลทั้งหมดแบบละเอียด
  const users = await prisma.user.findMany({
    include: {
      moods: { orderBy: { createdAt: 'desc' } },
      chats: { orderBy: { createdAt: 'desc' }, take: 20 } // เอาแชทล่าสุด 20 ข้อความ
    },
    orderBy: { createdAt: 'desc' }
  });

  const totalMoods = await prisma.moodLog.count();
  const totalChats = await prisma.chatHistory.count();

  // คำนวณกราฟอารมณ์รายวัน (ตัวอย่าง Logic ง่ายๆ)
  // ในงานจริงอาจต้องใช้ SQL Group By เพื่อประสิทธิภาพ
  const moodMap = new Map();
  const moodDist = [0,0,0,0,0]; // 1-5 scores

  users.forEach(user => {
    user.moods.forEach(mood => {
        // นับคะแนน 1-5
        if(mood.score >= 1 && mood.score <= 5) moodDist[mood.score - 1]++;
        
        // Group by Date
        const date = mood.createdAt.toISOString().split('T')[0];
        if(!moodMap.has(date)) moodMap.set(date, { sum: 0, count: 0 });
        const d = moodMap.get(date);
        d.sum += mood.score;
        d.count++;
    });
  });

  const dailyMoods = Array.from(moodMap.entries()).map(([date, val]: any) => ({
    date,
    avgScore: parseFloat((val.sum / val.count).toFixed(2))
  })).sort((a:any, b:any) => a.date.localeCompare(b.date));

  const moodDistribution = [
    { name: 'แย่มาก', value: moodDist[0], color: '#ef4444' },
    { name: 'แย่', value: moodDist[1], color: '#f97316' },
    { name: 'เฉยๆ', value: moodDist[2], color: '#eab308' },
    { name: 'ดี', value: moodDist[3], color: '#14b8a6' },
    { name: 'ดีมาก', value: moodDist[4], color: '#22c55e' },
  ];

  return NextResponse.json({
    stats: {
      totalUsers: users.length,
      totalMoods,
      totalChats
    },
    users,
    charts: {
      dailyMoods,
      moodDistribution
    }
  });
}