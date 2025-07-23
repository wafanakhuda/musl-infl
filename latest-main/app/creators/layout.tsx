import { Metadata } from "next"
import { getPageMetadata } from "../../lib/seo"

export const metadata: Metadata = getPageMetadata("/creators")

export default function CreatorsLayout({ children }: { children: React.ReactNode }) {
  return children
}
