'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, MapPin, Send, CheckCircle2, Loader2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { contactSchema, type ContactFormValues } from '@/lib/validations/contact';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type About = Database['public']['Tables']['about']['Row'];

interface ContactSectionProps {
  profile: Profile | null;
  about: About | null;
}

/**
 * A contact section with a form and contact details.
 * Uses React Hook Form + Zod for validation.
 */
export default function ContactSection({ profile, about }: ContactSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Form submitted:', data);
      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-[var(--transition-speed)]">
        <CheckCircle2 className="w-16 h-16 text-primary mb-4" />
        <h3 className="font-heading font-bold text-2xl text-app-text mb-2">Message Sent!</h3>
        <p className="font-body text-app-text/70 mb-8">
          Thank you for reaching out. I&rsquo;ll get back to you as soon as possible.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="bg-primary text-white px-6 py-2 rounded-[var(--border-radius)] font-body hover:opacity-90 transition-all duration-[var(--transition-speed)]"
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
            <div className="p-3 bg-primary/10 rounded-[var(--border-radius)] text-primary">
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
            <div className="p-3 bg-primary/10 rounded-[var(--border-radius)] text-primary">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="font-heading font-semibold text-app-text">Location</p>
              <p className="font-body text-app-text/70">{about?.location || 'Remote / Worldwide'}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-[var(--border-radius)] text-primary">
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
      <div className="bg-surface p-8 rounded-[var(--border-radius)] shadow-sm border border-app-text/5">
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
                  "w-full bg-background border border-app-text/10 rounded-[var(--border-radius)] py-3 pl-10 pr-4 font-body text-app-text focus:outline-none focus:border-primary transition-all duration-[var(--transition-speed)]",
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
                  "w-full bg-background border border-app-text/10 rounded-[var(--border-radius)] py-3 pl-10 pr-4 font-body text-app-text focus:outline-none focus:border-primary transition-all duration-[var(--transition-speed)]",
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
                "w-full bg-background border border-app-text/10 rounded-[var(--border-radius)] p-4 font-body text-app-text focus:outline-none focus:border-primary transition-all duration-[var(--transition-speed)] resize-none",
                errors.message && "border-red-500 focus:border-red-500"
              )}
            />
            {errors.message && <p className="text-red-500 text-xs mt-1 font-body">{errors.message.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white font-heading font-bold py-4 rounded-[var(--border-radius)] flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all duration-[var(--transition-speed)] ease-[var(--transition-easing)] disabled:opacity-70"
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
