import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, TrendingUp, Calendar, Download, Filter } from 'lucide-react'

export default function CommissionsPage() {
  // Mock data - replace with real data from database
  const stats = {
    totalEarnings: 12543.25,
    thisMonth: 3250.00,
    pending: 850.00,
    paid: 11693.25,
  }

  const commissions = [
    {
      id: '1',
      date: '2024-01-15',
      type: 'Retail Commission',
      amount: 125.00,
      status: 'paid',
      description: 'Product sale - Order #1234',
    },
    {
      id: '2',
      date: '2024-01-14',
      type: 'Matrix Bonus',
      amount: 250.00,
      status: 'paid',
      description: 'Level 2 bonus from team sales',
    },
    {
      id: '3',
      date: '2024-01-13',
      type: 'Rank Achievement',
      amount: 500.00,
      status: 'paid',
      description: 'Silver rank bonus',
    },
    {
      id: '4',
      date: '2024-01-12',
      type: 'Matching Bonus',
      amount: 175.00,
      status: 'pending',
      description: 'Matching bonus from downline',
    },
    {
      id: '5',
      date: '2024-01-11',
      type: 'Retail Commission',
      amount: 89.50,
      status: 'paid',
      description: 'Product sale - Order #1230',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Commissions</h1>
          <p className="text-muted-foreground">Track your earnings and payouts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Earnings
            </CardDescription>
            <CardTitle className="text-3xl">${stats.totalEarnings.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              This Month
            </CardDescription>
            <CardTitle className="text-3xl">${stats.thisMonth.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Pending
            </CardDescription>
            <CardTitle className="text-3xl">${stats.pending.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Paid Out
            </CardDescription>
            <CardTitle className="text-3xl">${stats.paid.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Commission History */}
      <Card>
        <CardHeader>
          <CardTitle>Commission History</CardTitle>
          <CardDescription>View all your commission transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commissions.map((commission) => (
              <div
                key={commission.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{commission.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {commission.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${commission.amount.toFixed(2)}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {new Date(commission.date).toLocaleDateString()}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        commission.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {commission.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Commission Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Breakdown</CardTitle>
          <CardDescription>Earnings by commission type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Retail Commissions</p>
                <p className="text-sm text-muted-foreground">Direct product sales</p>
              </div>
              <p className="text-lg font-bold">$4,250.00</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Matrix Bonuses</p>
                <p className="text-sm text-muted-foreground">Team volume bonuses</p>
              </div>
              <p className="text-lg font-bold">$3,500.00</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Rank Achievements</p>
                <p className="text-sm text-muted-foreground">Rank advancement bonuses</p>
              </div>
              <p className="text-lg font-bold">$2,500.00</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Matching Bonuses</p>
                <p className="text-sm text-muted-foreground">Downline matching</p>
              </div>
              <p className="text-lg font-bold">$2,293.25</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
