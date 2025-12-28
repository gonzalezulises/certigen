import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    const errorUrl = new URL('/admin/auth', requestUrl.origin);
    errorUrl.searchParams.set('error', error);
    errorUrl.searchParams.set('error_description', errorDescription ?? 'Authentication error');
    return NextResponse.redirect(errorUrl);
  }

  if (code) {
    const supabase = await createClient();

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError);
      const errorUrl = new URL('/admin/auth', requestUrl.origin);
      errorUrl.searchParams.set('error', 'exchange_failed');
      errorUrl.searchParams.set('error_description', exchangeError.message);
      return NextResponse.redirect(errorUrl);
    }

    // Redirect to admin dashboard on success
    return NextResponse.redirect(new URL('/admin', requestUrl.origin));
  }

  // No code provided, redirect to login
  return NextResponse.redirect(new URL('/admin/auth', requestUrl.origin));
}
