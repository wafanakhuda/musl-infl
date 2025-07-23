import { Metadata } from "next"
import { getPageMetadata } from "../../../../lib/seo"

export const metadata: Metadata = getPageMetadata("/auth/register/creator")

export default function CreatorRegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
