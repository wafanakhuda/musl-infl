"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { LoadingSpinner } from "../../components/ui/loading-spinner"
import { TrendingUp, Users, MapPin, Target } from "lucide-react"
import { useAnalytics } from "../../hooks/use-analytics"

export function AnalyticsCharts() {
  const { demographics, engagement, topCategories, loading, error } = useAnalytics()

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="glass-card border-white/10">
            <CardContent className="p-6 flex items-center justify-center">
              <LoadingSpinner />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="glass-card border-white/10">
        <CardContent className="p-6 text-center">
          <p className="text-red-400">Failed to load analytics data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Muslim Demographics by Region */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-400" />
            Muslim Audience by Region
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {demographics.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-400">No demographic data available</p>
            </div>
          ) : (
            demographics.map((item: any, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">{item.region}</span>
                  <span className="text-white font-medium">{item.percentage}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Age Group Engagement */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Age Group Engagement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {engagement.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-400">No engagement data available</p>
            </div>
          ) : (
            engagement.map((group: any, index) => (
              <div key={index} className="flex items-center justify-between p-3 glass-card border border-white/5">
                <div>
                  <span className="text-white font-medium">{group.group} years</span>
                  <div className="text-sm text-gray-400">{group.percentage}% of audience</div>
                </div>
                <Badge
                  className={`${
                    group.engagement === "Very High"
                      ? "bg-green-500/20 text-green-300 border-green-500/30"
                      : group.engagement === "High"
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                        : group.engagement === "Medium"
                          ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                          : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                  }`}
                >
                  {group.engagement}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Top Halal Categories */}
      <Card className="glass-card border-white/10 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-teal-400" />
            Top Halal Categories Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topCategories.length === 0 ? (
              <div className="col-span-full text-center py-4">
                <p className="text-gray-400">No category data available</p>
              </div>
            ) : (
              topCategories.map((category: any, index) => (
                <div key={index} className="glass-card p-4 border border-white/5">
                  <h4 className="font-medium text-white mb-2">{category.category}</h4>
                  <div className="text-2xl font-bold text-purple-300 mb-1">{category.campaigns}</div>
                  <div className="text-sm text-gray-400 mb-2">Active Campaigns</div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">{category.growth}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
