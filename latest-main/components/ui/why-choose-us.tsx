"use client"

import { DollarSign, CheckCircle, MessageCircle, Shield } from "lucide-react"
import { Button } from "./button"
import Link from "next/link"

export function WhyChooseUs() {
  const features = [
    {
      icon: <DollarSign className="w-12 h-12 text-pink-500" />,
      title: "No Upfront Cost",
      description: "Search influencers for free. No subscriptions, contracts, or hidden fees.",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-green-500" />,
      title: "Vetted Influencers",
      description: "Every influencer is vetted by us. Always receive high-quality, professional content.",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: <MessageCircle className="w-12 h-12 text-blue-500" />,
      title: "Instant Chat",
      description: "Instantly chat with influencers and stay in touch throughout the whole transaction.",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: <Shield className="w-12 h-12 text-purple-500" />,
      title: "Secure Purchases",
      description: "Your money is held safely until you approve the influencer's work.",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  ]

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm text-gray-600 mb-2">Receive your high-quality content from influencers directly through the platform.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.bgColor} ${feature.borderColor} border rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Campaign CTA Section */}
        <div className="mt-16 text-center bg-white rounded-2xl py-12 px-8 shadow-sm">
          <div className="max-w-2xl mx-auto">
            <span className="inline-block bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              Campaigns
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Post Campaigns and Have 250,000+ Influencers Come to You
            </h2>
            <p className="text-gray-600 mb-8">
              Create campaigns that attract top Muslim creators to collaborate with your brand
            </p>
            <div className="flex justify-center">
              <Link href="/campaigns/create">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  Post a Campaign
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}