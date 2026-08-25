import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans, Dancing_Script } from 'next/font/google';
import './globals.css';

const serif = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
});

const sans = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
});

const script = Dancing_Script({
  variable: '--font-script',
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
});

export const viewport: Viewport = {
  themeColor: '#e9a7b0',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
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
    <html lang="vi" suppressHydrationWarning>
      <body className={`${serif.variable} ${sans.variable} ${script.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
