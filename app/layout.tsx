import type { Metadata } from 'next'

/** * [S&J 희망나눔 배포용 Root Layout]
 * 1. 현재 Canvas 미리보기 환경의 기술적 제약으로 인해 './globals.css' 임포트 시 에러가 발생합니다.
 * 2. 이를 해결하기 위해 임시로 주석 처리하였으며, 대신 <head>에 Tailwind CDN을 추가했습니다.
 * 3. [중요] GitHub에 업로드하여 실제 배포하실 때는 1번 줄의 주석을 해제하셔야 정식 스타일이 적용됩니다.
 */
import './globals.css' 

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
    <html lang="ko">
      <head>
        {/* 미리보기 환경에서도 스타일이 정상적으로 보이도록 CDN을 사용합니다. */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="antialiased min-h-screen bg-white">
        {children}
      </body>
    </html>
  )
}
