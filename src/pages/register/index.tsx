import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldContent, FieldError } from '@/components/ui/field';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AtSign,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useRegister } from '@/hooks/api/auth';
interface RegisterProps {
  onNavigate?: (path: string) => void;
}

const registerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required.'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(20, 'Username must be at most 20 characters.')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and dashes.'
    ),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

// --- Password strength helpers ---
interface PasswordCriteria {
  label: string;
  test: (pw: string) => boolean;
}

const PASSWORD_CRITERIA: PasswordCriteria[] = [
  { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'Uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'Lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { label: 'Number', test: (pw) => /[0-9]/.test(pw) },
  { label: 'Special character', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

type StrengthLevel = 'none' | 'weak' | 'fair' | 'good' | 'strong';

function getStrength(password: string): { level: StrengthLevel; score: number } {
  if (!password) return { level: 'none', score: 0 };
  const score = PASSWORD_CRITERIA.filter((c) => c.test(password)).length;
  if (score <= 1) return { level: 'weak', score };
  if (score === 2) return { level: 'fair', score };
  if (score === 3) return { level: 'good', score };
  return { level: 'strong', score };
}

const STRENGTH_META: Record<StrengthLevel, { label: string; color: string; bars: number }> = {
  none: { label: '', color: 'bg-border', bars: 0 },
  weak: { label: 'Weak', color: 'bg-destructive', bars: 1 },
  fair: { label: 'Fair', color: 'bg-warning', bars: 2 },
  good: { label: 'Good', color: 'bg-info', bars: 3 },
  strong: { label: 'Strong', color: 'bg-success', bars: 5 },
};

function PasswordStrength({ password }: { password: string }) {
  const { level } = getStrength(password);
  const meta = STRENGTH_META[level];

  return (
    <div className="space-y-3">
      {/* Strength bars */}
      {password.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">Password strength</span>
            {meta.label && (
              <span
                className={cn(
                  'text-xs font-medium',
                  level === 'weak' && 'text-destructive',
                  level === 'fair' && 'text-warning',
                  level === 'good' && 'text-info',
                  level === 'strong' && 'text-success'
                )}
              >
                {meta.label}
              </span>
            )}
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-all duration-300',
                  i < meta.bars ? meta.color : 'bg-border'
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* Criteria list */}
      {password.length > 0 && (
        <div className="grid grid-cols-1 gap-1">
          {PASSWORD_CRITERIA.map((criterion) => {
            const passed = criterion.test(password);
            return (
              <div key={criterion.label} className="flex items-center gap-2">
                {passed ? (
                  <CheckCircle2 className="text-success h-3.5 w-3.5 shrink-0" />
                ) : (
                  <XCircle className="text-muted-foreground/40 h-3.5 w-3.5 shrink-0" />
                )}
                <span
                  className={cn(
                    'text-xs transition-colors duration-200',
                    passed ? 'text-success' : 'text-muted-foreground'
                  )}
                >
                  {criterion.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Compact hint when empty */}
      {password.length === 0 && (
        <p className="text-muted-foreground text-xs">
          Use 8+ characters with uppercase, numbers & symbols
        </p>
      )}
    </div>
  );
}

// --- Constellation animation ---
interface Node {
  x: number;
  y: number;
  r: number;
  animDuration: string;
  animDelay: string;
}

interface Edge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  animDuration: string;
  animDelay: string;
}

const NODES: Node[] = [
  { x: 80, y: 60, r: 5, animDuration: '4s', animDelay: '0s' },
  { x: 200, y: 30, r: 3, animDuration: '6s', animDelay: '0.5s' },
  { x: 320, y: 80, r: 4, animDuration: '5s', animDelay: '1s' },
  { x: 50, y: 160, r: 3, animDuration: '7s', animDelay: '1.5s' },
  { x: 160, y: 130, r: 6, animDuration: '4.5s', animDelay: '0.2s' },
  { x: 280, y: 170, r: 4, animDuration: '5.5s', animDelay: '0.8s' },
  { x: 370, y: 220, r: 3, animDuration: '6.5s', animDelay: '1.2s' },
  { x: 100, y: 260, r: 5, animDuration: '4s', animDelay: '0.3s' },
  { x: 230, y: 240, r: 3, animDuration: '5s', animDelay: '1s' },
  { x: 340, y: 310, r: 4, animDuration: '6s', animDelay: '0.7s' },
  { x: 70, y: 340, r: 3, animDuration: '5.5s', animDelay: '0s' },
  { x: 190, y: 330, r: 5, animDuration: '4.5s', animDelay: '1.4s' },
  { x: 300, y: 380, r: 3, animDuration: '7s', animDelay: '0.6s' },
  { x: 120, y: 400, r: 4, animDuration: '5s', animDelay: '0.9s' },
  { x: 250, y: 410, r: 3, animDuration: '6s', animDelay: '0.4s' },
];

const EDGES: Edge[] = [
  { x1: 80, y1: 60, x2: 200, y2: 30, animDuration: '4s', animDelay: '0s' },
  { x1: 200, y1: 30, x2: 320, y2: 80, animDuration: '5s', animDelay: '0.5s' },
  { x1: 80, y1: 60, x2: 160, y2: 130, animDuration: '6s', animDelay: '0.2s' },
  { x1: 200, y1: 30, x2: 160, y2: 130, animDuration: '4.5s', animDelay: '0.8s' },
  { x1: 320, y1: 80, x2: 280, y2: 170, animDuration: '5.5s', animDelay: '0.3s' },
  { x1: 160, y1: 130, x2: 280, y2: 170, animDuration: '6.5s', animDelay: '1s' },
  { x1: 50, y1: 160, x2: 160, y2: 130, animDuration: '4s', animDelay: '0.6s' },
  { x1: 280, y1: 170, x2: 370, y2: 220, animDuration: '5s', animDelay: '0.4s' },
  { x1: 100, y1: 260, x2: 160, y2: 130, animDuration: '6s', animDelay: '0.9s' },
  { x1: 100, y1: 260, x2: 230, y2: 240, animDuration: '4.5s', animDelay: '0.1s' },
  { x1: 230, y1: 240, x2: 280, y2: 170, animDuration: '5.5s', animDelay: '0.7s' },
  { x1: 230, y1: 240, x2: 340, y2: 310, animDuration: '6s', animDelay: '0.5s' },
  { x1: 70, y1: 340, x2: 100, y2: 260, animDuration: '4s', animDelay: '1.1s' },
  { x1: 70, y1: 340, x2: 190, y2: 330, animDuration: '5s', animDelay: '0.3s' },
  { x1: 190, y1: 330, x2: 230, y2: 240, animDuration: '6.5s', animDelay: '0.8s' },
  { x1: 190, y1: 330, x2: 300, y2: 380, animDuration: '4.5s', animDelay: '0.2s' },
  { x1: 340, y1: 310, x2: 300, y2: 380, animDuration: '5.5s', animDelay: '1s' },
  { x1: 120, y1: 400, x2: 70, y2: 340, animDuration: '4s', animDelay: '0.6s' },
  { x1: 120, y1: 400, x2: 250, y2: 410, animDuration: '6s', animDelay: '0.4s' },
  { x1: 250, y1: 410, x2: 300, y2: 380, animDuration: '5s', animDelay: '0.9s' },
];

function ConstellationIllustration() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Radial gradient background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-chart-2/10 absolute top-1/3 left-1/4 h-64 w-64 rounded-full blur-3xl" />
        <div className="bg-primary/10 absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full blur-3xl" />
        <div className="bg-chart-3/10 absolute top-2/3 left-1/2 h-32 w-32 rounded-full blur-2xl" />
      </div>

      {/* Constellation SVG */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 420 440"
          className="h-full max-h-[480px] w-full max-w-[480px]"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="1" className="text-primary" />
              <stop
                offset="100%"
                stopColor="currentColor"
                stopOpacity="0.3"
                className="text-primary"
              />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Edges */}
          {EDGES.map((e, i) => (
            <line
              key={i}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              className="stroke-primary/20"
              strokeWidth="1"
              style={{
                animation: `pulse ${e.animDuration} ease-in-out infinite alternate`,
                animationDelay: e.animDelay,
              }}
            />
          ))}

          {/* Nodes */}
          {NODES.map((n, i) => {
            const colors = [
              'fill-primary',
              'fill-chart-1',
              'fill-chart-2',
              'fill-chart-3',
              'fill-chart-4',
              'fill-chart-5',
            ];
            const color = colors[i % colors.length];
            return (
              <g key={i} filter="url(#glow)">
                {/* Outer pulse ring */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r * 2.5}
                  className={cn(color, 'opacity-10')}
                  style={{
                    animation: `pulse ${n.animDuration} ease-in-out infinite alternate`,
                    animationDelay: n.animDelay,
                  }}
                />
                {/* Core dot */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  className={cn(color, 'opacity-80')}
                  style={{
                    animation: `pulse ${n.animDuration} ease-in-out infinite alternate`,
                    animationDelay: n.animDelay,
                  }}
                />
              </g>
            );
          })}

          {/* Traveling "signal" dot along one edge */}
          <circle r="3" className="fill-chart-2 opacity-90" filter="url(#glow)">
            <animateMotion dur="5s" repeatCount="indefinite">
              <mpath xlinkHref="#signal-path" />
            </animateMotion>
          </circle>
          <path
            id="signal-path"
            d="M80,60 L200,30 L320,80 L280,170 L230,240 L190,330 L120,400 L250,410"
            fill="none"
            stroke="none"
          />

          <circle r="2.5" className="fill-primary opacity-80" filter="url(#glow)">
            <animateMotion dur="7s" repeatCount="indefinite" begin="2s">
              <mpath xlinkHref="#signal-path-2" />
            </animateMotion>
          </circle>
          <path
            id="signal-path-2"
            d="M50,160 L160,130 L280,170 L370,220 L340,310 L300,380"
            fill="none"
            stroke="none"
          />
        </svg>
      </div>

      {/* Floating label chips */}
      <div
        className="border-primary/20 bg-primary/10 text-primary absolute top-12 right-16 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm"
        style={{ animation: 'float 6s ease-in-out infinite' }}
      >
        Secure
      </div>
      <div
        className="border-chart-2/30 bg-chart-2/10 text-chart-2 absolute bottom-20 left-12 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm"
        style={{ animation: 'float 8s ease-in-out infinite reverse', animationDelay: '1s' }}
      >
        Fast
      </div>
      <div
        className="border-chart-3/30 bg-chart-3/10 text-chart-3 absolute top-1/2 right-10 -translate-y-1/2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm"
        style={{ animation: 'float 7s ease-in-out infinite', animationDelay: '2.5s' }}
      >
        Reliable
      </div>

      {/* Subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.4,
        }}
      />
    </div>
  );
}

// --- Register form ---
export function Register({ onNavigate }: RegisterProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
    },
  });

  const passwordValue = watch('password') || '';
  const { level } = useMemo(() => getStrength(passwordValue), [passwordValue]);
  const isPasswordValid = level === 'good' || level === 'strong';

  const registerMutation = useRegister();

  const onSubmit = async (data: RegisterFormValues) => {
    if (!isPasswordValid) return;
    setIsLoading(true);
    try {
      await registerMutation.mutateAsync(data);
      toast.success('Account created successfully. Please sign in.');
      navigate({ to: '/login' });
      onNavigate?.('/login');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-auth-fade-in flex min-h-screen w-full">
      {/* Left side - Form (reversed layout from login) */}
      <div className="animate-slide-in-left flex w-full items-center justify-center px-4 py-10 lg:w-1/2 lg:px-10">
        <Card className="w-full max-w-lg border-0 bg-transparent shadow-none">
          <CardHeader className="space-y-1 pb-2">
            {/* Back to login */}
            <button
              type="button"
              onClick={() => {
                navigate({ to: '/login' });
                onNavigate?.('/login');
              }}
              className="text-muted-foreground hover:text-foreground mb-2 flex w-fit items-center gap-1.5 text-sm transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to login
            </button>

            <CardTitle className="text-2xl font-semibold tracking-tight">
              Create your account
            </CardTitle>
            <CardDescription>Join thousands of developers managing their portfolio</CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name + Username side by side */}
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                  <FieldContent>
                    <div className="relative">
                      <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        id="fullName"
                        type="text"
                        autoComplete="name"
                        placeholder="Alex Morgan"
                        className="pl-10"
                        {...register('fullName')}
                      />
                    </div>
                  </FieldContent>
                  <FieldError errors={[errors.fullName]} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <FieldContent>
                    <div className="relative">
                      <AtSign className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        id="username"
                        type="text"
                        autoComplete="off"
                        placeholder="alexmorgan"
                        className="pl-10"
                        {...register('username', {
                          onChange: (e) => {
                            e.target.value = e.target.value.replace(/[^a-zA-Z0-9_-]/g, '');
                          },
                        })}
                      />
                    </div>
                  </FieldContent>
                  <FieldError errors={[errors.username]} />
                </Field>
              </div>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      {...register('email')}
                    />
                  </div>
                </FieldContent>
                <FieldError errors={[errors.email]} />
              </Field>

              {/* Password */}
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Create a strong password"
                      className="pr-10 pl-10"
                      {...register('password')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="text-muted-foreground h-4 w-4" />
                      ) : (
                        <Eye className="text-muted-foreground h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? 'Hide password' : 'Show password'}
                      </span>
                    </Button>
                  </div>
                </FieldContent>
                <FieldError errors={[errors.password]} />

                {/* Password strength indicator */}
                <div className="border-border/60 bg-muted/30 mt-3 rounded-lg border p-3">
                  <PasswordStrength password={passwordValue} />
                </div>
              </Field>

              <Button
                type="submit"
                className="w-full"
                disabled={passwordValue.length > 0 && !isPasswordValid}
                isLoading={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <div className="relative my-5">
              <Separator />
              <span className="bg-card text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-xs">
                or sign up with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" type="button">
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" type="button">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.576 4.765-1.59 8.199-6.087 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>

            <p className="text-muted-foreground mt-5 text-center text-sm">
              Already have an account?{' '}
              <Button
                variant="link"
                className="text-primary h-auto p-0"
                onClick={() => {
                  navigate({ to: '/login' });
                  onNavigate?.('/login');
                }}
              >
                Sign in
              </Button>
            </p>

            <p className="text-muted-foreground mt-3 text-center text-xs">
              By creating an account, you agree to our{' '}
              <span className="text-primary cursor-pointer hover:underline">Terms of Service</span>{' '}
              and{' '}
              <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Constellation illustration */}
      <div className="animate-slide-in-right from-chart-2/5 via-background to-primary/5 dark:from-chart-2/10 dark:via-background dark:to-primary/10 hidden w-1/2 bg-gradient-to-bl lg:block">
        <ConstellationIllustration />
      </div>
    </div>
  );
}
