"use client"

import CreatorDashboard from "../../../components/dashboard/creator-dashboard"
import CreatorDashboardLayout from "../../../components/layouts/creator-dashboard-layout"

export default function CreatorDashboardPage() {
  return (
    <CreatorDashboardLayout>
      <CreatorDashboard />
    </CreatorDashboardLayout>
  )
}
export const dynamic = "force-dynamic"