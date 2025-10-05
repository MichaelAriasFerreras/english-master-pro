
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { RevolutionaryAITutorClient } from '@/components/tutor/revolutionary-ai-tutor-client';

export default async function TutorPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return <RevolutionaryAITutorClient />;
}
