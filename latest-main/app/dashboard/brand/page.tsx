"use client"
export const dynamic = "force-dynamic"

import BrandDashboardLayout from "../../../components/layouts/brand-dashboard-layout"
import { BrandDashboard } from "../../../components/dashboard/brand-dashboard"

export default function BrandDashboardPage() {
  return (
    <BrandDashboardLayout>
      <BrandDashboard />
    </BrandDashboardLayout>
  )
}
