"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  FileText,
  Pause,
  StopCircle,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { calculateZTest, formatPValue, getSignificanceBadge } from "@/lib/stats-utils"

// Mock experiment data
const experimentData = {
  id: "exp-001",
  name: "Onboarding Flow Redesign",
  description: "Testing new step-by-step onboarding vs. single-page flow",
  status: "running",
  startDate: "2025-10-15",
  duration: 14,
  primaryMetric: "Activation Rate",
  variants: [
    {
      id: "control",
      name: "Control",
      users: 4216,
      conversions: 358,
      conversionRate: 8.49,
      avgTimeToConvert: 145,
      bounceRate: 42.3,
    },
    {
      id: "treatment-a",
      name: "Treatment A",
      users: 4216,
      conversions: 425,
      conversionRate: 10.08,
      avgTimeToConvert: 132,
      bounceRate: 38.7,
    },
  ],
  guardrailMetrics: [
    { name: "Churn Rate", control: 4.2, treatment: 4.1, threshold: 5.0, status: "pass" },
    { name: "Error Rate", control: 0.8, treatment: 0.9, threshold: 2.0, status: "pass" },
    { name: "Page Load Time", control: 1.2, treatment: 1.3, threshold: 2.0, status: "pass" },
  ],
  timeSeriesData: [
    { date: "Oct 15", control: 8.2, treatment: 9.8 },
    { date: "Oct 16", control: 8.5, treatment: 10.1 },
    { date: "Oct 17", control: 8.3, treatment: 9.9 },
    { date: "Oct 18", control: 8.6, treatment: 10.3 },
    { date: "Oct 19", control: 8.4, treatment: 10.0 },
    { date: "Oct 20", control: 8.7, treatment: 10.2 },
    { date: "Oct 21", control: 8.5, treatment: 10.1 },
  ],
}

