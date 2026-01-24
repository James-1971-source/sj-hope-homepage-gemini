'use client';

import React, { useState, useEffect } from 'react';
import { 
  Laptop, 
  HandHeart, 
  FileText, 
  ChevronRight, 
  Copy, 
  ShieldCheck,
  Calendar,
  Download,
  Menu,
  X,
  Database
} from 'lucide-react';

/* [이사장님 필독] 
  이 코드는 노션 연동 로직과 최신 디자인이 통합된 마스터 코드입니다.
  Vercel 환경변수(NOTION_API_KEY, NOTION_DATABASE_ID)가 설정되어야 실제 데이터가 연동됩니다.
*/

export default function App() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 환경 변수 안전 체크
  const getEnv = (key: string) => {
    try {
      return typeof process !== 'undefined' ? process.env[key] || process.env[`NEXT_PUBLIC_${key}`] : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    async function fetchNotionData() {
      // 1. 설정 전 샘플 데이터 (디자인 확인용)
      const sampleData = [
        { id: '1', title: '사단법인 S&J 희망나눔 홈페이지 리뉴얼 안내', date: '2026.01.23' },
        { id: '2', title: '2024년 하반기 청소년 인공지능(AI) 교육 성과 보고서', date: '2026.01.21' },
        { id: '3', title: '대구 지역아동센터 AI 미래교실 현장 소식', date: '2026.01.15' }
      ];

      try {
        // [중요] 브라우저에서 직접 노션에 가지 않고, 우리가 만든 API 서버로 요청합니다.
        const response = await fetch('/api/notices'); 
        const data = await response.json();

        if (data.results && Array.isArray(data.results)) {
          const formatted = data.results.map((item: any) => ({
            id: item.id,
            title: item.properties.제목?.title[0]?.plain_text || '내용 없음',
            date: item.properties.날짜?.date?.start || '2026.01.23',
            // [추가] 노션의 '설명' 칸 내용을 가져옵니다.
            description: item.properties.설명?.rich_text[0]?.plain_text || ''
          }));
          setNotices(formatted);
        } else {
          // 데이터가 없거나 에러가 나면 샘플 데이터를 보여줍니다.
          setNotices(sampleData);
        }
      } catch (error) {
        console.error('Data fetch error:', error);
        setNotices(sampleData);
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
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-2xl animate-bounce text-sm">
          ✅ 계좌번호가 복사되었습니다!
        </div>
      )}

      {/* Navigation (GNB) */}
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

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6 bg-slate-50 relative overflow-hidden">
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
              <div className="z-10 text-center">
                <Laptop size={48} className="mx-auto mb-8" />
                <h4 className="text-3xl font-black mb-4 tracking-tight uppercase">Specialized Hub</h4>
                <p className="text-orange-50 text-sm font-medium leading-relaxed">노션 데이터베이스와 연동되어<br />실시간 소식을 홈페이지에 송출합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IT Education Hub */}
      <section id="사업(IT교육)" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl text-left">
              <h2 className="text-orange-600 font-black text-xs tracking-[0.3em] uppercase mb-6 italic">Education Innovation</h2>
              <h3 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">AI 역량은 청소년의<br /><span className="text-orange-600 underline decoration-orange-200 decoration-8 underline-offset-8">새로운 경쟁력</span>입니다.</h3>
            </div>
            <button className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-xs font-bold hover:bg-orange-600 transition shadow-lg flex items-center gap-2">
              IT 연구보고서 아카이브 <Download size={16} />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-12 rounded-[56px] bg-slate-50 border border-transparent hover:border-orange-500 transition-all duration-500 group shadow-sm hover:shadow-xl">
              <Laptop className="text-orange-600 mb-8" size={32} />
              <h4 className="text-2xl font-bold mb-5 tracking-tight">AI 리터러시 클래스</h4>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">생성형 AI의 기초부터 윤리적 활용까지, 미래 사회의 필수 소양을 교육합니다.</p>
            </div>
            <div className="p-12 rounded-[56px] bg-slate-50 border border-transparent hover:border-orange-500 transition-all duration-500 group shadow-sm hover:shadow-xl">
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
        </div>
      </section>

      {/* Notion Real-time Notices */}
      <section id="활동·보고" className="py-32 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-orange-600 font-black text-xs tracking-[0.2em] uppercase mb-4 text-center">Transparency Hub</h2>
          <h3 className="text-4xl font-black text-slate-900 mb-16 text-center">실시간 활동 소식</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notices.map((n) => (
              <div key={n.id} className="p-8 bg-white rounded-[40px] border border-slate-100 hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-xl group">
                <div className="flex items-center justify-between mb-8">
                  <span className="bg-orange-50 px-4 py-1.5 rounded-full text-[10px] font-black text-orange-600 uppercase tracking-widest">Update</span>
                  <Calendar size={18} className="text-slate-300 group-hover:text-orange-400 transition-colors" />
                </div>
                <h4 className="text-xl font-bold mb-5 line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug tracking-tight">
                  {n.title}
                </h4>
                {/* [추가] 설명을 보여주는 코드를 넣습니다. */}
                <p className="text-sm text-slate-500 mb-6 line-clamp-3 font-medium leading-relaxed">
                  {n.description}
                </p>
                
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Date: {n.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support / Donation */}
      <section id="후원하기" className="py-32 px-6 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-20 italic tracking-tighter text-slate-900 leading-tight">"아이들의 미래를 위한<br />가장 따뜻한 투자"</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-slate-900 text-white p-16 rounded-[64px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/20 rounded-full blur-[80px]"></div>
              <span className="text-[10px] font-black text-orange-400 mb-6 block uppercase tracking-[0.4em]">하나은행 (사단법인 S&J)</span>
              <p className="text-2xl md:text-3xl font-black mb-10 tracking-tight leading-none group-hover:scale-105 transition-transform">123-456789-01234</p>
              <button onClick={() => copyAcc('123-456789-01234')} className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black text-sm hover:bg-orange-600 hover:text-white transition shadow-xl">계좌번호 복사</button>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-16 rounded-[64px] group">
              <span className="text-[10px] font-black text-slate-400 mb-6 block uppercase tracking-[0.4em]">대구은행 (사단법인 S&J)</span>
              <p className="text-2xl md:text-3xl font-black mb-10 tracking-tight text-slate-800 group-hover:scale-105 transition-transform">10-20-304050-6</p>
              <button onClick={() => copyAcc('10-20-304050-6')} className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-orange-700 transition shadow-xl shadow-orange-100">계좌번호 복사</button>
            </div>
          </div>
          <p className="text-slate-400 text-sm font-medium">S&J 희망나눔은 정부 지정 공익법인으로, 모든 후원금은 연말정산 시 세액공제 혜택을 받습니다.</p>
        </div>
      </section>

      {/* Footer */}
      <footer id="참여·문의" className="py-24 border-t border-slate-100 bg-white text-center px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xl shadow-inner">S</div>
            <span className="text-2xl font-black tracking-tighter uppercase text-slate-300">S&J Hope Sharing</span>
          </div>
          <p className="text-slate-500 text-base mb-8 font-medium leading-relaxed max-w-lg mx-auto">
            대구광역시 북구 대학로 80 경북대학교 테크노파크 201호<br />
            대표자: 윤동성 | 고유번호: 000-00-00000 | T. 053-000-0000
          </p>
          <div className="flex flex-wrap justify-center gap-12 text-[11px] text-slate-400 font-black uppercase tracking-[0.3em] mb-12">
            <a href="#" className="hover:text-slate-900 transition underline underline-offset-8">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition underline underline-offset-8">Terms</a>
            <span className="flex items-center gap-1 text-slate-900 font-bold tracking-wider"><ShieldCheck size={14} /> HTTPS Secure</span>
          </div>
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.5em]">© 2026 S&J HOPE SHARING. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}
