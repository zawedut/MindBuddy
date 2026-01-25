'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mitr } from 'next/font/google';
import Link from 'next/link';

const mitr = Mitr({ weight: ['400', '500', '600', '700'], subsets: ['thai'], variable: '--font-mitr' });

interface HealthPlace {
  id: number;
  type: 'clinic' | 'hospital';
  region: 'bkk' | 'perim';
  name: string;
  loc: string;
  addr: string;
  time: string;
  tel?: string;
}

const HealthDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<HealthPlace | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const healthData: HealthPlace[] = [
    // คลินิกในกรุงเทพฯ
    { id: 1, type: 'clinic', region: 'bkk', name: 'คลินิกเวชกรรมแพทย์นพดล', loc: 'บางคอแหลม', addr: '549/82 ถ.เจริญราษฎร์ (ห่าง รร.มณเฑียร 400ม.)', time: 'จ-พฤ, ส 17.30-19.30 | อา 8.30-10.30', tel: '0655044939' },
    { id: 2, type: 'clinic', region: 'bkk', name: 'นพ.กัมปนาท (Bangkok Health Hub)', loc: 'สีลม', addr: 'ชั้น 3 อาคารสีลม 64 (ติด BTS ศาลาแดง)', time: 'ตามนัดหมาย', tel: '026328232' },
    { id: 3, type: 'clinic', region: 'bkk', name: 'สมรักจิตเวชคลินิก', loc: 'บางซื่อ', addr: '62/8 ประชาราษฎร์สาย 1 (12)', time: 'จ/อ/พฤ 18.00-22.00', tel: '025867627' },
    { id: 4, type: 'clinic', region: 'bkk', name: 'นิพัทธิ์คลินิกแพทย์', loc: 'พระโขนง', addr: '2024/37 ซ.สุขุมวิท 50', time: '-', tel: '023310642' },
    { id: 5, type: 'clinic', region: 'bkk', name: 'Mind and Mood Clinic', loc: 'จตุจักร', addr: '94 ซ.พหลโยธิน 32', time: 'จ-ศ 17.00-21.00 | ส-อา 10.00-20.00', tel: '025610210' },
    { id: 6, type: 'clinic', region: 'bkk', name: 'กายใจคลินิก (Body and Mind)', loc: 'ปทุมวัน', addr: 'จัตุรัสจามจุรี ชั้น 2', time: 'จ-ศ 16.30-20.00', tel: '0933322511' },
    { id: 7, type: 'clinic', region: 'bkk', name: 'เติมสุขคลินิก', loc: 'ประเวศ', addr: '34 ซ.พัฒนาการ 61', time: 'อ-ศ 17-19 | ส-อา 9-18', tel: '0959509050' },
    { id: 8, type: 'clinic', region: 'bkk', name: 'คลินิกจิตเวช รพ.บ้านแพ้ว (สาทร)', loc: 'สาทร', addr: 'ตึก TPI ถ.จันทน์ ชั้น 10', time: 'ศ 09-14 | ส 09.30-16', tel: '022872228' },
    // เพิ่มคลินิกใหม่
    { id: 9, type: 'clinic', region: 'bkk', name: 'The Merry Mind Clinic', loc: 'วัฒนา', addr: 'อาคาร RSU Tower ชั้น 6 สุขุมวิท 31', time: 'จ-ส 10.00-20.00', tel: '020117555' },
    { id: 10, type: 'clinic', region: 'bkk', name: 'Peace of Mind Clinic', loc: 'ห้วยขวาง', addr: '1 อาคารฟอร์จูนทาวน์ ชั้น 3', time: 'จ-ส 10.00-19.00', tel: '026410818' },
    { id: 11, type: 'clinic', region: 'bkk', name: 'คลินิกจิตเวชนายแพทย์วิญญู', loc: 'บางกะปิ', addr: '99/99 ซ.ลาดพร้าว 87', time: 'จ-ศ 17.00-20.00 | ส 09.00-17.00', tel: '025300708' },
    { id: 12, type: 'clinic', region: 'bkk', name: 'ใจใสคลินิก (Jaisai Clinic)', loc: 'ลาดพร้าว', addr: '1 อาคารเซ็นทรัลลาดพร้าว ชั้น 8', time: 'ทุกวัน 10.00-20.00', tel: '025121111' },
    { id: 13, type: 'clinic', region: 'bkk', name: 'Better Mind Clinic', loc: 'คลองเตย', addr: 'อาคาร Q House Lumpini ชั้น 7', time: 'จ-ศ 09.00-18.00', tel: '026771777' },
    { id: 14, type: 'clinic', region: 'bkk', name: 'Serenity Clinic', loc: 'พญาไท', addr: '388 อาคาร SP ชั้น 10 ถ.พหลโยธิน', time: 'จ-ส 10.00-19.00', tel: '026198999' },
    { id: 15, type: 'clinic', region: 'bkk', name: 'คลินิกจิตเวชหมอปราโมทย์', loc: 'ดินแดง', addr: '155/5 อาคารโอลิมเปีย ชั้น 2', time: 'จ/พ/ศ 17.00-20.00', tel: '026410333' },
    { id: 16, type: 'clinic', region: 'bkk', name: 'Clear Mind Clinic', loc: 'สาทร', addr: 'อาคาร Sathorn Square ชั้น 21', time: 'จ-ศ 09.00-18.00 | ส 09.00-14.00', tel: '026798000' },
    { id: 17, type: 'clinic', region: 'bkk', name: 'ศูนย์สุขภาพจิตธนบุรี', loc: 'ธนบุรี', addr: '123 ถ.อิสรภาพ แขวงวัดอรุณ', time: 'จ-ศ 08.30-16.30', tel: '024112222' },
    { id: 18, type: 'clinic', region: 'bkk', name: 'Happy Brain Clinic', loc: 'บางนา', addr: '589 อาคาร Bhiraj Tower ชั้น 15', time: 'จ-ส 10.00-20.00', tel: '023615555' },
    { id: 19, type: 'clinic', region: 'bkk', name: 'Mind Plus Clinic', loc: 'รามคำแหง', addr: 'The Mall รามคำแหง ชั้น 4', time: 'ทุกวัน 10.00-21.00', tel: '023697000' },
    { id: 20, type: 'clinic', region: 'bkk', name: 'คลินิกจิตเวชพระราม 9', loc: 'ห้วยขวาง', addr: '9 ซ.พระราม 9 ซอย 17', time: 'จ-ส 09.00-18.00', tel: '026438888' },
    { id: 21, type: 'clinic', region: 'bkk', name: 'Wellness Mind Clinic', loc: 'ปทุมวัน', addr: 'อาคาร CRC Tower ชั้น 25 ถ.วิทยุ', time: 'จ-ศ 09.00-17.00', tel: '022556789' },
    { id: 22, type: 'clinic', region: 'bkk', name: 'ใจสบายคลินิก', loc: 'มีนบุรี', addr: '99 ถ.รามคำแหง 187', time: 'จ-ศ 16.00-20.00 | ส 09.00-17.00', tel: '025175959' },
    { id: 23, type: 'clinic', region: 'bkk', name: 'Thai Mental Health Clinic', loc: 'หลักสี่', addr: '123/45 ซ.แจ้งวัฒนะ 14', time: 'จ-ศ 10.00-19.00', tel: '025738888' },
    // โรงพยาบาล
    { id: 50, type: 'hospital', region: 'bkk', name: 'สถาบันจิตเวชสมเด็จเจ้าพระยา', loc: 'กทม', addr: 'เฉพาะทางจิตเวช', time: '24 ชม.', tel: '024370200' },
    { id: 51, type: 'hospital', region: 'bkk', name: 'รพ.จุฬาลงกรณ์', loc: 'กทม', addr: 'แผนกจิตเวช', time: 'เวลาราชการ', tel: '022564000' },
    { id: 52, type: 'hospital', region: 'bkk', name: 'รพ.ศิริราช', loc: 'กทม', addr: 'แผนกจิตเวช', time: 'เวลาราชการ', tel: '024197000' },
    { id: 53, type: 'hospital', region: 'bkk', name: 'รพ.รามาธิบดี', loc: 'ราชเทวี', addr: 'แผนกจิตเวช ตึกสมเด็จพระเทพฯ', time: 'เวลาราชการ', tel: '022012000' },
    { id: 54, type: 'hospital', region: 'bkk', name: 'รพ.ธรรมศาสตร์เฉลิมพระเกียรติ', loc: 'คลองหลวง', addr: 'แผนกจิตเวช', time: 'เวลาราชการ', tel: '029269999' },
    { id: 55, type: 'hospital', region: 'bkk', name: 'สถาบันกัลยาณ์ราชนครินทร์', loc: 'ทวีวัฒนา', addr: 'เฉพาะทางจิตเวชเด็ก', time: 'เวลาราชการ', tel: '024419323' },
    { id: 56, type: 'hospital', region: 'bkk', name: 'รพ.พระมงกุฎเกล้า', loc: 'ราชเทวี', addr: 'แผนกจิตเวช', time: 'เวลาราชการ', tel: '023547600' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('psFavs');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const filteredData = healthData.filter((place) => {
    const matchType =
      currentFilter === 'all' ||
      (currentFilter === 'clinic' && place.type === 'clinic') ||
      (currentFilter === 'hospital' && place.type === 'hospital') ||
      (currentFilter === 'fav' && favorites.includes(place.id));

    const matchText =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.loc.toLowerCase().includes(searchQuery.toLowerCase());

    return matchType && matchText;
  });

  const toggleFavorite = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newFavorites = favorites.includes(id)
      ? favorites.filter((fid) => fid !== id)
      : [...favorites, id];

    setFavorites(newFavorites);
    localStorage.setItem('psFavs', JSON.stringify(newFavorites));
    showToast(favorites.includes(id) ? 'ลบออกแล้ว' : 'บันทึกแล้ว 💜');
  };

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2000);
  };

  const openModal = (place: HealthPlace) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPlace(null), 300);
  };

  const filters = [
    { id: 'all', label: 'ทั้งหมด', icon: '🌐' },
    { id: 'fav', label: 'ที่บันทึก', icon: '💜' },
    { id: 'clinic', label: 'คลินิก', icon: '🏥' },
    { id: 'hospital', label: 'โรงพยาบาล', icon: '🏨' },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#F0FAFF] via-[#F8F5FF] to-[#FFF5F8] ${mitr.className}`}>
      {/* Decorative */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-600 transition-colors mb-6">
          <span>←</span>
          <span className="text-sm font-medium">กลับหน้าหลัก</span>
        </Link>

        {/* Header */}
        <header className="text-center mb-8 animate-[fadeIn_0.6s_ease-out]">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">🏥</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-700 mb-2">คลินิกสุขภาพจิต</h1>
          <p className="text-purple-400">ค้นหาสถานพยาบาลและคลินิกใกล้คุณ</p>
        </header>

        {/* Search */}
        <div className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="ค้นหาชื่อ หรือ เขต..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3.5 px-12 rounded-2xl bg-white/70 backdrop-blur-sm border-2 border-transparent focus:border-teal-300 text-gray-700 placeholder-gray-400 shadow-sm transition-all outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setCurrentFilter(filter.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap py-2.5 px-4 rounded-full text-sm font-medium transition-all ${currentFilter === filter.id
                ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-white shadow-lg shadow-teal-200/50'
                : 'bg-white/70 text-gray-600 hover:bg-white'
                }`}
            >
              <span>{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-400 mb-4">พบ {filteredData.length} สถานที่</p>

        {/* List */}
        <div className="space-y-3">
          {filteredData.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <span className="text-4xl mb-4 block">🔍</span>
              ไม่พบข้อมูล
            </div>
          ) : (
            filteredData.map((place, index) => (
              <div
                key={place.id}
                onClick={() => openModal(place)}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white hover:shadow-lg hover:border-teal-200 cursor-pointer transition-all duration-300 animate-[fadeInUp_0.4s_ease-out_both]"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${place.type === 'hospital'
                    ? 'bg-teal-100 text-teal-600'
                    : 'bg-purple-100 text-purple-600'
                    }`}>
                    {place.type === 'hospital' ? '🏨 โรงพยาบาล' : '🏥 คลินิก'}
                  </span>
                  <button
                    onClick={(e) => toggleFavorite(place.id, e)}
                    className={`text-xl transition-transform hover:scale-125 ${favorites.includes(place.id) ? 'text-purple-500' : 'text-gray-300'
                      }`}
                  >
                    {favorites.includes(place.id) ? '💜' : '🤍'}
                  </button>
                </div>
                <h3 className="font-semibold text-gray-700 mb-1">{place.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <span>📍</span> {place.loc}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedPlace && (
        <div
          className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm flex items-end justify-center animate-[fadeIn_0.2s_ease-out]"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-[slideUp_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="sticky top-0 bg-white pt-3 pb-2 flex justify-center">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </div>

            <div className="px-6 pb-8">
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${selectedPlace.type === 'hospital'
                  ? 'bg-teal-100 text-teal-600'
                  : 'bg-purple-100 text-purple-600'
                  }`}>
                  {selectedPlace.type === 'hospital' ? '🏨 โรงพยาบาล' : '🏥 คลินิก'}
                </span>
                <button
                  onClick={() => toggleFavorite(selectedPlace.id)}
                  className="text-2xl"
                >
                  {favorites.includes(selectedPlace.id) ? '💜' : '🤍'}
                </button>
              </div>

              <h2 className="text-2xl font-bold text-gray-700 mb-2">{selectedPlace.name}</h2>
              <p className="text-gray-500 mb-6">📍 {selectedPlace.loc}</p>

              {/* Map */}
              <div className="w-full h-48 rounded-2xl bg-gray-100 mb-6 overflow-hidden">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    selectedPlace.name + ' ' + selectedPlace.loc
                  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">📍 ที่อยู่</p>
                  <p className="text-gray-700">{selectedPlace.addr}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">🕐 เวลาทำการ</p>
                  <p className="text-gray-700">{selectedPlace.time}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                {selectedPlace.tel && (
                  <a
                    href={`tel:${selectedPlace.tel}`}
                    className="py-3.5 rounded-2xl text-center font-semibold bg-gradient-to-r from-teal-400 to-cyan-400 text-white shadow-lg shadow-teal-200/50"
                  >
                    📞 โทร
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    selectedPlace.name + ' ' + selectedPlace.loc
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 rounded-2xl text-center font-semibold bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg shadow-purple-200/50"
                >
                  🗺️ นำทาง
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white py-2.5 px-6 rounded-full text-sm z-[100] animate-[slideDown_0.3s_ease-out]">
          {toast.message}
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes slideDown { from { transform: translate(-50%, -100%); } to { transform: translate(-50%, 0); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default HealthDirectory;