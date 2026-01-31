'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, X, Users, Calendar, Target, ChevronDown } from 'lucide-react';

interface Program {
  id: string;
  name: string;
  category: string;
  description: string;
  target: string;
  period: string;
  image: string | null;
  order: number;
  published: boolean;
  url: string;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  // API에서 프로그램 데이터 불러오기
  useEffect(() => {
    fetch('/api/programs')
      .then((res) => res.json())
      .then((data) => {
        console.log('✅ 프로그램 데이터:', data);
        setPrograms(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('❌ 프로그램 로드 실패:', error);
        setLoading(false);
      });
  }, []);

  // 카테고리 목록 추출
  const categories = ['전체', ...Array.from(new Set(programs.map((p) => p.category)))];

  // 필터링된 프로그램
  const filteredPrograms =
    selectedCategory === '전체'
      ? programs
      : programs.filter((p) => p.category === selectedCategory);

  // 카테고리별 색상
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      교육: 'bg-blue-100 text-blue-700',
      문화: 'bg-purple-100 text-purple-700',
      복지: 'bg-green-100 text-green-700',
      의료: 'bg-red-100 text-red-700',
      기타: 'bg-gray-100 text-gray-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  // 이미지 프록시 처리
  const getProxyUrl = (url: string | null) => {
    if (!url) return 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800';
    if (url.includes('amazonaws.com') || url.includes('s3.')) {
      return `/api/proxy?url=${encodeURIComponent(url)}`;
    }
    return url;
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
              프로그램
            </h1>
            <div className="w-20"></div> {/* 균형 맞추기 */}
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-12">
        {/* 카테고리 필터 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
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
            <p className="mt-4 text-gray-600">프로그램을 불러오는 중...</p>
          </div>
        )}

        {/* 프로그램 그리드 */}
        {!loading && filteredPrograms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                onClick={() => setSelectedProgram(program)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl"
              >
                {/* 이미지 */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={getProxyUrl(program.image)}
                    alt={program.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getCategoryColor(program.category)}`}>
                      {program.category}
                    </span>
                  </div>
                </div>

                {/* 내용 */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{program.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                    {program.description}
                  </p>

                  {/* 메타 정보 */}
                  <div className="space-y-2">
                    {program.target && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span>{program.target}</span>
                      </div>
                    )}
                    {program.period && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span>{program.period}</span>
                      </div>
                    )}
                  </div>

                  {/* 자세히 보기 버튼 */}
                  <button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all">
                    자세히 보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 빈 상태 */}
        {!loading && filteredPrograms.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">해당 카테고리의 프로그램이 없습니다.</p>
          </div>
        )}
      </main>

      {/* 상세 모달 */}
      {selectedProgram && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProgram(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">{selectedProgram.name}</h2>
              <button
                onClick={() => setSelectedProgram(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-6">
              {/* 이미지 */}
              {selectedProgram.image && (
                <img
                  src={getProxyUrl(selectedProgram.image)}
                  alt={selectedProgram.name}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
              )}

              {/* 카테고리 */}
              <div className="mb-4">
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getCategoryColor(selectedProgram.category)}`}>
                  {selectedProgram.category}
                </span>
              </div>

              {/* 설명 */}
              <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
                {selectedProgram.description}
              </p>

              {/* 메타 정보 */}
              <div className="space-y-3 mb-6">
                {selectedProgram.target && (
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">참여 대상</p>
                      <p className="text-sm text-gray-600">{selectedProgram.target}</p>
                    </div>
                  </div>
                )}
                {selectedProgram.period && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">진행 기간</p>
                      <p className="text-sm text-gray-600">{selectedProgram.period}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Notion 페이지 링크 */}
              <a
                href={selectedProgram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold text-center hover:shadow-lg transition-all"
              >
                Notion에서 자세히 보기 →
              </a>
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
