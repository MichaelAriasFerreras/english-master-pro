
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { AboutClient } from '@/components/about/about-client';

export const metadata = {
  title: 'Acerca de - English Master Pro',
  description: 'Conoce al creador de English Master Pro - Michael Eduardo Arias Ferreras',
};

export default async function AboutPage() {
  const session = await getServerSession(authOptions);
  
  return <AboutClient session={session} />;
}
