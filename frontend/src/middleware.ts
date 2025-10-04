import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshToken } from "./utils/api";

// Redirect to login page if no valid tokens or session
export async function middleware(request: NextRequest) {
  const protectedPaths = ["/home"];
  const { pathname } = request.nextUrl;

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const idTokenFromCookie = request.cookies.get("idToken");
    const refreshTokenFromCookie = request.cookies.get("refreshToken");

    if (!idTokenFromCookie || !refreshTokenFromCookie) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // if (idTokenFromCookie && refreshTokenFromCookie) {
    //   console.log("Attempting to refresh token...");
    //   const response = await refreshToken({
    //     refreshToken: refreshTokenFromCookie.value,
    //   });

    //   return NextResponse.next();
    // } else {
    //   const loginUrl = new URL("/login", request.url);
    //   return NextResponse.redirect(loginUrl);
    // }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/home"],
};
