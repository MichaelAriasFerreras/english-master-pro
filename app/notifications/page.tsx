
import { NotificationsClient } from '@/components/notifications/notifications-client';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NotificationsClient className="w-full max-w-none" />
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
