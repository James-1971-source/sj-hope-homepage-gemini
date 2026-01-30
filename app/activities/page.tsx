'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, ChevronLeft, ImageIcon, Calendar, MapPin, 
  Users, Search, X, Home, Info
} from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  date: string;
  program: string;
  content: string;
  participantCount: number;
  participants: string;
  location: string;
  photos: string[];
  tags: string[];
  url: string;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/activities')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setActivities(data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedActivity) setCurrentImageIndex(0);
  }, [selectedActivity]);

  const nextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedActivity) return;
    setCurrentImageIndex((prev) => 
      prev === selectedActivity.photos.length - 1 ? 0 : prev + 1
    );
  }, [selectedActivity]);

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedActivity) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedActivity.photos.length - 1 : prev - 1
    );
  }, [selectedActivity]);

  const getProxyUrl = (url: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b';
    if (url.includes('amazonaws.com')) return `/api/proxy?url=${encodeURIComponent(url)}`;
    return url;
  };

  // 필터링
  const filteredActivities = activities.filter(activity => {
    const matchProgram = filter === 'all' || activity.program === filter;
    const matchSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       activity.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchProgram && matchSearch;
  });

  // 프로그램 목록
  const programs = ['all', ...Array.from(new Set(activities.map(a => a.program).filter(Boolean)))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:shadow-orange-200 transition">
                S&J
              </div>
              <span className="text-lg font-black tracking-tighter">S&J 희망나눔</span>
            </Link>
            
            <Link 
              href="/"
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-600 transition-colors"
            >
              <Home size={18} />
              <span>홈으로</span>
            </Link>
          </div>
        </div>
      </header>

      {/* PAGE HEADER */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 text-orange-600 font-black text-xs uppercase tracking-widest mb-6">
            <ImageIcon size={18} />
            <span>Activity Reports</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
            활동소식
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl">
            S&J 희망나눔의 생생한 현장 이야기를 만나보세요.
          </p>
        </div>
      </section>

      {/* FILTERS & SEARCH */}
      <section className="py-8 px-6 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* 프로그램 필터 */}
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              {programs.map(prog => (
                <button
                  key={prog}
                  onClick={() => setFilter(prog)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                    filter === prog
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {prog === 'all' ? '전체' : prog}
                </button>
              ))}
            </div>

            {/* 검색 */}
            <div className="relative w-full md:w-80">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="활동소식 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-100 border-2 border-transparent focus:border-orange-600 focus:bg-white rounded-2xl text-sm font-medium outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* 결과 카운트 */}
          <div className="mt-6 text-sm font-bold text-slate-500">
            총 <span className="text-orange-600">{filteredActivities.length}</span>개의 활동소식
          </div>
        </div>
      </section>

      {/* ACTIVITIES GRID */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredActivities.map(activity => (
              <div
                key={activity.id}
                onClick={() => setSelectedActivity(activity)}
                className="group bg-white rounded-[48px] overflow-hidden border border-slate-200 hover:border-orange-500 hover:shadow-2xl transition-all cursor-pointer flex flex-col"
              >
                {/* 이미지 */}
                <div className="aspect-[1.2/1] overflow-hidden relative">
                  <img 
                    src={getProxyUrl(activity.photos[0])} 
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {activity.program && (
                    <div className="absolute top-6 left-6 bg-orange-600 text-white px-4 py-2 rounded-full text-xs font-black shadow-lg">
                      {activity.program}
                    </div>
                  )}
                  {activity.photos.length > 1 && (
                    <div className="absolute bottom-6 right-6 bg-white/90 text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
                      📸 {activity.photos.length}
                    </div>
                  )}
                </div>

                {/* 내용 */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-3 mb-6 font-medium leading-relaxed">
                    {activity.content}
                  </p>

                  <div className="mt-auto space-y-3">
                    <div className="flex items-center text-slate-400 text-xs font-medium gap-2">
                      <Calendar size={14} />
                      <span>{activity.date}</span>
                    </div>
                    {activity.location && (
                      <div className="flex items-center text-slate-400 text-xs font-medium gap-2">
                        <MapPin size={14} />
                        <span className="truncate">{activity.location}</span>
                      </div>
                    )}
                    {activity.participantCount > 0 && (
                      <div className="flex items-center text-slate-400 text-xs font-medium gap-2">
                        <Users size={14} />
                        <span>{activity.participantCount}명 참여</span>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                      <ChevronRight size={20} className="text-slate-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 결과 없음 */}
          {filteredActivities.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon size={32} className="text-slate-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                활동소식이 없습니다
              </h3>
              <p className="text-slate-500 font-medium mb-8">
                {searchQuery ? '검색 결과가 없습니다. 다른 키워드로 검색해보세요.' : '등록된 활동소식이 없습니다.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition"
                >
                  검색 초기화
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ACTIVITY DETAIL MODAL */}
      {selectedActivity && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md" 
          onClick={() => setSelectedActivity(null)}
        >
          <div 
            className="bg-white w-full max-w-4xl rounded-[60px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedActivity(null)}
              className="absolute top-8 right-8 z-20 p-3 bg-white/80 rounded-full text-slate-400 hover:text-orange-600 transition-colors shadow-lg"
            >
              <X size={28} />
            </button>

            <div className="overflow-y-auto flex-grow p-10 md:p-16">
              {/* 이미지 슬라이더 */}
              {selectedActivity.photos.length > 0 && (
                <div className="relative aspect-video bg-slate-100 rounded-[40px] overflow-hidden mb-12 group">
                  <img 
                    src={getProxyUrl(selectedActivity.photos[currentImageIndex])} 
                    alt="활동 이미지"
                    className="w-full h-full object-cover"
                  />
                  {selectedActivity.photos.length > 1 && (
                    <>
                      <button 
                        onClick={prevImage}
                        className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/90 rounded-full text-slate-700 hover:text-orange-600 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button 
                        onClick={nextImage}
                        className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/90 rounded-full text-slate-700 hover:text-orange-600 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <ChevronRight size={24} />
                      </button>
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full text-xs font-bold">
                        {currentImageIndex + 1} / {selectedActivity.photos.length}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* 프로그램 */}
              <div className="flex items-center gap-2 text-orange-600 font-bold text-xs mb-6 uppercase tracking-widest">
                {selectedActivity.program && (
                  <span className="bg-orange-100 px-3 py-1 rounded-full">
                    {selectedActivity.program}
                  </span>
                )}
                <Info size={16} />
              </div>

              {/* 제목 */}
              <h2 className="text-4xl font-black text-slate-900 mb-8 leading-tight">
                {selectedActivity.title}
              </h2>

              {/* 메타 정보 */}
              <div className="grid grid-cols-2 gap-6 mb-12 pb-12 border-b border-slate-100">
                <div className="flex items-center text-slate-400 text-sm font-bold gap-3">
                  <Calendar size={18} />
                  <span>{selectedActivity.date}</span>
                </div>
                {selectedActivity.location && (
                  <div className="flex items-center text-slate-400 text-sm font-bold gap-3">
                    <MapPin size={18} />
                    <span>{selectedActivity.location}</span>
                  </div>
                )}
                {selectedActivity.participantCount > 0 && (
                  <div className="flex items-center text-slate-400 text-sm font-bold gap-3">
                    <Users size={18} />
                    <span>{selectedActivity.participantCount}명 참여</span>
                  </div>
                )}
              </div>

              {/* 내용 */}
              <div className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap text-xl mb-8">
                {selectedActivity.content}
              </div>

              {/* 태그 */}
              {selectedActivity.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-8 border-t border-slate-100 mb-8">
                  {selectedActivity.tags.map(tag => (
                    <span 
                      key={tag}
                      className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-xs font-bold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Notion 링크 */}
              {selectedActivity.url && (
                <div className="pt-8 border-t border-slate-100">
                  <a
                    href={selectedActivity.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors"
                  >
                    <span>Notion에서 보기</span>
                    <ChevronRight size={18} />
                  </a>
                </div>
              )}
            </div>

            {/* 푸터 */}
            <div className="p-10 bg-slate-50 flex justify-end border-t border-slate-100">
              <button
                onClick={() => setSelectedActivity(null)}
                className="bg-slate-900 text-white px-12 py-4 rounded-3xl font-bold hover:bg-orange-600 transition shadow-xl"
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
