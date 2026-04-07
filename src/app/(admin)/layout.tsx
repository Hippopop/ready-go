import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUnreadCount } from '@/lib/actions/contact';
import AdminShell from '@/components/admin/layout/admin-shell';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const unreadCount = await getUnreadCount();

  return (
    <AdminShell userEmail={user.email ?? null} unreadCount={unreadCount}>
      {children}
    </AdminShell>
  );
}
