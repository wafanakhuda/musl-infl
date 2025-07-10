"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import Image from "next/image"

interface Campaign {
  id: string
  title: string
  description?: string
  brand?: string
  image_url?: string
  budget_min?: number
  budget_max?: number
}

interface CampaignCardProps {
  campaign: Campaign
  viewMode?: "grid" | "list"
  showFullDetails?: boolean
}

export function CampaignCard({
  campaign,
  viewMode = "grid",
  showFullDetails = false,
}: CampaignCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Image
            src={campaign.image_url || "/default-campaign.png"}
            alt={campaign.title}
            width={64}
            height={64}
            className="rounded"
          />
          <div>
            <CardTitle>{campaign.title}</CardTitle>
            {campaign.brand && <p className="text-sm text-muted-foreground">{campaign.brand}</p>}
            {(campaign.budget_min || campaign.budget_max) && (
              <Badge variant="secondary">
                Budget: ${campaign.budget_min} – ${campaign.budget_max}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      {showFullDetails && campaign.description && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{campaign.description}</p>
        </CardContent>
      )}
    </Card>
  )
}
