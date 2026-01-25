'use client';

import React from 'react';
import Link from 'next/link';
import { Mitr } from 'next/font/google';

const mitr = Mitr({ weight: ['400', '500', '600', '700'], subsets: ['thai'], variable: '--font-mitr' });

const pages = [
  {
    href: '/calendar',
    icon: '📅',
    title: 'ปฏิทินอารมณ์',
    description: 'บันทึกความรู้สึกในแต่ละวัน ติดตามอารมณ์ของตัวเองได้ง่ายๆ',
    gradient: 'from-pink-100 to-rose-100',
    iconBg: 'bg-pink-200',
    borderColor: 'hover:border-pink-300'
  },
  {
    href: '/clinic',
    icon: '🏥',
    title: 'คลินิกสุขภาพจิต',
    description: 'ค้นหาสถานพยาบาลและคลินิกจิตเวชใกล้คุณ',
    gradient: 'from-mint-100 to-teal-100',
    iconBg: 'bg-teal-200',
    borderColor: 'hover:border-teal-300'
  },
  {
    href: '/resources',
    icon: '🌟',
    title: 'ข่าวสาร & แหล่งเรียนรู้',
    description: 'รวมข่าวสาร Flash Info, เว็บไซต์ TCAS และคอร์สออนไลน์ฟรี',
    gradient: 'from-lavender-100 to-purple-100',
    iconBg: 'bg-gradient-to-br from-purple-200 to-orange-200',
    borderColor: 'hover:border-purple-300'
  }
];

export default function Home() {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#F8F5FF] via-[#FFF5F8] to-[#F0FAFF] ${mitr.className}`}>
      {/* Decorative Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <header className="text-center mb-16 animate-[fadeInDown_0.8s_ease-out]">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-gradient-to-br from-pink-200 via-purple-200 to-teal-200 rounded-3xl shadow-lg shadow-purple-200/50 animate-[float_3s_ease-in-out_infinite]">
            <span className="text-5xl">💜</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
            Mind Buddy
          </h1>

          <p className="text-lg text-purple-400/80 max-w-md mx-auto leading-relaxed">
            เพื่อนคู่ใจดูแลสุขภาพจิต พร้อมเคียงข้างคุณทุกวัน 🌈
          </p>

          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-white/70 backdrop-blur-sm rounded-full border border-purple-100 shadow-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-purple-500 font-medium">พร้อมให้บริการ 24/7</span>
          </div>
        </header>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-center text-lg font-semibold text-purple-400/70 mb-8 flex items-center justify-center gap-2">
            <span className="w-8 h-[2px] bg-gradient-to-r from-transparent to-purple-300 rounded" />
            บริการของเรา
            <span className="w-8 h-[2px] bg-gradient-to-l from-transparent to-purple-300 rounded" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pages.map((page, index) => (
              <Link
                key={page.href}
                href={page.href}
                className={`group relative bg-white/60 backdrop-blur-sm p-6 rounded-3xl border-2 border-transparent ${page.borderColor} shadow-lg shadow-purple-100/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-[fadeInUp_0.6s_ease-out_both]`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className={`w-14 h-14 ${page.iconBg} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {page.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-700 mb-2 group-hover:text-purple-500 transition-colors">
                  {page.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {page.description}
                </p>

                {/* Arrow */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl text-purple-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                  →
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Admin Link */}
        {/* <section className="text-center mb-12">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <span>🔐</span>
            <span>Admin Dashboard</span>
          </Link>
        </section> */}

        {/* Footer */}
        <footer className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-purple-100">
            <span className="text-2xl">💙</span>
            <div className="text-left">
              <p className="text-sm font-medium text-purple-500">Mind Buddy by น้องเรียนดี</p>
              <p className="text-xs text-gray-400">เพราะทุกคนสำคัญ ทุกความรู้สึกมีค่า ✨</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
