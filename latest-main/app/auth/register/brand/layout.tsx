import { Metadata } from "next"
import { getPageMetadata } from "../../../../lib/seo"

export const metadata: Metadata = getPageMetadata("/auth/register/brand")

export default function BrandRegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
