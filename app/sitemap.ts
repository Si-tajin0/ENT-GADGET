import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return[
    {
      url: 'https://entgadgetbd.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://entgadgetbd.com/UI-Components/Shop',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    // পরে আমরা এখানে Single Product পেজগুলোর লিংকও অটোমেটিক জেনারেট করে দেবো
  ]
}