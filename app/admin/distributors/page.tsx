'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, Filter, Eye, Ban, CheckCircle, Loader2, Download } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Distributor {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  status: string
  role: string
  rankId: string | null
  sponsorId: string | null
  enrollmentDate: Date
  replicatedSiteUrl: string | null
  createdAt: Date
}

export default function DistributorsPage() {
  const [distributors, setDistributors] = useState<Distributor[]>([])
  const [filteredDistributors, setFilteredDistributors] = useState<Distributor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [rankFilter, setRankFilter] = useState('all')
  const [selectedDistributor, setSelectedDistributor] = useState<Distributor | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  useEffect(() => {
    fetchDistributors()
  }, [])

  useEffect(() => {
    filterDistributors()
  }, [searchTerm, statusFilter, rankFilter, distributors])

  const fetchDistributors = async () => {
    try {
      setIsLoading(true)

      // TODO: Replace with actual API call
      await fetch('/api/admin/distributors')

      // Mock data for development
      const mockDistributors: Distributor[] = Array.from({ length: 25 }, (_, i) => ({
        id: `dist-${i + 1}`,
        firstName: `First${i + 1}`,
        lastName: `Last${i + 1}`,
        email: `distributor${i + 1}@example.com`,
        phone: `555-010${i.toString().padStart(2, '0')}`,
        status: i % 4 === 0 ? 'inactive' : i % 10 === 0 ? 'suspended' : 'active',
        role: 'distributor',
        rankId: ['distributor', 'bronze', 'silver', 'gold', 'platinum'][i % 5],
        sponsorId: i > 0 ? `dist-${Math.floor(i / 2) + 1}` : null,
        enrollmentDate: new Date(2024, i % 12, (i % 28) + 1),
        replicatedSiteUrl: `dist${i + 1}.apexmlm.com`,
        createdAt: new Date(2024, i % 12, (i % 28) + 1),
      }))

      setDistributors(mockDistributors)
    } catch (error) {
      console.error('Error fetching distributors:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterDistributors = () => {
    let filtered = [...distributors]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((d) => d.status === statusFilter)
    }

    // Rank filter
    if (rankFilter !== 'all') {
      filtered = filtered.filter((d) => d.rankId === rankFilter)
    }

    setFilteredDistributors(filtered)
  }

  const handleViewDetails = (distributor: Distributor) => {
    setSelectedDistributor(distributor)
    setDetailsDialogOpen(true)
  }

  const handleStatusChange = async (distributorId: string, newStatus: string) => {
    // TODO: Implement API call
    console.log('Changing status:', distributorId, newStatus)
    await fetchDistributors()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Active</Badge>
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>
      case 'suspended':
        return <Badge className="bg-red-100 text-red-700">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRankBadge = (rank: string | null) => {
    if (!rank) return <Badge variant="outline">None</Badge>

    const colors = {
      presidential: 'bg-purple-100 text-purple-700',
      diamond: 'bg-cyan-100 text-cyan-700',
      platinum: 'bg-gray-200 text-gray-700',
      gold: 'bg-yellow-100 text-yellow-700',
      silver: 'bg-gray-100 text-gray-600',
      bronze: 'bg-orange-100 text-orange-700',
      distributor: 'bg-blue-100 text-blue-700',
    }

    return (
      <Badge className={colors[rank as keyof typeof colors] || 'bg-gray-100'}>
        {rank.charAt(0).toUpperCase() + rank.slice(1)}
      </Badge>
    )
  }

  const exportToCSV = () => {
    // TODO: Implement CSV export
    console.log('Exporting to CSV...')
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Distributors</h1>
          <p className="text-muted-foreground">Manage distributor accounts and permissions</p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Rank</label>
              <Select value={rankFilter} onValueChange={setRankFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ranks</SelectItem>
                  <SelectItem value="presidential">Presidential</SelectItem>
                  <SelectItem value="diamond">Diamond</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="distributor">Distributor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredDistributors.length} Distributor{filteredDistributors.length !== 1 ? 's' : ''}
          </CardTitle>
          <CardDescription>
            {filteredDistributors.length === distributors.length
              ? 'Showing all distributors'
              : `Filtered from ${distributors.length} total`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDistributors.map((distributor) => (
                <TableRow key={distributor.id}>
                  <TableCell className="font-medium">
                    {distributor.firstName} {distributor.lastName}
                  </TableCell>
                  <TableCell>{distributor.email}</TableCell>
                  <TableCell>{getStatusBadge(distributor.status)}</TableCell>
                  <TableCell>{getRankBadge(distributor.rankId)}</TableCell>
                  <TableCell>{new Date(distributor.enrollmentDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(distributor)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {distributor.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStatusChange(distributor.id, 'suspended')}
                        >
                          <Ban className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                      {distributor.status === 'suspended' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStatusChange(distributor.id, 'active')}
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Distributor Details</DialogTitle>
            <DialogDescription>
              {selectedDistributor?.firstName} {selectedDistributor?.lastName}
            </DialogDescription>
          </DialogHeader>
          {selectedDistributor && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p>{selectedDistributor.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p>{selectedDistributor.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedDistributor.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Rank</label>
                  <div className="mt-1">{getRankBadge(selectedDistributor.rankId)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Enrolled</label>
                  <p>{new Date(selectedDistributor.enrollmentDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Replicated Site
                  </label>
                  <p>{selectedDistributor.replicatedSiteUrl || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
