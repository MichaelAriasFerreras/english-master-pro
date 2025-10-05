
import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/ui/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'English Master Pro - La Mejor Plataforma de Inglés del Mundo',
  description: 'Aprende inglés con IA avanzada, reconocimiento de voz, competencias globales y gamificación revolucionaria',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
