import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Redirect to login page if no valid tokens or session
export async function middleware(request: NextRequest) {
  const protectedPaths = ["/home"];
  const unprotectedPaths = ["/login", "/signup"];
  const { pathname } = request.nextUrl;

  const idTokenFromCookie = request.cookies.get("idToken");
  const refreshTokenFromCookie = request.cookies.get("refreshToken");

  if (unprotectedPaths.some((path) => pathname.startsWith(path))) {
    if (idTokenFromCookie && refreshTokenFromCookie) {
      const homeUrl = new URL("/home", request.url);
      return NextResponse.redirect(homeUrl);
    }
  } else if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!idTokenFromCookie || !refreshTokenFromCookie) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/home", "/login", "/signup"],
};
