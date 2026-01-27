'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Laptop, HandHeart, FileText, ChevronRight, Copy, ShieldCheck, 
  Calendar, Download, Menu, X, Info, ChevronLeft, Users, 
  MapPin, Target, BookOpen, Image as ImageIcon, MessageSquare
} from 'lucide-react';

export default function App() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 노션 데이터 페칭 로직 (기존 성공 로직 유지)
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
            description: item.properties.설명?.rich_text.map((t: any) => t.plain_text).join('') || '',
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

  useEffect(() => {
    if (selectedNotice) setCurrentImageIndex(0);
  }, [selectedNotice]);

  const copyAcc = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const nextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedNotice) return;
    setCurrentImageIndex((prev) => (prev === selectedNotice.images.length - 1 ? 0 : prev + 1));
  }, [selectedNotice]);

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedNotice) return;
    setCurrentImageIndex((prev) => (prev === 0 ? selectedNotice.images.length - 1 : prev - 1));
  }, [selectedNotice]);

  const getProxyUrl = (url: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b';
    if (url.includes('amazonaws.com')) return `/api/proxy?url=${encodeURIComponent(url)}`;
    return url;
  };

  // Lovable 기반 메뉴 구조 정의 
  const navigation = [
    { name: '기관소개', sub: ['인사말', '미션과 비전', '연혁', '조직도', '오시는 길'] },
    { name: '사업소개', sub: ['IT 교육', '외국어 교육', '교육비 지원', '문화체험'] },
    { name: '소식', sub: ['공지사항', '활동소식', '언론보도'] },
    { name: '참여', sub: ['후원하기', '자원봉사 신청'] },
    { name: '자료실', sub: ['성과보고서', '재무공시', '서식다운로드'] },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-100">
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-2xl text-sm">
          ✅ 계좌번호가 복사되었습니다!
        </div>
      )}

      {/* 1. NAVIGATION: Lovable 스타일 드롭다운 구조 [cite: 268, 648] */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-xl z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
          <div className="flex items-center space-x-4 cursor-pointer">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-200">S&J</div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter">S&J 희망나눔</span>
              <span className="text-[10px] text-orange-600 font-bold uppercase tracking-widest">Global Youth Education</span>
            </div>
          </div>
          
          <div className="hidden lg:flex space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative group py-8">
                <button className="text-sm font-bold text-slate-600 group-hover:text-orange-600 transition-colors flex items-center gap-1">
                  {item.name} <ChevronRight size={14} className="rotate-90 group-hover:rotate-[270deg] transition-transform" />
                </button>
                <div className="absolute top-full left-0 w-48 bg-white border border-slate-100 shadow-xl rounded-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top scale-95 group-hover:scale-100">
                  {item.sub.map((s) => (
                    <a key={s} href={`#${s}`} className="block py-2 text-xs font-medium text-slate-500 hover:text-orange-600 hover:translate-x-1 transition-all">{s}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <a href="#후원하기" className="bg-orange-600 text-white px-8 py-3 rounded-full text-xs font-black hover:bg-orange-700 transition shadow-lg shadow-orange-100">정기후원 신청</a>
        </div>
      </nav>

      {/* 2. HERO: Lovable 디자인 반영 */}
      <section className="pt-56 pb-32 px-6 bg-gradient-to-b from-orange-50/50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-orange-600 rounded-full text-[12px] font-black mb-10 shadow-sm border border-orange-100">
            <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
            <span>2026 S&J 희망나눔: 청소년과 함께하는 디지털 동행</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black leading-[1.05] mb-12 tracking-tighter">
            더 넓은 세상,<br /><span className="text-orange-600">더 밝은 미래</span>를 향해
          </h1>
          <p className="text-slate-500 text-xl mb-16 leading-relaxed max-w-2xl mx-auto font-medium">
            우리는 환경이 꿈의 한계가 되지 않도록, IT 교육과 글로벌 지원을 통해 청소년들의 가능성을 현실로 바꿉니다. [cite: 5]
          </p>
          <div className="flex justify-center gap-6">
            <a href="#후원하기" className="bg-slate-900 text-white px-12 py-6 rounded-3xl font-black hover:bg-orange-600 transition shadow-2xl">동참하기</a>
            <a href="#인사말" className="bg-white text-slate-600 border border-slate-200 px-12 py-6 rounded-3xl font-black hover:bg-slate-50 transition">기관 소개</a>
          </div>
        </div>
      </section>

      {/* 3. CHAIRMAN MESSAGE: 이사장님 선택 Option 2 적용 */}
      <section id="인사말" className="py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <div className="aspect-[4/5] bg-slate-200 rounded-[60px] overflow-hidden shadow-2xl">
              <img src="/chairman_profile.jpg" alt="S&J 희망나눔 이사장" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-orange-600 text-white p-12 rounded-[48px] shadow-2xl hidden md:block">
              <p className="text-sm font-bold opacity-80 mb-2">Since 2016 [cite: 4]</p>
              <p className="text-2xl font-black">10년의 약속,<br />변함없는 동행</p>
            </div>
          </div>
          <div>
            <h2 className="text-orange-600 font-black text-sm tracking-widest uppercase mb-6">Chairman's Message</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 leading-tight">
              환경이 꿈의 한계가 되지 않도록,<br />S&J가 청소년의 곁을 지킵니다.
            </h3>
            <div className="text-slate-600 text-lg leading-relaxed font-medium space-y-8">
              <p>꿈을 마음껏 펼쳐야 할 청소년기에 가정환경의 어려움으로 스스로의 가능성을 닫는 아이들을 볼 때 가장 마음이 아픕니다. S&J희망나눔은 그런 아이들의 손을 잡고 밝은 미래로 나아가기 위해 설립되었습니다. [cite: 4, 5]</p>
              <p>지난 10년 동안 우리는 '청소년 글로벌 드림' 프로젝트를 통해 수많은 아이의 성장을 지켜보았습니다. 이제는 한 걸음 더 나아가, 급변하는 미래 사회에서 아이들이 소외되지 않도록 IT 교육과 인문학적 소양을 결합한 통합적 성장을 지원합니다.</p>
              <p>나눔은 또 다른 희망을 낳습니다. 아이들이 어려운 환경을 극복하고 당당한 사회의 일원으로 성장할 수 있도록 곁을 지키겠습니다.</p>
              <div className="pt-6 border-t border-slate-100 mt-10">
                <p className="text-slate-400 text-sm font-bold mb-2 uppercase tracking-widest">Chairman of S&J Hope Sharing</p>
                <p className="text-2xl font-black text-slate-900 underline decoration-orange-300 decoration-4 underline-offset-8">이사장 윤 동 성</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NOTION FEED: 활동 소식 (실시간 연동) */}
      <section id="활동소식" className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-orange-600 font-black text-xs tracking-[0.2em] uppercase mb-4 italic">Recent Updates</h2>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">현장의 생생한 희망 소식</h3>
            </div>
            <div className="flex gap-2">
               <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-orange-600 transition-colors cursor-pointer"><ChevronLeft /></div>
               <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-orange-600 transition-colors cursor-pointer"><ChevronRight /></div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="aspect-[4/5] bg-slate-200 rounded-[48px] animate-pulse"></div>)
            ) : (
              notices.slice(0, 3).map((n) => (
                <div key={n.id} onClick={() => setSelectedNotice(n)} className="group bg-white rounded-[48px] overflow-hidden border border-slate-100 hover:border-orange-500 transition-all duration-500 shadow-sm hover:shadow-2xl cursor-pointer flex flex-col h-full">
                  <div className="aspect-[1.2/1] overflow-hidden relative">
                    <img src={getProxyUrl(n.images[0])} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={n.title} />
                  </div>
                  <div className="p-10 flex flex-col flex-grow">
                    <p className="text-orange-600 text-[10px] font-black uppercase tracking-widest mb-4">News & Activity</p>
                    <h4 className="text-xl font-bold mb-6 line-clamp-2 leading-snug tracking-tight group-hover:text-orange-600 transition-colors">{n.title}</h4>
                    <p className="text-slate-500 text-sm line-clamp-3 mb-10 font-medium leading-relaxed">{n.description}</p>
                    <div className="mt-auto flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-widest pt-6 border-t border-slate-50">
                      <span>Date: {n.date}</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. DONATE: 후원 안내 */}
      <section id="후원하기" className="py-32 px-6 bg-white">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[80px] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 blur-[100px] -mr-32 -mt-32"></div>
          <h2 className="text-4xl md:text-6xl font-black mb-12 tracking-tighter italic">"여러분의 나눔이<br />아이들의 미래가 됩니다"</h2>
          <p className="text-slate-400 text-lg mb-20 max-w-xl mx-auto font-medium">사단법인 S&J 희망나눔은 지정기부금 단체로, 여러분의 소중한 후원금은 연말정산 시 세액공제 혜택을 받으실 수 있습니다. [cite: 4]</p>
          
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-white/5 border border-white/10 p-10 rounded-[48px] hover:bg-white/10 transition-colors">
              <span className="text-orange-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">하나은행 (사단법인 에스앤제이)</span>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-black tracking-tight">123-456789-01234</p>
                <button onClick={() => copyAcc('123-456789-01234')} className="p-3 bg-white text-slate-900 rounded-2xl hover:bg-orange-600 hover:text-white transition"><Copy size={20} /></button>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-10 rounded-[48px] hover:bg-white/10 transition-colors">
              <span className="text-orange-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">대구은행 (사단법인 에스앤제이)</span>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-black tracking-tight">10-20-304050-6</p>
                <button onClick={() => copyAcc('10-20-304050-6')} className="p-3 bg-white text-slate-900 rounded-2xl hover:bg-orange-600 hover:text-white transition"><Copy size={20} /></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER [cite: 299, 968] */}
      <footer className="py-24 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-20">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-10">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl">S</div>
              <span className="text-xl font-black tracking-tighter">S&J HOPE SHARING</span>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm mb-6">
              대구광역시 북구 대학로 80 경북대학교 테크노파크 201호 [cite: 968]<br />
              대표이사: 윤동성 | 고유번호: 000-00-00000<br />
              Tel: 053-000-0000 | Email: official@sj-hs.or.kr
            </p>
          </div>
          <div>
            <h5 className="text-slate-900 font-black text-[11px] uppercase tracking-widest mb-10">Quick Links</h5>
            <div className="flex flex-col gap-4 text-sm text-slate-400 font-bold">
              <a href="#" className="hover:text-orange-600 transition-colors">개인정보처리방침</a>
              <a href="#" className="hover:text-orange-600 transition-colors">이용약관</a>
              <a href="#" className="hover:text-orange-600 transition-colors">국세청 공시 자료실</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 border-t border-slate-50 mt-20 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          © 2026 S&J HOPE SHARING. ALL RIGHTS RESERVED. [cite: 968]
        </div>
      </footer>

      {/* 팝업 모달 (슬라이더 포함) - 기존 로직 유지 */}
      {selectedNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md transition-all" onClick={() => setSelectedNotice(null)}>
          <div className="bg-white w-full max-w-4xl rounded-[60px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 relative max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedNotice(null)} className="absolute top-8 right-8 z-20 p-3 bg-white/80 rounded-full text-slate-400 hover:text-orange-600 transition-colors"><X size={28} /></button>
            <div className="overflow-y-auto flex-grow p-10 md:p-16 custom-scrollbar">
              {selectedNotice.images.length > 0 && (
                <div className="relative aspect-video bg-slate-100 rounded-[40px] overflow-hidden mb-12 group">
                  <img src={getProxyUrl(selectedNotice.images[currentImageIndex])} className="w-full h-full object-cover" alt="공지 이미지" />
                  {selectedNotice.images.length > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/90 rounded-full text-slate-700 hover:text-orange-600 opacity-0 group-hover:opacity-100 transition-all"><ChevronLeft size={24} /></button>
                      <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/90 rounded-full text-slate-700 hover:text-orange-600 opacity-0 group-hover:opacity-100 transition-all"><ChevronRight size={24} /></button>
                    </>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 text-orange-600 font-bold text-xs mb-6 uppercase tracking-widest"><Info size={16} /> News Detail</div>
              <h2 className="text-4xl font-black text-slate-900 mb-8 leading-tight">{selectedNotice.title}</h2>
              <div className="flex items-center text-slate-400 text-sm font-bold gap-4 mb-12 pb-12 border-b border-slate-100"><Calendar size={18} /> {selectedNotice.date}</div>
              <div className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap text-xl">{selectedNotice.description}</div>
            </div>
            <div className="p-10 bg-slate-50 flex justify-end">
              <button onClick={() => setSelectedNotice(null)} className="bg-slate-900 text-white px-12 py-4 rounded-3xl font-bold hover:bg-orange-600 transition shadow-xl">닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
