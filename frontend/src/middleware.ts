import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Redirect to login page if no valid tokens or session
export function middleware(request: NextRequest) {
  const protectedPaths = ["/home"];
  const { pathname } = request.nextUrl;

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const hasIdToken = request.cookies.get("idToken");
    const hasRefreshToken = request.cookies.get("refreshToken");
    const hasSession = request.cookies.get("connect.sid");

    console.log(hasIdToken, hasRefreshToken, hasSession);
    // If no idToken and no session, redirect to login
    if (!hasIdToken || !hasSession) {
      const loginUrl = new URL("/login", request.url);
      // return NextResponse.redirect(loginUrl);
    }
    // If no idToken but refreshToken exists, redirect to backend refresh endpoint
    if (!hasIdToken && hasRefreshToken) {
      console.log("Redirecting to backend for token refresh");
      // const backendRefreshUrl = new URL("http://localhost:3000/auth/refresh-token");
      // backendRefreshUrl.searchParams.set("redirect", pathname);
      // return NextResponse.redirect(backendRefreshUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/home"],
};
