'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, MapPin, Send, CheckCircle2, Loader2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { contactSchema, type ContactFormData } from '@/lib/validations/contact';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type About = Database['public']['Tables']['about']['Row'];

interface ContactSectionProps {
  profile: Profile | null;
  about: About | null;
  uid: string;
}
 
/**
 * A contact section with a form and contact details.
 * Uses React Hook Form + Zod for validation.
 */
export default function ContactSection({ profile, about, uid }: ContactSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });
 
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setError(null)
    setIsSuccess(false)
   
    try {
      const response = await fetch(`/api/contact/${uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
   
      const contentType = response.headers.get('content-type')
      const isJson = contentType && contentType.includes('application/json')
      const result = isJson ? await response.json() : null
   
      if (!response.ok) {
        setError(result?.error ?? 'Something went wrong. Please try again.')
        return
      }
   
      setIsSuccess(true)
      reset()
    } catch (err) {
      console.error('Contact submission error:', err)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }

  }
 
  if (isSuccess) {
    return (
      <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-(--transition-speed)">
        <div className="text-5xl mb-4">✉️</div>
        <h3 className="font-heading text-xl font-semibold text-app-text mb-2">
          Message sent!
        </h3>
        <p className="font-body text-app-text/60 mb-8">
          Thanks for reaching out. I&rsquo;ll get back to you soon.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="bg-primary text-white px-6 py-2 rounded-(--border-radius) font-body hover:opacity-90 transition-all duration-(--transition-speed)"
        >
          Send another message
        </button>
      </div>
    );
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
      {/* Left Side: Contact Info */}
      <div className="space-y-8">
        <div>
          <h3 className="font-heading font-bold text-2xl text-app-text mb-4">Let&rsquo;s Connect</h3>
          <p className="font-body text-app-text/70 leading-relaxed max-w-md">
            I&rsquo;m always open to new opportunities, collaborations, or just a friendly chat. 
            Feel free to reach out using the form or through my contact details here:
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-(--border-radius) text-primary">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="font-heading font-semibold text-app-text">Email</p>
              <a 
                href={`mailto:${profile?.email || ''}`}
                className="font-body text-primary hover:underline transition-all"
              >
                {profile?.email || 'N/A'}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-(--border-radius) text-primary">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="font-heading font-semibold text-app-text">Location</p>
              <p className="font-body text-app-text/70">{about?.location || 'Remote / Worldwide'}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-(--border-radius) text-primary">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-heading font-semibold text-app-text">Availability</p>
              <p className="font-body text-app-text/70">{about?.availability_status || 'Open to opportunities'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Contact Form */}
      <div className="bg-surface p-8 rounded-(--border-radius) shadow-sm border border-app-text/5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block font-heading font-medium text-sm text-app-text">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text/40" />
              <input
                id="name"
                {...register('name')}
                placeholder="John Doe"
                className={cn(
                  "w-full bg-background border border-app-text/10 rounded-(--border-radius) py-3 pl-10 pr-4 font-body text-app-text focus:outline-none focus:border-primary transition-all duration-(--transition-speed)",
                  errors.name && "border-red-500 focus:border-red-500"
                )}
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1 font-body">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block font-heading font-medium text-sm text-app-text">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text/40" />
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder="john@example.com"
                className={cn(
                  "w-full bg-background border border-app-text/10 rounded-(--border-radius) py-3 pl-10 pr-4 font-body text-app-text focus:outline-none focus:border-primary transition-all duration-(--transition-speed)",
                  errors.email && "border-red-500 focus:border-red-500"
                )}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1 font-body">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block font-heading font-medium text-sm text-app-text">
              Your Message
            </label>
            <textarea
              id="message"
              {...register('message')}
              rows={5}
              placeholder="Tell me about your project..."
              className={cn(
                "w-full bg-background border border-app-text/10 rounded-(--border-radius) p-4 font-body text-app-text focus:outline-none focus:border-primary transition-all duration-(--transition-speed) resize-none",
                errors.message && "border-red-500 focus:border-red-500"
              )}
            />
            {errors.message && <p className="text-red-500 text-xs mt-1 font-body">{errors.message.message}</p>}
          </div>

          {error && (
            <p className="text-red-500 text-sm font-body text-center mt-2 animate-in fade-in transition-all">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white font-heading font-bold py-4 rounded-(--border-radius) flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all duration-(--transition-speed) ease-(--transition-easing) disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

