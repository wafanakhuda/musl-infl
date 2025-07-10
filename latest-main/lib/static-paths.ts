// Helper to generate static paths for build
export const STATIC_PATHS = {
  creators: ["fatima-lifestyle", "ahmed-tech", "sara-fashion", "omar-fitness", "layla-food"],
  campaigns: ["ramadan-special", "eid-collection", "halal-beauty", "modest-fashion", "islamic-books"],
}

export function generateCreatorPaths() {
  return STATIC_PATHS.creators.map((id) => ({ params: { id } }))
}

export function generateCampaignPaths() {
  return STATIC_PATHS.campaigns.map((id) => ({ params: { id } }))
}
