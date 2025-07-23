import { MetadataRoute } from 'next'
import { generateFullSitemap } from '../lib/sitemap'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return await generateFullSitemap()
}
