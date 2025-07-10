"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { DollarSign, Users, Clock, CheckCircle, Eye, Calendar } from "lucide-react"
import type { Campaign } from "../../hooks/use-campaigns"
import { useAuth } from "../../hooks/use-auth"
import { CampaignApplicationModal } from "./campaign-application-modal"
import { formatDistanceToNow, format } from "date-fns"

interface CampaignCardProps {
  campaign: Campaign
  onApply?: (campaignId: string) => void
  onView?: (campaignId: string) => void
  showApplicationButton?: boolean
}

export function CampaignCard({ campaign, onApply, onView, showApplicationButton = true }: CampaignCardProps) {
  const { user } = useAuth()
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)

  const isCreator = user?.user_type === "creator"
  const isBrand = user?.user_type === "brand"
  const isOwner = isBrand && campaign.brand.id === user?.id
  const canApply = isCreator && !hasApplied && campaign.status === "active" && showApplicationButton

  const handleApplicationSuccess = () => {
    setHasApplied(true)
    setShowApplicationModal(false)
    onApply?.(campaign.id)
  }

  const formatBudget = (min?: number, max?: number) => {
    if (!min && !max) return "Budget TBD"
    if (min && max && min === max) return `$${min.toLocaleString()}`
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    if (min) return `From $${min.toLocaleString()}`
    if (max) return `Up to $${max.toLocaleString()}`
    return "Budget TBD"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <>
      <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {campaign.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={campaign.brand.avatar_url || "/placeholder.svg?height=24&width=24"}
                    alt={campaign.brand.full_name}
                  />
                  <AvatarFallback className="text-xs">
                    {campaign.brand.full_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground truncate">{campaign.brand.full_name}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
              <Badge variant="outline" className="text-xs">
                {campaign.category}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pb-4">
          <p className="text-sm text-muted-foreground line-clamp-3">{campaign.description}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span className="font-medium">{formatBudget(campaign.budget_min, campaign.budget_max)}</span>
            </div>

            {campaign.target_audience.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="truncate">{campaign.target_audience.slice(0, 2).join(", ")}</span>
                {campaign.target_audience.length > 2 && (
                  <span className="text-muted-foreground">+{campaign.target_audience.length - 2}</span>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-orange-600 flex-shrink-0" />
              <span>Posted {formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}</span>
            </div>

            {campaign.end_date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <span>Deadline: {format(new Date(campaign.end_date), "MMM d, yyyy")}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-purple-600 flex-shrink-0" />
              <span>{campaign.applications_count} applications</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {campaign.campaign_type.map((type) => (
              <Badge key={type} variant="outline" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>

          {campaign.deliverables.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Deliverables:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                {campaign.deliverables.slice(0, 3).map((deliverable, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                    <span className="line-clamp-1">{deliverable}</span>
                  </li>
                ))}
                {campaign.deliverables.length > 3 && (
                  <li className="text-xs text-muted-foreground ml-5">
                    +{campaign.deliverables.length - 3} more deliverables
                  </li>
                )}
              </ul>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-4 gap-2">
          {canApply ? (
            <Button onClick={() => setShowApplicationModal(true)} className="flex-1" size="sm">
              Apply Now
            </Button>
          ) : hasApplied ? (
            <Button disabled className="flex-1" size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Applied
            </Button>
          ) : isOwner ? (
            <Button variant="outline" onClick={() => onView?.(campaign.id)} className="flex-1" size="sm">
              Manage Campaign
            </Button>
          ) : !isCreator ? (
            <Button disabled className="flex-1" size="sm">
              Creator Only
            </Button>
          ) : campaign.status !== "active" ? (
            <Button disabled className="flex-1" size="sm">
              Not Available
            </Button>
          ) : (
            <Button variant="outline" onClick={() => onView?.(campaign.id)} className="flex-1" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          )}
        </CardFooter>
      </Card>

      {showApplicationModal && (
        <CampaignApplicationModal
          campaign={campaign}
          open={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </>
  )
}
