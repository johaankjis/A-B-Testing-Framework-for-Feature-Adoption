import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Plus, TrendingUp, TrendingDown, Minus } from "lucide-react"
import Link from "next/link"

// Mock experiment data
const experiments = [
  {
    id: "exp-001",
    name: "Onboarding Flow Redesign",
    description: "Testing new step-by-step onboarding vs. single-page flow",
    status: "running",
    startDate: "2025-10-15",
    variants: ["Control", "Treatment A"],
    primaryMetric: "Activation Rate",
    lift: 12.4,
    pValue: 0.003,
    users: 8432,
    confidence: 99.7,
    projectedImpact: "$125K",
  },
  {
    id: "exp-002",
    name: "Feature Discovery Modal",
    description: "Introducing contextual tooltips for new features",
    status: "completed",
    startDate: "2025-09-28",
    endDate: "2025-10-12",
    variants: ["Control", "Treatment A"],
    primaryMetric: "Feature Adoption",
    lift: 8.1,
    pValue: 0.021,
    users: 12891,
    confidence: 97.9,
    projectedImpact: "$87K",
  },
  {
    id: "exp-003",
    name: "Pricing Page CTA",
    description: "Testing different CTA copy and button colors",
    status: "running",
    startDate: "2025-10-20",
    variants: ["Control", "Treatment A", "Treatment B"],
    primaryMetric: "Conversion Rate",
    lift: 5.7,
    pValue: 0.089,
    users: 6234,
    confidence: 91.1,
    projectedImpact: "$52K",
  },
  {
    id: "exp-004",
    name: "Email Notification Timing",
    description: "Optimizing send time for engagement emails",
    status: "completed",
    startDate: "2025-09-10",
    endDate: "2025-09-24",
    variants: ["Control", "Morning", "Evening"],
    primaryMetric: "Email Open Rate",
    lift: 15.2,
    pValue: 0.001,
    users: 15432,
    confidence: 99.9,
    projectedImpact: "$143K",
  },
  {
    id: "exp-005",
    name: "Dashboard Layout V2",
    description: "Testing card-based vs. list-based dashboard",
    status: "draft",
    startDate: "2025-10-28",
    variants: ["Control", "Treatment A"],
    primaryMetric: "Time on Page",
    lift: 0,
    pValue: 1.0,
    users: 0,
    confidence: 0,
    projectedImpact: "$0",
  },
  {
    id: "exp-006",
    name: "Search Algorithm Update",
    description: "ML-powered search vs. keyword matching",
    status: "running",
    startDate: "2025-10-18",
    variants: ["Control", "ML Model"],
    primaryMetric: "Search Success Rate",
    lift: -2.3,
    pValue: 0.234,
    users: 9876,
    confidence: 76.6,
    projectedImpact: "-$18K",
  },
]

export default function ExperimentsPage() {
  const runningExperiments = experiments.filter((e) => e.status === "running")
  const completedExperiments = experiments.filter((e) => e.status === "completed")
  const draftExperiments = experiments.filter((e) => e.status === "draft")

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Experiments</h1>
            <p className="mt-2 text-muted-foreground">Manage and monitor your A/B tests</p>
          </div>
          <Link href="/experiments/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Experiment
            </Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search experiments..." className="pl-9" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All ({experiments.length})</TabsTrigger>
            <TabsTrigger value="running">Running ({runningExperiments.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedExperiments.length})</TabsTrigger>
            <TabsTrigger value="draft">Draft ({draftExperiments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {experiments.map((exp) => (
              <ExperimentCard key={exp.id} experiment={exp} />
            ))}
          </TabsContent>

          <TabsContent value="running" className="space-y-4">
            {runningExperiments.map((exp) => (
              <ExperimentCard key={exp.id} experiment={exp} />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedExperiments.map((exp) => (
              <ExperimentCard key={exp.id} experiment={exp} />
            ))}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            {draftExperiments.map((exp) => (
              <ExperimentCard key={exp.id} experiment={exp} />
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function ExperimentCard({ experiment }: { experiment: (typeof experiments)[0] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "default"
      case "completed":
        return "secondary"
      case "draft":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getLiftIcon = (lift: number) => {
    if (lift > 0) return <TrendingUp className="h-4 w-4 text-chart-2" />
    if (lift < 0) return <TrendingDown className="h-4 w-4 text-destructive" />
    return <Minus className="h-4 w-4 text-muted-foreground" />
  }

  const isSignificant = experiment.pValue < 0.05

  return (
    <Link href={`/experiments/${experiment.id}`}>
      <Card className="transition-colors hover:bg-accent/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{experiment.name}</CardTitle>
                <Badge variant={getStatusColor(experiment.status)}>{experiment.status}</Badge>
                {isSignificant && experiment.status !== "draft" && (
                  <Badge variant="outline" className="border-chart-2 text-chart-2">
                    Significant
                  </Badge>
                )}
              </div>
              <CardDescription className="mt-1">{experiment.description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-lg font-semibold">
                {getLiftIcon(experiment.lift)}
                <span
                  className={
                    experiment.lift > 0
                      ? "text-chart-2"
                      : experiment.lift < 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }
                >
                  {experiment.lift > 0 ? "+" : ""}
                  {experiment.lift}%
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Lift</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Primary Metric</div>
              <div className="mt-1 text-sm font-semibold">{experiment.primaryMetric}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Variants</div>
              <div className="mt-1 text-sm font-semibold">{experiment.variants.length}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Users</div>
              <div className="mt-1 text-sm font-semibold">{experiment.users.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Confidence</div>
              <div className="mt-1 text-sm font-semibold">{experiment.confidence}%</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Projected Impact</div>
              <div className="mt-1 text-sm font-semibold">{experiment.projectedImpact}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
