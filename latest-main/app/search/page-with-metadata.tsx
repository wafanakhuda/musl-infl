import { Metadata } from "next"
import { getPageMetadata } from "../../lib/seo"
import SearchPageContent from "./search-content"

export const metadata: Metadata = getPageMetadata("/search")

export default function SearchPage() {
  return <SearchPageContent />
}
