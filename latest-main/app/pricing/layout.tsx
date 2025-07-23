import { Metadata } from "next"
import { getPageMetadata } from "../../lib/seo"

export const metadata: Metadata = getPageMetadata("/pricing")

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
