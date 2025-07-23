import { Metadata } from "next"
import { getPageMetadata } from "../../../lib/seo"

export const metadata: Metadata = getPageMetadata("/auth/login")

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
