'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mitr } from 'next/font/google';

const mitr = Mitr({ weight: ['400', '500', '600', '700'], subsets: ['thai'], variable: '--font-mitr' });

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
      badgeColor: 'from-pink-400 to-rose-400',
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
      badgeColor: 'from-teal-400 to-cyan-400',
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
    {
      id: 'modal3',
      badge: '🏆 แข่งขัน',
      badgeColor: 'from-blue-400 to-indigo-400',
      image: '/images/info3.jpg',
      title: '🏆 คำต้องเชื่อม Campus Tournament ชิงทุนการศึกษา 500,000 บาท',
      description:
        'แข่งขันรุ่นอายุ 16-23 ปี สังกัดสถานศึกษาในกรุงเทพมหานคร และปริมณฑล สมัครได้ตั้งแต่วันนี้ถึง 6 มีนาคม 2569!',
      modalContent: {
        image: '/images/info3.jpg',
        description: [
          '🏆 คำต้องเชื่อม Campus Tournament ชิงทุนการศึกษา 500,000 บาท!',
          '📌 คุณสมบัติผู้สมัคร:',
          '• แข่งขันรุ่นอายุ 16-23 ปี',
          '• สังกัดสถานศึกษาในกรุงเทพมหานคร และปริมณฑล',
          '📅 สมัครได้ตั้งแต่วันนี้ถึง 6 มีนาคม 2569',
        ],
        highlights: ['� สแกน QR code เพื่ออ่านรายละเอียดและสมัครแข่งขัน'],
      },
    },
    {
      id: 'modal4',
      badge: '� ผู้นำ',
      badgeColor: 'from-green-400 to-emerald-400',
      image: '/images/info4.jpg',
      title: '� โครงการบ่มเพาะผู้นำเยาวชนรุ่นใหม่ อายุ 18-25 ปี ทั่วประเทศไทย',
      description:
        'Impact Leaders Program รุ่น 2 เปิดรับสมัครแล้ว! โดย SOL: School of Leadership และมูลนิธิเพื่อคนไทย พร้อมเวิร์คชอร์ป เมนเทอร์ และลงมือแก้โจทย์จริง',
      modalContent: {
        image: '/images/info4.jpg',
        description: [
          '🌟 Impact starts with you – การเปลี่ยนแปลงเริ่มต้นที่ตัวคุณ!',
          'Impact Leaders Program รุ่น 2 เปิดรับสมัครแล้ว! โครงการบ่มเพาะผู้นำเยาวชนให้เป็นผู้นำที่ต้องการสร้างความเปลี่ยนแปลงในแบบของคุณ',
          '🏫 ออกแบบโดย SOL: School of Leadership และมูลนิธิเพื่อคนไทย ผ่านกระบวนการสุดเข้มข้น:',
          '• เวิร์คชอร์ป',
          '• เมนเทอร์',
          '• การลงมือแก้โจทย์ปัญหาทางสังคมจริง',
          '• คอมมูนิตี้ที่จะคอยสนับสนุนคุณตลอดโครงการ',
          '📌 สำหรับเยาวชนอายุ 18-25 ปี ทั่วประเทศไทย',
        ],
        highlights: ['📱 สแกน QR code เพื่ออ่านรายละเอียดและสมัคร'],
      },
    },
    {
      id: 'modal5',
      badge: '📝 TCAS',
      badgeColor: 'from-teal-400 to-green-500',
      image: '/images/info5.jpg',
      title: "📝 Let's start TCAS70 — รู้ก่อน เริ่มก่อน สอบติด!",
      description:
        'งานแนะแนว TCAS ครั้งใหญ่ประจำปี เพื่อน้องๆ dek70-71 เจาะลึกแผนสอบ TGAT / TPAT และ A-Level วันเสาร์ที่ 28 ก.พ. 2569',
      modalContent: {
        image: '/images/info5.jpg',
        description: [
          "� Let's start TCAS70 — รู้ก่อน เริ่มก่อน สอบติด!",
          '🎯 งานแนะแนว TCAS ครั้งใหญ่ประจำปี เพื่อน้องๆ dek70-71',
          '📌 สิ่งที่จะได้:',
          '• เจาะลึกแผนสอบทุกสนาม',
          '• เจาะกลยุทธ์ 10 เดือน พิชิตทุกสนามสอบ TGAT / TPAT และ A-Level',
          '• อัปเดทระบบสอบช่วยวางแผนพิชิตคณะชั้นนำ ทั้งสายวิทย์ และสายศิลป์',
          '• รู้ลึกแผนเตรียมตัว พร้อมอัปเดทเกณฑ์คะแนนที่ใช้ยื่น',
          '📅 วันเสาร์ที่ 28 กุมภาพันธ์ 2569 เวลา 09.30-14.30 น.',
          '📍 จัดกิจกรรมที่ Megastudy MBK ชั้น 5 โซน D',
        ],
        highlights: ['� สมัครได้ตั้งแต่วันนี้ถึงวันที่ 27 กุมภาพันธ์ 2569'],
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

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#F8F5FF] via-[#FFF5F8] to-[#F0FAFF] ${mitr.className}`}>
      {/* Decorative */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-600 transition-colors mb-6">
          <span>←</span>
          <span className="text-sm font-medium">กลับหน้าหลัก</span>
        </Link>

        {/* Header */}
        <header className="text-center mb-10 animate-[fadeIn_0.6s_ease-out]">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">📢</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-700 mb-2">Flash Info</h1>
          <p className="text-purple-400">ข่าวสาร ความรู้ และเคล็ดลับดีดี</p>

          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-purple-100">
            <span>🦆</span>
            <span className="text-sm text-purple-500">อัพเดทพร้อมดูแลจิตใจน้องๆ ทุกวัน</span>
          </div>
        </header>

        {/* About Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-purple-100 shadow-sm animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">💜</span>
            <h3 className="text-lg font-semibold text-gray-700">เราคือเพื่อนที่ดีของคุณ</h3>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            <strong className="text-purple-500">Mind Buddy</strong> คือแพลตฟอร์มที่รวบรวมข่าวสาร ความรู้ และการดูแลสุขภาพจิตไว้ในที่เดียว
            พร้อมมอบข้อมูลที่เป็นประโยชน์และทันสมัยให้กับทุกคน 🌟
          </p>
        </div>

        {/* Section Title */}
        <h2 className="text-lg font-semibold text-gray-600 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
          📢 ประกาศล่าสุด
        </h2>

        {/* Announcements */}
        <div className="space-y-5 mb-8">
          {announcements.map((announcement, index) => (
            <div
              key={announcement.id}
              onClick={() => openModal(announcement.id)}
              className="bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden border border-white shadow-lg hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 animate-[fadeInUp_0.6s_ease-out_both]"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              {/* Badge */}
              <div className="relative">
                <div
                  className={`absolute top-4 right-4 bg-gradient-to-r ${announcement.badgeColor} text-white py-1.5 px-3 rounded-xl text-xs font-bold z-10 shadow-md`}
                >
                  {announcement.badge}
                </div>

                <div className="w-full aspect-video relative bg-gradient-to-br from-purple-50 to-pink-50">
                  <Image
                    src={announcement.image}
                    alt={announcement.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 480px"
                  />
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-700 mb-2 leading-snug">
                  {announcement.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{announcement.description}</p>
                <span className="inline-flex items-center text-sm font-medium text-purple-500">
                  อ่านรายละเอียด →
                </span>
              </div>
            </div>
          ))}

          {/* Coming Soon */}
          <div className="bg-white/40 border-2 border-dashed border-purple-200 rounded-3xl py-12 flex flex-col items-center justify-center">
            <span className="text-5xl mb-3">🎪</span>
            <p className="text-lg font-semibold text-purple-400">Coming Soon</p>
            <p className="text-sm text-gray-400">เร็วๆ นี้</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-purple-100">
          <p className="text-sm text-purple-500 leading-relaxed">
            💜 <strong>Mind Buddy by น้องเรียนดี</strong>
            <br />
            พร้อมอัพเดทข่าวสารและความรู้ดีดีให้เสมอ
            <br />
            <strong>เพราะทุกคนสำคัญ ทุกความรู้สึกมีค่า</strong> ✨
          </p>
        </footer>
      </div>

      {/* Modal */}
      {announcements.map((announcement) => (
        <div
          key={`modal-${announcement.id}`}
          className={`fixed inset-0 bg-black/50 z-50 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 ${activeModal === announcement.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          onClick={closeModal}
        >
          <div
            className={`bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative shadow-2xl transition-all duration-300 ${activeModal === announcement.id ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-400 to-pink-400 text-white py-4 px-5 rounded-t-3xl flex justify-between items-center z-10">
              <h2 className="text-lg font-bold truncate pr-4">
                {announcement.title.split(' ').slice(0, 4).join(' ')}
              </h2>
              <button
                onClick={closeModal}
                className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-xl transition-all"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="w-full rounded-2xl mb-5 shadow-md overflow-hidden relative aspect-video">
                <Image
                  src={announcement.modalContent.image}
                  alt={announcement.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>

              {announcement.modalContent.description.map((desc, i) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-3">
                  {desc}
                </p>
              ))}

              {announcement.modalContent.highlights?.map((highlight, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-r from-teal-50 to-cyan-50 border-l-4 border-teal-400 p-4 rounded-xl my-4"
                >
                  <p className="font-semibold text-teal-700">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default FlashInfo;