'use client';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AccountProvider } from '../context/AccountContext';
import { usePathname } from 'next/navigation';
import { CONSTANTS } from '@/utils/constants';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === CONSTANTS.LINK.LOGIN || pathname === CONSTANTS.LINK.SIGN_UP;
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster />
        {isAuthPage ? children : <AccountProvider>{children}</AccountProvider>}
      </body>
    </html>
  );
}
