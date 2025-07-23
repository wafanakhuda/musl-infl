import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPageMetadata, generatePersonSchema } from "../../../lib/seo"
import PublicProfilePageContent from "./profile-content"

// This would be your API call to get creator data
async function getCreator(id: string) {
  try {
    // Replace with actual API call
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/creators/${id}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error("Error fetching creator:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const creator = await getCreator(params.id)
  
  if (!creator) {
    return getPageMetadata("/profile", { name: "Creator Not Found" })
  }
  
  return getPageMetadata("/profile", {
    name: creator.full_name || creator.name,
    avatar: creator.avatar_url,
    bio: creator.bio,
  })
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const creator = await getCreator(params.id)
  
  if (!creator) {
    notFound()
  }
  
  // Generate structured data for the creator
  const personSchema = generatePersonSchema(creator)
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <PublicProfilePageContent creator={creator} />
    </>
  )
}
