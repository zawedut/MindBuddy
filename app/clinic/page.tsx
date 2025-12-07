'use client';

import React, { useState, useEffect, useRef } from 'react';

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
  const [modalTransform, setModalTransform] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);

  const healthData: HealthPlace[] = [
    { id: 1, type: 'clinic', region: 'bkk', name: 'คลินิกเวชกรรมแพทย์นพดล', loc: 'บางคอแหลม', addr: '549/82 ถ.เจริญราษฎร์ (ห่าง รร.มณเฑียร 400ม.)', time: 'จ-พฤ, ส 17.30-19.30 | อา 8.30-10.30', tel: '0655044939' },
    { id: 2, type: 'clinic', region: 'bkk', name: 'นพ.กัมปนาท (Bangkok Health Hub)', loc: 'สีลม', addr: 'ชั้น 3 อาคารสีลม 64 (ติด BTS ศาลาแดง)', time: 'ตามนัดหมาย', tel: '026328232' },
    { id: 3, type: 'clinic', region: 'bkk', name: 'สมรักจิตเวชคลินิก', loc: 'บางซื่อ', addr: '62/8 ประชาราษฎร์สาย 1 (12)', time: 'จ/อ/พฤ 18.00-22.00', tel: '025867627' },
    { id: 4, type: 'clinic', region: 'bkk', name: 'นิพัทธิ์คลินิกแพทย์', loc: 'พระโขนง', addr: '2024/37 ซ.สุขุมวิท 50', time: '-', tel: '023310642' },
    { id: 5, type: 'clinic', region: 'bkk', name: 'Mind and Mood Clinic', loc: 'จตุจักร', addr: '94 ซ.พหลโยธิน 32', time: 'จ-ศ 17.00-21.00 | ส-อา 10.00-20.00', tel: '025610210' },
    { id: 6, type: 'clinic', region: 'bkk', name: 'กายใจคลินิก (Body and Mind)', loc: 'ปทุมวัน', addr: 'จัตุรัสจามจุรี ชั้น 2', time: 'จ-ศ 16.30-20.00', tel: '0933322511' },
    { id: 7, type: 'clinic', region: 'bkk', name: 'เติมสุขคลินิก', loc: 'ประเวศ', addr: '34 ซ.พัฒนาการ 61', time: 'อ-ศ 17-19 | ส-อา 9-18', tel: '0959509050' },
    { id: 8, type: 'clinic', region: 'bkk', name: 'คลินิกจิตเวช รพ.บ้านแพ้ว (สาทร)', loc: 'สาทร', addr: 'ตึก TPI ถ.จันทน์ ชั้น 10', time: 'ศ 09-14 | ส 09.30-16', tel: '022872228' },
    { id: 9, type: 'clinic', region: 'bkk', name: 'Joy of Minds Clinic', loc: 'อโศก/สายไหม', addr: 'สาขา 1: อโศกทาวเวอร์ | สาขา 2: สายไหม', time: '-' },
    { id: 10, type: 'clinic', region: 'bkk', name: 'Sunshine Mind Clinic', loc: 'บางเขน', addr: 'Platinum Place วัชรพล', time: 'จิตเวชเด็ก', tel: '0805535212' },
    { id: 50, type: 'hospital', region: 'bkk', name: 'สถาบันจิตเวชสมเด็จเจ้าพระยา', loc: 'กทม', addr: 'เฉพาะทางจิตเวช', time: '24 ชม.', tel: '024370200' },
    { id: 51, type: 'hospital', region: 'bkk', name: 'รพ.จุฬาลงกรณ์', loc: 'กทม', addr: 'แผนกจิตเวช', time: 'เวลาราชการ', tel: '022564000' },
    { id: 52, type: 'hospital', region: 'bkk', name: 'รพ.ศิริราช', loc: 'กทม', addr: 'แผนกจิตเวช', time: 'เวลาราชการ', tel: '024197000' },
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
      (currentFilter === 'bkk' && place.region === 'bkk') ||
      (currentFilter === 'perim' && place.region === 'perim') ||
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
    showToast(favorites.includes(id) ? 'ลบแล้ว' : 'บันทึกแล้ว');
  };

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2000);
  };

  const openModal = (place: HealthPlace) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
    setModalTransform(0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPlace(null), 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;
    if (diff > 0) {
      setModalTransform(diff);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = e.changedTouches[0].clientY - startYRef.current;
    if (diff > 100) {
      closeModal();
    } else {
      setModalTransform(0);
    }
  };

  return (
    <div className="w-full max-w-[500px] mx-auto relative font-['Prompt'] bg-gradient-to-br from-gray-50 to-gray-100 rounded-[30px] shadow-2xl overflow-hidden border border-gray-50 h-[650px] flex flex-col">
      {/* Header */}
      <div className="bg-white px-5 py-5 pb-2.5 rounded-b-[30px] shadow-md z-10 flex-shrink-0">
        <div className="text-center mb-4">
          <h2 className="text-[1.3rem] font-bold text-[#E27D60] mb-1">Health Directory</h2>
          <p className="text-[0.8rem] text-gray-500">ค้นหาสถานพยาบาล & คลินิก</p>
        </div>

        <div className="relative mb-2.5">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 text-[0.9rem]">🔍</span>
          <input
            type="text"
            placeholder="ค้นหาชื่อ, เขต..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 px-4 pl-9 rounded-full border-2 border-gray-100 bg-gray-50 text-[0.9rem] text-gray-700 focus:border-[#FFB7B2] focus:bg-white transition-all outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-hide">
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'fav', label: '❤️ ที่ชอบ' },
            { id: 'clinic', label: '🏥 คลินิก' },
            { id: 'hospital', label: '🏨 โรงพยาบาล' },
            { id: 'bkk', label: '📍 กทม.' },
            { id: 'perim', label: '📍 ปริมณฑล' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setCurrentFilter(filter.id)}
              className={`whitespace-nowrap py-1.5 px-3 rounded-[20px] text-[0.75rem] font-medium transition-all ${
                currentFilter === filter.id
                  ? 'bg-[#E27D60] text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex justify-between mb-2.5 text-[0.8rem] text-gray-500">
          <span>รายการทั้งหมด ({filteredData.length})</span>
        </div>

        {filteredData.length === 0 ? (
          <div className="text-center py-10 text-[0.9rem] text-gray-400">ไม่พบข้อมูล</div>
        ) : (
          filteredData.map((place) => (
            <div
              key={place.id}
              onClick={() => openModal(place)}
              className="bg-white rounded-[18px] p-4 mb-2.5 shadow-sm border border-gray-50 cursor-pointer relative transition-all hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex justify-between items-center mb-1">
                <span
                  className={`text-[0.6rem] px-2 py-0.5 rounded-md font-bold uppercase ${
                    place.type === 'hospital'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-50 text-[#E27D60]'
                  }`}
                >
                  {place.type === 'hospital' ? 'HOSPITAL' : 'CLINIC'}
                </span>
                <button
                  onClick={(e) => toggleFavorite(place.id, e)}
                  className={`text-xl transition-all ${
                    favorites.includes(place.id) ? 'text-red-500 scale-110' : 'text-gray-300'
                  }`}
                >
                  ❤️
                </button>
              </div>
              <div className="text-[0.95rem] font-semibold text-gray-700 mb-1 leading-snug">
                {place.name}
              </div>
              <div className="text-[0.8rem] text-gray-500 flex items-center gap-1">
                📍 {place.loc}
              </div>
              <div className="absolute right-4 bottom-4 text-[0.8rem] text-gray-300">➜</div>
            </div>
          ))
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[99999] backdrop-blur-sm transition-opacity duration-300"
          onClick={closeModal}
        >
          <div
            className="fixed bottom-0 left-0 w-full bg-white rounded-t-[25px] px-5 py-2.5 pb-10 shadow-2xl max-h-[85vh] overflow-y-auto transition-transform duration-400"
            style={{
              transform: `translateY(${modalTransform}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-full h-10 flex justify-center items-center cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            <div className="flex justify-between items-center mb-2.5">
              <span
                className={`text-[0.6rem] px-2 py-0.5 rounded-md font-bold uppercase ${
                  selectedPlace?.type === 'hospital'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-50 text-[#E27D60]'
                }`}
              >
                {selectedPlace?.type === 'hospital' ? 'HOSPITAL' : 'CLINIC'}
              </span>
              <button
                onClick={() => selectedPlace && toggleFavorite(selectedPlace.id)}
                className={`text-2xl transition-all ${
                  selectedPlace && favorites.includes(selectedPlace.id)
                    ? 'text-red-500 scale-110'
                    : 'text-gray-300'
                }`}
              >
                ❤️
              </button>
            </div>

            <h2 className="text-[1.2rem] font-bold text-gray-800 mb-1">{selectedPlace?.name}</h2>
            <p className="text-[0.85rem] text-gray-500 mb-4">📍 {selectedPlace?.loc}</p>

            <div className="w-full h-[180px] rounded-2xl bg-gray-200 mb-5 overflow-hidden relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 text-[0.8rem]">
                กำลังโหลด...
              </div>
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  selectedPlace?.name + ' ' + selectedPlace?.loc
                )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>

            <div className="text-[0.7rem] text-[#E27D60] font-bold mb-1.5 uppercase">ที่อยู่ & รายละเอียด</div>
            <div className="text-[0.9rem] text-gray-600 leading-relaxed mb-4">{selectedPlace?.addr}</div>

            <div className="text-[0.7rem] text-[#E27D60] font-bold mb-1.5 uppercase">เวลาทำการ</div>
            <div className="text-[0.9rem] text-gray-600 leading-relaxed mb-4">{selectedPlace?.time}</div>

            <div className="grid grid-cols-2 gap-2.5 mt-5">
              {selectedPlace?.tel && (
                <a
                  href={`tel:${selectedPlace.tel}`}
                  className="py-3 px-4 rounded-xl text-center font-semibold text-[0.9rem] bg-[#FFB7B2] text-white hover:bg-[#E27D60] transition-all"
                >
                  📞 โทร
                </a>
              )}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  selectedPlace?.name + ' ' + selectedPlace?.loc
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl text-center font-semibold text-[0.9rem] bg-green-100 text-green-700 hover:bg-green-200 transition-all"
              >
                🗺️ นำทาง
              </a>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: selectedPlace?.name,
                      text: `สถานที่: ${selectedPlace?.name}`,
                      url: window.location.href,
                    });
                  } else {
                    showToast('คัดลอกลิงก์แล้ว');
                  }
                }}
                className="col-span-2 py-3 px-4 rounded-xl text-center font-semibold text-[0.9rem] bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
              >
                📤 แชร์
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white py-2.5 px-6 rounded-full text-[0.85rem] z-[100000] transition-all animate-[slideDown_0.4s_ease]">
          {toast.message}
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateX(-50%) translateY(-100px);
          }
          to {
            transform: translateX(-50%) translateY(0);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default HealthDirectory;