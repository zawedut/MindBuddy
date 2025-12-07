'use client';

import React, { useState, useEffect } from 'react';
import { Mitr, Fredoka } from 'next/font/google';
import liff from '@line/liff';

// Config Font
const mitr = Mitr({ weight: ['400', '500', '600'], subsets: ['thai'], variable: '--font-mitr' });
const fredoka = Fredoka({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-fredoka' });

// Types
interface MoodEntry { score: number; comment: string; updated: number; }
interface MoodMap { [key: string]: MoodEntry; }

export default function MoodCalendar() {
  // State
  const [profile, setProfile] = useState<any>(null);
  const [view, setView] = useState<Date>(new Date());
  const [moods, setMoods] = useState<MoodMap>({});
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");

  const monthNames = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  const weekDays = ['อา','จ','อ','พ','พฤ','ศ','ส'];

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID || '' });
        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }
        const userProfile = await liff.getProfile();
        setProfile(userProfile);
        fetchMoods(userProfile.userId);
      } catch (e) {
        console.error("LIFF Init Failed", e);
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
  }

  // 🌤️ Logic ฤดูกาล
  const getSeasonTheme = (date: Date) => {
    const month = date.getMonth(); 
    if (month >= 2 && month <= 4) return { name: 'spring', bg: '#FFE1ED', accent: '#E85D9A', btn: '#FFB3D9', cellHover: 'hover:bg-[#FFD6E8] hover:border-[#E85D9A] hover:shadow-[0_4px_12px_rgba(232,93,154,0.3)]' };
    if (month >= 5 && month <= 7) return { name: 'summer', bg: '#FFE8D1', accent: '#E8854D', btn: '#FFD4AD', cellHover: 'hover:bg-[#FFE0C4] hover:border-[#E8854D] hover:shadow-[0_4px_12px_rgba(232,133,77,0.3)]' };
    if (month >= 8 && month <= 10) return { name: 'autumn', bg: '#FFDDD1', accent: '#E8754D', btn: '#FFC4AD', cellHover: 'hover:bg-[#FFD4C4] hover:border-[#E8754D] hover:shadow-[0_4px_12px_rgba(232,117,77,0.3)]' };
    return { name: 'winter', bg: '#D9EDFF', accent: '#5DA8E8', btn: '#B3D9FF', cellHover: 'hover:bg-[#D0E8FF] hover:border-[#5DA8E8] hover:shadow-[0_4px_12px_rgba(93,168,232,0.3)]' };
  };

  const currentTheme = getSeasonTheme(view);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  const handlePrevMonth = () => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1));
  const handleNextMonth = () => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1));

  const openModal = (key: string) => {
    setSelectedKey(key);
    const entry = moods[key];
    setSelectedScore(entry ? entry.score : null);
    setComment(entry ? entry.comment : "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => { setSelectedKey(null); setSelectedScore(null); setComment(""); }, 200);
  };

  const handleSave = async () => {
    if (selectedKey && selectedScore !== null && profile) {
      const newMoods = { 
        ...moods, 
        [selectedKey]: { score: selectedScore, comment: comment.trim(), updated: Date.now() }
      };
      setMoods(newMoods);

      try {
        await fetch('/api/mood', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lineId: profile.userId,
            profile: { 
                displayName: profile.displayName,
                pictureUrl: profile.pictureUrl
            },
            dateKey: selectedKey,
            score: selectedScore,
            comment: comment.trim()
          })
        });
      } catch (e) {
        console.error("Save failed", e);
      }
    }
    closeModal();
  };

  const getMoodImage = (score: number) => {
      const map: {[key:number]: string} = { 5: '/assets/happy.png', 4: '/assets/wink.png', 3: '/assets/bored.png', 2: '/assets/sad.png', 1: '/assets/angry.png' }
      return map[score];
  }

  const getMoodStyles = (score: number) => {
    switch(score) {
      case 5: return "bg-gradient-to-br from-[#E8F8E8] to-[#C8F0C8] border-[#66D966]";
      case 4: return "bg-gradient-to-br from-[#E8F4FD] to-[#D0E7F9] border-[#6BA3D4]";
      case 3: return "bg-gradient-to-br from-[#FFF8E1] to-[#FFECB3] border-[#FFC04D]";
      case 2: return "bg-gradient-to-br from-[#FFECD9] to-[#FFD4A8] border-[#FFB366]";
      case 1: return "bg-gradient-to-br from-[#FFE5E5] to-[#FFD0D0] border-[#FF6B6B]";
      default: return "";
    }
  };

  // 🛠️ ส่วนที่แก้ Layout (สำคัญ)
  const renderCalendar = () => {
    const year = view.getFullYear();
    const month = view.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const startDay = getFirstDayOfMonth(year, month);
    const cells = [];

    const createCell = (day: number, monthIndex: number, yearIndex: number, isCurrentMonth: boolean) => {
        const key = `${yearIndex}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const entry = moods[key];
        const isToday = new Date().toDateString() === new Date(yearIndex, monthIndex, day).toDateString();
        
        // ✅ ปรับ CSS Base: ใส่ overflow-hidden และจัด justify-start (ชิดบน) เสมอ ไม่ว่าจะมีอารมณ์หรือไม่
        let cellClass = "relative w-full aspect-[1/1.4] rounded-2xl flex flex-col items-center justify-start pt-1.5 cursor-pointer border-2 transition-all duration-200 ease-out p-1 overflow-hidden ";
        
        if (!isCurrentMonth) cellClass += "opacity-40 ";
        
        if (entry) {
            // มีอารมณ์: เปลี่ยนสีพื้นหลัง
            cellClass += `${getMoodStyles(entry.score)} `;
        } else {
            // ไม่มีอารมณ์: สีขาวปกติ
            cellClass += `bg-white border-transparent hover:-translate-y-1 ${currentTheme.cellHover} `;
            if (isToday) cellClass += `!bg-white ring-2 ring-offset-1 `;
        }

        return (
            <div 
                key={key} 
                onClick={() => openModal(key)} 
                className={cellClass}
                style={isToday && !entry ? { borderColor: currentTheme.accent, color: currentTheme.accent, '--tw-ring-color': currentTheme.accent } as React.CSSProperties : {}}
            >
                {/* ตัวเลขวันที่ */}
                <span className={`text-[13px] font-semibold transition-colors z-10 ${entry ? 'text-gray-500 text-[11px]' : 'text-[#2D2D2D]'} ${isCurrentMonth ? '' : 'text-[#bbb]'}`}>
                    {day}
                </span>

                {/* รูปอารมณ์ */}
                {entry && (
                    <div 
                        className="w-full h-full mt-1 bg-contain bg-center bg-no-repeat drop-shadow-sm animate-[popIn_0.3s_ease]"
                        style={{ backgroundImage: `url(${getMoodImage(entry.score)})` }}
                    ></div>
                )}
            </div>
        );
    };

    const prevMonthDays = new Date(year, month, 0).getDate();
    const prevM = month === 0 ? 11 : month - 1;
    const prevY = month === 0 ? year - 1 : year;
    for (let i = startDay - 1; i >= 0; i--) cells.push(createCell(prevMonthDays - i, prevM, prevY, false));
    for (let day = 1; day <= daysInMonth; day++) cells.push(createCell(day, month, year, true));
    const remaining = 42 - cells.length;
    const nextM = month === 11 ? 0 : month + 1;
    const nextY = month === 11 ? year + 1 : year;
    for (let day = 1; day <= remaining; day++) cells.push(createCell(day, nextM, nextY, false));

    return cells;
  };

  const moodOptionsList = [
    { score: 5, label: 'ดีใจ', bg: 'bg-[#E8F8E8]', active: 'bg-[#C8F0C8] border-[#66D966]' },
    { score: 4, label: 'ขยิบตา', bg: 'bg-[#E8F4FD]', active: 'bg-[#D0E7F9] border-[#6BA3D4]' },
    { score: 3, label: 'เบื่อ', bg: 'bg-[#FFF8E1]', active: 'bg-[#FFECB3] border-[#FFC04D]' },
    { score: 2, label: 'เศร้า', bg: 'bg-[#FFECD9]', active: 'bg-[#FFD4A8] border-[#FFB366]' },
    { score: 1, label: 'โกรธ', bg: 'bg-[#FFE5E5]', active: 'bg-[#FFD0D0] border-[#FF6B6B]' },
  ];

  if (!profile) {
     return <div className="min-h-screen w-full flex items-center justify-center bg-[#FFE5F1] text-[#E85D9A] font-bold text-xl">
         กำลังเชื่อมต่อ LINE... ⏳
     </div>
  }

  return (
    <div 
        className={`min-h-screen w-full flex flex-col items-center py-10 px-4 transition-colors duration-500 ${mitr.className} ${fredoka.variable}`}
        style={{ backgroundColor: currentTheme.bg }} 
    >
      <div className="w-full max-w-[420px] flex items-center gap-3 mb-6">
         {profile?.pictureUrl && (
             <img src={profile.pictureUrl} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="Profile" />
         )}
         <div>
             <div className="text-sm text-gray-500">สวัสดี,</div>
             <div className="text-lg font-bold text-[#2D2D2D]">{profile?.displayName}</div>
         </div>
      </div>

      <div 
        className="w-full max-w-[420px] h-fit rounded-[28px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-colors duration-500"
        style={{ backgroundColor: currentTheme.bg }} 
      >
        <h3 className="text-center text-2xl font-semibold mb-5 tracking-wide transition-colors duration-300" style={{ color: currentTheme.accent }}>
            📅 ปฏิทินอารมณ์
        </h3>
        
        <div className="flex justify-between items-center mb-5">
          <button onClick={handlePrevMonth} className="w-11 h-10 bg-white rounded-xl shadow-sm transition-all active:scale-90 flex items-center justify-center text-lg hover:text-white" style={{ color: currentTheme.accent }} 
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = currentTheme.accent; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = currentTheme.accent; }}
          >❮</button>
          
          <div className="text-xl font-semibold text-[#2D2D2D]">
            {monthNames[view.getMonth()]} {view.getFullYear() + 543}
          </div>

          <button onClick={handleNextMonth} className="w-11 h-10 bg-white rounded-xl shadow-sm transition-all active:scale-90 flex items-center justify-center text-lg hover:text-white" style={{ color: currentTheme.accent }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = currentTheme.accent; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = currentTheme.accent; }}
          >❯</button>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {weekDays.map(d => (
            <div key={d} className="text-center text-[13px] text-gray-400 font-medium mb-1">{d}</div>
          ))}
          {renderCalendar()}
        </div>
      </div>

      {modalOpen && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
            onClick={(e) => (e.target === e.currentTarget) && closeModal()}
        >
          <div className="w-[88%] max-w-[400px] bg-white p-6 rounded-[30px] shadow-2xl text-center animate-[popIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
            <h3 className="text-xl text-[#2D2D2D] mb-5 font-medium">วันนี้รู้สึกยังไง?</h3>

            <div className="flex flex-wrap justify-center gap-2 mb-5">
              {moodOptionsList.map((opt) => (
                <div key={opt.score} className="group relative">
                  <button 
                    onClick={() => setSelectedScore(opt.score)}
                    className={`w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-2xl border-4 transition-all duration-200 bg-center bg-no-repeat bg-[length:65%] hover:-translate-y-1 active:scale-95
                        ${selectedScore === opt.score ? `${opt.active} shadow-lg -translate-y-1` : `${opt.bg} border-transparent hover:brightness-95`}
                    `}
                    style={{ backgroundImage: `url(${getMoodImage(opt.score)})` }}
                  ></button>
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {opt.label}
                  </div>
                </div>
              ))}
            </div>

            <textarea 
              className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm resize-none h-20 outline-none focus:bg-white transition-colors"
              placeholder="เขียนบันทึกสั้นๆ..." 
              value={comment} 
              onChange={(e) => setComment(e.target.value)}
              style={{ borderColor: 'transparent' }}
              onFocus={(e) => e.target.style.borderColor = currentTheme.accent}
              onBlur={(e) => e.target.style.borderColor = 'transparent'}
            ></textarea>

            <div className="flex gap-3 mt-5">
              <button 
                onClick={handleSave}
                className="flex-1 py-3 rounded-2xl text-white font-semibold shadow-md hover:brightness-110 active:scale-95 transition-all"
                style={{ backgroundColor: currentTheme.accent }}
              >
                บันทึก
              </button>
              <button 
                onClick={closeModal}
                className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-500 font-semibold hover:bg-gray-200 active:scale-95 transition-all"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 80% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}