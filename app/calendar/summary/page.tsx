'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Mitr, Fredoka } from 'next/font/google';
import Link from 'next/link';
import liff from '@line/liff';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { ArrowLeft, CalendarDays, TrendingUp, Award, Frown, Smile } from 'lucide-react';

const mitr = Mitr({ weight: ['400', '500', '600'], subsets: ['thai'], variable: '--font-mitr' });
const fredoka = Fredoka({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-fredoka' });

interface MoodEntry { score: number; comment: string; updated: number; }
interface MoodMap { [key: string]: MoodEntry; }

type ViewMode = 'week' | 'month';

const moodConfig: { [key: number]: { label: string; emoji: string; color: string; bg: string } } = {
  5: { label: 'ดีมาก', emoji: '😄', color: '#66D966', bg: '#E8F8E8' },
  4: { label: 'ดี', emoji: '🙂', color: '#6BA3D4', bg: '#E8F4FD' },
  3: { label: 'เฉยๆ', emoji: '😐', color: '#FFC04D', bg: '#FFF8E1' },
  2: { label: 'แย่', emoji: '😔', color: '#FFB366', bg: '#FFECD9' },
  1: { label: 'แย่มาก', emoji: '😢', color: '#FF6B6B', bg: '#FFE5E5' },
};

export default function MoodSummary() {
  const [profile, setProfile] = useState<any>(null);
  const [moods, setMoods] = useState<MoodMap>({});
  const [isReady, setIsReady] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('week');

  useEffect(() => {
    const initLiff = async () => {
      try {
        const liffPromise = liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID || '' });
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000));
        await Promise.race([liffPromise, timeoutPromise]);
        if (!liff.isLoggedIn()) { liff.login(); return; }
        const userProfile = await liff.getProfile();
        setProfile(userProfile);
        fetchMoods(userProfile.userId);
        setIsReady(true);
      } catch (e) {
        console.error("LIFF Init Failed/Timeout", e);
        setProfile({ userId: 'guest', displayName: 'ผู้ใช้งาน' });
        setIsReady(true);
      }
    };
    initLiff();
  }, []);

  const fetchMoods = async (lineId: string) => {
    try {
      const res = await fetch(`/api/mood?lineId=${lineId}`);
      const data = await res.json();
      if (data && !data.error && Array.isArray(data.data)) {
        const newMoods: MoodMap = {};
        data.data.forEach((item: any) => {
          newMoods[item.dateKey] = {
            score: item.score,
            comment: item.comment,
            updated: new Date(item.updatedAt).getTime()
          };
        });
        setMoods(newMoods);
      }
    } catch (e) { console.error("Load failed", e); }
  };

  // Compute date ranges
  const dateRange = useMemo(() => {
    const now = new Date();
    if (viewMode === 'week') {
      const dayOfWeek = now.getDay(); // 0=Sun
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - dayOfWeek);
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return { start: startOfWeek, end: endOfWeek, label: 'สัปดาห์นี้' };
    } else {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const monthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
      return { start: startOfMonth, end: endOfMonth, label: monthNames[now.getMonth()] + ' ' + (now.getFullYear() + 543) };
    }
  }, [viewMode]);

  // Filter moods in range
  const filteredMoods = useMemo(() => {
    const result: { key: string; entry: MoodEntry }[] = [];
    const startStr = formatDateKey(dateRange.start);
    const endStr = formatDateKey(dateRange.end);

    Object.entries(moods).forEach(([key, entry]) => {
      if (key >= startStr && key <= endStr) {
        result.push({ key, entry });
      }
    });
    result.sort((a, b) => a.key.localeCompare(b.key));
    return result;
  }, [moods, dateRange]);

  // Statistics
  const stats = useMemo(() => {
    if (filteredMoods.length === 0) return null;

    const totalDays = filteredMoods.length;
    const avgScore = filteredMoods.reduce((sum, m) => sum + m.entry.score, 0) / totalDays;
    const moodCounts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    filteredMoods.forEach(m => { moodCounts[m.entry.score]++; });

    const mostCommonScore = Object.entries(moodCounts).reduce((a, b) => b[1] > a[1] ? b : a, ['0', 0]);
    const bestDay = filteredMoods.reduce((best, m) => m.entry.score > best.entry.score ? m : best, filteredMoods[0]);
    const worstDay = filteredMoods.reduce((worst, m) => m.entry.score < worst.entry.score ? m : worst, filteredMoods[0]);

    const chartData = Object.entries(moodCounts).map(([score, count]) => ({
      score: Number(score),
      count,
      label: moodConfig[Number(score)].label,
      emoji: moodConfig[Number(score)].emoji,
      color: moodConfig[Number(score)].color,
    })).reverse();

    return { totalDays, avgScore, moodCounts, mostCommonScore: Number(mostCommonScore[0]), bestDay, worstDay, chartData };
  }, [filteredMoods]);

  // Season theme (same logic as calendar)
  const getSeasonTheme = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return { bg: '#FFE1ED', accent: '#E85D9A', btn: '#FFB3D9' };
    if (month >= 5 && month <= 7) return { bg: '#FFE8D1', accent: '#E8854D', btn: '#FFD4AD' };
    if (month >= 8 && month <= 10) return { bg: '#FFDDD1', accent: '#E8754D', btn: '#FFC4AD' };
    return { bg: '#D9EDFF', accent: '#5DA8E8', btn: '#B3D9FF' };
  };

  const theme = getSeasonTheme();

  if (!isReady) {
    return (
      <div className={`min-h-screen w-full flex flex-col items-center justify-center ${mitr.className}`} style={{ backgroundColor: theme.bg }}>
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4" style={{ borderColor: theme.btn }}></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent animate-spin" style={{ borderTopColor: theme.accent }}></div>
        </div>
        <p className="font-medium" style={{ color: theme.accent }}>กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center py-8 px-4 transition-colors duration-500 ${mitr.className} ${fredoka.variable}`}
      style={{ backgroundColor: theme.bg }}
    >
      {/* Header */}
      <div className="w-full max-w-[420px] mb-6">
        <Link
          href="/calendar"
          className="inline-flex items-center gap-2 text-sm font-medium mb-4 px-4 py-2 rounded-2xl bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all active:scale-95"
          style={{ color: theme.accent }}
        >
          <ArrowLeft size={16} />
          กลับปฏิทิน
        </Link>

        <h1 className="text-2xl font-semibold tracking-wide flex items-center gap-2" style={{ color: theme.accent }}>
          📊 สรุปผลอารมณ์
        </h1>
      </div>

      {/* Tab Switcher */}
      <div className="w-full max-w-[420px] mb-6">
        <div className="flex bg-white/50 backdrop-blur-sm rounded-2xl p-1.5 shadow-sm">
          {(['week', 'month'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                viewMode === mode
                  ? 'text-white shadow-md scale-[1.02]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              style={viewMode === mode ? { backgroundColor: theme.accent } : {}}
            >
              {mode === 'week' ? '📅 สัปดาห์นี้' : '🗓️ เดือนนี้'}
            </button>
          ))}
        </div>
      </div>

      {/* Period Label */}
      <div className="w-full max-w-[420px] mb-4">
        <p className="text-center text-sm text-gray-500 font-medium">{dateRange.label}</p>
      </div>

      {stats ? (
        <>
          {/* Overview Cards */}
          <div className="w-full max-w-[420px] grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm">
              <CalendarDays size={20} className="mx-auto mb-1 text-gray-400" />
              <div className="text-2xl font-bold font-[family-name:var(--font-fredoka)]" style={{ color: theme.accent }}>
                {stats.totalDays}
              </div>
              <div className="text-xs text-gray-400 mt-1">วันที่บันทึก</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm">
              <TrendingUp size={20} className="mx-auto mb-1 text-gray-400" />
              <div className="text-2xl font-bold font-[family-name:var(--font-fredoka)]" style={{ color: theme.accent }}>
                {stats.avgScore.toFixed(1)}
              </div>
              <div className="text-xs text-gray-400 mt-1">คะแนนเฉลี่ย</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm">
              <Award size={20} className="mx-auto mb-1 text-gray-400" />
              <div className="text-2xl">
                {moodConfig[stats.mostCommonScore]?.emoji}
              </div>
              <div className="text-xs text-gray-400 mt-1">อารมณ์หลัก</div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="w-full max-w-[420px] bg-white/70 backdrop-blur-sm rounded-[24px] p-5 shadow-sm mb-6">
            <h3 className="text-base font-semibold text-gray-600 mb-4">จำนวนวันต่ออารมณ์</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.chartData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="emoji"
                  tick={{ fontSize: 18 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: '#999' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [`${value} วัน`, '']}
                  labelFormatter={(label) => `อารมณ์: ${label}`}
                  contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="count" radius={[12, 12, 4, 4]} maxBarSize={40}>
                  {stats.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Emoji Timeline */}
          <div className="w-full max-w-[420px] bg-white/70 backdrop-blur-sm rounded-[24px] p-5 shadow-sm mb-6">
            <h3 className="text-base font-semibold text-gray-600 mb-4">ไทม์ไลน์อารมณ์</h3>
            <div className="flex flex-wrap gap-2">
              {filteredMoods.map(({ key, entry }) => {
                const day = parseInt(key.split('-')[2]);
                return (
                  <div
                    key={key}
                    className="flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all hover:scale-110"
                    style={{ backgroundColor: moodConfig[entry.score]?.bg }}
                  >
                    <span className="text-[10px] text-gray-400 font-medium">{day}</span>
                    <span className="text-lg">{moodConfig[entry.score]?.emoji}</span>
                  </div>
                );
              })}
              {filteredMoods.length === 0 && (
                <p className="text-sm text-gray-400 text-center w-full py-4">ยังไม่มีข้อมูล</p>
              )}
            </div>
          </div>

          {/* Best & Worst Day */}
          <div className="w-full max-w-[420px] grid grid-cols-2 gap-3 mb-6">
            {/* Best Day */}
            <div className="bg-white/70 backdrop-blur-sm rounded-[20px] p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Smile size={16} className="text-green-400" />
                <span className="text-xs font-semibold text-gray-500">วันดีสุด</span>
              </div>
              <div className="text-2xl mb-1">{moodConfig[stats.bestDay.entry.score]?.emoji}</div>
              <div className="text-xs text-gray-400">{formatThaiDate(stats.bestDay.key)}</div>
              {stats.bestDay.entry.comment && (
                <div className="text-xs text-gray-500 mt-2 p-2 bg-green-50 rounded-xl line-clamp-2">
                  &ldquo;{stats.bestDay.entry.comment}&rdquo;
                </div>
              )}
            </div>

            {/* Worst Day */}
            <div className="bg-white/70 backdrop-blur-sm rounded-[20px] p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Frown size={16} className="text-orange-400" />
                <span className="text-xs font-semibold text-gray-500">วันแย่สุด</span>
              </div>
              <div className="text-2xl mb-1">{moodConfig[stats.worstDay.entry.score]?.emoji}</div>
              <div className="text-xs text-gray-400">{formatThaiDate(stats.worstDay.key)}</div>
              {stats.worstDay.entry.comment && (
                <div className="text-xs text-gray-500 mt-2 p-2 bg-orange-50 rounded-xl line-clamp-2">
                  &ldquo;{stats.worstDay.entry.comment}&rdquo;
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="w-full max-w-[420px] bg-white/70 backdrop-blur-sm rounded-[24px] p-10 shadow-sm text-center">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">ยังไม่มีข้อมูล</h3>
          <p className="text-sm text-gray-400">ลองบันทึกอารมณ์ในปฏิทินก่อนนะ</p>
          <Link
            href="/calendar"
            className="inline-block mt-4 px-6 py-2.5 rounded-2xl text-white text-sm font-semibold shadow-md hover:brightness-110 transition-all active:scale-95"
            style={{ backgroundColor: theme.accent }}
          >
            ไปบันทึกอารมณ์
          </Link>
        </div>
      )}

      <style jsx global>{`
        @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 80% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatThaiDate(dateKey: string): string {
  const parts = dateKey.split('-');
  const day = parseInt(parts[2]);
  const month = parseInt(parts[1]) - 1;
  const shortMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${day} ${shortMonths[month]}`;
}
