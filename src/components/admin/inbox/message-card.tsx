'use client'
 
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Mail, Trash2, CheckCircle, Reply } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { markAsRead, deleteSubmission } from '@/lib/actions/contact'
import { cn } from '@/lib/utils'
 
interface MessageCardProps {
  submission: {
    id: string
    sender_name: string
    sender_email: string
    message: string
    is_read: boolean
    created_at: string
  }
}
 
export function MessageCard({ submission }: MessageCardProps) {
  const router = useRouter()
 
  const handleMarkAsRead = async () => {
    await markAsRead(submission.id)
    router.refresh()
  }
 
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this message?')) {
      await deleteSubmission(submission.id)
      router.refresh()
    }
  }
 
  return (
    <div
      className={cn(
        'p-4 rounded-(--border-radius) transition-all duration-(--transition-speed) ease-(--transition-easing)',
        submission.is_read
          ? 'bg-background border border-app-text/10 opacity-70'
          : 'bg-surface border-l-4 border-l-primary shadow-sm'
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-lg text-app-text">
              {submission.sender_name}
            </h3>
            {!submission.is_read && (
              <span className="bg-primary text-white text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">
                New
              </span>
            )}
          </div>
          <a
            href={`mailto:${submission.sender_email}`}
            className="text-primary text-sm hover:underline flex items-center gap-1.5"
          >
            <Mail className="size-3.5" />
            {submission.sender_email}
          </a>
        </div>
        <span className="text-app-text/40 text-xs font-body">
          {format(new Date(submission.created_at), 'MMM d, h:mm a')}
        </span>
      </div>
 
      <p className="font-body text-app-text/80 text-sm mt-3 whitespace-pre-wrap leading-relaxed">
        {submission.message}
      </p>
 
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-app-text/5">
        {!submission.is_read && (
          <Button
            variant="default"
            size="sm"
            onClick={handleMarkAsRead}
            className="h-8"
          >
            <CheckCircle className="size-3.5 mr-1" />
            Mark as read
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8"
        >
          <a href={`mailto:${submission.sender_email}`}>
            <Reply className="size-3.5 mr-1" />
            Reply
          </a>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          className="h-8 ml-auto"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
