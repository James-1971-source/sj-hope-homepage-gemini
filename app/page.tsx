'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronLeft, ChevronRight, Heart, Users, BookOpen, Award, Calendar, MapPin, UserCheck } from 'lucide-react';
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

interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  order: number;
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
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
    fetch('/api/banners')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setBanners(data);
        } else {
          setBanners([
            {
              id: '1',
              title: '청소년 글로벌 드림 프로젝트',
              description: '꿈을 향한 도전, S&J희망나눔이 함께합니다',
              image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920',
              order: 1
            },
            {
              id: '2',
              title: 'IT 교육으로 미래를 준비합니다',
              description: '청소년들의 디지털 역량 강화를 지원합니다',
              image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920',
              order: 2
            },
            {
              id: '3',
              title: '함께 만드는 희망찬 내일',
              description: '청소년이 행복한 세상을 만드는 것',
              image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920',
              order: 3
            }
          ]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch banners:', err);
        setBanners([
          {
            id: '1',
            title: '함께 만드는 희망찬 내일',
            description: '사단법인 S&J희망나눔과 함께하는 따뜻한 동행',
            image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920',
            order: 1
          }
        ]);
      });

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
      .catch(err => {
        console.error('Failed to fetch chairman info:', err);
        setChairmanImage('/chairman_profile.jpg');
      });
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setSlideDirection(1);
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const getActivityProxyUrl = (url: string) => {
    if (url && url.startsWith('http') && url.includes('amazonaws.com')) {
      return `/api/proxy?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  const getBannerProxyUrl = (url: string) => {
    if (url && url.startsWith('http') && url.includes('amazonaws.com')) {
      return `/api/proxy?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  const nextBanner = () => {
    setSlideDirection(1);
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setSlideDirection(-1);
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0
    })
  };

  const navigation = [
  {
    name: '기관소개',
    href: '#기관소개',
    sub: [
      'S&J희망나눔은',
      '인사말',
      '미션과 비전',
      '연혁',
      '조직도',
      '오시는 길'
    ]
  },
  {
    name: '사업소개',
    href: '/business',  // ← 이 부분을 수정!
    sub: [
      '글로벌 드림 프로젝트',
      'IT 교육 지원 사업',
      '외국어 교육 지원 사업',
      '교육비 지원 사업',
      '문화체험 지원 사업',
      '아동복지시설 지원 사업',
      'IT 교육장 지원 사업'
    ]
  },
  {
    name: '소식',
    href: '#소식',
    sub: [
      { name: '공지사항', href: '/notices' },
      { name: '활동 소식', href: '/activities' },
      { name: '프로그램', href: '/programs' },
      '언론 보도',
      '캠페인'
    ]
  },
  {
    name: '참여',
    href: '#참여',
    sub: [
      '후원하기',
      '자원봉사 신청',
      'FAQ',
      '문의하기'
    ]
  },
  {
    name: '자료실',
    href: '#자료실',
    sub: [
      '성과 보고서',
      '재무공시',
      '서식 다운로드',
      '소식지',
      '회원 명단',
      '후원자 명단',
      '재능기부활동가 명단',
      '끌레브 장학회',
      '글로벌 서포터즈'
    ]
  },
];


  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white/90 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
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
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
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

      {/* Hero Banner Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <AnimatePresence initial={false} custom={slideDirection} mode="wait">
          <motion.div
            key={currentBannerIndex}
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 }
            }}
            className="absolute inset-0"
          >
            <Image
              src={getBannerProxyUrl(banners[currentBannerIndex]?.image) || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920'}
              alt={banners[currentBannerIndex]?.title || 'Banner'}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl">
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl md:text-7xl font-bold mb-6"
                >
                  {banners[currentBannerIndex]?.title || '함께 만드는 희망찬 내일'}
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl md:text-2xl mb-8"
                >
                  {banners[currentBannerIndex]?.description || '사단법인 S&J희망나눔과 함께하는 따뜻한 동행'}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {banners.length > 1 && (
          <>
            <button
              onClick={prevBanner}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all"
              aria-label="Previous banner"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextBanner}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all"
              aria-label="Next banner"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSlideDirection(index > currentBannerIndex ? 1 : -1);
                    setCurrentBannerIndex(index);
                  }}
                  className={`h-3 rounded-full transition-all ${
                    index === currentBannerIndex ? 'bg-white w-8' : 'bg-white/50 w-3'
                  }`}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
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
            <p className="text-sm text-[#F79332] font-semibold mb-2">CHAIRMAN'S MESSAGE</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">이사장 인사말</h2>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-shrink-0"
            >
              <div className="relative w-64 h-80 lg:w-80 lg:h-96">
                <Image
                  src={chairmanImage}
                  alt="이사장 윤동성"
                  fill
                  className="rounded-2xl shadow-2xl object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/chairman_profile.jpg';
                  }}
                />
              </div>
            </motion.div>

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

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 max-w-2xl"
            >
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                환경이 꿈의 한계가 되지 않도록,<br/>
                S&J가 청소년의 곁을 지킵니다.
              </h3>
              <div className="space-y-5 text-gray-700 leading-relaxed">
                <p className="text-base lg:text-lg">
                  꿈을 마음껏 펼쳐야 할 청소년기에 가정환경의 어려움으로 스스로의 가능성을 닫는 아이들을 볼 때 가장 마음이 아픕니다. S&J희망나눔은 그런 아이들의 손을 잡고 밝은 미래로 나아가기 위해 설립되었습니다.
                </p>
                <p className="text-base lg:text-lg">
                  지난 10년 동안 우리는 '청소년 글로벌 드림' 프로젝트를 통해 수많은 아이의 성장을 지켜보았습니다. 이제는 한 걸음 더 나아가, 급변하는 미래 사회에서 아이들이 소외되지 않도록 IT 교육과 인문학적 소양을 결합한 통합적 성장을 지원합니다.
                </p>
                <p className="text-base lg:text-lg">
                  나눔은 또 다른 희망을 낳습니다. 아이들이 어려운 환경을 극복하고 당당한 사회의 일원으로 성장할 수 있도록 곁을 지키겠습니다.
                </p>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-[#A6A9AB] mb-2">CHAIRMAN OF S&J HOPE SHARING</p>
                  <p className="text-lg lg:text-xl font-bold text-gray-900">이사장 윤 동 성</p>
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
              <div className="mb-4">
                {/* 푸터 로고 - 흰색으로 표시 */}
                  <Link href="/" className="flex-shrink-0">
                    <Image
                      src="/sj-hope-logo.png"
                      alt="S&J 희망나눔"
                      width={200}
                      height={60}
                      style={{ 
                        filter: 'brightness(0) saturate(100%) invert(100%)' 
                      }}
                      className="h-16 w-auto object-contain"
                      priority
                    />
                  </Link>

              </div>
              <p className="text-gray-400 mb-4">
                사단법인 S&J희망나눔<br />
                함께 만드는 희망찬 내일
              </p>
              
              <div className="flex gap-4 mt-6">
                <a 
                  href="https://www.youtube.com/@SJ-lv4ft" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-[#F79332] flex items-center justify-center transition-colors"
                  aria-label="유튜브"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/sj_hopesharing/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-[#F79332] flex items-center justify-center transition-colors"
                  aria-label="인스타그램"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://blog.naver.com/sjhopesharing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-[#F79332] flex items-center justify-center transition-colors"
                  aria-label="블로그"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
                  </svg>
                </a>
              </div>
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
              <h3 className="text-lg font-semibold mb-4">후원 계좌</h3>
              <div className="text-gray-400 space-y-2 text-sm">
                <p className="font-semibold text-white">하나은행</p>
                <p>501-910055-21605</p>
                <p className="font-semibold text-white mt-3">대구은행</p>
                <p>504-10-319709-1</p>
                <p className="text-xs mt-2">(사)S&J희망나눔</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
              <div>
                <p className="mb-2"><span className="font-semibold">대표자:</span> 윤동성</p>
                <p className="mb-2"><span className="font-semibold">본부:</span> 대구광역시 중구 동덕로 115 진석타워 9층 906호(41940)</p>
                <p className="mb-2"><span className="font-semibold">대표전화:</span> 053-428-7942</p>
              </div>
              <div>
                <p className="mb-2"><span className="font-semibold">지부:</span> 서울특별시 종로구 송월길 48, (사)S&J희망나눔 본관</p>
                <p className="mb-2"><span className="font-semibold">대표전화:</span> 053-428-7942</p>
                <p className="mb-2"><span className="font-semibold">메일:</span> sjfoundation@sj-hs.or.kr</p>
                <p className="mb-2"><span className="font-semibold">상담시간:</span> 10:00~17:00</p>
              </div>
            </div>
            <div className="text-center mt-6 text-gray-500 text-sm">
              <p>Copyright@ 2026 (사)S&J 희망나눔. All rights reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
