import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  console.log("pathname:", pathname);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("token:", token);

  const isAdmin = token?.role === "admin";
  const isSalon = token?.role === "salon";
  const isAuth = !!token;
  console.log("isAdmin:", isAdmin);
  console.log("isSalon:", isSalon);
  console.log("isAuth:", isAuth);

  const isAdminLoginPage = pathname.startsWith("/admin/login");
  const isAdminSignupPage = pathname.startsWith("/admin/signup");
  const isSalonLoginPage = pathname.startsWith("/auth/login");
  const isSalonSignupPage = pathname.startsWith("/auth/signup");
  console.log("isAdminLoginPage:", isAdminLoginPage);
  console.log("isAdminSignupPage:", isAdminSignupPage);
  console.log("isSalonLoginPage:", isSalonLoginPage);
  console.log("isSalonSignupPage:", isSalonSignupPage);

  const adminRoutes = pathname.startsWith("/admin");
  const salonRoutes = pathname.startsWith("/dashboard");
  console.log("adminRoutes:", adminRoutes);
  console.log("salonRoutes:", salonRoutes);

  if (isAdminLoginPage || isAdminSignupPage) {
    console.log("isAdminLoginPage || isAdminSignupPage");
    if (isAdmin) {
      console.log("isAdmin");
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    console.log("NextResponse.next()");
    return NextResponse.next();
  }

  if (isSalonLoginPage || isSalonSignupPage) {
    console.log("isSalonLoginPage || isSalonSignupPage");
    if (isSalon) {
      console.log("isSalon");
      return NextResponse.redirect(new URL(`/dashboard/${token.id}`, req.url));
    }
    console.log("NextResponse.next()");
    return NextResponse.next();
  }

  if (!isAuth && adminRoutes) {
    console.log("!isAuth && adminRoutes");
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (!isAuth && salonRoutes) {
    console.log("!isAuth && salonRoutes");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isAdmin && adminRoutes) {
    console.log("isAdmin && adminRoutes");
    return NextResponse.next();
  }

  if (isSalon && salonRoutes) {
    console.log("isSalon && salonRoutes");
    return NextResponse.next();
  }

  console.log("NextResponse.next()");
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/auth/login',
    '/auth/signup',
  ],
};
