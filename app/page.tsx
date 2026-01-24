'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  X, 
  Maximize2, 
  ChevronRight,
  Info
} from 'lucide-react';

export default function App() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<any>(null); // 팝업용 상태

  useEffect(() => {
    async function fetchNotionData() {
      try {
        const response = await fetch('/api/notices'); 
        const data = await response.json();

        if (data.results && Array.isArray(data.results)) {
          const formatted = data.results.map((item: any) => ({
            id: item.id,
            title: item.properties.제목?.title[0]?.plain_text || '내용 없음',
            date: item.properties.날짜?.date?.start || '2026.01.23',
            description: item.properties.설명?.rich_text[0]?.plain_text || '상세 설명이 없습니다.',
            // 이미지 열에서 첫 번째 사진 가져오기
            imageUrl: item.properties.이미지?.files[0]?.file?.url || 
                      item.properties.이미지?.files[0]?.external?.url || 
                      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' // 이미지가 없을 때 보여줄 기본 이미지
          }));
          setNotices(formatted);
        }
      } catch (error) {
        console.error('Data fetch error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotionData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      
      {/* Header Section */}
      <section className="pt-32 pb-16 px-6 text-center">
        <h2 className="text-orange-600 font-black text-xs tracking-[0.3em] uppercase mb-4">Transparency Hub</h2>
        <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">실시간 활동 소식</h3>
        <p className="mt-6 text-slate-500 font-medium">노션 데이터베이스와 실시간으로 연동된 최신 소식입니다.</p>
      </section>

      {/* Grid Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notices.map((n) => (
            <div 
              key={n.id} 
              onClick={() => setSelectedNotice(n)} // 클릭 시 팝업 열기
              className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 hover:border-orange-500 transition-all duration-500 shadow-sm hover:shadow-2xl cursor-pointer flex flex-col"
            >
              {/* Image Area */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img 
                  src={n.imageUrl} 
                  alt={n.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Maximize2 className="text-white" size={32} />
                </div>
              </div>

              {/* Content Area */}
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-orange-50 px-3 py-1 rounded-lg text-[10px] font-black text-orange-600 uppercase tracking-widest">Update</span>
                  <div className="flex items-center text-slate-300 text-xs font-bold gap-1">
                    <Calendar size={14} /> {n.date}
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug">
                  {n.title}
                </h4>
                <p className="text-sm text-slate-500 line-clamp-2 font-medium leading-relaxed mb-6">
                  {n.description}
                </p>
                <div className="mt-auto flex items-center text-orange-600 font-bold text-xs gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                  자세히 보기 <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 팝업(모달) UI */}
      {selectedNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* 배경 어둡게 */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedNotice(null)}
          ></div>
          
          {/* 팝업 창 */}
          <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setSelectedNotice(null)}
              className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-400 hover:text-orange-600 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="max-h-[80vh] overflow-y-auto">
              <img 
                src={selectedNotice.imageUrl} 
                className="w-full aspect-video object-cover" 
                alt={selectedNotice.title}
              />
              <div className="p-10">
                <div className="flex items-center gap-2 text-orange-600 font-bold text-xs mb-4 uppercase tracking-widest">
                  <Info size={14} /> 상세 안내
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-6 leading-tight">
                  {selectedNotice.title}
                </h2>
                <div className="flex items-center text-slate-400 text-sm font-bold gap-2 mb-8 pb-8 border-b border-slate-100">
                  <Calendar size={16} /> {selectedNotice.date} 에 작성됨
                </div>
                <div className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {selectedNotice.description}
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedNotice(null)}
                className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600 transition shadow-lg"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
