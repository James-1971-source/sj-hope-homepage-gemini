'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ChevronDown, Heart, Users, BookOpen, Award, Calendar, MapPin, UserCheck, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Notice {
  id: string;
  title: string;
  date: string;
  category: string;
}

interface Activity {
  id: string;
  title: string;
  date: string;
  description: string;
  images: string[];
  program: string;
  location: string;
  participantCount: number;
  tags: string[];
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [chairmanImage, setChairmanImage] = useState('/chairman_profile.jpg');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showActivityDetail, setShowActivityDetail] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/notices')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setNotices(data.slice(0, 3));
        }
      })
      .catch(err => console.error('Failed to fetch notices:', err));

    fetch('/api/activities')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const formattedActivities = data.slice(0, 3).map((item: any) => ({
            id: item.id,
            title: item.title || '제목 없음',
            date: item.date || '날짜 미정',
            description: item.content || '',
            images: item.images || [],
            program: item.program || '',
            location: item.location || '',
            participantCount: item.participantCount || 0,
            tags: item.tags || []
          }));
          setActivities(formattedActivities);
        }
      })
      .catch(err => console.error('Failed to fetch activities:', err));

    fetch('/api/about')
      .then(res => res.json())
      .then(data => {
        if (data.chairmanImage) {
          const imageUrl = data.chairmanImage.startsWith('http') && data.chairmanImage.includes('amazonaws.com')
            ? `/api/proxy?url=${encodeURIComponent(data.chairmanImage)}`
            : data.chairmanImage;
          setChairmanImage(imageUrl);
        }
      })
      .catch(err => console.error('Failed to fetch chairman info:', err));
  }, []);

  const getActivityProxyUrl = (url: string) => {
    if (url && url.startsWith('http') && url.includes('amazonaws.com')) {
      return `/api/proxy?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  const navigation = [
    { name: '소개', href: '#소개', sub: ['인사말', '설립목적', '주요사업', '연혁', '조직도', '찾아오시는 길'] },
    { name: '소식', href: '#소식', sub: [
      { name: '공지사항', href: '/notices' },
      { name: '활동소식', href: '/activities' },
      { name: '프로그램', href: '/programs' },
      '언론보도'
    ]},
    { name: '후원', href: '#후원', sub: ['후원안내', '후원신청', '후원자 명단'] },
    { name: '참여', href: '#참여', sub: ['봉사활동 신청', 'FAQ', '문의하기'] },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white/90 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <Image 
                  src="/sj-hope-logo.png" 
                  alt="S&J 희망나눔" 
                  width={180}
                  height={60}
                  className="h-12 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  <a
                    href={item.href}
                    className="text-gray-700 hover:text-[#F79332] px-3 py-2 text-sm font-medium transition-colors"
                  >
                    {item.name}
                    {item.sub && <ChevronDown className="inline ml-1 h-4 w-4" />}
                  </a>
                  {item.sub && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-2">
                        {item.sub.map((subItem) => {
                          if (typeof subItem === 'object') {
                            return (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F79332]/10 hover:text-[#F79332]"
                              >
                                {subItem.name}
                              </Link>
                            );
                          }
                          return (
                            <a
                              key={subItem}
                              href={`#${subItem}`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F79332]/10 hover:text-[#F79332]"
                            >
                              {subItem}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-[#F79332]"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  <a
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#F79332] hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                  {item.sub && (
                    <div className="pl-4">
                      {item.sub.map((subItem) => {
                        if (typeof subItem === 'object') {
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-3 py-2 text-sm text-gray-600 hover:text-[#F79332]"
                            >
                              {subItem.name}
                            </Link>
                          );
                        }
                        return (
                          <a
                            key={subItem}
                            href={`#${subItem}`}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-[#F79332]"
                          >
                            {subItem}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F79332]/90 to-[#F79332]/70" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              함께 만드는<br />희망찬 내일
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              사단법인 S&J희망나눔과 함께하는 따뜻한 동행
            </p>
            <button className="bg-white text-[#F79332] px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
              후원하기
            </button>
          </motion.div>
        </div>
      </section>

      {/* Notices Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">공지사항</h2>
            <p className="text-xl text-[#A6A9AB]">최신 소식을 확인하세요</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {notices.length > 0 ? (
              notices.map((notice, index) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-[#F79332]/10 text-[#F79332] rounded-full text-sm font-medium">
                      {notice.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {notice.title}
                  </h3>
                  <p className="text-[#A6A9AB] text-sm">{notice.date}</p>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center text-[#A6A9AB]">
                공지사항을 불러오는 중입니다...
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/notices"
              className="inline-block bg-[#F79332] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#F79332]/90 transition-all transform hover:scale-105"
            >
              공지사항 더보기
            </Link>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">활동소식</h2>
            <p className="text-xl text-[#A6A9AB]">우리의 따뜻한 활동을 만나보세요</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className="relative h-64">
                    <Image
                      src={getActivityProxyUrl(activity.images[0]) || '/placeholder-activity.jpg'}
                      alt={activity.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-activity.jpg';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {activity.title}
                    </h3>
                    <p className="text-[#A6A9AB] text-sm mb-4">{activity.date}</p>
                    <p className="text-gray-600 line-clamp-3 mb-4">{activity.description}</p>
                    <button className="text-[#F79332] font-semibold hover:text-[#F79332]/80 transition-colors">
                      자세히 보기 →
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center text-[#A6A9AB]">
                활동소식을 불러오는 중입니다...
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/activities"
              className="inline-block bg-[#F79332] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#F79332]/90 transition-all transform hover:scale-105"
            >
              활동소식 더보기
            </Link>
          </div>
        </div>
      </section>

      {/* Activity Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedActivity(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {!showActivityDetail ? (
              <>
                <div className="relative h-96">
                  <Image
                    src={getActivityProxyUrl(selectedActivity.images[0]) || '/placeholder-activity.jpg'}
                    alt={selectedActivity.title}
                    fill
                    className="object-cover rounded-t-2xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-activity.jpg';
                    }}
                  />
                </div>
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedActivity.title}</h2>
                  <div className="flex items-center gap-4 text-[#A6A9AB] mb-6">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {selectedActivity.date}
                    </span>
                    {selectedActivity.location && (
                      <span className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        {selectedActivity.location}
                      </span>
                    )}
                    {selectedActivity.participantCount > 0 && (
                      <span className="flex items-center gap-2">
                        <UserCheck className="w-5 h-5" />
                        {selectedActivity.participantCount}명 참여
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
                    {selectedActivity.description}
                  </p>
                  {selectedActivity.tags && selectedActivity.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selectedActivity.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-[#F79332]/10 text-[#F79332] rounded-full text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowActivityDetail(true)}
                      className="flex-1 bg-[#F79332] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#F79332]/90 transition-colors"
                    >
                      자세히 보기
                    </button>
                    <button
                      onClick={() => setSelectedActivity(null)}
                      className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{selectedActivity.title}</h2>
                
                {selectedActivity.images && selectedActivity.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {selectedActivity.images.map((img, idx) => (
                      <div key={idx} className="relative h-64">
                        <Image
                          src={getActivityProxyUrl(img) || '/placeholder-activity.jpg'}
                          alt={`${selectedActivity.title} ${idx + 1}`}
                          fill
                          className="object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-activity.jpg';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#F79332] mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">날짜</p>
                      <p className="text-gray-600">{selectedActivity.date}</p>
                    </div>
                  </div>

                  {selectedActivity.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#F79332] mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">장소</p>
                        <p className="text-gray-600">{selectedActivity.location}</p>
                      </div>
                    </div>
                  )}

                  {selectedActivity.program && (
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-[#F79332] mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">프로그램</p>
                        <p className="text-gray-600">{selectedActivity.program}</p>
                      </div>
                    </div>
                  )}

                  {selectedActivity.participantCount > 0 && (
                    <div className="flex items-start gap-3">
                      <UserCheck className="w-5 h-5 text-[#F79332] mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">참여 인원</p>
                        <p className="text-gray-600">{selectedActivity.participantCount}명</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">활동 내용</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedActivity.description}
                  </p>
                </div>

                {selectedActivity.tags && selectedActivity.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">태그</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedActivity.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-[#F79332]/10 text-[#F79332] rounded-full text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowActivityDetail(false);
                      setSelectedActivity(null);
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Chairman Message Section */}
      <section id="인사말" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">이사장 인사말</h2>
            <p className="text-xl text-[#A6A9AB]">따뜻한 마음으로 함께하겠습니다</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-shrink-0"
            >
              <div className="relative w-64 h-80 lg:w-80 lg:h-96">
                <Image
                  src={chairmanImage}
                  alt="이사장"
                  fill
                  className="rounded-2xl shadow-2xl object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/chairman_profile.jpg';
                  }}
                />
              </div>
            </motion.div>

            {/* Badge - Positioned in the middle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex-shrink-0"
            >
              <div className="relative">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-[#F79332] to-[#F79332]/80 flex items-center justify-center shadow-2xl">
                  <div className="text-center">
                    <p className="text-white text-xs lg:text-sm font-medium mb-1">Since 2016</p>
                    <p className="text-white text-sm lg:text-base font-bold leading-tight">
                      10년의 약속<br/>
                      변함없는 동행
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 max-w-2xl"
            >
              <div className="space-y-5 text-gray-700 leading-relaxed">
                <p className="text-base lg:text-lg">
                  안녕하십니까. 사단법인 S&J희망나눔 이사장 김성진입니다.
                </p>
                <p className="text-base lg:text-lg">
                  우리 법인은 2016년 설립 이래, 지역사회의 소외된 이웃들과 함께 
                  희망을 나누고 더 나은 내일을 만들어가는 데 최선을 다해왔습니다.
                </p>
                <p className="text-base lg:text-lg">
                  교육, 문화, 복지 등 다양한 분야에서 실질적인 도움을 드리고자 
                  끊임없이 노력하고 있으며, 많은 분들의 관심과 후원 덕분에 
                  의미 있는 성과를 이루어낼 수 있었습니다.
                </p>
                <p className="text-base lg:text-lg">
                  앞으로도 변함없는 마음으로 우리 사회의 따뜻한 동반자가 되어 
                  더 많은 분들에게 희망과 행복을 전하는 법인이 되겠습니다.
                </p>
                <p className="text-base lg:text-lg font-semibold text-[#F79332]">
                  여러분의 소중한 관심과 응원을 부탁드립니다. 감사합니다.
                </p>
                <div className="pt-4">
                  <p className="text-lg lg:text-xl font-bold text-gray-900">사단법인 S&J희망나눔</p>
                  <p className="text-base lg:text-lg font-semibold text-[#6C6E70]">이사장 김성진</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">우리의 미션</h2>
            <p className="text-xl text-[#A6A9AB]">나눔으로 만드는 더 나은 세상</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: '사랑나눔', desc: '따뜻한 마음으로 이웃과 함께합니다' },
              { icon: Users, title: '함께성장', desc: '지역사회와 더불어 성장합니다' },
              { icon: BookOpen, title: '교육지원', desc: '꿈을 키우는 교육기회를 제공합니다' },
              { icon: Award, title: '가치실현', desc: '나눔의 가치를 실천합니다' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-[#F79332]/10 rounded-full flex items-center justify-center">
                  <item.icon className="w-10 h-10 text-[#F79332]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-[#A6A9AB]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <Image 
                src="/sj-hope-logo.png" 
                alt="S&J 희망나눔" 
                width={200}
                height={60}
                className="h-12 w-auto mb-4 brightness-0 invert"
              />
              <p className="text-gray-400 mb-4">
                사단법인 S&J희망나눔<br />
                함께 만드는 희망찬 내일
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">바로가기</h3>
              <ul className="space-y-2">
                <li><Link href="/notices" className="text-gray-400 hover:text-[#F79332] transition-colors">공지사항</Link></li>
                <li><Link href="/activities" className="text-gray-400 hover:text-[#F79332] transition-colors">활동소식</Link></li>
                <li><Link href="/programs" className="text-gray-400 hover:text-[#F79332] transition-colors">프로그램</Link></li>
                <li><a href="#후원" className="text-gray-400 hover:text-[#F79332] transition-colors">후원하기</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">문의</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Tel: 02-1234-5678</li>
                <li>Email: info@sjhope.or.kr</li>
                <li>주소: 서울시 강남구</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 사단법인 S&J희망나눔. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
