import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['en', 'vi'],
  defaultLocale: 'en'
});

export default function middleware(request) {
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/*|favicon.ico|images/books|icons|manifest).*)']
};