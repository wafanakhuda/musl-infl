"use client"

import { useState } from "react"
import { apiClient } from "../../lib/api-client"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { toast } from "sonner"

export function RegistrationTest() {
  const [testing, setTesting] = useState(false)

  const testCreatorRegistration = async () => {
    setTesting(true)
    try {
      const testData = {
        email: `test-creator-${Date.now()}@example.com`,
        password: "TestPassword123!",
        full_name: "Test Creator",
        user_type: "creator" as const,
        niche: "Fashion & Beauty",
      }

      await apiClient.register(testData)
      toast.success("Creator registration test passed!")
    } catch (error) {
      toast.error("Creator registration test failed")
      console.error(error)
    } finally {
      setTesting(false)
    }
  }

  const testBrandRegistration = async () => {
    setTesting(true)
    try {
      const testData = {
        email: `test-brand-${Date.now()}@example.com`,
        password: "TestPassword123!",
        full_name: "Test Brand Manager",
        user_type: "brand" as const,
        company_name: "Test Brand Company",
      }

      await apiClient.register(testData)
      toast.success("Brand registration test passed!")
    } catch (error) {
      toast.error("Brand registration test failed")
      console.error(error)
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Registration Testing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testCreatorRegistration} disabled={testing} className="w-full">
          Test Creator Registration
        </Button>
        <Button onClick={testBrandRegistration} disabled={testing} className="w-full">
          Test Brand Registration
        </Button>
      </CardContent>
    </Card>
  )
}