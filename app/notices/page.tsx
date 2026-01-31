'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, X, Calendar, Tag, Eye } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  // API에서 공지사항 데이터 불러오기
  useEffect(() => {
    fetch('/api/notices')
      .then((res) => res.json())
      .then((data) => {
        console.log('✅ 공지사항 데이터:', data);
        setNotices(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('❌ 공지사항 로드 실패:', error);
        setLoading(false);
      });
  }, []);

  // 카테고리 목록 추출
  const categories = ['전체', ...Array.from(new Set(notices.map((n) => n.category)))];

  // 필터링된 공지사항
  const filteredNotices = notices.filter((notice) => {
    const matchesCategory = selectedCategory === '전체' || notice.category === selectedCategory;
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 카테고리별 색상
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      공지: 'bg-blue-100 text-blue-700',
      행사: 'bg-purple-100 text-purple-700',
      뉴스: 'bg-green-100 text-green-700',
      안내: 'bg-orange-100 text-orange-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">홈으로</span>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              공지사항
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-12">
        {/* 검색 및 필터 */}
        <div className="mb-8 space-y-4">
          {/* 검색창 */}
          <input
            type="text"
            placeholder="공지사항 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />

          {/* 카테고리 필터 */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">공지사항을 불러오는 중...</p>
          </div>
        )}

        {/* 공지사항 목록 */}
        {!loading && filteredNotices.length > 0 && (
          <div className="space-y-4">
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                onClick={() => setSelectedNotice(notice)}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-2xl border border-gray-100"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-grow">
                      {/* 상단 메타 정보 */}
                      <div className="flex items-center gap-3 mb-4">
                        {notice.pinned && (
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                            고정
                          </span>
                        )}
                        <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${getCategoryColor(notice.category)}`}>
                          {notice.category}
                        </span>
                        <span className="text-gray-400 text-sm font-medium flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {notice.date}
                        </span>
                        <span className="text-gray-400 text-sm font-medium flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {notice.views}
                        </span>
                      </div>

                      {/* 제목 */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                        {notice.title}
                      </h3>

                      {/* 내용 미리보기 */}
                      <p className="text-gray-600 text-base leading-relaxed line-clamp-2 mb-6">
                        {notice.content}
                      </p>

                      {/* ✅ 자세히 보기 버튼 (유지) */}
                      <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                        자세히 보기 →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 빈 상태 */}
        {!loading && filteredNotices.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">검색 결과가 없습니다.</p>
          </div>
        )}
      </main>

      {/* 상세 모달 */}
      {selectedNotice && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedNotice(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10 rounded-t-3xl">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-3">
                  {selectedNotice.pinned && (
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                      고정
                    </span>
                  )}
                  <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${getCategoryColor(selectedNotice.category)}`}>
                    {selectedNotice.category}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">{selectedNotice.title}</h2>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 ml-4"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-8">
              {/* 메타 정보 */}
              <div className="flex items-center gap-6 text-gray-500 text-sm mb-8 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedNotice.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>조회수 {selectedNotice.views}</span>
                </div>
              </div>

              {/* 본문 */}
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                  {selectedNotice.content}
                </p>
              </div>

              {/* ❌ "Notion에서 자세히 보기" 버튼 제거됨 */}
            </div>

            {/* 모달 하단 */}
            <div className="p-8 bg-gray-50 flex justify-end rounded-b-3xl">
              <button
                onClick={() => setSelectedNotice(null)}
                className="bg-gray-900 text-white px-12 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026 사단법인 S&J희망나눔. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
