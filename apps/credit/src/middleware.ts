import { defineMiddleware } from 'astro:middleware';
import { isAdmin } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;

  // All credit routes require admin auth
  const adminStatus = await isAdmin(cookies);

  if (!adminStatus) {
    // Redirect to main app's login
    const redirectTo = encodeURIComponent('/admin/credit' + url.pathname + url.search);
    return redirect(`/admin/login?redirect=${redirectTo}`);
  }

  return next();
});
