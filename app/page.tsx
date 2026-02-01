'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Laptop, HandHeart, FileText, ChevronRight, Copy, ShieldCheck, 
  Calendar, Download, Menu, X, Info, ChevronLeft, Users, 
  MapPin, Target, BookOpen, Image as ImageIcon, MessageSquare,
  Bell, Megaphone
} from 'lucide-react';

export default function App() {
  const [activities, setActivities] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [chairmanImage, setChairmanImage] = useState<string>('https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800');
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const noticesRes = await fetch('/api/notices');
        const noticesData = await noticesRes.json();
        if (Array.isArray(noticesData)) {
          setNotices(noticesData);
        }

        const activitiesRes = await fetch('/api/activities');
        const activitiesData = await activitiesRes.json();
        if (Array.isArray(activitiesData)) {
          const formatted = activitiesData.map((item: any) => ({
            id: item.id,
            title: item.title || '제목 없음',
            date: item.date || '2026-01-23',
            description: item.content || '',
            images: item.photos || [],
            program: item.program || '',
            location: item.location || '',
            participantCount: item.participantCount || 0,
            tags: item.tags || []
          }));
          setActivities(formatted);
        }

        try {
          const aboutRes = await fetch('/api/about');
          const aboutData = await aboutRes.json();
          if (aboutData.chairmanImage) {
            const notionImage = aboutData.chairmanImage;
            if (notionImage.includes('amazonaws.com') || notionImage.includes('s3.')) {
              setChairmanImage(`/api/proxy?url=${encodeURIComponent(notionImage)}`);
            } else {
              setChairmanImage(notionImage);
            }
          }
        } catch (error) {
          console.log('⚠️ 이사장 이미지를 불러올 수 없습니다. 기본 이미지를 사용합니다.');
        }
      } catch (error) {
        console.error('Data fetch error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedActivity) setCurrentImageIndex(0);
  }, [selectedActivity]);

  const copyAcc = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const nextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedActivity) return;
    setCurrentImageIndex((prev) => (prev === selectedActivity.images.length - 1 ? 0 : prev + 1));
  }, [selectedActivity]);

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedActivity) return;
    setCurrentImageIndex((prev) => (prev === 0 ? selectedActivity.images.length - 1 : prev - 1));
  }, [selectedActivity]);

  const getActivityProxyUrl = (url: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b';
    if (url.includes('amazonaws.com')) return `/api/proxy?url=${encodeURIComponent(url)}`;
    return url;
  };

  const navigation = [
    { name: '기관소개', sub: ['인사말', '미션과 비전', '연혁', '조직도', '오시는 길'] },
    { name: '사업소개', sub: ['IT 교육', '외국어 교육', '교육비 지원', '문화체험'] },
    { 
      name: '소식', 
      sub: [
        { label: '공지사항', link: '/notices' },
        { label: '활동소식', link: '/activities' },
        { label: '프로그램', link: '/programs' },
        { label: '언론보도', link: '#언론보도' }
      ]
    },
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

      {/* ✅ NAVIGATION - CI 컬러 적용 */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-xl z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
          {/* ✅ 로고 이미지로 교체 */}
          <Link href="/" className="flex items-center space-x-3 cursor-pointer">
            <img 
              src="https://www.genspark.ai/api/files/s/SmiX95Zu" 
              alt="S&J 희망나눔" 
              className="h-14 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            {/* Fallback */}
            <div className="hidden items-center space-x-3">
              <div className="w-12 h-12 bg-[#F79332] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">S&J</div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-[#6C6E70]">S&J 희망나눔</span>
                <span className="text-[10px] text-[#F79332] font-bold uppercase tracking-widest">Global Youth Education</span>
              </div>
            </div>
          </Link>
          
          <div className="hidden lg:flex space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative group py-8">
                <button className="text-sm font-bold text-[#6C6E70] group-hover:text-[#F79332] transition-colors flex items-center gap-1">
                  {item.name} <ChevronRight size={14} className="rotate-90 group-hover:rotate-[270deg] transition-transform" />
                </button>
                <div className="absolute top-full left-0 w-48 bg-white border border-slate-100 shadow-xl rounded-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top scale-95 group-hover:scale-100">
                  {item.sub.map((s) => {
                    if (typeof s === 'object' && s.link) {
                      return (
                        <Link 
                          key={s.label} 
                          href={s.link} 
                          className="block py-2 text-xs font-medium text-[#A6A9AB] hover:text-[#F79332] hover:translate-x-1 transition-all"
                        >
                          {s.label}
                        </Link>
                      );
                    }
                    return (
                      <a 
                        key={s} 
                        href={`#${s}`} 
                        className="block py-2 text-xs font-medium text-[#A6A9AB] hover:text-[#F79332] hover:translate-x-1 transition-all"
                      >
                        {s}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <a href="#후원하기" className="bg-[#F79332] text-white px-8 py-3 rounded-full text-xs font-black hover:bg-[#E58422] transition shadow-lg">정기후원 신청</a>
        </div>
      </nav>

      {/* ✅ HERO - CI 컬러 적용 */}
      <section className="pt-56 pb-32 px-6 bg-gradient-to-b from-orange-50/30 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-[#F79332] rounded-full text-[12px] font-black mb-10 shadow-sm border border-orange-100">
            <span className="w-2 h-2 bg-[#F79332] rounded-full animate-pulse"></span>
            <span>2026 S&J 희망나눔: 청소년과 함께하는 디지털 동행</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black leading-[1.05] mb-12 tracking-tighter text-[#6C6E70]">
            더 넓은 세상,<br /><span className="text-[#F79332]">더 밝은 미래</span>를 향해
          </h1>
          <p className="text-[#A6A9AB] text-xl mb-16 leading-relaxed max-w-2xl mx-auto font-medium">
            우리는 환경이 꿈의 한계가 되지 않도록, IT 교육과 글로벌 지원을 통해 청소년들의 가능성을 현실로 바꿉니다.
          </p>
          <div className="flex justify-center gap-6">
            <a href="#후원하기" className="bg-[#6C6E70] text-white px-12 py-6 rounded-3xl font-black hover:bg-[#F79332] transition shadow-2xl">동참하기</a>
            <a href="#인사말" className="bg-white text-[#6C6E70] border-2 border-[#A6A9AB] px-12 py-6 rounded-3xl font-black hover:bg-slate-50 transition">기관 소개</a>
          </div>
        </div>
      </section>

      {/* ✅ CHAIRMAN MESSAGE - 뱃지 위치 중간으로 이동 + CI 컬러 */}
      <section id="인사말" className="py-16 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[auto_1fr] gap-16 items-center">
          {/* ✅ 이미지 + 뱃지 영역 */}
          <div className="relative flex flex-col items-center lg:items-start">
            {/* 이미지 */}
            <div className="w-[280px] aspect-[3/4] bg-gradient-to-br from-slate-200 to-slate-300 rounded-[40px] overflow-hidden shadow-2xl">
              <img 
                src={chairmanImage}
                alt="S&J 희망나눔 이사장" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('이사장 이미지 로드 실패');
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800';
                }}
              />
            </div>
            
            {/* ✅ 뱃지를 이미지 옆으로 이동 (중간 위치) */}
            <div className="mt-8 lg:mt-0 lg:ml-8 lg:self-center bg-[#F79332] text-white p-8 rounded-[32px] shadow-2xl">
              <p className="text-xs font-bold opacity-90 mb-2 text-center">Since 2016</p>
              <p className="text-lg font-black leading-tight text-center whitespace-nowrap">
                10년의 약속,<br />변함없는 동행
              </p>
            </div>
          </div>
          
          {/* ✅ 텍스트 영역 - CI 컬러 */}
          <div>
            <h2 className="text-[#F79332] font-black text-[10px] tracking-widest uppercase mb-3">Chairman's Message</h2>
            <h3 className="text-3xl md:text-4xl font-black text-[#6C6E70] mb-6 leading-tight">
              환경이 꿈의 한계가 되지 않도록,<br />S&J가 청소년의 곁을 지킵니다.
            </h3>
            <div className="text-[#6C6E70] text-sm md:text-base leading-relaxed font-medium space-y-5">
              <p>꿈을 마음껏 펼쳐야 할 청소년기에 가정환경의 어려움으로 스스로의 가능성을 닫는 아이들을 볼 때 가장 마음이 아픕니다. S&J희망나눔은 그런 아이들의 손을 잡고 밝은 미래로 나아가기 위해 설립되었습니다.</p>
              <p>지난 10년 동안 우리는 '청소년 글로벌 드림' 프로젝트를 통해 수많은 아이의 성장을 지켜보았습니다. 이제는 한 걸음 더 나아가, 급변하는 미래 사회에서 아이들이 소외되지 않도록 IT 교육과 인문학적 소양을 결합한 통합적 성장을 지원합니다.</p>
              <p>나눔은 또 다른 희망을 낳습니다. 아이들이 어려운 환경을 극복하고 당당한 사회의 일원으로 성장할 수 있도록 곁을 지키겠습니다.</p>
              <div className="pt-4 border-t border-slate-100 mt-6">
                <p className="text-[#A6A9AB] text-[10px] font-bold mb-2 uppercase tracking-widest">Chairman of S&J Hope Sharing</p>
                <p className="text-lg md:text-xl font-black text-[#6C6E70] underline decoration-[#F79332] decoration-4 underline-offset-8">이사장 윤 동 성</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ NOTICES SECTION - CI 컬러 */}
      <section id="공지사항" className="py-32 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-[#F79332] font-black text-xs tracking-[0.2em] uppercase mb-4 italic flex items-center gap-2">
                <Bell size={16} /> Important Announcements
              </h2>
              <h3 className="text-4xl font-black text-[#6C6E70] tracking-tight">공지사항</h3>
            </div>
            <Link 
              href="/notices"
              className="flex items-center gap-2 text-sm font-bold text-[#A6A9AB] hover:text-[#F79332] transition-colors"
            >
              전체보기 <ChevronRight size={16} />
            </Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-slate-100 rounded-3xl animate-pulse"></div>
              ))
            ) : (
              notices.slice(0, 3).map((notice) => (
                <div 
                  key={notice.id}
                  className="group bg-white border border-slate-200 rounded-3xl p-8 hover:border-[#F79332] hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        {notice.pinned && (
                          <span className="bg-[#F79332] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                            고정
                          </span>
                        )}
                        <span className="bg-orange-100 text-[#F79332] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                          {notice.category}
                        </span>
                        <span className="text-[#A6A9AB] text-xs font-bold">
                          {notice.date}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-[#6C6E70] mb-3 group-hover:text-[#F79332] transition-colors">
                        {notice.title}
                      </h4>
                      <p className="text-sm text-[#A6A9AB] line-clamp-2 font-medium leading-relaxed">
                        {notice.content}
                      </p>
                    </div>
                    <ChevronRight size={24} className="text-slate-300 group-hover:text-[#F79332] transition-colors flex-shrink-0 mt-2" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ✅ ACTIVITIES SECTION - CI 컬러 */}
      <section id="활동소식" className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-[#F79332] font-black text-xs tracking-[0.2em] uppercase mb-4 italic flex items-center gap-2">
                <ImageIcon size={16} /> Recent Updates
              </h2>
              <h3 className="text-4xl font-black text-[#6C6E70] tracking-tight">현장의 생생한 희망 소식</h3>
            </div>
            <Link 
              href="/activities"
              className="flex items-center gap-2 text-sm font-bold text-[#A6A9AB] hover:text-[#F79332] transition-colors"
            >
              전체보기 <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="aspect-[4/5] bg-slate-200 rounded-[48px] animate-pulse"></div>)
            ) : (
              activities.slice(0, 3).map((activity) => (
                <div key={activity.id} onClick={() => setSelectedActivity(activity)} className="group bg-white rounded-[48px] overflow-hidden border border-slate-100 hover:border-[#F79332] transition-all duration-500 shadow-sm hover:shadow-2xl cursor-pointer flex flex-col h-full">
                  <div className="aspect-[1.2/1] overflow-hidden relative">
                    <img 
                      src={getActivityProxyUrl(activity.images[0])} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={activity.title}
                      onError={(e) => {
                        console.error('활동소식 이미지 로드 실패:', activity.images[0]);
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800';
                      }}
                    />
                    {activity.program && (
                      <div className="absolute top-6 left-6 bg-[#F79332] text-white px-4 py-2 rounded-full text-xs font-black">
                        {activity.program}
                      </div>
                    )}
                  </div>
                  <div className="p-10 flex flex-col flex-grow">
                    <p className="text-[#F79332] text-[10px] font-black uppercase tracking-widest mb-4">Activity Report</p>
                    <h4 className="text-xl font-bold mb-6 line-clamp-2 leading-snug tracking-tight text-[#6C6E70] group-hover:text-[#F79332] transition-colors">{activity.title}</h4>
                    <p className="text-[#A6A9AB] text-sm line-clamp-3 mb-10 font-medium leading-relaxed">{activity.description}</p>
                    <div className="mt-auto space-y-3">
                      {activity.location && (
                        <div className="flex items-center text-[#A6A9AB] text-xs font-medium gap-2">
                          <MapPin size={14} />
                          <span className="truncate">{activity.location}</span>
                        </div>
                      )}
                      {activity.participantCount > 0 && (
                        <div className="flex items-center text-[#A6A9AB] text-xs font-medium gap-2">
                          <Users size={14} />
                          <span>{activity.participantCount}명 참여</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-[#A6A9AB] text-[10px] font-bold uppercase tracking-widest pt-6 border-t border-slate-50">
                        <span>Date: {activity.date}</span>
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ✅ DONATE - CI 컬러 */}
      <section id="후원하기" className="py-32 px-6 bg-white">
        <div className="max-w-5xl mx-auto bg-[#6C6E70] rounded-[80px] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F79332]/20 blur-[100px] -mr-32 -mt-32"></div>
          <h2 className="text-4xl md:text-6xl font-black mb-12 tracking-tighter italic relative z-10">"여러분의 나눔이<br />아이들의 미래가 됩니다"</h2>
          <p className="text-[#A6A9AB] text-lg mb-20 max-w-xl mx-auto font-medium relative z-10">사단법인 S&J 희망나눔은 지정기부금 단체로, 여러분의 소중한 후원금은 연말정산 시 세액공제 혜택을 받으실 수 있습니다.</p>
          
          <div className="grid md:grid-cols-2 gap-8 text-left relative z-10">
            <div className="bg-white/5 border border-white/10 p-10 rounded-[48px] hover:bg-white/10 transition-colors">
              <span className="text-[#F79332] text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">하나은행 (사단법인 에스앤제이)</span>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-black tracking-tight">123-456789-01234</p>
                <button onClick={() => copyAcc('123-456789-01234')} className="p-3 bg-white text-[#6C6E70] rounded-2xl hover:bg-[#F79332] hover:text-white transition"><Copy size={20} /></button>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-10 rounded-[48px] hover:bg-white/10 transition-colors">
              <span className="text-[#F79332] text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">대구은행 (사단법인 에스앤제이)</span>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-black tracking-tight">10-20-304050-6</p>
                <button onClick={() => copyAcc('10-20-304050-6')} className="p-3 bg-white text-[#6C6E70] rounded-2xl hover:bg-[#F79332] hover:text-white transition"><Copy size={20} /></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ FOOTER - 로고 추가 + CI 컬러 */}
      <footer className="py-24 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-20">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-10">
              <img 
                src="https://www.genspark.ai/api/files/s/6lA4bGKZ" 
                alt="S&J Hope Sharing" 
                className="h-12 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <span className="hidden text-xl font-black tracking-tighter text-[#6C6E70]">S&J HOPE SHARING</span>
            </div>
            <p className="text-[#A6A9AB] text-sm font-medium leading-relaxed max-w-sm mb-6">
              대구광역시 북구 대학로 80 경북대학교 테크노파크 201호<br />
              대표이사: 윤동성 | 고유번호: 000-00-00000<br />
              Tel: 053-000-0000 | Email: official@sj-hs.or.kr
            </p>
          </div>
          <div>
            <h5 className="text-[#6C6E70] font-black text-[11px] uppercase tracking-widest mb-10">Quick Links</h5>
            <div className="flex flex-col gap-4 text-sm text-[#A6A9AB] font-bold">
              <Link href="/notices" className="hover:text-[#F79332] transition-colors">공지사항</Link>
              <Link href="/activities" className="hover:text-[#F79332] transition-colors">활동소식</Link>
              <Link href="/programs" className="hover:text-[#F79332] transition-colors">프로그램</Link>
              <a href="#" className="hover:text-[#F79332] transition-colors">개인정보처리방침</a>
              <a href="#" className="hover:text-[#F79332] transition-colors">이용약관</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 border-t border-slate-50 mt-20 text-[10px] font-black text-[#A6A9AB] uppercase tracking-[0.3em]">
          © 2026 S&J HOPE SHARING. ALL RIGHTS RESERVED.
        </div>
      </footer>

      {/* ACTIVITY MODAL - CI 컬러 */}
      {selectedActivity && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md transition-all" onClick={() => setSelectedActivity(null)}>
          <div className="bg-white w-full max-w-4xl rounded-[60px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 relative max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedActivity(null)} className="absolute top-8 right-8 z-20 p-3 bg-white/80 rounded-full text-[#A6A9AB] hover:text-[#F79332] transition-colors"><X size={28} /></button>
            <div className="overflow-y-auto flex-grow p-10 md:p-16 custom-scrollbar">
              {selectedActivity.images.length > 0 && (
                <div className="relative aspect-video bg-slate-100 rounded-[40px] overflow-hidden mb-12 group">
                  <img src={getActivityProxyUrl(selectedActivity.images[currentImageIndex])} className="w-full h-full object-cover" alt="활동 이미지" />
                  {selectedActivity.images.length > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/90 rounded-full text-[#6C6E70] hover:text-[#F79332] opacity-0 group-hover:opacity-100 transition-all"><ChevronLeft size={24} /></button>
                      <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/90 rounded-full text-[#6C6E70] hover:text-[#F79332] opacity-0 group-hover:opacity-100 transition-all"><ChevronRight size={24} /></button>
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full text-xs font-bold text-[#6C6E70]">
                        {currentImageIndex + 1} / {selectedActivity.images.length}
                      </div>
                    </>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 text-[#F79332] font-bold text-xs mb-6 uppercase tracking-widest">
                {selectedActivity.program && (
                  <span className="bg-orange-100 px-3 py-1 rounded-full">{selectedActivity.program}</span>
                )}
                <Info size={16} />
              </div>
              <h2 className="text-4xl font-black text-[#6C6E70] mb-8 leading-tight">{selectedActivity.title}</h2>
              
              <div className="grid grid-cols-2 gap-6 mb-12 pb-12 border-b border-slate-100">
                <div className="flex items-center text-[#A6A9AB] text-sm font-bold gap-3">
                  <Calendar size={18} />
                  <span>{selectedActivity.date}</span>
                </div>
                {selectedActivity.location && (
                  <div className="flex items-center text-[#A6A9AB] text-sm font-bold gap-3">
                    <MapPin size={18} />
                    <span>{selectedActivity.location}</span>
                  </div>
                )}
                {selectedActivity.participantCount > 0 && (
                  <div className="flex items-center text-[#A6A9AB] text-sm font-bold gap-3">
                    <Users size={18} />
                    <span>{selectedActivity.participantCount}명 참여</span>
                  </div>
                )}
              </div>
              
              <div className="text-[#6C6E70] leading-relaxed font-medium whitespace-pre-wrap text-xl mb-8">{selectedActivity.description}</div>
              
              {selectedActivity.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-8 border-t border-slate-100">
                  {selectedActivity.tags.map((tag: string) => (
                    <span key={tag} className="bg-slate-100 text-[#6C6E70] px-4 py-2 rounded-full text-xs font-bold">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="p-10 bg-slate-50 flex justify-end">
              <button onClick={() => setSelectedActivity(null)} className="bg-[#6C6E70] text-white px-12 py-4 rounded-3xl font-bold hover:bg-[#F79332] transition shadow-xl">닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
