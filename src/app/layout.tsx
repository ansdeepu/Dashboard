import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a professional font alternative to Geist for broader compatibility
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans', // Changed variable name for clarity
});

export const metadata: Metadata = {
  title: 'GWD Kollam Dashboard - Ground Water Dept. Kollam',
  description: 'Work progress dashboard for Ground Water Department Kollam.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
