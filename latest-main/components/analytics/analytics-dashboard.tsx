"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { LoadingSpinner } from "../../components/ui/loading-spinner"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts"
import { Users, DollarSign, Eye, Target, ArrowUp, ArrowDown, Minus } from "lucide-react"

interface AnalyticsData {
  users: any
  campaigns: any
  revenue: any
  engagement: any
  traffic: any
  date_range: any
}

interface FunnelData {
  funnel_name: string
  steps: any[]
  overall_conversion_rate: number
  total_started: number
  total_completed: number
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [funnelData, setFunnelData] = useState<FunnelData[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState("30")
  const [selectedFunnel, setSelectedFunnel] = useState("creator_onboarding")

  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange])

  useEffect(() => {
    fetchFunnelData()
  }, [selectedFunnel])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics/dashboard?days=${dateRange}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Failed to fetch analytics data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFunnelData = async () => {
    try {
      const response = await fetch(`/api/analytics/funnel/${selectedFunnel}?days=${dateRange}`)
      const result = await response.json()
      setFunnelData([result])
    } catch (error) {
      console.error("Failed to fetch funnel data:", error)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <ArrowUp className="w-4 h-4 text-green-500" />
    if (current < previous) return <ArrowDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load analytics data</p>
        <Button onClick={fetchAnalyticsData} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400">Comprehensive insights for the last {dateRange} days</p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 days</SelectItem>
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="90">90 days</SelectItem>
            <SelectItem value="365">1 year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">{formatNumber(data.users.total_users)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(data.users.new_users, data.users.new_users * 0.8)}
                  <span className="text-sm text-gray-400">+{data.users.new_users} new</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(data.revenue.total_revenue)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(data.revenue.period_revenue, data.revenue.period_revenue * 0.8)}
                  <span className="text-sm text-gray-400">
                    {formatCurrency(data.revenue.period_revenue)} this period
                  </span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Campaigns</p>
                <p className="text-2xl font-bold text-white">{formatNumber(data.campaigns.active_campaigns)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {data.campaigns.completion_rate}% completion
                  </Badge>
                </div>
              </div>
              <Target className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Page Views</p>
                <p className="text-2xl font-bold text-white">{formatNumber(data.engagement.page_views)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-gray-400">{data.engagement.bounce_rate}% bounce rate</span>
                </div>
              </div>
              <Eye className="w-8 h-8 text-teal-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="funnels">Funnels</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.users.growth_chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: "#3B82F6", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Daily Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.revenue.daily_chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
                    />
                    <Bar dataKey="amount" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Types Distribution */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">User Types</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.users.user_types}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {data.users.user_types.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Traffic Sources */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.traffic.sources.slice(0, 5).map((source: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{source.source}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${(source.visits / data.traffic.sources[0].visits) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-white text-sm font-medium">{formatNumber(source.visits)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Pages */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Top Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.engagement.top_pages.slice(0, 5).map((page: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm truncate">{page.page || "/"}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-teal-500 h-2 rounded-full"
                            style={{
                              width: `${(page.views / data.engagement.top_pages[0].views) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-white text-sm font-medium">{formatNumber(page.views)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Activity Heatmap */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">User Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{formatNumber(data.users.total_users)}</div>
                    <div className="text-sm text-gray-400">Total Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{formatNumber(data.users.active_users)}</div>
                    <div className="text-sm text-gray-400">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{formatNumber(data.users.new_users)}</div>
                    <div className="text-sm text-gray-400">New Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">
                      {((data.users.active_users / data.users.total_users) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-400">Engagement Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Device Types */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Device Types</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.traffic.devices}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="visits"
                    >
                      {data.traffic.devices.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Campaign Categories */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Campaign Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.campaigns.categories}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="category" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Campaign Performance */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Completion Rate</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${data.campaigns.completion_rate}%` }}
                        />
                      </div>
                      <span className="text-white font-medium">{data.campaigns.completion_rate}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-400">
                        {formatNumber(data.campaigns.total_campaigns)}
                      </div>
                      <div className="text-sm text-gray-400">Total Campaigns</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-400">
                        {formatCurrency(data.campaigns.average_budget)}
                      </div>
                      <div className="text-sm text-gray-400">Avg Budget</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by User Type */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Revenue by User Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.revenue.by_user_type}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="type" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
                    />
                    <Bar dataKey="amount" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Metrics */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Revenue Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">
                      {formatCurrency(data.revenue.total_revenue)}
                    </div>
                    <div className="text-sm text-gray-400">Total Revenue</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-400">
                        {formatCurrency(data.revenue.period_revenue)}
                      </div>
                      <div className="text-sm text-gray-400">Period Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-400">
                        {formatCurrency(data.revenue.average_transaction)}
                      </div>
                      <div className="text-sm text-gray-400">Avg Transaction</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnels" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Conversion Funnels</h3>
            <Select value={selectedFunnel} onValueChange={setSelectedFunnel}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="creator_onboarding">Creator Onboarding</SelectItem>
                <SelectItem value="brand_onboarding">Brand Onboarding</SelectItem>
                <SelectItem value="campaign_creation">Campaign Creation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {funnelData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Funnel Visualization */}
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">
                    {funnelData[0].funnel_name.replace("_", " ").toUpperCase()} Funnel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <FunnelChart>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Funnel dataKey="users" data={funnelData[0].steps} isAnimationActive>
                        <LabelList position="center" fill="#fff" stroke="none" />
                      </Funnel>
                    </FunnelChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Funnel Metrics */}
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Funnel Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center pb-4 border-b border-gray-700">
                      <div className="text-2xl font-bold text-green-400">{funnelData[0].overall_conversion_rate}%</div>
                      <div className="text-sm text-gray-400">Overall Conversion Rate</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-400">
                          {formatNumber(funnelData[0].total_started)}
                        </div>
                        <div className="text-sm text-gray-400">Started</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-400">
                          {formatNumber(funnelData[0].total_completed)}
                        </div>
                        <div className="text-sm text-gray-400">Completed</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {funnelData[0].steps.map((step: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm capitalize">{step.step.replace("_", " ")}</span>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                step.conversion_rate > 70
                                  ? "default"
                                  : step.conversion_rate > 40
                                    ? "secondary"
                                    : "destructive"
                              }
                              className="text-xs"
                            >
                              {step.conversion_rate}%
                            </Badge>
                            <span className="text-white text-sm">{formatNumber(step.users)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
