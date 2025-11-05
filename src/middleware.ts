import { defineMiddleware } from 'astro:middleware';
import { isAdmin } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;

  // Protect /admin routes (except login)
  if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') {
    const adminStatus = await isAdmin(cookies);

    if (!adminStatus) {
      const redirectTo = encodeURIComponent(url.pathname + url.search);
      return redirect(`/admin/login?redirect=${redirectTo}`);
    }
  }

  return next();
});
