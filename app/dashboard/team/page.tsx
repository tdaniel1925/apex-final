'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  TrendingUp,
  DollarSign,
  Award,
  Target,
  ArrowUpRight,
  Loader2,
} from 'lucide-react'
import GenealogyTreeView from '@/components/genealogy/tree-view'

interface TeamStats {
  totalMembers: number
  activeMembers: number
  newThisMonth: number
  totalVolume: number
  monthlyGrowth: number
  rankDistribution: Record<string, number>
}

interface RankProgress {
  currentRank: string
  nextRank: string | null
  progress: number
  requirements: {
    personalSales: { current: number; required: number }
    activeLegs: { current: number; required: number }
    teamVolume: { current: number; required: number }
  }
}

export default function TeamPage() {
  const [stats, setStats] = useState<TeamStats | null>(null)
  const [rankProgress, setRankProgress] = useState<RankProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTeamData()
  }, [])

  const fetchTeamData = async () => {
    try {
      setIsLoading(true)

      // TODO: Replace with actual API calls
      await Promise.all([
        fetch('/api/team/stats'),
        fetch('/api/rank/progress'),
      ])

      // Mock data for development
      setStats({
        totalMembers: 45,
        activeMembers: 38,
        newThisMonth: 7,
        totalVolume: 125000,
        monthlyGrowth: 15.5,
        rankDistribution: {
          presidential: 0,
          diamond: 0,
          platinum: 1,
          gold: 3,
          silver: 8,
          bronze: 12,
          distributor: 21,
        },
      })

      setRankProgress({
        currentRank: 'gold',
        nextRank: 'platinum',
        progress: 65,
        requirements: {
          personalSales: { current: 7500, required: 10000 },
          activeLegs: { current: 5, required: 5 },
          teamVolume: { current: 32000, required: 50000 },
        },
      })
    } catch (error) {
      console.error('Error fetching team data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'presidential':
        return 'bg-purple-100 text-purple-700'
      case 'diamond':
        return 'bg-cyan-100 text-cyan-700'
      case 'platinum':
        return 'bg-gray-200 text-gray-700'
      case 'gold':
        return 'bg-yellow-100 text-yellow-700'
      case 'silver':
        return 'bg-gray-100 text-gray-600'
      case 'bronze':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-blue-100 text-blue-700'
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
        <h1 className="text-3xl font-bold mb-2">My Team</h1>
        <p className="text-muted-foreground">
          View your genealogy, team performance, and rank progress
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMembers || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {stats?.newThisMonth || 0} new this month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeMembers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.totalMembers
                ? Math.round(((stats?.activeMembers || 0) / stats.totalMembers) * 100)
                : 0}
              % of total team
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats?.totalVolume || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {stats?.monthlyGrowth || 0}% vs last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Rank</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {rankProgress?.currentRank || 'Distributor'}
            </div>
            <p className="text-xs text-muted-foreground">
              {rankProgress?.nextRank ? `${rankProgress.progress}% to ${rankProgress.nextRank}` : 'Highest rank'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rank Progress */}
      {rankProgress?.nextRank && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Rank Advancement Progress
            </CardTitle>
            <CardDescription>
              Requirements to reach {rankProgress.nextRank} rank
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Personal Sales */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Personal Sales</span>
                <span className="text-sm text-muted-foreground">
                  ${rankProgress.requirements.personalSales.current.toLocaleString()} / $
                  {rankProgress.requirements.personalSales.required.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (rankProgress.requirements.personalSales.current /
                        rankProgress.requirements.personalSales.required) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Active Legs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Active Legs</span>
                <span className="text-sm text-muted-foreground">
                  {rankProgress.requirements.activeLegs.current} /{' '}
                  {rankProgress.requirements.activeLegs.required}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (rankProgress.requirements.activeLegs.current /
                        rankProgress.requirements.activeLegs.required) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Team Volume */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Team Volume</span>
                <span className="text-sm text-muted-foreground">
                  ${rankProgress.requirements.teamVolume.current.toLocaleString()} / $
                  {rankProgress.requirements.teamVolume.required.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (rankProgress.requirements.teamVolume.current /
                        rankProgress.requirements.teamVolume.required) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Overall Progress</span>
                <span className="text-sm font-semibold">{rankProgress.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all"
                  style={{ width: `${rankProgress.progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rank Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Team Rank Distribution</CardTitle>
          <CardDescription>Number of team members at each rank</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats &&
              Object.entries(stats.rankDistribution)
                .sort(([, a], [, b]) => b - a)
                .map(([rank, count]) => (
                  <div key={rank} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Badge className={`w-24 justify-center ${getRankColor(rank)}`}>
                        {rank}
                      </Badge>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getRankColor(rank)}`}
                          style={{
                            width: `${((count / (stats.totalMembers || 1)) * 100).toFixed(1)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{count}</span>
                  </div>
                ))}
          </div>
        </CardContent>
      </Card>

      {/* Genealogy Tree */}
      <GenealogyTreeView userId="00000000-0000-0000-0000-000000000001" maxLevels={3} />
    </div>
  )
}
