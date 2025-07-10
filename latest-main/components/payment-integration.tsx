"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { CreditCard, Wallet, Building2, Shield, CheckCircle, AlertCircle } from "lucide-react"

const paymentMethods = [
  {
    id: "stripe",
    name: "Credit/Debit Card",
    description: "Visa, Mastercard, American Express",
    icon: CreditCard,
    halalCompliant: true,
    processingFee: "2.9% + $0.30",
    features: ["Instant processing", "Buyer protection", "Global acceptance"],
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Pay with your PayPal account",
    icon: Wallet,
    halalCompliant: true,
    processingFee: "3.49% + $0.49",
    features: ["Buyer protection", "Easy refunds", "No card details needed"],
  },
  {
    id: "wise",
    name: "Wise (Islamic Banking)",
    description: "Sharia-compliant international transfers",
    icon: Building2,
    halalCompliant: true,
    processingFee: "0.5% - 2%",
    features: ["Sharia-compliant", "Low fees", "Multi-currency"],
  },
  {
    id: "crypto",
    name: "Cryptocurrency",
    description: "Bitcoin, Ethereum, USDC",
    icon: Shield,
    halalCompliant: false, // Note: Crypto compliance varies by Islamic scholar interpretation
    processingFee: "1% - 3%",
    features: ["Decentralized", "Low fees", "Global"],
  },
]

interface PaymentIntegrationProps {
  amount: number
  campaignTitle: string
  creatorName: string
  onPaymentComplete?: (paymentData: any) => void
}

export function PaymentIntegration({ amount, campaignTitle, creatorName, onPaymentComplete }: PaymentIntegrationProps) {
  const [selectedMethod, setSelectedMethod] = useState("stripe")
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  })

  const selectedPaymentMethod = paymentMethods.find((method) => method.id === selectedMethod)
  const processingFee = amount * 0.029 + 0.3 // Example calculation
  const totalAmount = amount + processingFee

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      // This would integrate with actual payment processors
      const paymentData = {
        method: selectedMethod,
        amount: totalAmount,
        campaign: campaignTitle,
        creator: creatorName,
        timestamp: new Date().toISOString(),
      }

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      onPaymentComplete?.(paymentData)
      console.log("Payment processed:", paymentData)
    } catch (error) {
      console.error("Payment failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Payment Summary */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Secure Halal Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Campaign</span>
            <span className="text-white font-medium">{campaignTitle}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Creator</span>
            <span className="text-white font-medium">{creatorName}</span>
          </div>
          <Separator className="bg-white/10" />
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Campaign Amount</span>
            <span className="text-white">${amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Processing Fee</span>
            <span className="text-white">${processingFee.toFixed(2)}</span>
          </div>
          <Separator className="bg-white/10" />
          <div className="flex justify-between items-center text-lg font-semibold">
            <span className="text-white">Total</span>
            <span className="text-gradient">${totalAmount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Choose Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="space-y-4">
            {paymentMethods.map((method) => {
              const Icon = method.icon
              return (
                <div
                  key={method.id}
                  className="flex items-start space-x-3 p-4 glass-card border border-white/10 rounded-lg"
                >
                  <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={method.id} className="cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5 text-purple-400" />
                        <span className="text-white font-medium">{method.name}</span>
                        {method.halalCompliant ? (
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Halal Compliant
                          </Badge>
                        ) : (
                          <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Consult Scholar
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{method.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Fee: {method.processingFee}</span>
                        <span>•</span>
                        <span>{method.features.join(" • ")}</span>
                      </div>
                    </Label>
                  </div>
                </div>
              )
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Details Form */}
      {selectedMethod === "stripe" && (
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Card Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName" className="text-white">
                Cardholder Name
              </Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => setCardDetails((prev) => ({ ...prev, name: e.target.value }))}
                className="border-white/20 bg-white/5 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-white">
                Card Number
              </Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => setCardDetails((prev) => ({ ...prev, number: e.target.value }))}
                className="border-white/20 bg-white/5 text-white placeholder-gray-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry" className="text-white">
                  Expiry Date
                </Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails((prev) => ({ ...prev, expiry: e.target.value }))}
                  className="border-white/20 bg-white/5 text-white placeholder-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc" className="text-white">
                  CVC
                </Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  value={cardDetails.cvc}
                  onChange={(e) => setCardDetails((prev) => ({ ...prev, cvc: e.target.value }))}
                  className="border-white/20 bg-white/5 text-white placeholder-gray-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="glass-card border-green-500/20 bg-green-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <h4 className="text-green-300 font-medium mb-1">Secure & Halal Payment</h4>
              <p className="text-green-200/80 text-sm">
                All payments are processed securely with 256-bit SSL encryption. We only work with Sharia-compliant
                payment processors to ensure your transactions align with Islamic principles.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Button */}
      <Button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 neon-glow py-3 text-lg"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing Payment...
          </div>
        ) : (
          `Pay $${totalAmount.toFixed(2)} Securely`
        )}
      </Button>
    </div>
  )
}
