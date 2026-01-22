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
  ExternalLink
} from 'lucide-react';

/**
 * [S&J 희망나눔 공식 홈페이지 마스터 코드]
 * 기능: 젠스파크 IA 반영 GNB, IT 교육 허브, 노션 공지사항 실시간 연동, 계좌 복사
 * 주의: Vercel 환경변수에 NOTION_API_KEY와 NOTION_DATABASE_ID가 입력되어야 실시간 데이터가 작동합니다.
 */

export default function App() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 환경 변수 안전 체크
  const getEnv = (key) => {
    try {
      return typeof process !== 'undefined' ? process.env[key] || process.env[`NEXT_PUBLIC_${key}`] : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    async function fetchNotionData() {
      const apiKey = getEnv('NOTION_API_KEY');
      const databaseId = getEnv('NOTION_DATABASE_ID');

      // API 키가 없을 경우 보여줄 샘플 데이터 (디자인 확인용)
      if (!apiKey || !databaseId) {
        setNotices([
          { id: '1', title: '사단법인 S&J 희망나눔 홈페이지 리뉴얼을 축하합니다!', date: '2026.01.23' },
          { id: '2', title: '2024 하반기 청소년 인공지능(AI) 교육 성과 보고서 발간', date: '2026.01.21' },
          { id: '3', title: '경북대학교와 함께하는 미래인재 코딩교실 현장 소식', date: '2026.01.15' }
        ]);
        setLoading(false);
        return;
      }

      try {
        // 실제 운영 시에는 /api/notion 등 별도의 API Route를 통해 호출하는 것이 보안상 안전합니다.
        // 여기서는 이사장님의 빠른 구축을 위해 표준 fetch 구조를 제안합니다.
        const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ page_size: 6 }),
        });
        const data = await response.json();
        if (data.results) {
          const formatted = data.results.map((item) => ({
            id: item.id,
            title: item.properties.제목?.title[0]?.plain_text || '내용 없음',
            date: item.properties.날짜?.date?.start || '2026.01.23'
          }));
          setNotices(formatted);
        }
      } catch (error) {
        console.error('노션 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNotionData();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900 text-white px-8 py-4 rounded-full font-bold shadow-2xl animate-bounce border border-white/10">
          ✅ 계좌번호가 복사되었습니다!
        </div>
      )}

      {/* Navigation (GNB) */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-[100] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">SJ</div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none">S&J 희망나눔</span>
              <span className="text-[9px] text-orange-600 font-bold tracking-widest uppercase">Safe & Joy Education</span>
            </div>
          </div>

          <div className="hidden lg:flex space-x-10">
            {['소개', '사업(IT교육)', '후원하기', '활동·보고', '참여·문의'].map((item) => (
              <a key={item} href={`#${item}`} className="text-sm font-bold text-slate-500 hover:text-orange-600 transition-all relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button className="bg-orange-600 text-white px-7 py-2.5 rounded-full text-xs font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-100">
              정기후원
            </button>
            <button className="lg:hidden text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="소개" className="pt-48 pb-32 px-6 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-[11px] font-bold mb-8 border border-orange-200">
              <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse"></span>
              <span>2026 청소년 미래 인재 양성 캠페인</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-10 tracking-tight text-slate-900">
              아이들의 꿈이<br /><span className="text-orange-600 italic underline decoration-orange-200 decoration-8 underline-offset-4">AI 기술</span>로<br />날개를 달도록
            </h1>
            <p className="text-slate-500 text-lg md:text-xl mb-12 leading-relaxed max-w-lg font-medium">
              사단법인 S&J 희망나눔은 대구 지역 청소년들에게 인공지능(AI) 미래교실과 교육 복지를 통해 공평한 배움의 기회를 제공합니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#후원하기" className="bg-orange-600 text-white px-10 py-5 rounded-2xl font-bold hover:shadow-2xl transition shadow-xl shadow-orange-100">
                나눔 동참하기
              </a>
              <a href="#활동·보고" className="bg-white text-slate-600 border border-slate-200 px-10 py-5 rounded-2xl font-bold hover:bg-slate-50 transition shadow-sm">
                활동 성과 보고
              </a>
            </div>
          </div>
          <div className="relative group hidden lg:block">
            <div className="bg-gradient-to-br from-orange-500 to-orange-400 rounded-[60px] aspect-square flex flex-col items-center justify-center text-white p-12 shadow-2xl relative overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
              <div className="z-10 text-center">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/30">
                  <Laptop size={48} />
                </div>
                <h4 className="text-3xl font-black mb-4 tracking-tight uppercase">Specialized Hub</h4>
                <p className="text-orange-50 text-sm font-medium leading-relaxed">이사장님의 전문 AI 교실 소식을<br />노션 DB를 통해 실시간으로 전해드립니다.</p>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* IT Education Hub (이사장님 전문성 강조) */}
      <section id="사업(IT교육)" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl text-left">
              <h2 className="text-orange-600 font-black text-xs tracking-[0.3em] uppercase mb-6 italic">Education Innovation</h2>
              <h3 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">AI 역량은 청소년의<br />새로운 <span className="text-orange-600">권리</span>이자 <span className="text-orange-600">경쟁력</span>입니다.</h3>
            </div>
            <button className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-xs font-bold hover:bg-orange-600 transition shadow-lg flex items-center gap-2">
              IT 연구보고서 아카이브 <Download size={16} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-12 rounded-[56px] bg-slate-50 border border-transparent hover:border-orange-500 transition-all duration-500 group cursor-pointer shadow-sm hover:shadow-xl">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-600 mb-10 shadow-sm group-hover:bg-orange-600 group-hover:text-white transition">
                <Laptop size={32} />
              </div>
              <h4 className="text-2xl font-bold mb-5 tracking-tight">AI 리터러시 클래스</h4>
              <p className="text-sm text-slate-500 leading-relaxed mb-10 font-medium">생성형 AI의 기초 원리부터 창의적 활용까지, 미래 사회의 시민으로서 갖춰야 할 디지털 소양을 교육합니다.</p>
              <span className="text-orange-600 font-black text-xs uppercase tracking-wider">Curriculum Info →</span>
            </div>

            <div className="p-12 rounded-[56px] bg-slate-50 border border-transparent hover:border-orange-500 transition-all duration-500 group cursor-pointer shadow-sm hover:shadow-xl">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-600 mb-10 shadow-sm group-hover:bg-orange-600 group-hover:text-white transition">
                <FileText size={32} />
              </div>
              <h4 className="text-2xl font-bold mb-5 tracking-tight">미래인재 코딩교실</h4>
              <p className="text-sm text-slate-500 leading-relaxed mb-10 font-medium">파이썬과 블록코딩을 통해 문제 해결 능력을 키우고 자신만의 디지털 결과물을 창작하는 실습 중심 교육입니다.</p>
              <span className="text-orange-600 font-black text-xs uppercase tracking-wider">Application Info →</span>
            </div>

            <div className="p-12 rounded-[56px] bg-orange-600 text-white shadow-2xl shadow-orange-900/20 group">
              <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-10">
                <ShieldCheck size={32} />
              </div>
              <h4 className="text-2xl font-bold mb-5 tracking-tight">IT 교육 임팩트 연구</h4>
              <p className="text-sm text-orange-50 leading-relaxed mb-10 font-medium opacity-90">이사장님의 전문 데이터를 바탕으로 매년 발간되는 청소년 IT 교육 연구 보고서를 투명하게 공개합니다.</p>
              <span className="text-white font-black text-xs underline underline-offset-8">2024 Research Report Released</span>
            </div>
          </div>
        </div>
      </section>

      {/* Notion Feed Section (활동 소식) */}
      <section id="활동·보고" className="py-32 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16 gap-6">
            <div className="text-left">
              <h2 className="text-orange-600 font-black text-xs tracking-[0.2em] uppercase mb-4">Latest Activities</h2>
              <h3 className="text-4xl font-black text-slate-900 leading-tight">실시간 활동 소식</h3>
            </div>
            <p className="text-slate-400 text-xs font-bold italic border-b border-slate-200 pb-1">Real-time synced with Notion DB</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-200 rounded-[40px] animate-pulse"></div>)
            ) : notices.map((notice) => (
              <div key={notice.id} className="p-8 bg-white rounded-[40px] border border-slate-100 hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-xl group cursor-pointer">
                <div className="flex items-center justify-between mb-8">
                  <span className="bg-orange-50 px-4 py-1.5 rounded-full text-[10px] font-black text-orange-600 uppercase tracking-widest">Update</span>
                  <Calendar size={18} className="text-slate-300 group-hover:text-orange-400 transition-colors" />
                </div>
                <h4 className="text-xl font-bold mb-6 group-hover:text-orange-600 transition-colors leading-snug tracking-tight">
                  {notice.title}
                </h4>
                <div className="flex items-center text-slate-400 text-xs font-bold">
                   <span className="mr-2">활동일:</span>
                   <span>{notice.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section id="후원하기" className="py-32 px-6 bg-white text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-20 italic tracking-tighter text-slate-900 leading-tight">"청소년의 내일을 위한<br />가장 가치 있는 동행"</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-slate-900 text-white p-16 rounded-[64px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/20 rounded-full blur-[80px]"></div>
              <span className="text-[10px] font-black text-orange-400 mb-6 block uppercase tracking-[0.4em]">하나은행 (사단법인 S&J)</span>
              <p className="text-3xl font-black mb-10 tracking-tight leading-none group-hover:scale-105 transition-transform">123-456789-01234</p>
              <button onClick={() => copyToClipboard('123-456789-01234')} className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black text-sm hover:bg-orange-600 hover:text-white transition shadow-xl">계좌번호 복사</button>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-16 rounded-[64px] group shadow-sm">
              <span className="text-[10px] font-black text-slate-400 mb-6 block uppercase tracking-[0.4em]">대구은행 (사단법인 S&J)</span>
              <p className="text-3xl font-black mb-10 tracking-tight text-slate-800 group-hover:scale-105 transition-transform">10-20-304050-6</p>
              <button onClick={() => copyToClipboard('10-20-304050-6')} className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-orange-700 transition shadow-xl shadow-orange-100">계좌번호 복사</button>
            </div>
          </div>
          <p className="text-slate-400 text-sm font-medium">S&J 희망나눔은 정부 지정 공익법인으로, 모든 후원금은 연말정산 시 세액공제 혜택을 받습니다.</p>
        </div>
      </section>

      {/* Footer */}
      <footer id="참여·문의" className="py-32 border-t border-slate-100 bg-white text-center px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center space-x-3 mb-12">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xl shadow-inner">S</div>
            <span className="text-2xl font-black tracking-tighter uppercase text-slate-300">S&J Hope Sharing</span>
          </div>
          <p className="text-slate-500 text-base mb-8 font-medium leading-relaxed max-w-lg mx-auto">
            대구광역시 북구 대학로 80 경북대학교 테크노파크 201호<br />
            대표자: 윤동성 | 고유번호: 000-00-00000 | T. 053-000-0000
          </p>
          <div className="flex justify-center space-x-12 text-[11px] text-slate-400 font-black uppercase tracking-[0.3em] mb-12">
            <a href="#" className="hover:text-slate-900 transition underline underline-offset-8">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition underline underline-offset-8">Terms of Use</a>
            <span className="flex items-center gap-1 font-bold text-slate-900 tracking-wider"><ShieldCheck size={14} /> HTTPS Secure</span>
          </div>
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.5em]">© 2026 S&J HOPE SHARING. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}
