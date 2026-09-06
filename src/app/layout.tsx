import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Providers } from './providers';
import './globals.css';

const pretendard = localFont({
  src: '../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2',
  variable: '--font-pretendard',
  weight: '45 920',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CANDiY 건강검진 대시보드',
  description: 'CANDiY API 연동 건강검진 결과 조회 및 시각화 대시보드',
};

// localStorage에 저장된 테마를 hydration 전에 적용해, 실제 값과 다른 기본값으로 그렸다가 페이지 전체 색이 한 번 바뀌는 깜빡임(FOUC)을 막는다.
// 이 스크립트가 hydration 전에 html의 data-theme를 바꿔버려 서버 렌더 결과와 항상 다를 수 있으니 html에 suppressHydrationWarning을 둔다.
const THEME_INIT_SCRIPT = `
  try {
    var t = localStorage.getItem('theme');
    if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
  } catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
