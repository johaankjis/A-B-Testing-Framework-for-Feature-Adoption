import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="mt-2 text-muted-foreground">Configure your experimentation platform</p>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Platform-wide configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input id="org-name" defaultValue="Acme Corp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-significance">Default Significance Level</Label>
                <Select defaultValue="0.05">
                  <SelectTrigger id="default-significance">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.01">0.01 (99% confidence)</SelectItem>
                    <SelectItem value="0.05">0.05 (95% confidence)</SelectItem>
                    <SelectItem value="0.10">0.10 (90% confidence)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-power">Default Statistical Power</Label>
                <Select defaultValue="0.80">
                  <SelectTrigger id="default-power">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.70">70%</SelectItem>
                    <SelectItem value="0.80">80%</SelectItem>
                    <SelectItem value="0.90">90%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Data Integration */}
          <Card>
            <CardHeader>
              <CardTitle>Data Integration</CardTitle>
              <CardDescription>Connect your data sources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mongodb-uri">MongoDB Connection URI</Label>
                <Input id="mongodb-uri" type="password" placeholder="mongodb://..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sql-connection">SQL Database Connection</Label>
                <Input id="sql-connection" type="password" placeholder="postgresql://..." />
              </div>
              <Button>Test Connection</Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure experiment alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Experiment Completion</Label>
                  <p className="text-sm text-muted-foreground">Notify when experiments reach significance</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Guardrail Violations</Label>
                  <p className="text-sm text-muted-foreground">Alert when guardrail metrics are breached</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly experimentation summaries</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
