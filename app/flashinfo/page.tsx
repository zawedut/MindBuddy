'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Announcement {
  id: string;
  badge: string;
  badgeColor: string;
  image: string;
  title: string;
  description: string;
  modalContent: {
    image: string;
    description: string[];
    highlights?: string[];
  };
}

const FlashInfo = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const announcements: Announcement[] = [
    {
      id: 'modal1',
      badge: '🔥 HOT',
      badgeColor: 'from-pink-400 to-red-400',
      image: '/images/info1.jpg',
      title: '🎓 Google AI Pro ฟรี 1 ปีเต็ม สำหรับนักเรียน นิสิต นักศึกษา',
      description:
        'สิทธิ์พิเศษสำหรับนักเรียน นิสิต นักศึกษา ที่มีอายุ 18 ปีขึ้นไป รีบลงทะเบียนรับสิทธ์กันน้า สิทธิ์พิเศษมีจำนวนจำกัด!',
      modalContent: {
        image: '/images/info1.jpg',
        description: [
          '📢 สิทธิ์พิเศษสำหรับนักเรียน นิสิต นักศึกษา ที่มีอายุ 18 ปีขึ้นไป สามารถใช้ Google AI Pro ฟรี 1 ปีเต็ม',
          '⚡ รีบลงทะเบียนรับสิทธ์กันน้า สิทธิ์พิเศษมีจำนวนจำกัด ของฟรีแบบนี้ ไม่ลงไม่ได้แน้ววววว!!! 😘💖',
        ],
        highlights: ['📱 สามารถสแกน QR code เพื่ออ่านรายละเอียดเพิ่มเติม'],
      },
    },
    {
      id: 'modal2',
      badge: '💚 24/7',
      badgeColor: 'from-green-400 to-emerald-400',
      image: '/images/info2.jpg',
      title: '💚 สายด่วนสุขภาพจิต 1300 โทรฟรี 24 ชั่วโมง',
      description:
        'มีปัญหาไม่สบายใจ ความเครียด ปัญหาครอบครัว? มีปัญหาอย่าเก็บไว้คนเดียว เราจะผ่านมันไปด้วยกัน แถมยังมีน้องเรียนดีอยู่ด้วยนะ 🥰',
      modalContent: {
        image: '/images/info2.jpg',
        description: [
          'สำหรับใครที่มีปัญหาไม่สบายใจ ความเครียด ปัญหาครอบครัว',
          '✅ ไม่มีค่าใช้จ่าย',
          '✅ ปลอดภัย เป็นความลับ',
          '✅ มีผู้เชี่ยวชาญพร้อมรับฟัง',
          'มีปัญหาอย่าเก็บไว้คนเดียว เราจะผ่านมันไปด้วยกันนนนน แถมยังมีน้องเรียนดีอยู่ด้วยนะ ไม่ต้องกลัวน้าคนเก่งงงงง 🥰',
        ],
        highlights: ['☎️ โทรได้เลย 1300 โทรฟรี 24 ชั่วโมง ไม่มีค่าใช้จ่าย'],
      },
    },
  ];

  const openModal = (modalId: string) => {
    setActiveModal(modalId);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'auto';
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 bg-[length:400%_400%] animate-[gradientShift_15s_ease_infinite] py-5 px-4">
      <div className="max-w-[480px] mx-auto">
        {/* Premium Header */}
        <div className="text-center mb-6 animate-[fadeInDown_0.8s_ease]">
          <div className="inline-block bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-5 rounded-[20px] text-[13px] font-semibold tracking-wider mb-3 shadow-lg animate-[pulse_2s_ease_infinite]">
            ✨ FLASH INFO
          </div>
          <h1 className="font-['Kanit'] text-[32px] font-extrabold bg-gradient-to-r from-purple-500 via-purple-700 to-pink-400 bg-clip-text text-transparent mb-2 tracking-tight">
            Mind Buddy
          </h1>
          <div className="bg-white/95 backdrop-blur-md py-3 px-5 rounded-2xl text-purple-600 text-sm font-medium shadow-lg border-2 border-purple-200">
            🦆 อัพเดทข่าวสาร ความรู้ เคล็ดลับดีดี พร้อมดูแลจิตใจน้องๆ ทุกวัน
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-white/95 backdrop-blur-md rounded-[20px] p-5 mb-6 shadow-xl border-2 border-purple-200 animate-[fadeInUp_0.8s_ease_0.2s_both]">
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-3">💙</span>
            <h3 className="font-['Kanit'] text-lg font-bold text-purple-600">เราคือเพื่อนที่ดีของคุณ</h3>
          </div>
          <div className="text-sm text-gray-600 leading-relaxed">
            <p>
              <strong>Mind Buddy</strong> คือแพลตฟอร์มที่รวบรวมข่าวสาร ความรู้ และการดูแลสุขภาพจิตไว้ในที่เดียว
              พร้อมมอบข้อมูลที่เป็นประโยชน์และทันสมัยให้กับทุกคน 🌟
            </p>
          </div>
        </div>

        {/* Announcements Section */}
        <h2 className="font-['Kanit'] text-xl font-bold text-white mb-4 flex items-center drop-shadow-lg">
          <span className="w-1 h-6 bg-gradient-to-b from-pink-400 to-blue-400 mr-2.5 rounded"></span>
          📢 ประกาศล่าสุด
        </h2>

        <div className="flex flex-col gap-5 mb-6">
          {announcements.map((announcement, index) => (
            <div
              key={announcement.id}
              onClick={() => openModal(announcement.id)}
              className="bg-white/95 rounded-3xl overflow-hidden shadow-xl border-2 border-white/50 cursor-pointer transition-all duration-400 hover:shadow-2xl hover:-translate-y-2 active:scale-[0.98] animate-[fadeInUp_0.6s_ease_both] relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`absolute top-4 right-4 bg-gradient-to-r ${announcement.badgeColor} text-white py-1.5 px-3.5 rounded-xl text-[11px] font-bold z-10 shadow-lg tracking-wide`}
              >
                {announcement.badge}
              </div>

              <div className="w-full aspect-video relative bg-gradient-to-br from-blue-50 to-blue-100">
                <Image
                  src={announcement.image}
                  alt={announcement.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 480px"
                />
              </div>

              <div className="p-5">
                <h3 className="font-['Kanit'] text-xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent mb-3 leading-snug">
                  {announcement.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{announcement.description}</p>
                <div className="inline-flex items-center text-[13px] font-semibold text-purple-600 gap-1">
                  อ่านรายละเอียด →
                </div>
              </div>
            </div>
          ))}

          {/* Coming Soon */}
          <div className="bg-gradient-to-br from-pink-400/20 to-blue-400/20 border-2 border-dashed border-white/80 rounded-3xl min-h-[200px] flex flex-col items-center justify-center animate-[breathe_3s_ease_infinite]">
            <div className="text-6xl mb-3 grayscale-[0.3]">🎪</div>
            <div className="font-['Kanit'] text-xl text-white/90 font-bold drop-shadow-md">Coming Soon</div>
            <div className="text-sm text-white/70 mt-1">เร็วๆ นี้</div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/95 backdrop-blur-md rounded-[20px] p-5 text-center border-2 border-white/50 shadow-xl">
          <p className="bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent text-sm leading-relaxed font-medium">
            💙 <strong>Mind Buddy by น้องเรียนดี</strong>
            <br />
            พร้อมอัพเดทข่าวสารและความรู้ดีดีให้เสมอ
            <br />
            ติดตามเราได้ที่ LINE Official Account 🌈
            <br />
            <strong>เพราะทุกคนสำคัญ ทุกความรู้สึกมีค่า</strong> ✨
          </p>
        </div>
      </div>

      {/* Modals */}
      {announcements.map((announcement) => (
        <div
          key={`modal-${announcement.id}`}
          className={`fixed inset-0 bg-black/85 z-[1000] backdrop-blur-md flex items-center justify-center p-5 transition-opacity duration-300 ${
            activeModal === announcement.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={handleBackdropClick}
        >
          <div
            className={`bg-white rounded-3xl max-w-[500px] w-full max-h-[90vh] overflow-y-auto relative shadow-2xl transition-all duration-500 ${
              activeModal === announcement.id
                ? 'translate-y-0 scale-100'
                : 'translate-y-24 scale-90'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-700 text-white py-5 px-5 rounded-t-3xl flex justify-between items-center z-10 shadow-md">
              <h2 className="font-['Kanit'] text-xl font-bold tracking-tight">
                {announcement.title.split(' ').slice(0, 3).join(' ')}
              </h2>
              <button
                onClick={closeModal}
                className="bg-white/20 hover:bg-white/30 w-10 h-10 rounded-full flex items-center justify-center text-3xl font-light transition-all hover:rotate-90"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="w-full rounded-2xl mb-5 shadow-lg overflow-hidden relative aspect-video">
                <Image
                  src={announcement.modalContent.image}
                  alt={announcement.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>

              {announcement.modalContent.description.map((desc, i) => (
                <p key={i} className="text-[15px] text-gray-600 leading-relaxed mb-4">
                  {desc}
                </p>
              ))}

              {announcement.modalContent.highlights &&
                announcement.modalContent.highlights.map((highlight, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-400 p-4 rounded-xl my-4"
                  >
                    <p className="font-semibold text-blue-900 text-base m-0">{highlight}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes breathe {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
};

export default FlashInfo;