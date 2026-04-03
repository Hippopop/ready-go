'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth';
import { createClient } from '@/lib/supabase/client';
import { Rocket, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    router.push('/admin');
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
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
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your credentials to access the admin panel
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            {/* Server error */}
            {serverError && (
              <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive animate-in fade-in zoom-in-95 duration-300">
                {serverError}
              </div>
            )}

            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground ml-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  className="w-full h-11 rounded-xl border border-input bg-background/50 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-destructive ml-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Password
                  </label>
                  <Link href="#" className="text-xs text-primary hover:underline underline-offset-4">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full h-11 rounded-xl border border-input bg-background/50 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-xs text-destructive ml-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                 <Loader2 className="animate-spin mx-auto" size={20} />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign in
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              )}
            </button>
          </form>

          {/* Quick Login Hint */}
          <div className="mt-8 pt-8 border-t border-border/50 text-center">
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3">Demo Credentials</p>
            <code className="text-xs bg-muted px-2 py-1 rounded-md text-foreground">
              mostafijul1000@gmail.com / password
            </code>
          </div>
        </div>

        {/* Link to signup */}
        <p className="text-center text-sm text-muted-foreground">
          New to Ready-Go?{' '}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:underline underline-offset-4 transition-all"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
