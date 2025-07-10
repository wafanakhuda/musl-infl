"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react"

const plans = [
  {
    title: "Basic",
    price: "Free",
    features: [
      { text: "Search influencers on the marketplace", available: true },
      { text: "10% marketplace fee", available: true },
      { text: "Post campaigns", available: false },
      { text: "Track live analytics", available: false },
      { text: "Advanced filters for age, ethnicity, language & more", available: false },
      { text: "Chat & Negotiate with creators before hiring", available: false },
      { text: "Influencer engagement & audience reports", available: false },
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    title: "Pro",
    price: "$299/mo",
    features: [
      { text: "Everything in Basic", available: true },
      { text: "Post 1 campaign per month", available: true },
      { text: "Track analytics for 5 posts", available: true },
      { text: "Advanced filters for targeting", available: true },
      { text: "Chat & negotiate with creators", available: true },
      { text: "20 engagement & audience reports", available: true },
    ],
    cta: "Get Started",
    highlight: true,
  },
  {
    title: "Premium",
    price: "$399/mo",
    features: [
      { text: "Everything in Pro", available: true },
      { text: "Post unlimited campaigns", available: true },
      { text: "Track analytics for 15 posts", available: true },
      { text: "5% marketplace fee", available: true },
      { text: "Priority customer support", available: true },
      { text: "50 engagement & audience reports", available: true },
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    title: "Full Service",
    price: "We Do the Work",
    features: [
      { text: "End-to-end campaign setup", available: true },
      { text: "Influencer sourcing & outreach", available: true },
      { text: "Content delivery & approvals", available: true },
      { text: "Performance tracking & reports", available: true },
      { text: "Dedicated account manager", available: true },
    ],
    cta: "Inquire",
    highlight: false,
  },
]

const faqs = [
  {
    question: "What is the marketplace fee?",
    answer: "It’s a percentage charged per transaction between brands and influencers.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel anytime from your dashboard settings.",
  },
  {
    question: "How are creators vetted before joining?",
    answer: "We manually review all influencer profiles to ensure authenticity and quality.",
  },
  {
    question: "How fast will creators apply to my campaign?",
    answer: "Most campaigns start receiving applications within a few hours.",
  },
  {
    question: "What platforms do you support for analytics?",
    answer: "Currently Instagram, TikTok, and YouTube.",
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-white">
      <h1 className="text-4xl font-bold text-center mb-12">
        Supercharge Your Influencer Marketing
      </h1>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <div
            key={plan.title}
            className={`rounded-lg p-6 flex flex-col justify-between shadow-md transition ${
              plan.highlight
                ? "border-2 border-blue-500 bg-slate-800 shadow-lg scale-105"
                : "bg-slate-800 border border-slate-700"
            }`}
          >
            <div>
              <h2 className="text-2xl font-semibold mb-2">{plan.title}</h2>
              <p className="text-xl text-teal-400 mb-4">{plan.price}</p>
              <ul className="space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li
                    key={feature.text}
                    className={`flex items-start gap-2 ${
                      feature.available
                        ? "text-white"
                        : "line-through text-gray-400 opacity-50"
                    }`}
                  >
                    <CheckCircle
                      className={`w-4 h-4 mt-1 ${
                        feature.available ? "text-green-400" : "text-gray-500"
                      }`}
                    />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <Button
                className="w-full"
                variant={plan.highlight ? "default" : "outline"}
                onClick={() =>
                  router.push(
                    plan.cta === "Get Started"
                      ? "/auth/register/brand"
                      : "/contact"
                  )
                }
              >
                {plan.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center mt-16">
        <h2 className="text-xl font-semibold mb-2 text-slate-300">
          Still on the fence?
        </h2>
        <p className="text-sm mb-4 text-slate-400">
          Interested in our monthly plans? Speak to an expert.
        </p>
        <Button variant="outline" className="border-slate-600 text-white">
          Book a Demo
        </Button>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-2xl mx-auto mt-20">
        <h3 className="text-2xl font-bold text-center mb-6">FAQs</h3>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-slate-700 rounded-md">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center px-4 py-3 text-left"
              >
                <span className="font-medium">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4 text-sm text-slate-300">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
