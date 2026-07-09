import { useEffect, useRef } from 'react';
import { type LucideIcon, ArrowLeft } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <span
      className="pointer-events-none absolute rounded-full bg-primary/30 blur-sm"
      style={style}
    />
  );
}

function OrbitRing({ size, duration, delay }: { size: number; duration: number; delay: number }) {
  return (
    <span
      className="pointer-events-none absolute rounded-full border border-primary/10"
      style={{
        width: size,
        height: size,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        animation: `cs-spin ${duration}s linear ${delay}s infinite`,
        borderStyle: 'dashed',
      }}
    />
  );
}

export interface ComingSoonProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon: LucideIcon;
  features?: string[];
  backTo?: string;
  backLabel?: string;
}

export function ComingSoon({
  title,
  subtitle = 'Something awesome is on its way',
  description,
  icon: Icon,
  features = [],
  backTo = '/',
  backLabel = 'Back to Dashboard',
}: ComingSoonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    const stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.004 + 0.002,
    }));

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) s.speed *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${s.alpha * 0.5})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }

    draw();

    const ro = new ResizeObserver(() => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  const particles: React.CSSProperties[] = [
    { width: 6, height: 6, top: '18%', left: '12%', animation: 'cs-float 6s ease-in-out 0s infinite' },
    { width: 4, height: 4, top: '72%', left: '8%', animation: 'cs-float 8s ease-in-out 1s infinite' },
    { width: 8, height: 8, top: '30%', right: '10%', animation: 'cs-float 7s ease-in-out 2s infinite' },
    { width: 5, height: 5, top: '80%', right: '15%', animation: 'cs-float 5s ease-in-out 0.5s infinite' },
    { width: 7, height: 7, top: '55%', left: '5%', animation: 'cs-float 9s ease-in-out 1.5s infinite' },
    { width: 4, height: 4, top: '10%', right: '25%', animation: 'cs-float 6.5s ease-in-out 3s infinite' },
  ];

  return (
    <>
      {/* Keyframe injection */}
      <style>{`
        @keyframes cs-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes cs-float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50%       { transform: translateY(-12px) scale(1.15); opacity: 0.8; }
        }
        @keyframes cs-pulse-ring {
          0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
        }
        @keyframes cs-badge-glow {
          0%, 100% { box-shadow: 0 0 8px 2px rgba(99,102,241,0.25); }
          50%       { box-shadow: 0 0 20px 6px rgba(99,102,241,0.45); }
        }
        @keyframes cs-title-slide {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cs-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cs-title    { animation: cs-title-slide 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
        .cs-subtitle { animation: cs-fade-up     0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
        .cs-desc     { animation: cs-fade-up     0.7s cubic-bezier(0.16,1,0.3,1) 0.55s both; }
        .cs-badge    { animation: cs-fade-up     0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both,
                                  cs-badge-glow  3s  ease-in-out              1s  infinite; }
        .cs-actions  { animation: cs-fade-up     0.7s cubic-bezier(0.16,1,0.3,1) 0.7s both; }
        .cs-icon-float { animation: cs-float 5s ease-in-out infinite; }
        .cs-pulse {
          position: absolute; left: 50%; top: 50%;
          width: 160px; height: 160px;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          animation: cs-pulse-ring 3s ease-out infinite;
        }
      `}</style>

      <main className="animate-fade-in relative flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center overflow-hidden px-6 py-16">
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        />

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-violet-500/8 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-2xl" />
        </div>

        {/* Floating particles */}
        {particles.map((s, i) => (
          <Particle key={i} style={s} />
        ))}


        <div className="relative mb-10 flex items-center justify-center">
          <span className="cs-pulse" aria-hidden="true" />

          <div className="pointer-events-none absolute" aria-hidden="true">
            <OrbitRing size={160} duration={18} delay={0} />
          </div>
          <div className="pointer-events-none absolute" aria-hidden="true">
            <OrbitRing size={220} duration={26} delay={-3} />
          </div>
          <div className="pointer-events-none absolute" aria-hidden="true">
            <OrbitRing size={290} duration={36} delay={-6} />
          </div>

          <div className="cs-icon-float relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 shadow-xl backdrop-blur-sm">
            <Icon className="size-11 text-primary" strokeWidth={1.5} />
            <Sparkles
              className="absolute -top-3 -right-3 size-5 text-violet-400 opacity-80"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <span className="cs-badge mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          In Development
        </span>

        <h1 className="cs-title text-foreground mb-3 text-center text-4xl font-extrabold tracking-tight sm:text-5xl">
          {title}
          <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
            {' '}Coming Soon
          </span>
        </h1>

        <p className="cs-subtitle text-muted-foreground mb-2 text-center text-lg font-medium sm:text-xl">
          {subtitle}
        </p>

        {description && (
          <p className="cs-desc text-muted-foreground/80 mb-10 max-w-md text-center text-sm leading-relaxed">
            {description}
          </p>
        )}


        {features.length > 0 && (
          <div className="cs-desc mb-10 flex flex-wrap justify-center gap-2.5">
            {features.map((f) => (
              <span
                key={f}
                className="bg-muted/60 border-border/60 text-muted-foreground rounded-full border px-3.5 py-1 text-xs font-medium backdrop-blur-sm"
              >
                {f}
              </span>
            ))}
          </div>
        )}

        <div className="cs-actions flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="h-9 gap-2">
            <Link to={backTo}>
              <ArrowLeft className="size-4" />
              {backLabel}
            </Link>
          </Button>
        </div>
      </main>
    </>
  );
}
