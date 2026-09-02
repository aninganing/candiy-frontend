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

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
