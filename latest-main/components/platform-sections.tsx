"use client"

import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Instagram, Users, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const instagramCreators = [
  {
    id: 5,
    name: "Khadija Ali",
    username: "@muslimparenting",
    avatar: "/placeholder.svg?height=200&width=200",
    followers: "98K",
    rating: 4.8,
    price: 180,
    category: "Parenting",
  },
  {
    id: 6,
    name: "Yusuf Rahman",
    username: "@islamiceducation",
    avatar: "/placeholder.svg?height=200&width=200",
    followers: "203K",
    rating: 4.9,
    price: 250,
    category: "Education",
  },
  {
    id: 7,
    name: "Mariam Boutique",
    username: "@modestfashion",
    avatar: "/placeholder.svg?height=200&width=200",
    followers: "145K",
    rating: 4.7,
    price: 220,
    category: "Fashion",
  },
  {
    id: 8,
    name: "Hassan Travel",
    username: "@halaltravel",
    avatar: "/placeholder.svg?height=200&width=200",
    followers: "87K",
    rating: 4.8,
    price: 160,
    category: "Travel",
  },
]

export function PlatformSections() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <Instagram className="w-6 h-6 mr-2" />
              Instagram
            </h2>
            <p className="text-gray-600">Hire Instagram influencers</p>
          </div>
          <Link href="/search?platform=Instagram">
            <Button variant="outline">See All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {instagramCreators.map((creator) => (
            <Link key={creator.id} href={`/creators/${creator.id}`}>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative">
                  <Image
                    src={creator.avatar || "/placeholder.svg"}
                    alt={creator.name}
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover"
                  />

                  <div className="absolute bottom-3 left-3 bg-white rounded-full p-2 shadow-sm">
                    <Instagram className="w-4 h-4" />
                  </div>

                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {creator.followers}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{creator.name}</h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{creator.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-2">{creator.username}</p>
                  <p className="text-sm text-gray-600 mb-3">{creator.category}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">${creator.price}</span>
                    <Badge variant="secondary" className="bg-green-50 text-green-700">
                      ✓ Halal
                    </Badge>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
