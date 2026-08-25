import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope, Lora } from 'next/font/google';
import './globals.css';

const serif = Cormorant_Garamond({
  variable: '--font-serif',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
});

const sans = Manrope({
  variable: '--font-sans',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600'],
});

const script = Lora({
  variable: '--font-script',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500'],
  style: ['italic'],
});

export const viewport: Viewport = {
  themeColor: '#e9a7b0',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Happy Birthday Trịnh Phương Quyên 🎂',
  description: 'Một món quà nhỏ dành riêng cho sinh nhật 25/08 của Út Quyên.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Happy Birthday Trịnh Phương Quyên 🎂',
    description: 'Một món quà nhỏ dành riêng cho sinh nhật 25/08 của Út Quyên.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${serif.variable} ${sans.variable} ${script.variable}`}>
        {children}
      </body>
    </html>
  );
}
