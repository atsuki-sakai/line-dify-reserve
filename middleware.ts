import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  console.log("pathname:", pathname);

  // // LIFFページへのアクセスは常に許可
  // if (pathname.startsWith('/liff')) {
  //   return NextResponse.next();
  // }

  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // console.log("token:", token);

  // // パスの判定
  // const isAdminAuthPage = pathname.startsWith('/admin/login') || pathname.startsWith('/admin/signup');
  // const isAdminPage = pathname.startsWith('/admin');
  // const isSalonAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  // const isSalonPage = pathname.startsWith('/dashboard');

  // // 管理者ページの処理
  // if (isAdminPage) {
  //   if (!token && !isAdminAuthPage) {
  //     return NextResponse.redirect(new URL('/admin/login', req.url));
  //   }
  //   if (token && isAdminAuthPage) {
  //     return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  //   }
  // }

  // // サロンページの処理
  // if (isSalonPage) {
  //   if (!token) {
  //     return NextResponse.redirect(new URL('/login', req.url));
  //   }
  // }

  // if (token && isSalonAuthPage) {
  //   return NextResponse.redirect(new URL('/dashboard', req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/liff/:path*'  // LIFFページのパスのみ
  ],
};
