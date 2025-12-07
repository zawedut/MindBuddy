'use client';

import React from 'react';

const EducationResources = () => {
  const tcasResources = [
    {
      icon: '📝',
      title: 'MyTCAS',
      description: 'ระบบรับสมัครนักศึกษาส่วนกลาง ข้อมูลครบถ้วนทุกรอบ',
      url: 'https://www.mytcas.com/',
    },
    {
      icon: '🎓',
      title: 'TCASter',
      description: 'ข้อมูล TCAS เจาะลึก วิเคราะห์คะแนน และเทคนิคการสอบ',
      url: 'https://share.google/vOGlf6H3sSYRDltm0',
    },
    {
      icon: '🐵',
      title: 'MonkeyEveryday',
      description: 'ข่าวสาร เทคนิคการเรียน และข้อมูลมหาวิทยาลัย',
      url: 'https://monkeyeveryday.com/',
    },
    {
      icon: '💬',
      title: 'Dek-D.com',
      description: 'คอมมูนิตี้นักเรียน ข้อสอบ และแนะแนวการศึกษา',
      url: 'https://www.dek-d.com/',
    },
    {
      icon: '⛺',
      title: 'Camphub',
      description: 'ค่ายเตรียมสอบเข้า และข้อมูลรับตรงต่างๆ',
      url: 'https://camphub.in.th/',
    },
    {
      icon: '🌐',
      title: 'Eduzones.com',
      description: 'ข้อมูลการศึกษา คอร์สเรียน และแนะแนว',
      url: 'https://www.eduzones.com/',
    },
    {
      icon: '📈',
      title: 'Growthd',
      description: 'พัฒนาทักษะและความรู้เพื่อการเติบโต',
      url: 'https://www.growthd.co/',
    },
    {
      icon: '⭐',
      title: 'Admission Premium',
      description: 'บริการแนะแนวและเตรียมสอบแบบพรีเมียม',
      url: 'https://www.admissionpremium.com/',
    },
  ];

  const moocResources = [
    {
      icon: '🏛️',
      title: 'CHULA MOOC',
      description: 'คอร์สออนไลน์จากจุฬาลงกรณ์มหาวิทยาลัย',
      url: 'https://www.mooc.chula.ac.th/',
    },
    {
      icon: '🔧',
      title: 'KMUTNB MOOC',
      description: 'เรียนรู้ฟรีจากมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าฯ',
      url: 'https://mooc.kmutnb.ac.th/',
    },
    {
      icon: '🌾',
      title: 'KU Online',
      description: 'ระบบเรียนออนไลน์มหาวิทยาลัยเกษตรศาสตร์',
      url: 'https://www.ku.ac.th/',
    },
    {
      icon: '🏖️',
      title: 'BUU MOOC',
      description: 'คอร์สออนไลน์จากมหาวิทยาลัยบูรพา',
      url: 'https://mooc.buu.ac.th/',
    },
    {
      icon: '⛰️',
      title: 'CMU MOOC',
      description: 'เรียนรู้ฟรีจากมหาวิทยาลัยเชียงใหม่',
      url: 'https://mooc.cmu.ac.th/',
    },
    {
      icon: '🏥',
      title: 'Mahidol University',
      description: 'คอร์สและข้อมูลจากมหาวิทยาลัยมหิดล',
      url: 'https://mahidol.ac.th/',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-[fadeInDown_0.8s_ease-out]">
          <h1 className="text-4xl md:text-5xl font-bold text-pink-500 mb-3 drop-shadow-lg">
            <span className="text-5xl">📚</span>
            {' '}แหล่งข้อมูลการศึกษา{' '}
            <span className="text-5xl">✨</span>
          </h1>
          <p className="text-lg text-purple-400">
            รวมเว็บไซต์ที่น้องๆ ควรรู้จักสำหรับการศึกษาต่อ
          </p>
        </div>

        {/* TCAS Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-purple-400 mb-6 pl-4 border-l-4 border-pink-300 animate-[fadeInLeft_0.8s_ease-out]">
            🎯 ข้อมูลสอบเข้า & TCAS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tcasResources.map((resource, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-pink-50 rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 border-2 border-transparent hover:border-pink-300 animate-[fadeInUp_0.8s_ease-out] cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-pink-200 to-blue-200 rounded-2xl flex items-center justify-center text-3xl mb-4">
                  {resource.icon}
                </div>
                <h3 className="text-xl font-semibold text-pink-500 mb-3">
                  {resource.title}
                </h3>
                <p className="text-sm text-purple-300 mb-4 leading-relaxed">
                  {resource.description}
                </p>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-300 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  เยี่ยมชมเว็บไซต์ →
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* MOOC Section */}
        <div>
          <h2 className="text-3xl font-bold text-purple-400 mb-6 pl-4 border-l-4 border-pink-300 animate-[fadeInLeft_0.8s_ease-out]">
            💻 คอร์สออนไลน์ฟรี (MOOC)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moocResources.map((resource, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-pink-50 rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 border-2 border-transparent hover:border-pink-300 animate-[fadeInUp_0.8s_ease-out] cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-pink-200 to-blue-200 rounded-2xl flex items-center justify-center text-3xl mb-4">
                  {resource.icon}
                </div>
                <h3 className="text-xl font-semibold text-pink-500 mb-3">
                  {resource.title}
                </h3>
                <p className="text-sm text-purple-300 mb-4 leading-relaxed">
                  {resource.description}
                </p>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-300 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  เยี่ยมชมเว็บไซต์ →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
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

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default EducationResources;