export default function ExperimentDetailPage() {
  const control = experimentData.variants[0]
  const treatment = experimentData.variants[1]

  // Calculate statistical test
  const stats = calculateZTest(control.conversions, control.users, treatment.conversions, treatment.users)

  const significanceBadge = getSignificanceBadge(stats.pValue)

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{experimentData.name}</h1>
                <Badge variant="default">{experimentData.status}</Badge>
                <Badge variant={significanceBadge.variant}>{significanceBadge.label}</Badge>
              </div>
              <p className="mt-2 text-muted-foreground">{experimentData.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
              <Button variant="outline" size="sm">
                <StopCircle className="mr-2 h-4 w-4" />
                Stop
              </Button>
              <Button size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(control.users + treatment.users).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{control.users.toLocaleString()} per variant</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lift</CardTitle>
              {stats.liftPercent > 0 ? (
                <TrendingUp className="h-4 w-4 text-chart-2" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.liftPercent > 0 ? "text-chart-2" : "text-destructive"}`}>
                {stats.liftPercent > 0 ? "+" : ""}
                {stats.liftPercent}%
              </div>
              <p className="text-xs text-muted-foreground">{experimentData.primaryMetric}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">P-Value</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPValue(stats.pValue)}</div>
              <p className="text-xs text-muted-foreground">
                {stats.isSignificant ? "Statistically significant" : "Not significant"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Days Running</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">of {experimentData.duration} days</p>
              <Progress value={50} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="results" className="space-y-6">
          <TabsList>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="analysis">Statistical Analysis</TabsTrigger>
            <TabsTrigger value="guardrails">Guardrails</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {/* Variant Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Variant Performance</CardTitle>
                <CardDescription>Primary metric comparison across variants</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {experimentData.variants.map((variant) => (
                    <div key={variant.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{variant.name}</span>
                          {variant.id === "treatment-a" && stats.isSignificant && (
                            <Badge variant="default" className="text-xs">
                              Winner
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{variant.conversionRate}%</div>
                          <div className="text-xs text-muted-foreground">
                            {variant.conversions} / {variant.users} users
                          </div>
                        </div>
                      </div>
                      <Progress value={variant.conversionRate * 10} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Series Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate Over Time</CardTitle>
                <CardDescription>Daily conversion rates by variant</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={experimentData.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      label={{ value: "Conversion Rate (%)", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="control"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={2}
                      name="Control"
                    />
                    <Line
                      type="monotone"
                      dataKey="treatment"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      name="Treatment A"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Secondary Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Secondary Metrics</CardTitle>
                <CardDescription>Additional performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-border p-4">
                      <div className="text-sm font-medium text-muted-foreground">Avg Time to Convert</div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{treatment.avgTimeToConvert}s</span>
                        <span className="text-sm text-chart-2">-13s vs control</span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <div className="text-sm font-medium text-muted-foreground">Bounce Rate</div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{treatment.bounceRate}%</span>
                        <span className="text-sm text-chart-2">-3.6% vs control</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistical Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistical Test Results</CardTitle>
                <CardDescription>Two-proportion z-test analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Test Type</div>
                      <div className="text-lg font-semibold">Z-Test (Two-Proportion)</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Confidence Level</div>
                      <div className="text-lg font-semibold">{stats.confidenceLevel}%</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">Z-Score</div>
                      <div className="text-lg font-semibold">{stats.zScore}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground">P-Value</div>
                      <div className="text-lg font-semibold">{formatPValue(stats.pValue)}</div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-accent p-4">
                    <div className="flex items-start gap-3">
                      {stats.isSignificant ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-chart-2" />
                      ) : (
                        <AlertCircle className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <div className="font-medium">
                          {stats.isSignificant ? "Statistically Significant Result" : "Not Yet Significant"}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {stats.isSignificant
                            ? `The treatment shows a ${stats.liftPercent}% lift with p < 0.05, indicating a real effect.`
                            : `Continue running the experiment to gather more data for conclusive results.`}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Confidence Intervals (95%)</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Control</span>
                          <span className="font-mono">
                            [{stats.controlCi[0]}%, {stats.controlCi[1]}%]
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-muted-foreground"
                            style={{ width: `${stats.controlRate}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Treatment A</span>
                          <span className="font-mono">
                            [{stats.treatmentCi[0]}%, {stats.treatmentCi[1]}%]
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-chart-1"
                            style={{ width: `${stats.treatmentRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guardrails Tab */}
          <TabsContent value="guardrails" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Guardrail Metrics</CardTitle>
                <CardDescription>Ensuring no negative side effects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {experimentData.guardrailMetrics.map((metric, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="flex items-center gap-3">
                        {metric.status === "pass" ? (
                          <CheckCircle2 className="h-5 w-5 text-chart-2" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        )}
                        <div>
                          <div className="font-medium">{metric.name}</div>
                          <div className="text-sm text-muted-foreground">Threshold: {metric.threshold}%</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Control vs Treatment</div>
                        <div className="font-mono text-sm font-medium">
                          {metric.control}% vs {metric.treatment}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Decision Memo</CardTitle>
                <CardDescription>Actionable insights and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-accent p-6">
                  <h3 className="mb-4 text-lg font-semibold">Executive Summary</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    The new step-by-step onboarding flow (Treatment A) demonstrates a{" "}
                    <strong className="text-foreground">+{stats.liftPercent}% lift</strong> in activation rate compared
                    to the control, with statistical significance (p = {formatPValue(stats.pValue)}). Based on current
                    traffic patterns, implementing this change is projected to drive an additional{" "}
                    <strong className="text-foreground">$125K in annual revenue</strong> through improved user
                    activation.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Key Findings</h4>
                  <ul className="space-y-2">
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-chart-2" />
                      <span className="text-sm leading-relaxed">
                        Treatment A increased activation rate from {stats.controlRate}% to {stats.treatmentRate}%, a
                        relative improvement of {stats.liftPercent}%
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-chart-2" />
                      <span className="text-sm leading-relaxed">
                        Time to conversion decreased by 13 seconds, indicating improved user experience
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-chart-2" />
                      <span className="text-sm leading-relaxed">
                        All guardrail metrics remain within acceptable thresholds
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-chart-2" />
                      <span className="text-sm leading-relaxed">
                        Bounce rate improved by 3.6 percentage points, suggesting better engagement
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Recommendation</h4>
                  <div className="rounded-lg border-2 border-chart-2 bg-chart-2/10 p-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="mt-0.5 h-5 w-5 text-chart-2" />
                      <div>
                        <div className="font-medium text-chart-2">Ship Treatment A to 100% of users</div>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          The data strongly supports rolling out the new onboarding flow. Consider monitoring retention
                          metrics over the next 30 days to validate long-term impact.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Projected Impact</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-border p-4">
                      <div className="text-sm text-muted-foreground">Additional Activations</div>
                      <div className="mt-1 text-2xl font-bold">+1,247</div>
                      <div className="text-xs text-muted-foreground">per month</div>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <div className="text-sm text-muted-foreground">Revenue Impact</div>
                      <div className="mt-1 text-2xl font-bold">$125K</div>
                      <div className="text-xs text-muted-foreground">annually</div>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <div className="text-sm text-muted-foreground">Confidence</div>
                      <div className="mt-1 text-2xl font-bold">99.7%</div>
                      <div className="text-xs text-muted-foreground">statistical confidence</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
