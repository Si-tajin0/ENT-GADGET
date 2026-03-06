import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // অ্যাডমিন প্যানেল গুগলে দেখানোর দরকার নেই
    },
    sitemap: 'https://entgadgetbd.com/sitemap.xml',
  }
}