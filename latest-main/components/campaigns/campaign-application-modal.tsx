"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Badge } from "../../components/ui/badge"
import { Separator } from "../../components/ui/separator"
import { DollarSign, FileText, Send, Clock, Target, CheckCircle } from "lucide-react"
import { type Campaign, useCampaigns } from "../../hooks/use-campaigns"
import { toast } from "sonner"

interface CampaignApplicationModalProps {
  campaign: Campaign
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

interface ApplicationData {
  proposal: string
  price: number
  timeline: string
  deliverables: string[]
}

export function CampaignApplicationModal({ campaign, open, onClose, onSuccess }: CampaignApplicationModalProps) {
  const { applyToCampaign } = useCampaigns()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ApplicationData>({
    proposal: "",
    price: campaign.budget_min || 0,
    timeline: "",
    deliverables: [],
  })
  const [newDeliverable, setNewDeliverable] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.proposal.trim()) {
      toast.error("Please write a proposal")
      return
    }

    if (formData.price <= 0) {
      toast.error("Please enter a valid price")
      return
    }

    if (!formData.timeline.trim()) {
      toast.error("Please specify a timeline")
      return
    }

    try {
      setLoading(true)
      await applyToCampaign(campaign.id, {
        proposal: formData.proposal.trim(),
        price: formData.price,
        timeline: formData.timeline.trim(),
        deliverables: formData.deliverables,
      })
      onSuccess()
      setFormData({ proposal: "", price: 0, timeline: "", deliverables: [] })
    } catch (error) {
      // Error handled in hook
    } finally {
      setLoading(false)
    }
  }

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      setFormData((prev) => ({
        ...prev,
        deliverables: [...prev.deliverables, newDeliverable.trim()],
      }))
      setNewDeliverable("")
    }
  }

  const removeDeliverable = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index),
    }))
  }

  const formatBudget = (min?: number, max?: number) => {
    if (!min && !max) return "Budget not specified"
    if (min && max && min === max) return `$${min.toLocaleString()}`
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    if (min) return `From $${min.toLocaleString()}`
    if (max) return `Up to $${max.toLocaleString()}`
    return "Budget not specified"
  }

  const getBudgetWarning = () => {
    if (campaign.budget_min && formData.price < campaign.budget_min) {
      return { type: "warning", message: `Below minimum budget of $${campaign.budget_min.toLocaleString()}` }
    }
    if (campaign.budget_max && formData.price > campaign.budget_max) {
      return { type: "error", message: `Above maximum budget of $${campaign.budget_max.toLocaleString()}` }
    }
    return null
  }

  const budgetWarning = getBudgetWarning()

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Apply to Campaign</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Campaign Summary */}
          <div className="bg-muted/50 p-4 rounded-lg border">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              {campaign.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{campaign.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span>{formatBudget(campaign.budget_min, campaign.budget_max)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>{campaign.deliverables.length} deliverables</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span>{campaign.applications_count} applications</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mt-3">
              {campaign.campaign_type.map((type) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Proposal */}
            <div className="space-y-2">
              <Label htmlFor="proposal" className="text-base font-medium">
                Your Proposal *
              </Label>
              <Textarea
                id="proposal"
                placeholder="Explain why you're the perfect fit for this campaign. Include your approach, relevant experience, and what makes you unique..."
                value={formData.proposal}
                onChange={(e) => setFormData({ ...formData, proposal: e.target.value })}
                className="min-h-[120px] resize-none"
                required
              />
              <p className="text-xs text-muted-foreground">
                💡 Tip: Be specific about your experience and how you'll deliver results
              </p>
            </div>

            {/* Price and Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-base font-medium">
                  Your Price (USD) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter your price"
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: Number.parseInt(e.target.value) || 0 })}
                  required
                />
                {budgetWarning && (
                  <p className={`text-xs ${budgetWarning.type === "error" ? "text-red-600" : "text-orange-600"}`}>
                    {budgetWarning.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline" className="text-base font-medium">
                  Delivery Timeline *
                </Label>
                <Input
                  id="timeline"
                  placeholder="e.g., 7 days, 2 weeks"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Custom Deliverables */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Additional Deliverables (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a custom deliverable..."
                  value={newDeliverable}
                  onChange={(e) => setNewDeliverable(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addDeliverable())}
                />
                <Button type="button" variant="outline" onClick={addDeliverable} disabled={!newDeliverable.trim()}>
                  Add
                </Button>
              </div>

              {formData.deliverables.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Your Additional Deliverables:</p>
                  <div className="space-y-1">
                    {formData.deliverables.map((deliverable, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted/30 p-2 rounded">
                        <span className="text-sm">{deliverable}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDeliverable(index)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Campaign Requirements */}
            {campaign.requirements && (
              <div className="space-y-2">
                <Label className="text-base font-medium">Campaign Requirements</Label>
                <div className="bg-muted/30 p-3 rounded-md border">
                  <p className="text-sm whitespace-pre-wrap">{campaign.requirements}</p>
                </div>
              </div>
            )}

            {/* Expected Deliverables */}
            {campaign.deliverables.length > 0 && (
              <div className="space-y-2">
                <Label className="text-base font-medium">Expected Deliverables</Label>
                <div className="bg-muted/30 p-3 rounded-md border">
                  <ul className="text-sm space-y-2">
                    {campaign.deliverables.map((deliverable, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Target Audience */}
            {campaign.target_audience.length > 0 && (
              <div className="space-y-2">
                <Label className="text-base font-medium">Target Audience</Label>
                <div className="flex flex-wrap gap-1">
                  {campaign.target_audience.map((audience, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {audience}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.proposal.trim() || !formData.timeline.trim() || formData.price <= 0}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
