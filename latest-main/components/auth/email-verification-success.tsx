"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export function EmailVerificationSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <Card className="w-full max-w-md glass-card border-white/10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Email Verified!</CardTitle>
          <p className="text-gray-400">
            Congratulations! Your email has been successfully verified. You can now access all features of the halal
            marketplace.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <h3 className="text-green-400 font-medium mb-2">What's Next?</h3>
            <ul className="text-green-300 text-sm space-y-1">
              <li>• Complete your profile</li>
              <li>• Browse campaigns or creators</li>
              <li>• Start collaborating</li>
            </ul>
          </div>

          <Link href="/auth/login" className="block">
            <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              Continue to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
