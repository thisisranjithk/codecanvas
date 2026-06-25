import { useState } from "react"
import { Save, Globe, User, Bell, Shield, Link } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { mockUser } from "@/data/mock"
import { toast } from "sonner"

export function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [newMessageAlert, setNewMessageAlert] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [portfolioPublic, setPortfolioPublic] = useState(true)
  const [showEmail, setShowEmail] = useState(false)
  const [openToWork, setOpenToWork] = useState(true)

  function handleSave(section: string) {
    toast.success(`${section} settings saved`)
  }

  return (
    <div className="flex flex-col gap-4 p-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Manage your portfolio configuration and preferences.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="h-7">
          <TabsTrigger value="profile" className="text-[11px] h-5 px-2.5 gap-1.5">
            <User className="size-3" />Profile
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="text-[11px] h-5 px-2.5 gap-1.5">
            <Globe className="size-3" />Portfolio
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-[11px] h-5 px-2.5 gap-1.5">
            <Bell className="size-3" />Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="text-[11px] h-5 px-2.5 gap-1.5">
            <Shield className="size-3" />Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-4">
          <div className="flex flex-col gap-3 max-w-2xl">
            <Card className="border-border/60">
              <CardHeader className="pb-3 pt-4 px-4">
                <CardTitle className="text-sm">Profile Information</CardTitle>
                <CardDescription className="text-[11px]">Update your personal details visible on your portfolio.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 px-4 pb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-14 ring-2 ring-border">
                    <AvatarFallback className="text-sm bg-primary text-primary-foreground font-semibold">{mockUser.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <Button variant="outline" size="sm" className="h-7 text-xs w-fit">Change Avatar</Button>
                    <p className="text-[10px] text-muted-foreground">PNG, JPG up to 2MB</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label className="text-xs">Full Name</Label>
                    <Input defaultValue={mockUser.name} className="h-8 text-xs" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-xs">Email</Label>
                    <Input defaultValue={mockUser.email} type="email" className="h-8 text-xs" />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs">Professional Headline</Label>
                  <Input defaultValue="Senior Software Engineer & Open Source Contributor" placeholder="e.g. Full Stack Developer" className="h-8 text-xs" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs">Bio</Label>
                  <Textarea
                    defaultValue="I'm a software engineer with 6+ years of experience building high-performance web applications. Currently at Vercel, previously at Stripe and Linear."
                    rows={3}
                    placeholder="Tell visitors about yourself..."
                    className="text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label className="text-xs">Location</Label>
                    <Input defaultValue="San Francisco, CA" className="h-8 text-xs" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-xs">Timezone</Label>
                    <Select defaultValue="america-la">
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america-la">America/Los Angeles</SelectItem>
                        <SelectItem value="america-ny">America/New York</SelectItem>
                        <SelectItem value="europe-lon">Europe/London</SelectItem>
                        <SelectItem value="asia-tok">Asia/Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader className="pb-3 pt-4 px-4">
                <CardTitle className="text-sm">Social Links</CardTitle>
                <CardDescription className="text-[11px]">Add links to your social profiles and personal sites.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2.5 px-4 pb-4">
                {[
                  { label: "GitHub", value: "alexmorgan", prefix: "github.com/" },
                  { label: "LinkedIn", value: "alexmorgan", prefix: "linkedin.com/in/" },
                  { label: "Twitter / X", value: "alexmorgan", prefix: "x.com/" },
                  { label: "Personal Website", value: "alexmorgan.dev", prefix: "https://" },
                ].map((link) => (
                  <div key={link.label} className="grid gap-1.5">
                    <Label className="text-xs">{link.label}</Label>
                    <div className="flex">
                      <span className="flex items-center px-2.5 text-[10px] text-muted-foreground bg-muted border border-r-0 rounded-l-md border-border/60">
                        <Link className="size-2.5 mr-1" />{link.prefix}
                      </span>
                      <Input defaultValue={link.value} className="rounded-l-none h-8 text-xs" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button size="sm" onClick={() => handleSave("Profile")} className="h-8 gap-1.5">
                <Save className="size-3.5" />
                Save Profile
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="mt-4">
          <div className="flex flex-col gap-3 max-w-2xl">
            <Card className="border-border/60">
              <CardHeader className="pb-3 pt-4 px-4">
                <CardTitle className="text-sm">Portfolio Visibility</CardTitle>
                <CardDescription className="text-[11px]">Control what visitors can see on your public portfolio.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 px-4 pb-4">
                {[
                  { label: "Portfolio is Public", desc: "Your portfolio is visible to everyone.", value: portfolioPublic, set: setPortfolioPublic },
                  { label: "Show Email Address", desc: "Display your email on the contact section.", value: showEmail, set: setShowEmail },
                  { label: "Open to Work", desc: "Show an 'Open to Work' banner.", value: openToWork, set: setOpenToWork },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-lg border border-border/60 px-3.5 py-2.5">
                    <div>
                      <p className="text-xs font-medium">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch checked={item.value} onCheckedChange={item.set} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader className="pb-3 pt-4 px-4">
                <CardTitle className="text-sm">Domain & SEO</CardTitle>
                <CardDescription className="text-[11px]">Configure your portfolio domain and search engine settings.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 px-4 pb-4">
                <div className="grid gap-1.5">
                  <Label className="text-xs">Custom Domain</Label>
                  <div className="flex gap-2">
                    <Input defaultValue="alexmorgan.dev" placeholder="yourdomain.com" className="flex-1 h-8 text-xs" />
                    <Button variant="outline" size="sm" className="h-8 text-xs shrink-0">Verify</Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Point your domain CNAME to portfolio.example.com</p>
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs">SEO Title</Label>
                  <Input defaultValue="Alex Morgan – Senior Software Engineer" className="h-8 text-xs" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs">SEO Description</Label>
                  <Textarea defaultValue="Portfolio of Alex Morgan, a Senior Software Engineer specializing in React, TypeScript, and full-stack web development." rows={2} className="text-xs" />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button size="sm" onClick={() => handleSave("Portfolio")} className="h-8 gap-1.5">
                <Save className="size-3.5" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-4">
          <div className="flex flex-col gap-3 max-w-2xl">
            <Card className="border-border/60">
              <CardHeader className="pb-3 pt-4 px-4">
                <CardTitle className="text-sm">Email Notifications</CardTitle>
                <CardDescription className="text-[11px]">Choose what emails you'd like to receive.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 px-4 pb-4">
                {[
                  { label: "Email Notifications", desc: "Receive all email notifications.", value: emailNotifications, set: setEmailNotifications },
                  { label: "New Message Alert", desc: "Get notified when someone sends you a message.", value: newMessageAlert, set: setNewMessageAlert },
                  { label: "Weekly Digest", desc: "A weekly summary of your portfolio traffic.", value: weeklyDigest, set: setWeeklyDigest },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-lg border border-border/60 px-3.5 py-2.5">
                    <div>
                      <p className="text-xs font-medium">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch checked={item.value} onCheckedChange={item.set} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button size="sm" onClick={() => handleSave("Notification")} className="h-8 gap-1.5">
                <Save className="size-3.5" />
                Save Preferences
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-4">
          <div className="flex flex-col gap-3 max-w-2xl">
            <Card className="border-border/60">
              <CardHeader className="pb-3 pt-4 px-4">
                <CardTitle className="text-sm">Change Password</CardTitle>
                <CardDescription className="text-[11px]">Update your account password.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2.5 px-4 pb-4">
                <div className="grid gap-1.5">
                  <Label className="text-xs">Current Password</Label>
                  <Input type="password" placeholder="••••••••" className="h-8 text-xs" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs">New Password</Label>
                  <Input type="password" placeholder="••••••••" className="h-8 text-xs" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs">Confirm New Password</Label>
                  <Input type="password" placeholder="••••••••" className="h-8 text-xs" />
                </div>
                <Button size="sm" className="w-fit h-8" onClick={() => toast.success("Password updated")}>
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader className="pb-3 pt-4 px-4">
                <CardTitle className="text-sm">Active Sessions</CardTitle>
                <CardDescription className="text-[11px]">Manage devices signed in to your account.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 px-4 pb-4">
                {[
                  { device: "MacBook Pro", location: "San Francisco, CA", time: "Now", current: true },
                  { device: "iPhone 15", location: "San Francisco, CA", time: "2 hours ago", current: false },
                  { device: "Chrome on Windows", location: "New York, NY", time: "3 days ago", current: false },
                ].map((session) => (
                  <div key={session.device} className="flex items-center justify-between rounded-lg border border-border/60 px-3.5 py-2.5">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{session.device}</span>
                        {session.current && <Badge variant="secondary" className="text-[9px] h-4 px-1.5 bg-secondary/60">Current</Badge>}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{session.location} · {session.time}</span>
                    </div>
                    {!session.current && (
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive text-xs h-7" onClick={() => toast.success("Session revoked")}>
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-destructive/30">
              <CardHeader className="pb-3 pt-4 px-4">
                <CardTitle className="text-sm text-destructive">Danger Zone</CardTitle>
                <CardDescription className="text-[11px]">Irreversible and destructive actions.</CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex items-center justify-between rounded-lg border border-destructive/20 px-3.5 py-2.5 bg-destructive/5">
                  <div>
                    <p className="text-xs font-medium">Delete Account</p>
                    <p className="text-[10px] text-muted-foreground">Permanently delete your account and all portfolio data.</p>
                  </div>
                  <Button variant="destructive" size="sm" className="h-7 text-xs" onClick={() => toast.error("This action is disabled in demo mode")}>
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
