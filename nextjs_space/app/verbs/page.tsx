
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import RestoredVerbsClient from '@/components/verbs/restored-verbs-client';

export default async function VerbsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return <RestoredVerbsClient />;
}
