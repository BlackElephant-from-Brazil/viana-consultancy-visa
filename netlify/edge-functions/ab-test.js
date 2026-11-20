// A/B test of the home page: page A (index.html) against page B (/b/), 50/50, same URL "/".
//
// A first visit draws a variant and keeps it in the cookie "va_ab" for 30 days, so a visitor
// always sees the same page. Variant B is an internal rewrite to /b/index.html: the address
// bar, the gclid in the query string and the Google Ads final URL stay "/".
//
// Testing: "/?ab=a" or "/?ab=b" forces a variant and stores it. Every answer carries the
// header "X-AB-Variant".
//
// Ending the test: delete this file (and the cookie stops mattering), then keep the winner as
// index.html. Netlify Split Testing is not used: it cannot be added to projects since 2026-08
// and it turns Edge Functions off.

const COOKIE = 'va_ab';
const SHARE_B = 0.5;
const MAX_AGE = 30 * 24 * 60 * 60;

export default async (request, context) => {
  const url = new URL(request.url);
  const forced = url.searchParams.get('ab');
  let variant = forced === 'a' || forced === 'b' ? forced : context.cookies.get(COOKIE);
  const isNew = variant !== 'a' && variant !== 'b' || !!forced;
  if (variant !== 'a' && variant !== 'b') variant = Math.random() < SHARE_B ? 'b' : 'a';

  if (isNew) {
    context.cookies.set({
      name: COOKIE,
      value: variant,
      path: '/',
      maxAge: MAX_AGE,
      sameSite: 'Lax',
      secure: url.protocol === 'https:',
    });
  }

  const response = variant === 'b'
    ? await context.next(new Request(new URL('/b/index.html', url), request))
    : await context.next();

  // Same HTML on one URL for two audiences: browsers and caches must not mix them.
  const headers = new Headers(response.headers);
  headers.set('X-AB-Variant', variant.toUpperCase());
  headers.set('Cache-Control', 'private, no-cache');
  headers.set('Vary', 'Cookie');
  return new Response(response.body, { status: response.status, headers });
};

export const config = {
  path: '/',
  method: 'GET',
};
