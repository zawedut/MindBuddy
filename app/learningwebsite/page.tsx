'use client';

import React from 'react';
import Link from 'next/link';
import { Mitr } from 'next/font/google';

const mitr = Mitr({ weight: ['400', '500', '600', '700'], subsets: ['thai'], variable: '--font-mitr' });

const tcasResources = [
  { icon: '📝', title: 'MyTCAS', description: 'ระบบรับสมัครนักศึกษาส่วนกลาง ข้อมูลครบถ้วนทุกรอบ', url: 'https://www.mytcas.com/' },
  { icon: '🎓', title: 'TCASter', description: 'ข้อมูล TCAS เจาะลึก วิเคราะห์คะแนน และเทคนิคการสอบ', url: 'https://tcaster.net/' },
  { icon: '🐵', title: 'MonkeyEveryday', description: 'ข่าวสาร เทคนิคการเรียน และข้อมูลมหาวิทยาลัย', url: 'https://monkeyeveryday.com/' },
  { icon: '💬', title: 'Dek-D.com', description: 'คอมมูนิตี้นักเรียน ข้อสอบ และแนะแนวการศึกษา', url: 'https://www.dek-d.com/' },
  { icon: '⛺', title: 'Camphub', description: 'ค่ายเตรียมสอบเข้า และข้อมูลรับตรงต่างๆ', url: 'https://camphub.in.th/' },
  { icon: '🌐', title: 'Eduzones.com', description: 'ข้อมูลการศึกษา คอร์สเรียน และแนะแนว', url: 'https://www.eduzones.com/' },
  { icon: '📈', title: 'Growthd', description: 'พัฒนาทักษะและความรู้เพื่อการเติบโต', url: 'https://www.growthd.co/' },
  { icon: '⭐', title: 'Admission Premium', description: 'บริการแนะแนวและเตรียมสอบแบบพรีเมียม', url: 'https://www.admissionpremium.com/' },
];

const moocResources = [
  { icon: '🏛️', title: 'CHULA MOOC', description: 'คอร์สออนไลน์จากจุฬาลงกรณ์มหาวิทยาลัย', url: 'https://www.mooc.chula.ac.th/' },
  { icon: '🔧', title: 'KMUTNB MOOC', description: 'เรียนรู้ฟรีจากมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าฯ', url: 'https://mooc.kmutnb.ac.th/' },
  { icon: '🌾', title: 'KU Online', description: 'ระบบเรียนออนไลน์มหาวิทยาลัยเกษตรศาสตร์', url: 'https://www.ku.ac.th/' },
  { icon: '🏖️', title: 'BUU MOOC', description: 'คอร์สออนไลน์จากมหาวิทยาลัยบูรพา', url: 'https://mooc.buu.ac.th/' },
  { icon: '⛰️', title: 'CMU MOOC', description: 'เรียนรู้ฟรีจากมหาวิทยาลัยเชียงใหม่', url: 'https://mooc.cmu.ac.th/' },
  { icon: '🏥', title: 'Mahidol University', description: 'คอร์สและข้อมูลจากมหาวิทยาลัยมหิดล', url: 'https://mahidol.ac.th/' },
];

export default function EducationResources() {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#FDF2E9] via-[#FFF5F8] to-[#F8F5FF] ${mitr.className}`}>
      {/* Decorative */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 right-20 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-600 transition-colors mb-8">
          <span>←</span>
          <span className="text-sm font-medium">กลับหน้าหลัก</span>
        </Link>

        {/* Header */}
        <header className="text-center mb-12 animate-[fadeIn_0.6s_ease-out]">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-200 to-pink-200 rounded-3xl mb-5 shadow-lg">
            <span className="text-4xl">📚</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-700 mb-3">แหล่งข้อมูลการศึกษา</h1>
          <p className="text-lg text-purple-400">รวมเว็บไซต์ที่น้องๆ ควรรู้จักสำหรับการศึกษาต่อ ✨</p>
        </header>

        {/* TCAS Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-600 mb-6 flex items-center gap-3 animate-[fadeIn_0.5s_ease-out]">
            <span className="w-1.5 h-8 bg-gradient-to-b from-orange-400 to-pink-400 rounded-full" />
            🎯 ข้อมูลสอบเข้า & TCAS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {tcasResources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/70 backdrop-blur-sm rounded-3xl p-6 border-2 border-transparent hover:border-orange-200 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-[fadeInUp_0.5s_ease-out_both]"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  {resource.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 group-hover:text-orange-500 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  {resource.description}
                </p>
                <span className="inline-flex items-center text-sm font-medium text-orange-400 group-hover:text-orange-500">
                  เยี่ยมชม →
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* MOOC Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-600 mb-6 flex items-center gap-3 animate-[fadeIn_0.5s_ease-out]">
            <span className="w-1.5 h-8 bg-gradient-to-b from-purple-400 to-teal-400 rounded-full" />
            💻 คอร์สออนไลน์ฟรี (MOOC)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {moocResources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/70 backdrop-blur-sm rounded-3xl p-6 border-2 border-transparent hover:border-purple-200 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-[fadeInUp_0.5s_ease-out_both]"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-teal-100 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  {resource.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2 group-hover:text-purple-500 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  {resource.description}
                </p>
                <span className="inline-flex items-center text-sm font-medium text-purple-400 group-hover:text-purple-500">
                  เยี่ยมชม →
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-100">
            <span className="text-2xl">💜</span>
            <div className="text-left">
              <p className="text-sm font-medium text-purple-500">Mind Buddy - Education Hub</p>
              <p className="text-xs text-gray-400">รวมแหล่งเรียนรู้ดีดี เพื่ออนาคตที่สดใส ✨</p>
            </div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}