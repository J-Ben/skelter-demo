import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://demo.skelter.dev', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
  ];
}
