'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, ChevronLeft, Bell, Calendar, Pin, 
  Search, Filter, X, Home
} from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  date: string;
  category: string;
  content: string;
  pinned: boolean;
  views: number;
  url: string;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/notices')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNotices(data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  // 필터링 로직
  const filteredNotices = notices.filter(notice => {
    const matchCategory = filter === 'all' || notice.category === filter;
    const matchSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // 고정 공지와 일반 공지 분리
  const pinnedNotices = filteredNotices.filter(n => n.pinned);
  const regularNotices = filteredNotices.filter(n => !n.pinned);

  // 카테고리 목록
  const categories = ['all', ...Array.from(new Set(notices.map(n => n.category)))];

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
            <Bell size={18} />
            <span>Important Announcements</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
            공지사항
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl">
            S&J 희망나눔의 중요한 소식과 공지사항을 확인하세요.
          </p>
        </div>
      </section>

      {/* FILTERS & SEARCH */}
      <section className="py-8 px-6 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* 카테고리 필터 */}
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                    filter === cat
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? '전체' : cat}
                </button>
              ))}
            </div>

            {/* 검색 */}
            <div className="relative w-full md:w-80">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="공지사항 검색..."
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
            총 <span className="text-orange-600">{filteredNotices.length}</span>개의 공지사항
          </div>
        </div>
      </section>

      {/* NOTICES LIST */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* 고정 공지 */}
          {pinnedNotices.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs font-black text-orange-600 uppercase tracking-widest mb-4">
                <Pin size={14} />
                <span>고정 공지</span>
              </div>
              <div className="space-y-4">
                {pinnedNotices.map(notice => (
                  <div
                    key={notice.id}
                    onClick={() => setSelectedNotice(notice)}
                    className="group bg-gradient-to-r from-orange-50 to-white border-2 border-orange-200 rounded-3xl p-8 hover:border-orange-500 hover:shadow-2xl transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">
                            고정
                          </span>
                          <span className="bg-white text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border-2 border-orange-200">
                            {notice.category}
                          </span>
                          <span className="text-slate-400 text-xs font-bold">
                            {notice.date}
                          </span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">
                          {notice.title}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-2 font-medium leading-relaxed">
                          {notice.content}
                        </p>
                      </div>
                      <ChevronRight size={28} className="text-orange-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 일반 공지 */}
          <div className="space-y-4">
            {regularNotices.map(notice => (
              <div
                key={notice.id}
                onClick={() => setSelectedNotice(notice)}
                className="group bg-white border border-slate-200 rounded-3xl p-8 hover:border-orange-500 hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                        {notice.category}
                      </span>
                      <span className="text-slate-400 text-xs font-bold">
                        {notice.date}
                      </span>
                      <span className="text-slate-300 text-xs font-bold">
                        조회 {notice.views}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">
                      {notice.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 font-medium leading-relaxed">
                      {notice.content}
                    </p>
                  </div>
                  <ChevronRight size={24} className="text-slate-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
                </div>
              </div>
            ))}
          </div>

          {/* 결과 없음 */}
          {filteredNotices.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell size={32} className="text-slate-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                공지사항이 없습니다
              </h3>
              <p className="text-slate-500 font-medium mb-8">
                {searchQuery ? '검색 결과가 없습니다. 다른 키워드로 검색해보세요.' : '등록된 공지사항이 없습니다.'}
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

      {/* NOTICE DETAIL MODAL */}
      {selectedNotice && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md" 
          onClick={() => setSelectedNotice(null)}
        >
          <div 
            className="bg-white w-full max-w-3xl rounded-[60px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedNotice(null)}
              className="absolute top-8 right-8 z-10 p-3 bg-white rounded-full text-slate-400 hover:text-orange-600 transition-colors shadow-lg"
            >
              <X size={24} />
            </button>

            <div className="overflow-y-auto flex-grow p-12 md:p-16">
              {/* 카테고리 & 날짜 */}
              <div className="flex items-center gap-3 mb-8">
                {selectedNotice.pinned && (
                  <span className="bg-orange-600 text-white px-4 py-2 rounded-full text-xs font-black uppercase">
                    고정
                  </span>
                )}
                <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-xs font-black uppercase">
                  {selectedNotice.category}
                </span>
                <span className="text-slate-400 text-sm font-bold">
                  {selectedNotice.date}
                </span>
              </div>

              {/* 제목 */}
              <h2 className="text-4xl font-black text-slate-900 mb-8 leading-tight">
                {selectedNotice.title}
              </h2>

              {/* 메타 정보 */}
              <div className="flex items-center gap-6 text-slate-400 text-sm font-bold pb-8 mb-8 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{selectedNotice.date}</span>
                </div>
                <div>조회 {selectedNotice.views}</div>
              </div>

              {/* 내용 */}
              <div className="text-slate-600 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                {selectedNotice.content}
              </div>

              {/* Notion 링크 */}
              {selectedNotice.url && (
                <div className="mt-12 pt-8 border-t border-slate-100">
                  <a
                    href={selectedNotice.url}
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
            <div className="p-8 bg-slate-50 flex justify-end border-t border-slate-100">
              <button
                onClick={() => setSelectedNotice(null)}
                className="bg-slate-900 text-white px-10 py-4 rounded-3xl font-bold hover:bg-orange-600 transition shadow-xl"
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
