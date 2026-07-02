import { useState } from "react"
import { Copy, Check, Globe, Lock, Code2, BookOpen, Terminal, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------



interface EndpointDef {
    id: string
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
    path: string
    summary: string
    description: string
    urlExample: string
    responseExample: string
    errorExample?: string
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const BASE_URL = "/api/v1/portfolio"



const ENDPOINTS: EndpointDef[] = [
    {
        id: "endpoint-overview",
        method: "GET",
        path: `${BASE_URL}/{username}`,
        summary: "Portfolio Overview",
        description:
            "Returns the complete portfolio homepage information for a given username, including the owner's profile and aggregate statistics.",
        urlExample: `${BASE_URL}/alexmorgan`,
        responseExample: `{
  "username": "alexmorgan",
  "fullName": "Alex Morgan",
  "bio": "Senior Software Engineer specializing in full-stack web development.",
  "avatar": "AM",
  "stats": {
    "totalProjects": 6,
    "publishedProjects": 4,
    "totalBlogs": 5,
    "publishedBlogs": 4,
    "totalSkills": 12
  }
}`,
        errorExample: `// 404 Not Found
{
  "error": "Portfolio not found",
  "message": "No portfolio exists for username 'unknownuser'"
}`,
    },
    {
        id: "endpoint-projects",
        method: "GET",
        path: `${BASE_URL}/{username}/projects`,
        summary: "List Projects",
        description:
            "Returns all published projects for the given portfolio owner. Draft and archived projects are excluded.",
        urlExample: `${BASE_URL}/alexmorgan/projects`,
        responseExample: `{
  "data": [
    {
      "id": "1",
      "title": "E-Commerce Platform",
      "description": "A full-stack e-commerce solution with real-time inventory and Stripe payments.",
      "status": "published",
      "featured": true,
      "technologies": ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
      "category": "Full Stack",
      "liveUrl": "https://shop.example.com",
      "githubUrl": "https://github.com/alexmorgan/ecommerce",
      "createdAt": "2024-01-15",
      "updatedAt": "2024-03-20"
    }
  ],
  "total": 4
}`,
        errorExample: `// 404 Not Found
{
  "error": "Portfolio not found",
  "message": "No portfolio exists for username 'unknownuser'"
}`,
    },
    {
        id: "endpoint-project-detail",
        method: "GET",
        path: `${BASE_URL}/{username}/projects/{id}`,
        summary: "Project Detail",
        description:
            "Returns a single project by its ID. Use the `id` field from the projects list to construct this URL.",
        urlExample: `${BASE_URL}/alexmorgan/projects/1`,
        responseExample: `{
  "id": "1",
  "title": "E-Commerce Platform",
  "description": "A full-stack e-commerce solution with real-time inventory, Stripe payments, and an admin dashboard built with Next.js and PostgreSQL.",
  "status": "published",
  "featured": true,
  "technologies": ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Tailwind CSS"],
  "category": "Full Stack",
  "liveUrl": "https://shop.example.com",
  "githubUrl": "https://github.com/alexmorgan/ecommerce",
  "createdAt": "2024-01-15",
  "updatedAt": "2024-03-20"
}`,
        errorExample: `// 404 Not Found
{
  "error": "Project not found",
  "message": "No project found with id '99' for username 'alexmorgan'"
}

// 400 Bad Request
{
  "error": "Invalid request",
  "message": "Project ID must be a valid identifier"
}`,
    },
    {
        id: "endpoint-blogs",
        method: "GET",
        path: `${BASE_URL}/{username}/blogs`,
        summary: "List Blogs",
        description:
            "Returns all published blog posts for the given portfolio owner. Draft posts are excluded.",
        urlExample: `${BASE_URL}/alexmorgan/blogs`,
        responseExample: `{
  "data": [
    {
      "id": "1",
      "title": "Building a Real-time Collaborative Editor from Scratch",
      "slug": "real-time-collaborative-editor",
      "excerpt": "A deep dive into CRDTs, operational transforms, and WebSocket architecture.",
      "status": "published",
      "featured": true,
      "tags": ["WebSockets", "CRDTs", "React", "Architecture"],
      "category": "Engineering",
      "readTime": 12,
      "publishedAt": "2024-03-15",
      "updatedAt": "2024-03-20"
    }
  ],
  "total": 4
}`,
        errorExample: `// 404 Not Found
{
  "error": "Portfolio not found",
  "message": "No portfolio exists for username 'unknownuser'"
}`,
    },
    {
        id: "endpoint-blog-detail",
        method: "GET",
        path: `${BASE_URL}/{username}/blogs/{slug}`,
        summary: "Blog Detail",
        description:
            "Returns a single blog post by its slug. Use the `slug` field from the blogs list — not the `id`. The response includes the full `content` body in Markdown.",
        urlExample: `${BASE_URL}/alexmorgan/blogs/real-time-collaborative-editor`,
        responseExample: `{
  "id": "1",
  "title": "Building a Real-time Collaborative Editor from Scratch",
  "slug": "real-time-collaborative-editor",
  "excerpt": "A deep dive into CRDTs, operational transforms, and WebSocket architecture.",
  "content": "Full markdown content of the blog post...",
  "status": "published",
  "featured": true,
  "tags": ["WebSockets", "CRDTs", "React", "Architecture"],
  "category": "Engineering",
  "readTime": 12,
  "publishedAt": "2024-03-15",
  "updatedAt": "2024-03-20"
}`,
        errorExample: `// 404 Not Found
{
  "error": "Blog not found",
  "message": "No blog post found with slug 'unknown-slug' for username 'alexmorgan'"
}

// 400 Bad Request
{
  "error": "Invalid request",
  "message": "Slug must be a valid URL-safe string"
}`,
    },
]

const REQUEST_EXAMPLES = {
    fetch: `const BASE = '${BASE_URL}'
const username = 'alexmorgan'

// Portfolio overview
const res = await fetch(\`\${BASE}/\${username}\`)
if (!res.ok) throw new Error('Portfolio not found')
const portfolio = await res.json()

// List projects
const projectsRes = await fetch(\`\${BASE}/\${username}/projects\`)
const { data: projects } = await projectsRes.json()

// Single project
const projectRes = await fetch(\`\${BASE}/\${username}/projects/1\`)
const project = await projectRes.json()

// List blogs
const blogsRes = await fetch(\`\${BASE}/\${username}/blogs\`)
const { data: blogs } = await blogsRes.json()

// Single blog post
const blogRes = await fetch(\`\${BASE}/\${username}/blogs/real-time-collaborative-editor\`)
const blog = await blogRes.json()`,

    axios: `import axios from 'axios'

const BASE = '${BASE_URL}'
const username = 'alexmorgan'

// Portfolio overview
const { data: portfolio } = await axios.get(\`\${BASE}/\${username}\`)

// List projects
const { data: { data: projects } } = await axios.get(\`\${BASE}/\${username}/projects\`)

// Single project
const { data: project } = await axios.get(\`\${BASE}/\${username}/projects/1\`)

// List blogs
const { data: { data: blogs } } = await axios.get(\`\${BASE}/\${username}/blogs\`)

// Single blog post
const { data: blog } = await axios.get(
  \`\${BASE}/\${username}/blogs/real-time-collaborative-editor\`
)`,

    curl: `# Portfolio overview
curl ${BASE_URL}/alexmorgan

# List projects
curl ${BASE_URL}/alexmorgan/projects

# Single project
curl ${BASE_URL}/alexmorgan/projects/1

# List blogs
curl ${BASE_URL}/alexmorgan/blogs

# Single blog post
curl ${BASE_URL}/alexmorgan/blogs/real-time-collaborative-editor`,
}

const NOTES = [
    "Only **published** portfolio data is returned. Draft and archived content is excluded.",
    "Usernames are **case-sensitive** — `alexmorgan` and `AlexMorgan` are different identifiers.",
    "Authentication is **not required** for any Portfolio API endpoint.",
    "Use the project `id` field when fetching a single project via the detail endpoint.",
    "Use the blog `slug` field (not `id`) when fetching a single blog post.",
    "The `content` field in blog detail responses contains the full post body as **Markdown**.",
    "The `liveUrl` and `githubUrl` fields in project responses may be **empty strings** — guard against empty values before rendering links.",
    "The `featured` field can be used to highlight featured projects or blog posts in your UI.",
    "List responses return a `total` count alongside the `data` array.",
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const METHOD_STYLES: Record<string, string> = {
    GET: "bg-info/10 text-info border border-info/30",
    POST: "bg-success/10 text-success border border-success/30",
    PUT: "bg-warning/10 text-warning border border-warning/30",
    PATCH: "bg-warning/10 text-warning border border-warning/30",
    DELETE: "bg-destructive/10 text-destructive border border-destructive/30",
}

function MethodBadge({ method }: { method: string }) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded px-2 py-0.5 font-mono text-xs font-semibold",
                METHOD_STYLES[method] ?? "bg-muted text-muted-foreground border border-border"
            )}
        >
            {method}
        </span>
    )
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="relative rounded-lg border border-border/60 bg-muted/40 dark:bg-secondary/20 overflow-hidden">
            {label && (
                <div className="flex items-center justify-between border-b border-border/60 bg-muted/60 dark:bg-secondary/40 px-4 py-2">
                    <span className="text-xs font-medium text-muted-foreground">{label}</span>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        aria-label="Copy code"
                    >
                        {copied ? (
                            <Check className="h-3.5 w-3.5 text-success" />
                        ) : (
                            <Copy className="h-3.5 w-3.5" />
                        )}
                        {copied ? "Copied" : "Copy"}
                    </button>
                </div>
            )}
            {!label && (
                <button
                    onClick={handleCopy}
                    className="absolute right-3 top-3 flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label="Copy code"
                >
                    {copied ? (
                        <Check className="h-3.5 w-3.5 text-success" />
                    ) : (
                        <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "Copied" : "Copy"}
                </button>
            )}
            <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
                <code className="font-mono text-foreground/80">{code}</code>
            </pre>
        </div>
    )
}

