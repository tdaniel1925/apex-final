'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings, Save } from 'lucide-react'

export default function SettingsPage() {
  const [matrixWidth, setMatrixWidth] = useState('5')
  const [matrixDepth, setMatrixDepth] = useState('9')
  const [retailCommission, setRetailCommission] = useState('25')

  const handleSave = async () => {
    // TODO: Implement API call
    console.log('Saving settings...')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Compensation Plan Settings</h1>
        <p className="text-muted-foreground">
          Configure matrix structure and commission rates
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Matrix Configuration
          </CardTitle>
          <CardDescription>Define the forced matrix structure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Matrix Width</Label>
              <Input
                type="number"
                value={matrixWidth}
                onChange={(e) => setMatrixWidth(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Number of positions per level
              </p>
            </div>
            <div>
              <Label>Matrix Depth</Label>
              <Input
                type="number"
                value={matrixDepth}
                onChange={(e) => setMatrixDepth(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maximum number of levels
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commission Rates</CardTitle>
          <CardDescription>Configure commission percentages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Retail Commission (%)</Label>
            <Input
              type="number"
              value={retailCommission}
              onChange={(e) => setRetailCommission(e.target.value)}
              className="mt-1"
              max="100"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Percentage of commissionable value paid to distributor
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
