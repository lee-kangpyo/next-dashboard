import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
// 코딩한 authConfig 객체로 NextAuth.js 초기화 및 인증 속성 내보내기
export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