function ParamPill({ name, type, required }: { name: string; type: string; required?: boolean }) {
    return (
        <div className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/30 px-3 py-2">
            <code className="font-mono text-sm font-semibold text-foreground">{name}</code>
            <span className="text-xs text-muted-foreground">{type}</span>
            {required && (
                <Badge variant="outline" className="ml-auto h-5 text-[10px] text-destructive border-destructive/40">
                    required
                </Badge>
            )}
        </div>
    )
}

function SectionHeader({ id, icon: Icon, title, description }: {
    id: string
    icon: React.ComponentType<{ className?: string }>
    title: string
    description?: string
}) {
    return (
        <div id={id} className="scroll-mt-20">
            <div className="flex items-center gap-2.5 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
            </div>
            {description && (
                <p className="text-sm leading-7 text-muted-foreground mt-1 mb-4">{description}</p>
            )}
        </div>
    )
}

function EndpointSection({ endpoint }: { endpoint: EndpointDef }) {
    return (
        <div id={endpoint.id} className="scroll-mt-20">
            <Card className="overflow-hidden gap-0 py-0">
                {/* Endpoint header */}
                <CardHeader className="border-b border-border/60 bg-muted/30 py-4 gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <MethodBadge method={endpoint.method} />
                        <code className="font-mono text-sm text-foreground">
                            {endpoint.path}
                        </code>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground">{endpoint.summary}</p>
                        <p className="mt-0.5 text-sm leading-6 text-muted-foreground">{endpoint.description}</p>
                    </div>
                </CardHeader>

                <CardContent className="space-y-5 py-5">
                    {/* URL Example */}
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            URL Example
                        </p>
                        <div className="flex items-center gap-2 rounded-md border border-border/60 bg-muted/30 px-3 py-2">
                            <MethodBadge method={endpoint.method} />
                            <code className="font-mono text-sm text-foreground break-all">
                                {endpoint.urlExample}
                            </code>
                        </div>
                    </div>

                    {/* Path Parameters */}
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Path Parameters
                        </p>
                        <div className="space-y-1.5">
                            {endpoint.path.includes("{username}") && (
                                <ParamPill name="{username}" type="string" required />
                            )}
                            {endpoint.path.includes("{id}") && (
                                <ParamPill name="{id}" type="string" required />
                            )}
                            {endpoint.path.includes("{slug}") && (
                                <ParamPill name="{slug}" type="string" required />
                            )}
                        </div>
                    </div>

                    {/* Response example */}
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Response (200 OK)
                        </p>
                        <CodeBlock code={endpoint.responseExample} />
                    </div>

                    {/* Error example */}
                    {endpoint.errorExample && (
                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Error Responses
                            </p>
                            <CodeBlock code={endpoint.errorExample} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export function Developer(_props: { onNavigate?: (path: string) => void }) {
    return (
        <div className="min-h-full">
            {/* ── Main content ── */}
            <main className="max-w-4xl mx-auto px-6 py-8 pb-20 space-y-12">
                {/* Page hero */}
                <div className="rounded-xl border border-border/60 bg-gradient-to-br from-primary/5 via-background to-chart-1/5 p-6 dark:from-primary/10 dark:to-chart-1/10">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                            <Code2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Developer Portal
                            </h1>
                            <p className="mt-1.5 text-sm leading-7 text-muted-foreground max-w-2xl">
                                Public REST APIs for consuming Portfolio data. Build portfolio websites, personal
                                dashboards, mobile apps, and third-party integrations — no authentication required.
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <Badge variant="outline" className="text-xs gap-1">
                                    <Globe className="h-3 w-3" />
                                    Public API
                                </Badge>
                                <Badge variant="outline" className="text-xs gap-1">
                                    <Lock className="h-3 w-3" />
                                    No Auth Required
                                </Badge>
                                <Badge variant="outline" className="text-xs gap-1">
                                    <Layers className="h-3 w-3" />
                                    REST / JSON
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Introduction ── */}
                <section className="space-y-4">
                    <SectionHeader
                        id="introduction"
                        icon={BookOpen}
                        title="Introduction"
                    />
                    <p className="text-sm leading-7 text-muted-foreground">
                        The Portfolio API exposes a set of public read-only endpoints that let you access
                        portfolio data for any registered user by their username. The API is designed to be
                        simple, predictable, and beginner-friendly — every endpoint follows the same
                        username-scoped pattern.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-3">
                        {[
                            {
                                icon: Globe,
                                title: "Public Access",
                                desc: "No API keys or tokens. Every endpoint is openly accessible.",
                            },
                            {
                                icon: Code2,
                                title: "Username-scoped",
                                desc: "All data is accessed via the portfolio owner's username.",
                            },
                            {
                                icon: Terminal,
                                title: "JSON Responses",
                                desc: "All responses are standard JSON with consistent structure.",
                            },
                        ].map(({ icon: Icon, title, desc }) => (
                            <Card key={title} className="gap-2 py-4">
                                <CardContent className="px-4 flex gap-3">
                                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                                        <Icon className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">{title}</p>
                                        <p className="text-xs leading-5 text-muted-foreground">{desc}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <p className="text-sm leading-7 text-muted-foreground">
                        Typical use cases include rendering a public-facing portfolio website from this data,
                        building a personal dashboard that displays your content, or integrating portfolio
                        information into a third-party service.
                    </p>
                </section>

                <Separator />

                {/* ── Base URL ── */}
                <section className="space-y-4">
                    <SectionHeader
                        id="base-url"
                        icon={Globe}
                        title="Base URL"
                        description="All Portfolio API endpoints are served under the following base path."
                    />
                    <CodeBlock code={BASE_URL} />
                    <div className="rounded-lg border border-border/60 bg-muted/30 p-4 space-y-2">
                        <p className="text-sm font-semibold text-foreground">Username-based routing</p>
                        <p className="text-sm leading-6 text-muted-foreground">
                            Every endpoint is scoped to a portfolio owner's{" "}
                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-semibold">
                                username
                            </code>
                            . Append the username immediately after the base path:
                        </p>
                        <CodeBlock code={`${BASE_URL}/{username}\n\n// Example\n${BASE_URL}/alexmorgan`} />
                    </div>
                </section>

                <Separator />

                {/* ── Authentication ── */}
                <section className="space-y-4">
                    <SectionHeader
                        id="authentication"
                        icon={Lock}
                        title="Authentication"
                    />
                    <Alert className="border-success/30 bg-success/5 dark:bg-success/10">
                        <Lock className="h-4 w-4 text-success" />
                        <AlertTitle className="text-success">No authentication required</AlertTitle>
                        <AlertDescription className="text-muted-foreground">
                            All Portfolio API endpoints are public. You do not need an API key, bearer token, or
                            any authentication header to call them.
                        </AlertDescription>
                    </Alert>
                    <p className="text-sm leading-7 text-muted-foreground">
                        Simply make an HTTP GET request to any Portfolio API endpoint — no headers beyond
                        standard{" "}
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-semibold">
                            Accept: application/json
                        </code>{" "}
                        are necessary.
                    </p>
                </section>

                <Separator />

                {/* ── API Reference ── */}
                <section className="space-y-6">
                    <SectionHeader
                        id="api-reference"
                        icon={Terminal}
                        title="API Reference"
                        description="Five endpoints cover the full public portfolio surface: profile overview, projects, and blog posts."
                    />

                    {/* Endpoints summary table */}
                    <Card className="overflow-hidden gap-0 py-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/60 bg-muted/30">
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Method
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Endpoint
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                                            Description
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ENDPOINTS.map((ep, i) => (
                                        <tr
                                            key={ep.id}
                                            className={cn(
                                                "border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors cursor-pointer",
                                                i % 2 === 0 ? "" : "bg-muted/10"
                                            )}
                                            onClick={() => document.getElementById(ep.id)?.scrollIntoView({ behavior: "smooth" })}
                                        >
                                            <td className="px-4 py-3">
                                                <MethodBadge method={ep.method} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <code className="font-mono text-xs text-foreground/80">{ep.path}</code>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                                                {ep.summary}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Individual endpoint sections */}
                    <div className="space-y-8">
                        {ENDPOINTS.map((endpoint) => (
                            <EndpointSection key={endpoint.id} endpoint={endpoint} />
                        ))}
                    </div>
                </section>

                <Separator />

                {/* ── Request Examples ── */}
                <section className="space-y-4">
                    <SectionHeader
                        id="request-examples"
                        icon={Code2}
                        title="Request Examples"
                        description="Ready-to-use code snippets for the three most common HTTP clients."
                    />
                    <Tabs defaultValue="fetch">
                        <TabsList>
                            <TabsTrigger value="fetch">Fetch API</TabsTrigger>
                            <TabsTrigger value="axios">Axios</TabsTrigger>
                            <TabsTrigger value="curl">cURL</TabsTrigger>
                        </TabsList>
                        <TabsContent value="fetch" className="mt-3">
                            <CodeBlock code={REQUEST_EXAMPLES.fetch} label="JavaScript — Fetch API" />
                        </TabsContent>
                        <TabsContent value="axios" className="mt-3">
                            <CodeBlock code={REQUEST_EXAMPLES.axios} label="JavaScript — Axios" />
                        </TabsContent>
                        <TabsContent value="curl" className="mt-3">
                            <CodeBlock code={REQUEST_EXAMPLES.curl} label="Shell — cURL" />
                        </TabsContent>
                    </Tabs>
                </section>

                <Separator />

                {/* ── Error Handling ── */}
                <section className="space-y-4">
                    <SectionHeader
                        id="error-handling"
                        icon={Terminal}
                        title="Error Handling"
                        description="The API uses standard HTTP status codes. Errors return a JSON body with an error key and a human-readable message."
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                        {[
                            {
                                code: "200 OK",
                                desc: "Request succeeded. Response body contains the requested data.",
                                color: "text-success",
                                bg: "bg-success/5 border-success/20",
                            },
                            {
                                code: "400 Bad Request",
                                desc: "The request was malformed — e.g. an invalid ID or slug format.",
                                color: "text-warning",
                                bg: "bg-warning/5 border-warning/20",
                            },
                            {
                                code: "404 Not Found",
                                desc: "The requested resource does not exist — unknown username, ID, or slug.",
                                color: "text-destructive",
                                bg: "bg-destructive/5 border-destructive/20",
                            },
                            {
                                code: "500 Internal Server Error",
                                desc: "An unexpected server error. Retry after a short delay.",
                                color: "text-muted-foreground",
                                bg: "bg-muted/40 border-border",
                            },
                        ].map(({ code, desc, color, bg }) => (
                            <div
                                key={code}
                                className={cn("rounded-lg border p-4", bg)}
                            >
                                <p className={cn("font-mono text-sm font-semibold", color)}>{code}</p>
                                <p className="mt-1 text-xs leading-5 text-muted-foreground">{desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Error response shape
                        </p>
                        <CodeBlock
                            code={`{
  "error": "Not found",
  "message": "No portfolio exists for username 'unknownuser'"
}`}
                        />
                    </div>
                </section>

                <Separator />

                {/* ── Notes ── */}
                <section className="space-y-4">
                    <SectionHeader
                        id="notes"
                        icon={BookOpen}
                        title="Notes"
                        description="Important details to keep in mind when integrating with the Portfolio API."
                    />
                    <div className="rounded-lg border border-border/60 overflow-hidden">
                        {NOTES.map((note, i) => {
                            const parts = note.split(/\*\*(.*?)\*\*/g)
                            return (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex gap-3 px-4 py-3 text-sm leading-6",
                                        i % 2 === 0 ? "bg-background" : "bg-muted/20",
                                        i < NOTES.length - 1 ? "border-b border-border/40" : ""
                                    )}
                                >
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                        {i + 1}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {parts.map((part, j) =>
                                            j % 2 === 1 ? (
                                                <strong key={j} className="font-semibold text-foreground">
                                                    {part}
                                                </strong>
                                            ) : (
                                                part
                                            )
                                        )}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </section>
            </main>
        </div>
    )
}
