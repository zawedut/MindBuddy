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
            highlights: ['📱 สแกน QR code เพื่ออ่านรายละเอียดและสมัครแข่งขัน'],
        },
    },
    {
        id: 'modal4',
        badge: '🌟 ผู้นำ',
        badgeColor: 'from-green-400 to-emerald-400',
        image: '/images/info4.jpg',
        title: '🌟 โครงการบ่มเพาะผู้นำเยาวชนรุ่นใหม่ อายุ 18-25 ปี ทั่วประเทศไทย',
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
                "📝 Let's start TCAS70 — รู้ก่อน เริ่มก่อน สอบติด!",
                '🎯 งานแนะแนว TCAS ครั้งใหญ่ประจำปี เพื่อน้องๆ dek70-71',
                '📌 สิ่งที่จะได้:',
                '• เจาะลึกแผนสอบทุกสนาม',
                '• เจาะกลยุทธ์ 10 เดือน พิชิตทุกสนามสอบ TGAT / TPAT และ A-Level',
                '• อัปเดทระบบสอบช่วยวางแผนพิชิตคณะชั้นนำ ทั้งสายวิทย์ และสายศิลป์',
                '• รู้ลึกแผนเตรียมตัว พร้อมอัปเดทเกณฑ์คะแนนที่ใช้ยื่น',
                '📅 วันเสาร์ที่ 28 กุมภาพันธ์ 2569 เวลา 09.30-14.30 น.',
                '📍 จัดกิจกรรมที่ Megastudy MBK ชั้น 5 โซน D',
            ],
            highlights: ['📱 สมัครได้ตั้งแต่วันนี้ถึงวันที่ 27 กุมภาพันธ์ 2569'],
        },
    },
];

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

type TabType = 'flashinfo' | 'learning';

export default function ResourcesHub() {
    const [activeTab, setActiveTab] = useState<TabType>('flashinfo');
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const openModal = (modalId: string) => {
        setActiveModal(modalId);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setActiveModal(null);
        document.body.style.overflow = 'auto';
    };

    const tabs = [
        { id: 'flashinfo' as TabType, label: 'ข่าวสาร', icon: '📢', color: 'from-purple-400 to-pink-400' },
        { id: 'learning' as TabType, label: 'แหล่งเรียนรู้', icon: '📚', color: 'from-orange-400 to-pink-400' },
    ];

    return (
        <div className={`min-h-screen bg-gradient-to-br from-[#F8F5FF] via-[#FFF5F8] to-[#F0FAFF] ${mitr.className}`}>
            {/* Decorative */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
                {/* Back Button */}
                <Link href="/" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-600 transition-colors mb-6">
                    <span>←</span>
                    <span className="text-sm font-medium">กลับหน้าหลัก</span>
                </Link>

                {/* Header */}
                <header className="text-center mb-10 animate-[fadeIn_0.6s_ease-out]">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200 rounded-3xl mb-5 shadow-lg">
                        <span className="text-4xl">🌟</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-3">Mind Buddy Hub</h1>
                    <p className="text-lg text-purple-400">รวมข่าวสาร ความรู้ และแหล่งเรียนรู้ไว้ในที่เดียว ✨</p>

                    <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-purple-100">
                        <span>🦆</span>
                        <span className="text-sm text-purple-500">อัพเดทพร้อมดูแลน้องๆ ทุกวัน</span>
                    </div>
                </header>

                {/* Tab Navigation */}
                <div className="flex justify-center gap-3 mb-10">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm md:text-base transition-all duration-300
                ${activeTab === tab.id
                                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-purple-500/25 scale-105`
                                    : 'bg-white/70 text-gray-600 hover:bg-white hover:shadow-md'
                                }
              `}
                        >
                            <span className="text-xl">{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Flash Info Tab Content */}
                {activeTab === 'flashinfo' && (
                    <div className="max-w-xl mx-auto animate-[fadeIn_0.3s_ease-out]">
                        {/* About Card */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-purple-100 shadow-sm">
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
                    </div>
                )}

                {/* Learning Resources Tab Content */}
                {activeTab === 'learning' && (
                    <div className="animate-[fadeIn_0.3s_ease-out]">
                        {/* TCAS Section */}
                        <section className="mb-12">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-600 mb-6 flex items-center gap-3">
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
                            <h2 className="text-xl md:text-2xl font-bold text-gray-600 mb-6 flex items-center gap-3">
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
                    </div>
                )}

                {/* Footer */}
                <footer className="text-center mt-12">
                    <div className="inline-flex items-center gap-3 px-6 py-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-100">
                        <span className="text-2xl">💜</span>
                        <div className="text-left">
                            <p className="text-sm font-medium text-purple-500">Mind Buddy Hub</p>
                            <p className="text-xs text-gray-400">รวมข่าวสารและแหล่งเรียนรู้ดีดี เพราะทุกคนสำคัญ ✨</p>
                        </div>
                    </div>
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
                            <div className="w-full rounded-2xl mb-5 shadow-md overflow-hidden relative" style={{ minHeight: '400px' }}>
                                <Image
                                    src={announcement.modalContent.image}
                                    alt={announcement.title}
                                    fill
                                    className="object-contain bg-gradient-to-br from-purple-50 to-pink-50"
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
}
