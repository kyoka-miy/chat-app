import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CONSTANTS } from './utils/constants';

// Redirect to login page if no valid tokens or session
export async function middleware(request: NextRequest) {
  const protectedPaths = [CONSTANTS.LINK.HOME];
  const unprotectedPaths = [CONSTANTS.LINK.LOGIN, CONSTANTS.LINK.SIGN_UP];
  const { pathname } = request.nextUrl;

  const idTokenFromCookie = request.cookies.get('idToken');
  const refreshTokenFromCookie = request.cookies.get('refreshToken');
  const session = request.cookies.get('connect.sid');

  // If the user is trying to access an unprotected path (login or signup),
  // and they have valid tokens, redirect them to the home page.
  if (unprotectedPaths.some((path) => pathname.startsWith(path))) {
    if (idTokenFromCookie && refreshTokenFromCookie && session) {
      const homeUrl = new URL(CONSTANTS.LINK.HOME, request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  // If the user is trying to access a protected path (home),
  // and they do not have valid refresh token, redirect them to the login page.
  // if (protectedPaths.some((path) => pathname.startsWith(path))) {
  //   console.log("redirecting check:");
  //   console.log(idTokenFromCookie, refreshTokenFromCookie, session);
  //   if (!refreshTokenFromCookie || !session) {
  //     const loginUrl = new URL(CONSTANTS.LINK.LOGIN, request.url);
  //     return NextResponse.redirect(loginUrl);
  //   }
  // }
  return NextResponse.next();
}

export const config = {
  matcher: [CONSTANTS.LINK.HOME, CONSTANTS.LINK.LOGIN, CONSTANTS.LINK.SIGN_UP],
};
