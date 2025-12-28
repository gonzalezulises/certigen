'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { OAuthButtons, OAuthDivider } from '@/components/auth';
import { Award, Mail, Lock, LogIn, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminAuthPage() {
  const t = useTranslations();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle OAuth errors from URL params
  useEffect(() => {
    const errorParam = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (errorParam) {
      setError(errorDescription || t('auth.oauth.errors.generic'));
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      url.searchParams.delete('error_description');
      window.history.replaceState({}, '', url);
    }
  }, [searchParams, t]);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/admin');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError(t('auth.errors.passwordMismatch'));
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t('auth.errors.weakPassword'));
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message === 'Invalid login credentials'
            ? t('auth.errors.invalidCredentials')
            : error.message);
        } else {
          router.push('/admin');
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          setSuccess(t('auth.register.success'));
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        }
      }
    } catch {
      setError(t('auth.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center" role="status" aria-label={t('common.loading')}>
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
            <Award className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLogin ? t('auth.login.title') : t('auth.register.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {isLogin ? t('auth.login.subtitle') : t('auth.register.subtitle')}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Toggle Tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6" role="tablist">
            <button
              onClick={() => { setIsLogin(true); setError(null); setSuccess(null); }}
              role="tab"
              aria-selected={isLogin}
              aria-controls="login-form"
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isLogin
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <LogIn className="h-4 w-4 inline mr-2" aria-hidden="true" />
              {t('auth.login.title')}
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(null); setSuccess(null); }}
              role="tab"
              aria-selected={!isLogin}
              aria-controls="register-form"
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isLogin
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <UserPlus className="h-4 w-4 inline mr-2" aria-hidden="true" />
              {t('auth.register.title')}
            </button>
          </div>

          {/* OAuth Buttons */}
          <OAuthButtons disabled={loading} />

          {/* Divider */}
          <OAuthDivider />

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2" role="alert">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-2" role="status">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" id={isLogin ? 'login-form' : 'register-form'}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.login.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-required="true"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t('auth.login.emailPlaceholder')}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.login.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-required="true"
                  minLength={6}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t('auth.login.passwordPlaceholder')}
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('auth.register.confirmPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    aria-required="true"
                    minLength={6}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder={t('auth.register.confirmPasswordPlaceholder')}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                  {t('common.loading')}
                </>
              ) : (
                <>
                  {isLogin ? <LogIn className="h-5 w-5" aria-hidden="true" /> : <UserPlus className="h-5 w-5" aria-hidden="true" />}
                  {isLogin ? t('auth.login.submit') : t('auth.register.submit')}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                {t('auth.anonymous.title')}
              </span>
            </div>
          </div>

          {/* Anonymous Access */}
          <Link
            href="/generate"
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Award className="h-5 w-5" aria-hidden="true" />
            {t('auth.anonymous.button')}
          </Link>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
            {t('auth.anonymous.hint')}
          </p>
        </div>
      </div>
    </div>
  );
}
