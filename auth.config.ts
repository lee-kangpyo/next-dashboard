import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages:{
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const protectedPaths = ['/dashboard'];  // 보호된 경로 리스트
            const isProtected = protectedPaths.some(path => nextUrl.pathname.startsWith(path)); // 보호된 경로인지 확인

            // 로그인하지 않은 상태에서 보호된 경로에 접근하려고 하면 로그인 페이지로 리다이렉트
            if (isProtected && !isLoggedIn) {
                return false; // 로그인 페이지로 리다이렉트
            }

            // 로그인한 상태에서 로그인 페이지나 루트에 접근하려면 대시보드로 리다이렉트
            if (isLoggedIn && (nextUrl.pathname === '/login' || nextUrl.pathname === '/')) {
                return Response.redirect(new URL('/dashboard', nextUrl)); // 로그인한 사용자는 대시보드로 리다이렉트
            }

            return true;  // 기본적으로 접근 허용
        },
      },
      providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;