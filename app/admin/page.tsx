'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  UserPlus,
  Package,
  AlertCircle,
  Clock,
  Loader2,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface DashboardMetrics {
  totalDistributors: number
  activeDistributors: number
  newDistributorsThisMonth: number
  totalOrders: number
  ordersThisMonth: number
  totalRevenue: number
  revenueThisMonth: number
  totalCommissionsPaid: number
  commissionsPending: number
  averageOrderValue: number
  pendingPhotoApprovals: number
  pendingTaxForms: number
}

interface ChartData {
  name: string
  revenue: number
  orders: number
  distributors: number
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)

      // TODO: Replace with actual API calls
      await Promise.all([
        fetch('/api/admin/metrics'),
        fetch('/api/admin/analytics'),
      ])

      // Mock data for development
      setMetrics({
        totalDistributors: 342,
        activeDistributors: 287,
        newDistributorsThisMonth: 23,
        totalOrders: 1456,
        ordersThisMonth: 145,
        totalRevenue: 456789.50,
        revenueThisMonth: 45678.90,
        totalCommissionsPaid: 89456.78,
        commissionsPending: 5234.56,
        averageOrderValue: 313.76,
        pendingPhotoApprovals: 8,
        pendingTaxForms: 12,
      })

      setChartData([
        { name: 'Jan', revenue: 35000, orders: 112, distributors: 250 },
        { name: 'Feb', revenue: 38000, orders: 121, distributors: 265 },
        { name: 'Mar', revenue: 42000, orders: 134, distributors: 278 },
        { name: 'Apr', revenue: 39000, orders: 124, distributors: 290 },
        { name: 'May', revenue: 44000, orders: 140, distributors: 305 },
        { name: 'Jun', revenue: 45679, orders: 145, distributors: 342 },
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of platform performance and key metrics
        </p>
      </div>

      {/* Pending Actions Alert */}
      {metrics && (metrics.pendingPhotoApprovals > 0 || metrics.pendingTaxForms > 0) && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900">Pending Approvals</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  {metrics.pendingPhotoApprovals > 0 && (
                    <span className="mr-4">
                      {metrics.pendingPhotoApprovals} photo{metrics.pendingPhotoApprovals !== 1 ? 's' : ''} awaiting approval
                    </span>
                  )}
                  {metrics.pendingTaxForms > 0 && (
                    <span>
                      {metrics.pendingTaxForms} W-9 form{metrics.pendingTaxForms !== 1 ? 's' : ''} awaiting review
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distributors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalDistributors || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">+{metrics?.newDistributorsThisMonth || 0}</span> this month
            </p>
            <p className="text-xs text-muted-foreground">
              {metrics?.activeDistributors || 0} active (
              {metrics?.totalDistributors
                ? Math.round(((metrics?.activeDistributors || 0) / metrics.totalDistributors) * 100)
                : 0}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(metrics?.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">
                +${(metrics?.revenueThisMonth || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span> this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">+{metrics?.ordersThisMonth || 0}</span> this month
            </p>
            <p className="text-xs text-muted-foreground">
              Avg: ${(metrics?.averageOrderValue || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commissions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(metrics?.totalCommissionsPaid || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-yellow-600 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                ${(metrics?.commissionsPending || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} pending
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  labelStyle={{ color: '#000' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Order Volume</CardTitle>
            <CardDescription>Monthly orders over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  labelStyle={{ color: '#000' }}
                />
                <Bar dataKey="orders" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distributor Growth */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Distributor Growth</CardTitle>
            <CardDescription>Total distributors over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="distributors"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Distributors</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.newDistributorsThisMonth || 0}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Photos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.pendingPhotoApprovals || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending W-9s</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.pendingTaxForms || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
