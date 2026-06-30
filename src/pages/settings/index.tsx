import { Save, Globe, User, Bell, Shield, Link, Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockUser } from '@/data/user';
import { toast } from 'sonner';
import { FormInput, FormTextarea, FormSelect, FormSwitch } from '@/components/shared/form-field';
import {
  profileSchema,
  type ProfileFormData,
  portfolioSchema,
  type PortfolioFormData,
  notificationsSchema,
  type NotificationsFormData,
  changePasswordSchema,
  type ChangePasswordFormData,
} from '@/schemas';

// ── Profile Tab ──

function ProfileTab() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: mockUser.name,
      email: mockUser.email,
      headline: 'Senior Software Engineer & Open Source Contributor',
      bio: "I'm a software engineer with 6+ years of experience building high-performance web applications. Currently at Vercel, previously at Stripe and Linear.",
      location: 'San Francisco, CA',
      timezone: 'america-la',
      github: 'alexmorgan',
      linkedin: 'alexmorgan',
      twitter: 'alexmorgan',
      website: 'alexmorgan.dev',
    },
  });

  function onSubmit(_data: ProfileFormData) {
    toast.success('Profile settings saved');
  }

  const socialLinks = [
    { label: 'GitHub', field: 'github' as const, prefix: 'github.com/' },
    { label: 'LinkedIn', field: 'linkedin' as const, prefix: 'linkedin.com/in/' },
    { label: 'Twitter / X', field: 'twitter' as const, prefix: 'x.com/' },
    { label: 'Personal Website', field: 'website' as const, prefix: 'https://' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex max-w-2xl flex-col gap-3">
        <Card className="border-border/60">
          <CardHeader className="px-4 pt-4 pb-3">
            <CardTitle className="text-sm">Profile Information</CardTitle>
            <CardDescription className="text-xs">
              Update your personal details visible on your portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 px-4 pb-4">
            <div className="flex items-center gap-3">
              <Avatar className="ring-border size-14 ring-2">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                  {mockUser.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <Button variant="outline" size="sm" className="h-7 w-fit text-xs" type="button">
                  Change Avatar
                </Button>
                <p className="text-muted-foreground text-xs">PNG, JPG up to 2MB</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Full Name"
                registration={register('name')}
                error={errors.name}
                required
                labelClassName="text-xs"
                inputClassName="h-8 text-xs"
              />
              <FormInput
                label="Email"
                registration={register('email')}
                error={errors.email}
                type="email"
                required
                labelClassName="text-xs"
                inputClassName="h-8 text-xs"
              />
            </div>
            <FormInput
              label="Professional Headline"
              registration={register('headline')}
              error={errors.headline}
              placeholder="e.g. Full Stack Developer"
              labelClassName="text-xs"
              inputClassName="h-8 text-xs"
            />
            <FormTextarea
              label="Bio"
              registration={register('bio')}
              error={errors.bio}
              placeholder="Tell visitors about yourself..."
              rows={3}
              labelClassName="text-xs"
              textareaClassName="text-xs"
            />
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Location"
                registration={register('location')}
                error={errors.location}
                labelClassName="text-xs"
                inputClassName="h-8 text-xs"
              />
              <FormSelect
                label="Timezone"
                name="timezone"
                control={control}
                error={errors.timezone}
                options={[
                  { label: 'America/Los Angeles', value: 'america-la' },
                  { label: 'America/New York', value: 'america-ny' },
                  { label: 'Europe/London', value: 'europe-lon' },
                  { label: 'Asia/Tokyo', value: 'asia-tok' },
                ]}
                required
                labelClassName="text-xs"
                selectClassName="h-8 text-xs"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="px-4 pt-4 pb-3">
            <CardTitle className="text-sm">Social Links</CardTitle>
            <CardDescription className="text-xs">
              Add links to your social profiles and personal sites.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2.5 px-4 pb-4">
            {socialLinks.map((link) => (
              <div key={link.label} className="grid gap-1.5">
                <Label className="text-xs">{link.label}</Label>
                <div className="flex">
                  <span className="text-muted-foreground bg-muted border-border/60 flex items-center rounded-l-md border border-r-0 px-2.5 text-xs">
                    <Link className="mr-1 size-2.5" />
                    {link.prefix}
                  </span>
                  <Input {...register(link.field)} className="h-8 rounded-l-none text-xs" />
                </div>
                {errors[link.field] && (
                  <p className="text-destructive text-3">{errors[link.field]?.message}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button size="sm" type="submit" className="h-8 gap-1.5">
            <Save className="size-3.5" />
            Save Profile
          </Button>
        </div>
      </div>
    </form>
  );
}

// ── Portfolio Tab ──

function PortfolioTab() {
  const { control, handleSubmit } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      portfolioPublic: true,
      showEmail: false,
      openToWork: true,
    },
  });

  function onSubmit(_data: PortfolioFormData) {
    toast.success('Portfolio settings saved');
  }

  const visibilityItems = [
    {
      name: 'portfolioPublic' as const,
      label: 'Portfolio is Public',
      desc: 'Your portfolio is visible to everyone.',
    },
    {
      name: 'showEmail' as const,
      label: 'Show Email Address',
      desc: 'Display your email on the contact section.',
    },
    { name: 'openToWork' as const, label: 'Open to Work', desc: "Show an 'Open to Work' banner." },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex max-w-2xl flex-col gap-3">
        <Card className="border-border/60">
          <CardHeader className="px-4 pt-4 pb-3">
            <CardTitle className="text-sm">Portfolio Visibility</CardTitle>
            <CardDescription className="text-xs">
              Control what visitors can see on your public portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 px-4 pb-4">
            {visibilityItems.map((item) => (
              <FormSwitch
                key={item.name}
                label={item.label}
                name={item.name}
                control={control}
                description={item.desc}
                className="px-3.5 py-2.5"
                labelClassName="text-xs"
              />
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button size="sm" type="submit" className="h-8 gap-1.5">
            <Save className="size-3.5" />
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
}

// ── Notifications Tab ──

function NotificationsTab() {
  const { control, handleSubmit } = useForm<NotificationsFormData>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      emailNotifications: false,
      newMessageAlert: false,
      weeklyDigest: false,
    },
  });

  function onSubmit(_data: NotificationsFormData) {
    toast.success('Notification settings saved');
  }

  const notificationItems = [
    {
      name: 'emailNotifications' as const,
      label: 'Email Notifications',
      desc: 'Receive all email notifications.',
    },
    {
      name: 'newMessageAlert' as const,
      label: 'New Message Alert',
      desc: 'Get notified when someone sends you a message.',
    },
    {
      name: 'weeklyDigest' as const,
      label: 'Weekly Digest',
      desc: 'A weekly summary of your portfolio traffic.',
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex max-w-2xl flex-col gap-3">
        <Card className="border-blue-500/30 bg-blue-500/10 shadow-sm dark:bg-blue-500/5">
          <CardContent className="flex items-center gap-3.5 px-4">
            <div className="rounded-full bg-blue-500/20 p-2 text-blue-600 dark:text-blue-400">
              <Info className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Coming Soon</p>
              <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
                Notification preferences will be available in a future update.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="pointer-events-none opacity-50">
          <Card className="border-border/60">
            <CardHeader className="px-4 pt-4 pb-3">
              <CardTitle className="text-sm">Email Notifications</CardTitle>
              <CardDescription className="text-xs">
                Choose what emails you'd like to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 px-4 pb-4">
              {notificationItems.map((item) => (
                <FormSwitch
                  key={item.name}
                  label={item.label}
                  name={item.name}
                  control={control}
                  description={item.desc}
                  className="px-3.5 py-2.5"
                  labelClassName="text-xs"
                />
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="pointer-events-none flex justify-end opacity-50">
          <Button size="sm" type="submit" className="h-8 gap-1.5" disabled>
            <Save className="size-3.5" />
            Save Preferences
          </Button>
        </div>
      </div>
    </form>
  );
}

// ── Security Tab ──

function SecurityTab() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  function onSubmit(_data: ChangePasswordFormData) {
    toast.success('Password updated');
    reset();
  }

  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <Card className="border-border/60">
        <CardHeader className="px-4 pt-4 pb-3">
          <CardTitle className="text-sm">Change Password</CardTitle>
          <CardDescription className="text-xs">Update your account password.</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2.5">
              <FormInput
                label="Current Password"
                registration={register('currentPassword')}
                error={errors.currentPassword}
                type="password"
                placeholder="••••••••"
                required
                labelClassName="text-xs"
                inputClassName="h-8 text-xs"
              />
              <FormInput
                label="New Password"
                registration={register('newPassword')}
                error={errors.newPassword}
                type="password"
                placeholder="••••••••"
                required
                labelClassName="text-xs"
                inputClassName="h-8 text-xs"
              />
              <FormInput
                label="Confirm New Password"
                registration={register('confirmPassword')}
                error={errors.confirmPassword}
                type="password"
                placeholder="••••••••"
                required
                labelClassName="text-xs"
                inputClassName="h-8 text-xs"
              />
              <Button size="sm" className="h-8 w-fit" type="submit">
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader className="px-4 pt-4 pb-3">
          <CardTitle className="text-destructive text-sm">Danger Zone</CardTitle>
          <CardDescription className="text-xs">
            Irreversible and destructive actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="border-destructive/20 bg-destructive/5 flex items-center justify-between rounded-lg border px-3.5 py-2.5">
            <div>
              <p className="text-xs font-medium">Delete Account</p>
              <p className="text-muted-foreground text-xs">
                Permanently delete your account and all portfolio data.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="h-7 text-xs"
              onClick={() => toast.error('This action is disabled in demo mode')}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main Settings Page ──

export function Settings() {
  return (
    <div className="animate-fade-in flex flex-col gap-4 p-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Manage your portfolio configuration and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="h-7">
          <TabsTrigger value="profile" className="h-5 gap-1.5 px-2.5 text-xs">
            <User className="size-3" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="h-5 gap-1.5 px-2.5 text-xs">
            <Globe className="size-3" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="notifications" className="h-5 gap-1.5 px-2.5 text-xs">
            <Bell className="size-3" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="h-5 gap-1.5 px-2.5 text-xs">
            <Shield className="size-3" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="portfolio" className="mt-4">
          <PortfolioTab />
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <NotificationsTab />
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
