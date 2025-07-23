import { Metadata } from "next"
import { getPageMetadata } from "../../lib/seo"

export const metadata: Metadata = getPageMetadata("/search")

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children
}
