'use client';

import React, { useState, useEffect } from 'react';
import { 
  Laptop, HandHeart, FileText, ChevronRight, Copy, ShieldCheck, 
  Calendar, Download, Menu, X, Database, Maximize2, Info 
} from 'lucide-react';

export default function App() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<any>(null);

  useEffect(() => {
    async function fetchNotionData() {
      try {
        const response = await fetch('/api/notices'); 
        const data = await response.json();

        if (data.results) {
          const formatted = data.results.map((item: any) => ({
            id: item.id,
            title: item.properties.제목?.title[0]?.plain_text || '내용 없음',
            date: item.properties.날짜?.date?.start || '2026.01.23',
            description: item.properties.설명?.rich_text[0]?.plain_text || '',
            // [중요] 모든 이미지를 배열로 가져옵니다
            images: item.properties.이미지?.files.map((f: any) => f.file?.url || f.external?.url) || []
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

  const copyAcc = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-100">
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-2xl animate-bounce text-sm">
          ✅ 계좌번호가 복사되었습니다!
        </div>
      )}

      {/* 1. Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">SJ</div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter">S&J 희망나눔</span>
              <span className="text-[9px] text-orange-600 font-bold uppercase tracking-widest">Chairman's AI Lab</span>
            </div>
          </div>
          <div className="hidden lg:flex space-x-10 text-sm font-bold text-slate-500">
            {['소개', '사업(IT교육)', '후원하기', '활동·보고', '참여·문의'].map(m => (
              <a key={m} href={`#${m}`} className="hover:text-orange-600 transition-all">{m}</a>
            ))}
          </div>
          <button className="bg-orange-600 text-white px-7 py-2.5 rounded-full text-xs font-bold hover:bg-orange-700 transition shadow-lg">정기후원</button>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section id="소개" className="pt-48 pb-32 px-6 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-[11px] font-bold mb-8 border border-orange-200">
              <span>2026 청소년 디지털 교육 혁신 캠페인</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-10 tracking-tight">
              아이들의 꿈이<br /><span className="text-orange-600 italic underline decoration-orange-200 decoration-8 underline-offset-4">AI 기술</span>로<br />날개를 달도록
            </h1>
            <p className="text-slate-500 text-lg mb-12 leading-relaxed max-w-lg font-medium">
              이사장님이 직접 진행하시는 인공지능(AI) 미래교실은 대구 지역 청소년들에게 새로운 가능성을 선물합니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#후원하기" className="bg-orange-600 text-white px-10 py-5 rounded-2xl font-bold hover:shadow-2xl transition shadow-xl">지금 참여하기</a>
              <a href="#활동·보고" className="bg-white text-slate-600 border border-slate-200 px-10 py-5 rounded-2xl font-bold hover:bg-slate-50 transition shadow-sm">보고서 열람</a>
            </div>
          </div>
          <div className="hidden lg:block relative group">
            <div className="bg-gradient-to-br from-orange-500 to-orange-400 rounded-[60px] aspect-square flex flex-col items-center justify-center text-white p-12 shadow-2xl relative overflow-hidden transition-all duration-500 hover:scale-[1.02]">
              <Laptop size={48} className="mx-auto mb-8" />
              <h4 className="text-3xl font-black mb-4 tracking-tight uppercase">Specialized Hub</h4>
              <p className="text-orange-50 text-sm font-medium leading-relaxed text-center">노션 데이터베이스와 연동되어<br />실시간 소식을 홈페이지에 송출합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. IT Education Hub */}
      <section id="사업(IT교육)" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-orange-600 font-black text-xs tracking-[0.3em] uppercase mb-6 italic">Education Innovation</h2>
          <h3 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">AI 역량은 청소년의 새로운 경쟁력입니다.</h3>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="p-12 rounded-[56px] bg-slate-50 border border-transparent hover:border-orange-500 transition-all shadow-sm hover:shadow-xl group">
            <Laptop className="text-orange-600 mb-8" size={32} />
            <h4 className="text-2xl font-bold mb-5 tracking-tight">AI 리터러시 클래스</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">생성형 AI의 기초부터 윤리적 활용까지, 미래 사회의 필수 소양을 교육합니다.</p>
          </div>
          <div className="p-12 rounded-[56px] bg-slate-50 border border-transparent hover:border-orange-500 transition-all shadow-sm hover:shadow-xl group">
            <FileText className="text-orange-600 mb-8" size={32} />
            <h4 className="text-2xl font-bold mb-5 tracking-tight">미래인재 코딩교실</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">파이썬과 블록코딩을 통해 문제 해결 능력을 키우는 실습 중심 교육입니다.</p>
          </div>
          <div className="p-12 rounded-[56px] bg-orange-600 text-white shadow-2xl group">
            <ShieldCheck className="text-white mb-8" size={32} />
            <h4 className="text-2xl font-bold mb-5 tracking-tight">교육 임팩트 연구</h4>
            <p className="text-sm text-orange-50 leading-relaxed font-medium opacity-90">이사장님의 전문 데이터를 바탕으로 매년 발간되는 연구 보고서를 확인하세요.</p>
          </div>
        </div>
      </section>

      {/* 4. 활동 보고 섹션 (업그레이드된 디자인) */}
      <section id="활동·보고" className="py-32 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-orange-600 font-black text-xs tracking-[0.2em] uppercase mb-4 text-center">Transparency Hub</h2>
          <h3 className="text-4xl font-black text-slate-900 mb-16 text-center">실시간 활동 소식</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notices.map((n) => (
              <div 
                key={n.id} 
                onClick={() => setSelectedNotice(n)}
                className="group bg-white rounded-[40px] overflow-hidden border border-slate-100 hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer"
              >
                <div className="aspect-video overflow-hidden bg-slate-200">
                  <img src={n.images[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={n.title} />
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <span className="bg-orange-50 px-4 py-1.5 rounded-full text-[10px] font-black text-orange-600 uppercase tracking-widest">Update</span>
                    <Calendar size={18} className="text-slate-300" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug tracking-tight">{n.title}</h4>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium">{n.description}</p>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Date: {n.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Support Section */}
      <section id="후원하기" className="py-32 px-6 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-20 italic tracking-tighter text-slate-900 leading-tight">"아이들의 미래를 위한<br />가장 따뜻한 투자"</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-slate-900 text-white p-12 rounded-[64px] shadow-2xl relative overflow-hidden group">
              <span className="text-[10px] font-black text-orange-400 mb-6 block uppercase tracking-[0.4em]">하나은행 (사단법인 S&J)</span>
              <p className="text-2xl font-black mb-10 tracking-tight leading-none">123-456789-01234</p>
              <button onClick={() => copyAcc('123-456789-01234')} className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-black text-sm hover:bg-orange-600 hover:text-white transition">계좌번호 복사</button>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-12 rounded-[64px] group">
              <span className="text-[10px] font-black text-slate-400 mb-6 block uppercase tracking-[0.4em]">대구은행 (사단법인 S&J)</span>
              <p className="text-2xl font-black mb-10 tracking-tight text-slate-800">10-20-304050-6</p>
              <button onClick={() => copyAcc('10-20-304050-6')} className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-orange-700 transition shadow-xl">계좌번호 복사</button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer id="참여·문의" className="py-24 border-t border-slate-100 bg-white text-center px-6 text-slate-400 text-sm">
        <p className="mb-4">대구광역시 북구 대학로 80 경북대학교 테크노파크 201호</p>
        <p>© 2026 S&J HOPE SHARING. ALL RIGHTS RESERVED.</p>
      </footer>

      {/* 7. 상세 팝업 (모달) */}
      {selectedNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 relative max-h-[90vh] flex flex-col">
            <button onClick={() => setSelectedNotice(null)} className="absolute top-6 right-6 z-10 p-2 bg-white/80 rounded-full text-slate-400 hover:text-orange-600 transition-colors"><X size={24} /></button>
            <div className="overflow-y-auto flex-grow p-10">
              <div className="grid grid-cols-1 gap-4 mb-10">
                {selectedNotice.images.map((img: string, idx: number) => (
                  <img key={idx} src={img} className="w-full rounded-3xl object-cover shadow-lg" alt={`소식 이미지 ${idx+1}`} />
                ))}
              </div>
              <div className="flex items-center gap-2 text-orange-600 font-bold text-xs mb-4 uppercase tracking-widest"><Info size={14} /> 상세 안내</div>
              <h2 className="text-3xl font-black text-slate-900 mb-6 leading-tight">{selectedNotice.title}</h2>
              <div className="flex items-center text-slate-400 text-sm font-bold gap-2 mb-8 pb-8 border-b border-slate-100"><Calendar size={16} /> {selectedNotice.date}</div>
              <div className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap text-lg">{selectedNotice.description}</div>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end"><button onClick={() => setSelectedNotice(null)} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600 transition">닫기</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
