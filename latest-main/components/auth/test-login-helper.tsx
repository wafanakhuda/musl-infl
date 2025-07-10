"use client"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { TEST_CREDENTIALS } from "../../lib/env-fallback"
import { User, CreditCard, Shield } from "lucide-react"

interface TestLoginHelperProps {
  onSelectCredentials: (email: string, password: string) => void
}

export function TestLoginHelper({ onSelectCredentials }: TestLoginHelperProps) {
  const testAccounts = [
    {
      ...TEST_CREDENTIALS.CREATOR,
      icon: User,
      color: "bg-blue-500",
      description: "Test creator account with sample portfolio and campaigns",
    },
    {
      ...TEST_CREDENTIALS.BRAND,
      icon: CreditCard,
      color: "bg-green-500",
      description: "Test brand account with active campaigns and analytics",
    },
    {
      ...TEST_CREDENTIALS.ADMIN,
      icon: Shield,
      color: "bg-purple-500",
      description: "Admin account with full platform management access",
    },
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">🧪 Test Accounts</CardTitle>
        <CardDescription>Click any account below to auto-fill login credentials for testing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {testAccounts.map((account) => {
          const Icon = account.icon
          return (
            <div
              key={account.email}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => onSelectCredentials(account.email, account.password)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${account.color} text-white`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">{account.full_name}</div>
                  <div className="text-sm text-muted-foreground">{account.email}</div>
                  <div className="text-xs text-muted-foreground mt-1">{account.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {account.user_type}
                </Badge>
                <Button size="sm" variant="outline">
                  Use Account
                </Button>
              </div>
            </div>
          )
        })}

        <div className="mt-4 p-3 bg-muted rounded-lg">
          <h4 className="font-medium text-sm mb-2">🔑 Test Payment Cards (Stripe Test Mode)</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <strong>Success:</strong> 4242 4242 4242 4242
            </div>
            <div>
              <strong>Declined:</strong> 4000 0000 0000 0002
            </div>
            <div>
              <strong>Insufficient:</strong> 4000 0000 0000 9995
            </div>
            <div>
              <strong>Any CVC/Date:</strong> Use any future date
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
