import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, TrendingUp, Users, Zap } from "lucide-react"
import { FlaskConical } from "lucide-react" // Added import for FlaskConical

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">A/B Testing Framework</h1>
          <p className="mt-2 text-muted-foreground">
            Measure the causal impact of product changes on user engagement and activation
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Experiments</CardTitle>
              <FlaskConical className="h-4 w-4 text-muted-foreground" /> {/* Updated to use FlaskConical */}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">54,231</div>
              <p className="text-xs text-muted-foreground">Across all experiments</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Lift</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+8.2%</div>
              <p className="text-xs text-muted-foreground">Activation rate improvement</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">40%</div>
              <p className="text-xs text-muted-foreground">Reduction in manual analysis</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Experiments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Experiments</CardTitle>
            <CardDescription>Latest A/B tests and their performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Onboarding Flow Redesign",
                  status: "running",
                  lift: "+12.4%",
                  pValue: "0.003",
                  users: "8,432",
                },
                {
                  name: "Feature Discovery Modal",
                  status: "completed",
                  lift: "+8.1%",
                  pValue: "0.021",
                  users: "12,891",
                },
                {
                  name: "Pricing Page CTA",
                  status: "running",
                  lift: "+5.7%",
                  pValue: "0.089",
                  users: "6,234",
                },
                {
                  name: "Email Notification Timing",
                  status: "completed",
                  lift: "+15.2%",
                  pValue: "0.001",
                  users: "15,432",
                },
              ].map((experiment, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{experiment.name}</h3>
                      <Badge variant={experiment.status === "running" ? "default" : "secondary"} className="text-xs">
                        {experiment.status}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{experiment.users} users</span>
                      <span>p-value: {experiment.pValue}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-chart-2">{experiment.lift}</div>
                      <div className="text-xs text-muted-foreground">Lift</div>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
