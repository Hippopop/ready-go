'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormValues } from '@/lib/validations/auth';
import { createClient } from '@/lib/supabase/client';
import { Rocket, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const supabase = createClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setServerError(null);

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.fullName },
      },
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    setEmailSent(true);
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-8 sm:p-10">
          {/* Brand */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2 group transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/60 text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <Rocket size={20} />
              </div>
              <span className="text-2xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Ready-Go
              </span>
            </Link>
            <h1 className="mt-6 text-xl font-semibold text-foreground">
              Create an account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Start building your professional portfolio today
            </p>
          </div>

          {/* Form / Success state */}
          {emailSent ? (
            <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">Check your inbox</h3>
                <p className="text-sm text-muted-foreground px-4">
                  We&apos;ve sent a verification link to your email. Please click the link to activate your portfolio account.
                </p>
              </div>
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                Return to login
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              {/* Server error */}
              {serverError && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive animate-in fade-in zoom-in-95 duration-300">
                  <p className="font-bold mb-1">Signup Error</p>
                  <p className="opacity-90">{serverError}</p>
                  {serverError.includes('confirmation') && (
                    <div className="mt-3 pt-3 border-t border-destructive/20">
                      <p className="text-xs font-medium">Tip: This might be a server SMTP issue. If you think your account was created, try <Link href="/login" className="underline">logging in directly</Link>.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Full name */}
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-sm font-medium text-foreground ml-1">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Jane Doe"
                  className="w-full h-11 rounded-xl border border-input bg-background/50 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  {...register('fullName')}
                />
                {errors.fullName && (
                  <p className="text-xs text-destructive ml-1">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-foreground ml-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-11 rounded-xl border border-input bg-background/50 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-destructive ml-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium text-foreground ml-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-11 rounded-xl border border-input bg-background/50 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-xs text-destructive ml-1">{errors.password.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 group mt-4"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin mx-auto" size={20} />
                ) : (
                  <span className="flex items-center justify-center gap-2 text-md">
                    Create account
                    <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Link to login */}
        {!emailSent && (
          <p className="text-center text-sm text-muted-foreground animate-in fade-in duration-700 delay-300">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
