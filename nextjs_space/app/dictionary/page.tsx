
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { EnhancedDictionaryClient } from '@/components/dictionary/enhanced-dictionary-client';

export default async function DictionaryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return <EnhancedDictionaryClient />;
}
