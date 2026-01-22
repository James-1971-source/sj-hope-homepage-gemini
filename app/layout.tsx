import type { Metadata } from 'next'

/** * [이사장님 필독: DOM 중첩 오류 최종 해결]
 * 1. 미리보기 환경에서는 <head>, <html>, <body> 태그를 직접 사용하면 에러가 발생합니다.
 * 2. <head> 태그를 제거하고, 스타일 적용을 위한 스크립트를 <div> 내부로 이동시켜 충돌을 방지했습니다.
 * 3. [중요] 나중에 Vercel 배포를 위해 GitHub에 저장하실 때는, 
 * 표준 Next.js 구조(<html><body>...</body></html>)로 다시 감싸주어야 정식 사이트가 정상 작동합니다.
 */

// import './globals.css' // 실제 GitHub 배포 시에는 이 줄의 주석을 해제하세요.

export const metadata: Metadata = {
  title: '사단법인 S&J 희망나눔',
  description: '청소년의 미래가 AI 기술로 더 넓어지도록',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="antialiased min-h-screen bg-white">
      {/* 미리보기 환경의 스타일 적용을 위해 Tailwind CDN 스크립트를 div 내부에 배치합니다. */}
      <script src="https://cdn.tailwindcss.com"></script>
      
      {/* 실제 홈페이지의 콘텐츠가 표시되는 영역입니다. */}
      {children}
    </div>
  )
}
