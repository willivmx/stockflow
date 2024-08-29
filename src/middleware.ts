import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  if (
    !cookies().has("next-auth.session-token") &&
    !cookies().has("__Secure-next-auth.session-token")
  ) {
    return NextResponse.redirect(new URL("/auth/signin", request.nextUrl));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|api/auth|auth|).*)",
    "/dashboard/:path*",
  ],
};
