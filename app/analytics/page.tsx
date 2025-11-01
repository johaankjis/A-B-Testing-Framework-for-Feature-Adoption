import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const experimentSuccessData = [
  { month: "Jul", successful: 8, failed: 2 },
  { month: "Aug", successful: 12, failed: 3 },
  { month: "Sep", successful: 15, failed: 2 },
  { month: "Oct", successful: 18, failed: 4 },
]

const liftDistribution = [
  { range: "0-5%", count: 12 },
  { range: "5-10%", count: 18 },
  { range: "10-15%", count: 8 },
  { range: "15%+", count: 5 },
]

const metricTypeData = [
  { name: "Activation", value: 35 },
  { name: "Conversion", value: 28 },
  { name: "Retention", value: 22 },
  { name: "Engagement", value: 15 },
]

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-2 text-muted-foreground">Platform-wide experimentation insights and trends</p>
        </div>

        <div className="space-y-6">
          {/* Experiment Success Rate */}
          <Card>
            <CardHeader>
              <CardTitle>Experiment Success Rate</CardTitle>
              <CardDescription>Successful vs. failed experiments over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={experimentSuccessData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="successful" fill="hsl(var(--chart-2))" name="Successful" />
                  <Bar dataKey="failed" fill="hsl(var(--muted-foreground))" name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Lift Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Lift Distribution</CardTitle>
                <CardDescription>Distribution of experiment lifts</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={liftDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--chart-1))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Metric Types */}
            <Card>
              <CardHeader>
                <CardTitle>Primary Metrics</CardTitle>
                <CardDescription>Distribution by metric type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={metricTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {metricTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Insights</CardTitle>
              <CardDescription>Key learnings from experimentation program</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border border-border p-4">
                  <div className="font-medium">Average Experiment Duration</div>
                  <div className="mt-1 text-2xl font-bold">14.2 days</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Most experiments reach statistical significance within 2 weeks
                  </p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="font-medium">Success Rate</div>
                  <div className="mt-1 text-2xl font-bold">81%</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    4 out of 5 experiments show positive or neutral results
                  </p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="font-medium">Cumulative Impact</div>
                  <div className="mt-1 text-2xl font-bold">$847K</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Total projected annual revenue impact from successful experiments
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
