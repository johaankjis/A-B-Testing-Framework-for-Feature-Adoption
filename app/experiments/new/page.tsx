"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Calculator, Info } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function NewExperimentPage() {
  const [variants, setVariants] = useState([
    { id: "1", name: "Control", traffic: 50 },
    { id: "2", name: "Treatment A", traffic: 50 },
  ])

  const [guardrailMetrics, setGuardrailMetrics] = useState([{ id: "1", name: "Churn Rate", threshold: "< 5%" }])

  const addVariant = () => {
    const newId = (variants.length + 1).toString()
    setVariants([
      ...variants,
      { id: newId, name: `Treatment ${String.fromCharCode(64 + variants.length)}`, traffic: 0 },
    ])
  }

  const removeVariant = (id: string) => {
    if (variants.length > 2) {
      setVariants(variants.filter((v) => v.id !== id))
    }
  }

  const addGuardrailMetric = () => {
    const newId = (guardrailMetrics.length + 1).toString()
    setGuardrailMetrics([...guardrailMetrics, { id: newId, name: "", threshold: "" }])
  }

  const removeGuardrailMetric = (id: string) => {
    setGuardrailMetrics(guardrailMetrics.filter((m) => m.id !== id))
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create New Experiment</h1>
          <p className="mt-2 text-muted-foreground">Design your A/B test with statistical rigor</p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Define the experiment name and description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Experiment Name</Label>
                <Input id="name" placeholder="e.g., Onboarding Flow Redesign" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe what you're testing and why..." rows={3} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input id="start-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input id="duration" type="number" placeholder="14" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Definition */}
          <Card>
            <CardHeader>
              <CardTitle>Metrics Definition</CardTitle>
              <CardDescription>Define primary and guardrail metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-metric">Primary Metric</Label>
                  <Select>
                    <SelectTrigger id="primary-metric">
                      <SelectValue placeholder="Select primary metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activation">Activation Rate</SelectItem>
                      <SelectItem value="conversion">Conversion Rate</SelectItem>
                      <SelectItem value="retention">Retention Rate</SelectItem>
                      <SelectItem value="engagement">Engagement Score</SelectItem>
                      <SelectItem value="revenue">Revenue per User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="success-metric">Success Criteria</Label>
                  <Input id="success-metric" placeholder="e.g., +5% lift with p < 0.05" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Guardrail Metrics</Label>
                    <p className="text-sm text-muted-foreground">Metrics that should not degrade</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={addGuardrailMetric}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Metric
                  </Button>
                </div>
                <div className="space-y-2">
                  {guardrailMetrics.map((metric) => (
                    <div key={metric.id} className="flex gap-2">
                      <Input placeholder="Metric name" className="flex-1" />
                      <Input placeholder="Threshold" className="w-32" />
                      <Button variant="ghost" size="icon" onClick={() => removeGuardrailMetric(metric.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variants Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Variants Configuration</CardTitle>
              <CardDescription>Define treatment and control groups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{variants.length} Variants</Badge>
                  <span className="text-sm text-muted-foreground">
                    Total traffic allocation: {variants.reduce((sum, v) => sum + v.traffic, 0)}%
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={addVariant}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Variant
                </Button>
              </div>
              <div className="space-y-3">
                {variants.map((variant, index) => (
                  <div key={variant.id} className="flex items-center gap-3 rounded-lg border border-border p-4">
                    <div className="flex-1 space-y-2">
                      <Input placeholder="Variant name" defaultValue={variant.name} className="font-medium" />
                      <Textarea placeholder="Describe this variant..." rows={2} className="text-sm" />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label className="text-xs">Traffic %</Label>
                      <Input type="number" defaultValue={variant.traffic} min="0" max="100" />
                    </div>
                    {variants.length > 2 && (
                      <Button variant="ghost" size="icon" onClick={() => removeVariant(variant.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Power Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Power Analysis
              </CardTitle>
              <CardDescription>Calculate required sample size for statistical significance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="baseline">Baseline Rate (%)</Label>
                  <Input id="baseline" type="number" placeholder="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mde">Minimum Detectable Effect (%)</Label>
                  <Input id="mde" type="number" placeholder="5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="power">Statistical Power (%)</Label>
                  <Input id="power" type="number" placeholder="80" />
                </div>
              </div>
              <div className="rounded-lg bg-accent p-4">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Required Sample Size</div>
                    <div className="mt-1 text-2xl font-bold">12,450 users per variant</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Based on 80% power to detect a 5% lift with 95% confidence (α = 0.05)
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Link href="/experiments">
              <Button variant="outline">Cancel</Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline">Save as Draft</Button>
              <Button>Launch Experiment</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
