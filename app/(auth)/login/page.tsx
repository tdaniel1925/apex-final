import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Sign in to your Apex Affinity account</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Login form will be implemented in Phase 2</p>
      </CardContent>
    </Card>
  )
}
