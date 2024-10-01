import { NextRequest, NextResponse } from 'next/server';

import {
  PUBLIC_ROUTES,
  AUTHETICATED_REDIRECT_URL,
  NOT_AUTHETICATED_REDIRECT_URL,
} from '@/shared/constants';
import { validateSession } from './shared/lib/validate-session';

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isOnPublicRoute = PUBLIC_ROUTES.includes(path);

  const session = req.cookies.get('session')?.value;
  const isAuthenticated = await validateSession(session);

  if (!isOnPublicRoute && !isAuthenticated) {
    return NextResponse.redirect(
      new URL(NOT_AUTHETICATED_REDIRECT_URL, req.nextUrl),
    );
  }

  if (isOnPublicRoute && isAuthenticated) {
    return NextResponse.redirect(
      new URL(AUTHETICATED_REDIRECT_URL, req.nextUrl),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
