import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { useNavigate } from "@tanstack/react-router"
import {
    Field,
    FieldLabel,
    FieldContent,
    FieldError,
} from "@/components/ui/field"

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(1, "Password is required."),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginProps {
    onNavigate?: (path: string) => void
}

function AnimatedIllustration() {
    return (
        <div className="relative h-full w-full overflow-hidden">
            {/* Main floating geometric shapes */}
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Central hexagon container */}
                <svg
                    viewBox="0 0 400 400"
                    className="h-80 w-80"
                    aria-hidden="true"
                >
                    {/* Outer rotating ring */}
                    <g className="origin-center animate-spin" style={{ animationDuration: "20s" }}>
                        <polygon
                            points="200,20 380,110 380,290 200,380 20,290 20,110"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            className="text-primary/20"
                        />
                    </g>

                    {/* Inner rotating ring (opposite direction) */}
                    <g className="origin-center" style={{ animation: "spin 15s linear infinite reverse" }}>
                        <polygon
                            points="200,60 320,130 320,270 200,340 80,270 80,130"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-primary/30"
                        />
                    </g>

                    {/* Floating nodes */}
                    <g className="origin-center animate-pulse" style={{ animationDuration: "3s" }}>
                        <circle cx="200" cy="20" r="8" className="fill-primary" />
                        <circle cx="380" cy="110" r="6" className="fill-primary/70" />
                        <circle cx="380" cy="290" r="8" className="fill-primary" />
                        <circle cx="200" cy="380" r="6" className="fill-primary/70" />
                        <circle cx="20" cy="290" r="8" className="fill-primary" />
                        <circle cx="20" cy="110" r="6" className="fill-primary/70" />
                    </g>

                    {/* Central orb with glow */}
                    <defs>
                        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="currentColor" className="text-primary" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="currentColor" className="text-primary" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <circle cx="200" cy="200" r="80" fill="url(#centerGlow)" />

                    {/* Central shape */}
                    <g className="origin-center animate-pulse" style={{ animationDuration: "2s" }}>
                        <polygon
                            points="200,150 243,175 243,225 200,250 157,225 157,175"
                            className="fill-primary/80"
                        />
                    </g>

                    {/* Orbiting particles */}
                    <g className="origin-center animate-spin" style={{ animationDuration: "8s" }}>
                        <circle cx="200" cy="100" r="4" className="fill-chart-1" />
                    </g>
                    <g className="origin-center" style={{ animation: "spin 12s linear infinite reverse" }}>
                        <circle cx="200" cy="80" r="3" className="fill-chart-2" />
                    </g>
                    <g className="origin-center animate-spin" style={{ animationDuration: "10s" }}>
                        <circle cx="200" cy="120" r="2" className="fill-chart-3" />
                    </g>
                </svg>
            </div>

            {/* Floating accent shapes */}
            <div className="absolute top-10 left-10 h-16 w-16 animate-float rounded-xl bg-primary/10 backdrop-blur-sm"
                style={{ animation: "float 6s ease-in-out infinite" }} />
            <div className="absolute bottom-20 right-16 h-12 w-12 animate-float rounded-full bg-chart-1/20"
                style={{ animation: "float 8s ease-in-out infinite reverse", animationDelay: "1s" }} />
            <div className="absolute top-1/4 right-10 h-8 w-8 animate-float rounded-lg bg-chart-2/20"
                style={{ animation: "float 7s ease-in-out infinite", animationDelay: "2s" }} />
            <div className="absolute bottom-1/4 left-16 h-10 w-10 animate-float rounded-full bg-chart-3/20"
                style={{ animation: "float 9s ease-in-out infinite reverse", animationDelay: "0.5s" }} />

            {/* Grid overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-[size:40px_40px] opacity-5" />
        </div>
    )
}

export function Login({ onNavigate }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true)
        try {
            await login(data.email, data.password)
            toast.success("Successfully logged in.")
            navigate({ to: "/" })
            onNavigate?.("/")
        } catch (error) {
            toast.error("Invalid email or password.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-[calc(100vh-4rem)] w-full">
            {/* Left side - Illustration */}
            <div className="hidden w-1/2 bg-gradient-to-br from-primary/5 via-background to-chart-1/5 lg:block dark:from-primary/10 dark:via-background dark:to-chart-1/10">
                <AnimatedIllustration />
            </div>

            {/* Right side - Login form */}
            <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2 lg:px-8">
                <Card className="w-full max-w-md border-0 bg-transparent shadow-none">
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                            <svg
                                viewBox="0 0 24 24"
                                className="h-8 w-8 text-primary"
                                fill="currentColor"
                            >
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <CardTitle className="text-2xl font-semibold tracking-tight">
                            Welcome back
                        </CardTitle>
                        <CardDescription>
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <FieldContent className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="pl-10"
                                        {...register("email")}
                                    />
                                </FieldContent>
                                <FieldError errors={[errors.email]} />
                            </Field>

                            <Field>
                                <div className="flex items-center justify-between">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="h-auto p-0 text-xs text-primary"
                                        onClick={() => { }}
                                    >
                                        Forgot password?
                                    </Button>
                                </div>
                                <FieldContent className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="pl-10 pr-10"
                                        {...register("password")}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span className="sr-only">
                                            {showPassword ? "Hide password" : "Show password"}
                                        </span>
                                    </Button>
                                </FieldContent>
                                <FieldError errors={[errors.password]} />
                            </Field>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign in"
                                )}
                            </Button>
                        </form>

                        <div className="relative my-6">
                            <Separator />
                            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                                or continue with
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

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Button
                                variant="link"
                                className="h-auto p-0 text-primary"
                                onClick={() => { }}
                            >
                                Sign up
                            </Button>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
