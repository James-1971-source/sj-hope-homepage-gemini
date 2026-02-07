'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, Users, Target, Award, TrendingUp } from 'lucide-react';

interface Business {
  id: string;
  title: string;
  category: string;
  overview: string;
  goal: string;
  target: string;
  content: string;
  achievement: string;
  images: string[];
  order: number;
  createdAt: string;
}

const categories = [
  '글로벌 드림 프로젝트',
  'IT 교육 지원 사업',
  '외국어 교육 지원 사업',
  '교육비 지원 사업',
  '문화체험 지원 사업',
  '아동복지시설 지원 사업',
  'IT 교육장 지원 사업',
];

export default function BusinessPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [loading, setLoading] = useState(true);

  // URL 파라미터에서 카테고리 읽기
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      setSelectedCategory(decodeURIComponent(categoryParam));
    }
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await fetch('/api/business');
      const data = await response.json();
      setBusinesses(data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBusinesses = selectedCategory === '전체'
    ? businesses
    : businesses.filter(b => b.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center text-gray-600 hover:text-[#F79332] transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span>홈으로</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">사업소개</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* 카테고리 필터 */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex overflow-x-auto gap-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('전체')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === '전체'
                  ? 'bg-[#F79332] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#F79332] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F79332]"></div>
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">등록된 사업이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredBusinesses.map((business, index) => (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {/* 이미지 섹션 */}
                {business.images.length > 0 && (
                  <div className="relative h-80 bg-gray-200">
                    <Image
                      src={business.images[0]}
                      alt={business.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* 콘텐츠 섹션 */}
                <div className="p-8">
                  {/* 카테고리 배지 */}
                  <span className="inline-block px-3 py-1 bg-[#F79332] text-white text-sm rounded-full mb-4">
                    {business.category}
                  </span>

                  {/* 제목 */}
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {business.title}
                  </h2>

                  {/* 개요 */}
                  <p className="text-xl text-gray-700 mb-6">
                    {business.overview}
                  </p>

                  {/* 세부 정보 그리드 */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* 목표 */}
                    {business.goal && (
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Target className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">사업 목표</h3>
                          <p className="text-gray-600 text-sm">{business.goal}</p>
                        </div>
                      </div>
                    )}

                    {/* 대상 */}
                    {business.target && (
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-green-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">지원 대상</h3>
                          <p className="text-gray-600 text-sm">{business.target}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 사업 내용 */}
                  {business.content && (
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Award className="w-5 h-5 text-[#F79332]" />
                        사업 내용
                      </h3>
                      <p className="text-gray-600 whitespace-pre-line">{business.content}</p>
                    </div>
                  )}

                  {/* 주요 성과 */}
                  {business.achievement && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#F79332]" />
                        주요 성과
                      </h3>
                      <p className="text-gray-600 whitespace-pre-line">{business.achievement}</p>
                    </div>
                  )}

                  {/* 이미지 갤러리 (2장 이상일 경우) */}
                  {business.images.length > 1 && (
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {business.images.slice(1).map((image, idx) => (
                        <div key={idx} className="relative h-48 rounded-lg overflow-hidden">
                          <Image
                            src={image}
                            alt={`${business.title} 이미지 ${idx + 2}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
