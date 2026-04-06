'use client'
 
import { useState, useMemo } from 'react'
import { Inbox, CheckCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MessageCard } from './message-card'
import { Button } from '@/components/ui/button'
import { markAsRead } from '@/lib/actions/contact'
import { cn } from '@/lib/utils'
 
export interface ContactSubmission {
  id: string
  sender_name: string
  sender_email: string
  message: string
  is_read: boolean
  created_at: string
}
 
interface InboxListProps {
  submissions: ContactSubmission[]
}
 
type Tab = 'all' | 'unread' | 'read'
 
export function InboxList({ submissions }: InboxListProps) {
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const router = useRouter()
 
  const filteredSubmissions = useMemo(() => {
    switch (activeTab) {
      case 'unread':
        return submissions.filter(s => !s.is_read)
      case 'read':
        return submissions.filter(s => s.is_read)
      default:
        return submissions
    }
  }, [submissions, activeTab])
 
  const unreadCount = submissions.filter(s => !s.is_read).length
  const readCount = submissions.filter(s => s.is_read).length
 
  const handleMarkAllAsRead = async () => {
    const unreadItems = submissions.filter(s => !s.is_read)
    if (unreadItems.length === 0) return
 
    await Promise.all(unreadItems.map(s => markAsRead(s.id)))
    router.refresh()
  }
 
  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="bg-surface p-6 rounded-full mb-6">
          <Inbox className="size-12 text-app-text/20" />
        </div>
        <h3 className="font-heading text-2xl font-bold text-app-text/60 mb-2">
          No messages yet
        </h3>
        <p className="font-body text-app-text/40 max-w-sm mx-auto">
          When visitors contact you from your portfolio, their messages will appear here.
        </p>
      </div>
    )
  }
 
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex bg-surface/50 p-1 rounded-(--border-radius) border border-app-text/5">
          <button
            onClick={() => setActiveTab('all')}
            className={cn(
              'px-4 py-1.5 text-sm font-medium transition-all duration-(--transition-speed) ease-(--transition-easing)',
              activeTab === 'all'
                ? 'bg-primary text-white shadow-sm rounded-(--border-radius)'
                : 'text-app-text/60 hover:text-app-text'
            )}
          >
            All ({submissions.length})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={cn(
              'px-4 py-1.5 text-sm font-medium transition-all duration-(--transition-speed) ease-(--transition-easing)',
              activeTab === 'unread'
                ? 'bg-primary text-white shadow-sm rounded-(--border-radius)'
                : 'text-app-text/60 hover:text-app-text'
            )}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setActiveTab('read')}
            className={cn(
              'px-4 py-1.5 text-sm font-medium transition-all duration-(--transition-speed) ease-(--transition-easing)',
              activeTab === 'read'
                ? 'bg-primary text-white shadow-sm rounded-(--border-radius)'
                : 'text-app-text/60 hover:text-app-text'
            )}
          >
            Read ({readCount})
          </button>
        </div>
 
        {unreadCount > 0 && (activeTab === 'all' || activeTab === 'unread') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="text-app-text/60 hover:text-primary transition-colors h-9"
          >
            <CheckCheck className="size-3.5 mr-2" />
            Mark all as read
          </Button>

        )}
      </div>
 
      <div className="grid gap-4">
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map(submission => (
            <MessageCard key={submission.id} submission={submission} />
          ))
        ) : (
          <div className="py-12 text-center text-app-text/40 font-body italic border-2 border-dashed border-app-text/5 rounded-(--border-radius)">
            No {activeTab} messages found.
          </div>
        )}
      </div>
    </div>
  )
}
