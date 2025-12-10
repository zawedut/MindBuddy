import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || 'all';

  // Calculate date range
  let startDate: Date | undefined;
  const now = new Date();

  switch (range) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = undefined;
  }

  // Build date filter
  const dateFilter = startDate ? { gte: startDate } : undefined;

  // Fetch users with moods and chats
  const users = await prisma.user.findMany({
    include: {
      moods: {
        where: dateFilter ? { createdAt: dateFilter } : undefined,
        orderBy: { createdAt: 'desc' }
      },
      chats: {
        where: dateFilter ? { createdAt: dateFilter } : undefined,
        orderBy: { createdAt: 'desc' },
        take: 50 // เพิ่มจำนวนแชท
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Count totals based on range
  const totalMoods = await prisma.moodLog.count({
    where: dateFilter ? { createdAt: dateFilter } : undefined
  });

  const totalChats = await prisma.chatHistory.count({
    where: dateFilter ? { createdAt: dateFilter } : undefined
  });

  // Count active users today
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const activeToday = await prisma.user.count({
    where: {
      OR: [
        { moods: { some: { createdAt: { gte: todayStart } } } },
        { chats: { some: { createdAt: { gte: todayStart } } } }
      ]
    }
  });

  // Calculate daily mood averages
  const moodMap = new Map<string, { sum: number; count: number }>();
  const moodDist = [0, 0, 0, 0, 0]; // scores 1-5

  users.forEach(user => {
    user.moods.forEach(mood => {
      // Count score distribution
      if (mood.score >= 1 && mood.score <= 5) {
        moodDist[mood.score - 1]++;
      }

      // Group by date
      const date = mood.createdAt.toISOString().split('T')[0];
      if (!moodMap.has(date)) {
        moodMap.set(date, { sum: 0, count: 0 });
      }
      const d = moodMap.get(date)!;
      d.sum += mood.score;
      d.count++;
    });
  });

  // Format daily moods for chart
  const dailyMoods = Array.from(moodMap.entries())
    .map(([date, val]) => ({
      date,
      avgScore: parseFloat((val.sum / val.count).toFixed(2)),
      count: val.count
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30); // Keep last 30 days for chart

  // Mood distribution for pie chart
  const moodDistribution = [
    { name: 'แย่มาก', value: moodDist[0], color: '#ef4444' },
    { name: 'แย่', value: moodDist[1], color: '#f97316' },
    { name: 'เฉยๆ', value: moodDist[2], color: '#eab308' },
    { name: 'ดี', value: moodDist[3], color: '#14b8a6' },
    { name: 'ดีมาก', value: moodDist[4], color: '#22c55e' },
  ];

  // Calculate chat activity per day
  const chatMap = new Map<string, number>();
  users.forEach(user => {
    user.chats.forEach(chat => {
      const date = chat.createdAt.toISOString().split('T')[0];
      chatMap.set(date, (chatMap.get(date) || 0) + 1);
    });
  });

  const dailyChats = Array.from(chatMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30);

  return NextResponse.json({
    stats: {
      totalUsers: users.length,
      totalMoods,
      totalChats,
      activeToday
    },
    users,
    charts: {
      dailyMoods,
      dailyChats,
      moodDistribution
    }
  });
}