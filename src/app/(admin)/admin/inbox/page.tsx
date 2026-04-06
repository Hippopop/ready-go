import { getContactSubmissions, getUnreadCount } from '@/lib/actions/contact'
import { InboxList } from '@/components/admin/inbox/inbox-list'
 
export const metadata = {
  title: 'Inbox | Admin',
}
 
export default async function InboxPage() {
  const submissions = await getContactSubmissions()
  const unreadCount = await getUnreadCount()
 
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight text-app-text">
          Inbox
        </h1>
        <p className="font-body text-app-text/60 mt-1">
          {unreadCount > 0
            ? `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`
            : 'Messages from your portfolio visitors'}
        </p>
      </div>
 
      <div className="bg-surface rounded-(--border-radius) border border-app-text/5 p-6 shadow-xs">
        <InboxList submissions={submissions} />
      </div>
    </div>
  )
}
