'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Mitr, Fredoka } from 'next/font/google';
import Link from 'next/link';
import liff from '@line/liff';
import { ArrowLeft, Flame, Trophy, Star, CalendarCheck, Target, Zap } from 'lucide-react';

const mitr = Mitr({ weight: ['400', '500', '600'], subsets: ['thai'], variable: '--font-mitr' });
const fredoka = Fredoka({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-fredoka' });

interface MoodEntry { score: number; comment: string; updated: number; }
interface MoodMap { [key: string]: MoodEntry; }

// Level System — ธีมเป็ด 🦆
const levels = [
  { name: 'เป็ดน้อย', emoji: '🐣', minPoints: 0, color: '#FFD54F' },
  { name: 'เป็ดเริ่มต้น', emoji: '🐥', minPoints: 100, color: '#FFC107' },
  { name: 'เป็ดทั่วไป', emoji: '🦆', minPoints: 300, color: '#FF9800' },
  { name: 'เป็ดดาวเด่น', emoji: '⭐', minPoints: 600, color: '#AB47BC' },
  { name: 'เป็ดเทพ', emoji: '💎', minPoints: 1000, color: '#42A5F5' },
  { name: 'ตำนานเป็ด', emoji: '👑', minPoints: 2000, color: '#E040FB' },
];

// Achievement badges
const achievements = [
  { id: 'first', title: 'ก้าวแรก', emoji: '🎯', desc: 'บันทึกอารมณ์ครั้งแรก', check: (total: number, streak: number) => total >= 1 },
  { id: 'week', title: '7 วันติด', emoji: '🔥', desc: 'บันทึกติดต่อกัน 7 วัน', check: (total: number, streak: number, longestStreak: number) => longestStreak >= 7 },
  { id: 'two_weeks', title: '14 วันไม่หยุด', emoji: '⚡', desc: 'บันทึกติดต่อกัน 14 วัน', check: (total: number, streak: number, longestStreak: number) => longestStreak >= 14 },
  { id: 'month', title: '30 วันมาราธอน', emoji: '🏅', desc: 'บันทึกติดต่อกัน 30 วัน', check: (total: number, streak: number, longestStreak: number) => longestStreak >= 30 },
  { id: 'fifty', title: 'ครึ่งร้อย', emoji: '💪', desc: 'บันทึกครบ 50 วัน', check: (total: number) => total >= 50 },
  { id: 'hundred', title: 'ร้อยวัน', emoji: '🏆', desc: 'บันทึกครบ 100 วัน', check: (total: number) => total >= 100 },
  { id: 'happy_week', title: 'สัปดาห์สดใส', emoji: '🌈', desc: 'บันทึกคะแนน 4-5 ครบ 7 วัน', check: (_t: number, _s: number, _l: number, happyDays: number) => happyDays >= 7 },
];

export default function MoodRewards() {
  const [profile, setProfile] = useState<any>(null);
  const [moods, setMoods] = useState<MoodMap>({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initLiff = async () => {
      try {
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
        if (!liffId) {
          console.warn('LIFF ID not configured, using guest mode');
          setProfile({ userId: 'guest', displayName: 'ผู้ใช้งาน' });
          setIsReady(true);
          return;
        }
        const liffPromise = liff.init({ liffId });
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

  // Calculate all stats
  const stats = useMemo(() => {
    const sortedKeys = Object.keys(moods).sort();
    const totalDays = sortedKeys.length;

    if (totalDays === 0) return null;

    // Streak calculation
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    // Check current streak (from today/yesterday backwards)
    const today = new Date();
    const todayKey = formatDateKey(today);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = formatDateKey(yesterday);

    // Start checking from the most recent entry
    if (moods[todayKey] || moods[yesterdayKey]) {
      const startKey = moods[todayKey] ? todayKey : yesterdayKey;
      currentStreak = 1;
      let checkDate = new Date(startKey);

      while (true) {
        checkDate.setDate(checkDate.getDate() - 1);
        const checkKey = formatDateKey(checkDate);
        if (moods[checkKey]) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Longest streak
    for (let i = 1; i < sortedKeys.length; i++) {
      const prevDate = new Date(sortedKeys[i - 1]);
      const currDate = new Date(sortedKeys[i]);
      const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

      if (Math.round(diffDays) === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Points: 10 per day + streak bonus
    let points = 0;
    let streakCount = 1;
    for (let i = 0; i < sortedKeys.length; i++) {
      if (i > 0) {
        const prevDate = new Date(sortedKeys[i - 1]);
        const currDate = new Date(sortedKeys[i]);
        const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          streakCount++;
        } else {
          streakCount = 1;
        }
      }
      const streakBonus = streakCount >= 7 ? 2 : streakCount >= 3 ? 1.5 : 1;
      points += Math.floor(10 * streakBonus);
    }

    // Happy days (score 4 or 5)
    const happyDays = Object.values(moods).filter(m => m.score >= 4).length;

    // Current level
    const currentLevel = [...levels].reverse().find(l => points >= l.minPoints) || levels[0];
    const nextLevel = levels[levels.indexOf(currentLevel) + 1];
    const progressToNext = nextLevel
      ? ((points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
      : 100;

    // This month progress
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysInMonth = thisMonthEnd.getDate();
    const thisMonthDays = sortedKeys.filter(key => {
      return key >= formatDateKey(thisMonthStart) && key <= formatDateKey(thisMonthEnd);
    }).length;

    return {
      totalDays,
      currentStreak,
      longestStreak,
      points,
      happyDays,
      currentLevel,
      nextLevel,
      progressToNext,
      thisMonthDays,
      daysInMonth,
    };
  }, [moods]);

  // Season theme
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
          🦆 ระดับของเป็ด
        </h1>
      </div>

      {stats ? (
        <>
          {/* Level Card */}
          <div className="w-full max-w-[420px] bg-white/70 backdrop-blur-sm rounded-[28px] p-6 shadow-md mb-6 text-center animate-[fadeIn_0.5s_ease]">
            <div className="text-5xl mb-2 animate-[popIn_0.5s_ease]">{stats.currentLevel.emoji}</div>
            <h2 className="text-lg font-bold text-gray-700 mb-1">{stats.currentLevel.name}</h2>
            <div className="text-3xl font-bold font-[family-name:var(--font-fredoka)] mb-3" style={{ color: stats.currentLevel.color }}>
              {stats.points} <span className="text-base font-medium text-gray-400">แต้ม</span>
            </div>

            {/* Progress to next level */}
            {stats.nextLevel && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>{stats.currentLevel.emoji} {stats.currentLevel.name}</span>
                  <span>{stats.nextLevel.emoji} {stats.nextLevel.name}</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.min(stats.progressToNext, 100)}%`,
                      backgroundColor: stats.currentLevel.color,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  อีก {stats.nextLevel.minPoints - stats.points} แต้มถึง {stats.nextLevel.name}
                </p>
              </div>
            )}
            {!stats.nextLevel && (
              <p className="text-sm text-gray-400">🎉 คุณอยู่เลเวลสูงสุดแล้ว!</p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="w-full max-w-[420px] grid grid-cols-2 gap-3 mb-6">
            {/* Current Streak */}
            <div className="bg-white/70 backdrop-blur-sm rounded-[20px] p-4 shadow-sm text-center">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: `${theme.accent}15` }}>
                <Flame size={20} style={{ color: theme.accent }} />
              </div>
              <div className="text-3xl font-bold font-[family-name:var(--font-fredoka)]" style={{ color: theme.accent }}>
                {stats.currentStreak}
              </div>
              <div className="text-xs text-gray-400 mt-1">🔥 Streak ปัจจุบัน</div>
            </div>

            {/* Longest Streak */}
            <div className="bg-white/70 backdrop-blur-sm rounded-[20px] p-4 shadow-sm text-center">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: '#FFC10715' }}>
                <Trophy size={20} className="text-amber-500" />
              </div>
              <div className="text-3xl font-bold font-[family-name:var(--font-fredoka)] text-amber-500">
                {stats.longestStreak}
              </div>
              <div className="text-xs text-gray-400 mt-1">🏆 Streak สูงสุด</div>
            </div>

            {/* Total Days */}
            <div className="bg-white/70 backdrop-blur-sm rounded-[20px] p-4 shadow-sm text-center">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-2 bg-teal-50">
                <CalendarCheck size={20} className="text-teal-500" />
              </div>
              <div className="text-3xl font-bold font-[family-name:var(--font-fredoka)] text-teal-500">
                {stats.totalDays}
              </div>
              <div className="text-xs text-gray-400 mt-1">📅 วันที่บันทึกทั้งหมด</div>
            </div>

            {/* This Month */}
            <div className="bg-white/70 backdrop-blur-sm rounded-[20px] p-4 shadow-sm text-center">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-2 bg-purple-50">
                <Target size={20} className="text-purple-500" />
              </div>
              <div className="text-3xl font-bold font-[family-name:var(--font-fredoka)] text-purple-500">
                {stats.thisMonthDays}<span className="text-base text-gray-300">/{stats.daysInMonth}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">📆 เดือนนี้</div>
              {/* Mini progress */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-purple-400 rounded-full transition-all duration-700"
                  style={{ width: `${(stats.thisMonthDays / stats.daysInMonth) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Point System Info */}
          <div className="w-full max-w-[420px] bg-white/70 backdrop-blur-sm rounded-[24px] p-5 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={18} style={{ color: theme.accent }} />
              <h3 className="text-sm font-semibold text-gray-600">ระบบแต้ม</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="w-6 h-6 bg-green-50 rounded-lg flex items-center justify-center text-sm">📝</span>
                บันทึกอารมณ์ = <span className="font-bold text-green-500">+10 แต้ม</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="w-6 h-6 bg-orange-50 rounded-lg flex items-center justify-center text-sm">🔥</span>
                Streak 3+ วัน = <span className="font-bold text-orange-500">x1.5 โบนัส</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="w-6 h-6 bg-red-50 rounded-lg flex items-center justify-center text-sm">💥</span>
                Streak 7+ วัน = <span className="font-bold text-red-500">x2 โบนัส</span>
              </div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="w-full max-w-[420px] bg-white/70 backdrop-blur-sm rounded-[24px] p-5 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Star size={18} style={{ color: theme.accent }} />
              <h3 className="text-sm font-semibold text-gray-600">เหรียญรางวัล</h3>
              <span className="ml-auto text-xs text-gray-400 font-[family-name:var(--font-fredoka)]">
                {achievements.filter(a => a.check(stats.totalDays, stats.currentStreak, stats.longestStreak, stats.happyDays)).length}/{achievements.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((badge) => {
                const unlocked = badge.check(stats.totalDays, stats.currentStreak, stats.longestStreak, stats.happyDays);
                return (
                  <div
                    key={badge.id}
                    className={`relative rounded-2xl p-3.5 border-2 transition-all duration-300 ${
                      unlocked
                        ? 'bg-white border-amber-200 shadow-sm'
                        : 'bg-gray-50/50 border-gray-100 opacity-50'
                    }`}
                  >
                    <div className={`text-2xl mb-1.5 ${unlocked ? '' : 'grayscale'}`}>
                      {badge.emoji}
                    </div>
                    <div className="text-xs font-semibold text-gray-700">{badge.title}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{badge.desc}</div>
                    {unlocked && (
                      <div className="absolute top-2 right-2 text-xs">✅</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* All Levels */}
          <div className="w-full max-w-[420px] bg-white/70 backdrop-blur-sm rounded-[24px] p-5 shadow-sm mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">ระดับทั้งหมด</h3>
            <div className="space-y-2.5">
              {levels.map((level, i) => {
                const isCurrentLevel = stats.currentLevel.name === level.name;
                const isUnlocked = stats.points >= level.minPoints;
                return (
                  <div
                    key={level.name}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isCurrentLevel
                        ? 'bg-white shadow-sm ring-2'
                        : isUnlocked
                        ? 'bg-white/50'
                        : 'opacity-40'
                    }`}
                    style={isCurrentLevel ? { '--tw-ring-color': level.color } as React.CSSProperties : {}}
                  >
                    <span className={`text-2xl ${isUnlocked ? '' : 'grayscale'}`}>{level.emoji}</span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-700">{level.name}</div>
                      <div className="text-xs text-gray-400">{level.minPoints} แต้ม</div>
                    </div>
                    {isCurrentLevel && (
                      <span className="text-xs font-bold px-2 py-1 rounded-full text-white" style={{ backgroundColor: level.color }}>
                        ปัจจุบัน
                      </span>
                    )}
                    {isUnlocked && !isCurrentLevel && (
                      <span className="text-xs text-green-500">✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="w-full max-w-[420px] bg-white/70 backdrop-blur-sm rounded-[24px] p-10 shadow-sm text-center">
          <div className="text-5xl mb-4">🌱</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">เริ่มสะสมแต้มกันเลย!</h3>
          <p className="text-sm text-gray-400">บันทึกอารมณ์ในปฏิทินเพื่อรับแต้มสะสม</p>
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
