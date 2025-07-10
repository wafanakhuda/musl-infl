export interface CreatorFormData {
  full_name: string
  email: string
  password: string
  location: string
  title: string
  bio: string
  social_links: { platform: string; url: string }[]
  gender: string
  content_type: string[]
  avatar: string | File | null              // ✅ Accepts image string or uploaded File
  cover_photos: (string | File | null)[]   // ✅ Same here
  packages: { title: string; description: string; price: string }[]
  otp: string
}


export interface BrandFormData {
  full_name: string
  email: string
  password: string
  role: "brand" | "agency"
  industry: string
  categories: string[]
  platforms: string[]
  content_quantity: string[]
  avatar: string
  cover_photos: string[]
  otp: string
}