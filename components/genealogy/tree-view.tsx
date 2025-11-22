'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronDown,
  ChevronRight,
  User,
} from 'lucide-react'

interface TreeNode {
  id: string
  name: string
  email: string
  rank: string
  level: number
  position: number
  legPosition: number
  children: TreeNode[]
  personalSales: number
  teamVolume: number
  activeLegs: number
  status: 'active' | 'inactive'
}

interface GenealogyTreeViewProps {
  userId: string
  maxLevels?: number
}

export default function GenealogyTreeView({
  userId,
  maxLevels = 3,
}: GenealogyTreeViewProps) {
  const [treeData, setTreeData] = useState<TreeNode | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [zoom, setZoom] = useState(1)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([userId]))

  useEffect(() => {
    fetchTreeData()
  }, [userId, maxLevels])

  const fetchTreeData = async () => {
    try {
      setIsLoading(true)
      // TODO: Replace with actual API call
      const response = await fetch(`/api/genealogy/tree?userId=${userId}&levels=${maxLevels}`)

      if (!response.ok) {
        throw new Error('Failed to fetch tree data')
      }

      const data = await response.json()
      setTreeData(data)
    } catch (error) {
      console.error('Error fetching tree data:', error)
      // Mock data for development
      setTreeData(createMockTreeData(userId))
    } finally {
      setIsLoading(false)
    }
  }

  const createMockTreeData = (id: string): TreeNode => {
    return {
      id,
      name: 'Current User',
      email: 'user@example.com',
      rank: 'gold',
      level: 1,
      position: 1,
      legPosition: 1,
      personalSales: 5000,
      teamVolume: 25000,
      activeLegs: 5,
      status: 'active',
      children: [
        {
          id: '2',
          name: 'John Doe',
          email: 'john@example.com',
          rank: 'silver',
          level: 2,
          position: 2,
          legPosition: 1,
          personalSales: 2500,
          teamVolume: 10000,
          activeLegs: 3,
          status: 'active',
          children: [],
        },
        {
          id: '3',
          name: 'Jane Smith',
          email: 'jane@example.com',
          rank: 'bronze',
          level: 2,
          position: 3,
          legPosition: 2,
          personalSales: 1000,
          teamVolume: 5000,
          activeLegs: 2,
          status: 'active',
          children: [],
        },
        {
          id: '4',
          name: 'Bob Johnson',
          email: 'bob@example.com',
          rank: 'distributor',
          level: 2,
          position: 4,
          legPosition: 3,
          personalSales: 500,
          teamVolume: 2000,
          activeLegs: 1,
          status: 'inactive',
          children: [],
        },
      ],
    }
  }

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'presidential':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'diamond':
        return 'bg-cyan-100 text-cyan-700 border-cyan-300'
      case 'platinum':
        return 'bg-gray-200 text-gray-700 border-gray-400'
      case 'gold':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'silver':
        return 'bg-gray-100 text-gray-600 border-gray-300'
      case 'bronze':
        return 'bg-orange-100 text-orange-700 border-orange-300'
      default:
        return 'bg-blue-100 text-blue-700 border-blue-300'
    }
  }

  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children && node.children.length > 0
    const matchesSearch = searchTerm === '' ||
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.email.toLowerCase().includes(searchTerm.toLowerCase())

    if (!matchesSearch && searchTerm !== '') {
      return null
    }

    return (
      <div key={node.id} className="relative">
        <div
          className="flex items-start gap-2 mb-4"
          style={{ marginLeft: `${depth * 40}px` }}
        >
          {hasChildren && (
            <button
              onClick={() => toggleNode(node.id)}
              className="mt-2 hover:bg-gray-100 rounded p-1"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}

          <Card
            className={`flex-1 transition-all hover:shadow-md border-2 ${
              node.status === 'inactive' ? 'opacity-60' : ''
            } ${getRankColor(node.rank)}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{node.name}</h4>
                    <p className="text-xs text-gray-600">{node.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Level {node.level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Leg {node.legPosition}
                      </Badge>
                      <Badge
                        className={`text-xs ${
                          node.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {node.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <Badge className={`text-xs capitalize ${getRankColor(node.rank)}`}>
                    {node.rank}
                  </Badge>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="text-gray-600">
                      <span className="font-medium">Personal:</span> ${node.personalSales.toLocaleString()}
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Team:</span> ${node.teamVolume.toLocaleString()}
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Legs:</span> {node.activeLegs}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Genealogy Tree
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600 w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(1)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={fetchTreeData}>
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tree */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-gray-600">Loading genealogy tree...</p>
              </div>
            </div>
          ) : treeData ? (
            <div
              className="overflow-auto"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
              }}
            >
              {renderTreeNode(treeData)}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">
              No genealogy data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Rank Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries({
              presidential: 'Presidential',
              diamond: 'Diamond',
              platinum: 'Platinum',
              gold: 'Gold',
              silver: 'Silver',
              bronze: 'Bronze',
              distributor: 'Distributor',
            }).map(([key, label]) => (
              <Badge
                key={key}
                className={`justify-center ${getRankColor(key)}`}
              >
                {label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
