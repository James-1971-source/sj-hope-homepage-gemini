'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, X, Calendar, MapPin, Users, ChevronLeft, ChevronRight, Tag } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  date: string;
  program: string;
  content: string;
  location: string;
  participantCount: number;
  photos: string[];
  tags: string[];
  url: string;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedProgram, setSelectedProgram] = useState<string>('전체');

  // API에서 활동소식 데이터 불러오기
  useEffect(() => {
    fetch('/api/activities')
      .then((res) => res.json())
      .then((data) => {
        console.log('✅ 활동소식 데이터:', data);
        setActivities(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('❌ 활동소식 로드 실패:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedActivity) setCurrentImageIndex(0);
  }, [selectedActivity]);

  // 프로그램 목록 추출
  const programs = ['전체', ...Array.from(new Set(activities.map((a) => a.program)))];

  // 필터링된 활동소식
  const filteredActivities =
    selectedProgram === '전체'
      ? activities
      : activities.filter((a) => a.program === selectedProgram);

  // 이미지 프록시 처리
  const getProxyUrl = (url: string | null) => {
    if (!url) return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800';
    if (url.includes('amazonaws.com') || url.includes('s3.')) {
      return `/api/proxy?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  // 이미지 네비게이션
  const nextImage = () => {
    if (!selectedActivity) return;
    setCurrentImageIndex((prev) =>
      prev === selectedActivity.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!selectedActivity) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedActivity.photos.length - 1 : prev - 1
    );
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
              활동소식
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-12">
        {/* 프로그램 필터 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {programs.map((program) => (
              <button
                key={program}
                onClick={() => setSelectedProgram(program)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                  selectedProgram === program
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
              >
                {program}
              </button>
            ))}
          </div>
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">활동소식을 불러오는 중...</p>
          </div>
        )}

        {/* 활동소식 그리드 */}
        {!loading && filteredActivities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => setSelectedActivity(activity)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl"
              >
                {/* 이미지 */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={getProxyUrl(activity.photos[0])}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                  {activity.program && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                        {activity.program}
                      </span>
                    </div>
                  )}
                </div>

                {/* 내용 */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{activity.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                    {activity.content}
                  </p>

                  {/* 메타 정보 */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>{activity.date}</span>
                    </div>
                    {activity.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <span className="truncate">{activity.location}</span>
                      </div>
                    )}
                    {activity.participantCount > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-green-600" />
                        <span>{activity.participantCount}명 참여</span>
                      </div>
                    )}
                  </div>

                  {/* ✅ 자세히 보기 버튼 (유지) */}
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all">
                    자세히 보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 빈 상태 */}
        {!loading && filteredActivities.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">해당 프로그램의 활동소식이 없습니다.</p>
          </div>
        )}
      </main>

      {/* 상세 모달 */}
      {selectedActivity && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedActivity(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">{selectedActivity.title}</h2>
              <button
                onClick={() => setSelectedActivity(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-6">
              {/* 이미지 슬라이더 */}
              {selectedActivity.photos.length > 0 && (
                <div className="relative mb-6">
                  <img
                    src={getProxyUrl(selectedActivity.photos[currentImageIndex])}
                    alt={selectedActivity.title}
                    className="w-full h-96 object-cover rounded-xl"
                  />
                  {selectedActivity.photos.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full hover:bg-white transition-all"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full hover:bg-white transition-all"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-800" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        {currentImageIndex + 1} / {selectedActivity.photos.length}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* 프로그램 뱃지 */}
              {selectedActivity.program && (
                <div className="mb-4">
                  <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                    {selectedActivity.program}
                  </span>
                </div>
              )}

              {/* 설명 */}
              <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
                {selectedActivity.content}
              </p>

              {/* 메타 정보 */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">활동 날짜</p>
                    <p className="text-sm text-gray-600">{selectedActivity.date}</p>
                  </div>
                </div>
                {selectedActivity.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">장소</p>
                      <p className="text-sm text-gray-600">{selectedActivity.location}</p>
                    </div>
                  </div>
                )}
                {selectedActivity.participantCount > 0 && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">참여 인원</p>
                      <p className="text-sm text-gray-600">{selectedActivity.participantCount}명</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 태그 */}
              {selectedActivity.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                  {selectedActivity.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* ❌ "Notion에서 자세히 보기" 버튼 제거됨 */}
            </div>

            {/* 모달 하단 */}
            <div className="p-6 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedActivity(null)}
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
