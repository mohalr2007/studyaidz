import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['ar', 'en', 'fr'];
const defaultLocale = 'ar';

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  
  try {
    return match(languages, locales, defaultLocale);
  } catch (e) {
    return defaultLocale;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Gérer les redirections de langue
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    // Redirect to the same path with the detected locale prefix
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }

  // Gérer la session Supabase
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase URL or Anon Key is missing. Skipping Supabase middleware logic.');
      return response;
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options) {
            request.cookies.set({ name, value, ...options });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options) {
            request.cookies.set({ name, value: '', ...options });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );

    await supabase.auth.getSession();
    return response;
  } catch (err) {
    console.error("Middleware crash prevented:", err);
    // If Supabase logic fails, still proceed with the request without session handling
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    // Also skip /api routes
    // The main goal is to only run this on actual pages
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
