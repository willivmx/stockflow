import { withAuth } from "next-auth/middleware";

export default withAuth(
  async function middleware(request) {
    return;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|api/auth|auth).*)",
  ],
};