import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Home,
  Leaf,
  Scan,
  SearchX,
} from "lucide-react";
import { DoodleLostPlant } from "@/components/ui/BotanicalDoodles";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const RECOVERY_LINKS = [
  {
    to: "/diagnose",
    title: "Diagnose a plant",
    description: "Upload a leaf photo and start a guided assessment.",
    icon: Scan,
  },
  {
    to: "/recommend",
    title: "Find plant ideas",
    description: "Explore climate-aware recommendations for your space.",
    icon: Leaf,
  },
  {
    to: "/about",
    title: "Learn about PlantDoc",
    description: "See how the product turns plant evidence into guidance.",
    icon: Compass,
  },
] as const;

const NotFound: React.FC = () => {
  useDocumentTitle(
    "404 — Page Not Found | PlantDoc AI",
    "The PlantDoc AI page you requested could not be found. Return home or start a plant diagnosis.",
    "/404"
  );

  const location = useLocation();
  const navigate = useNavigate();
  const canGoBack = typeof window !== "undefined" && window.history.length > 1;

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#060a08] text-white selection:bg-[#2DD4BF]/30 selection:text-white">
      <Header />

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12 sm:py-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_50%_10%,rgba(45,212,191,0.14),transparent_64%)]" />
        <div className="relative w-full max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#2DD4BF]/35 bg-black/55 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#5EEAD4] shadow-[0_0_24px_rgba(45,212,191,0.12)] sm:text-xs">
              <SearchX className="h-3.5 w-3.5" aria-hidden="true" />
              Page not found
            </div>

            <div className="mx-auto mb-5 flex w-fit items-center gap-4 rounded-[2rem] border border-white/10 bg-black/35 px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:gap-6 sm:px-8 sm:py-5">
              <DoodleLostPlant className="h-28 w-28 sm:h-36 sm:w-36" />
              <div className="text-left">
                <div className="font-mono text-5xl font-black tracking-tight text-[#5EEAD4] sm:text-7xl">
                  404
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45 sm:text-xs">
                  Unmapped route
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
              This path grew somewhere else.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-foreground/75 sm:text-base">
              We couldn&apos;t find the page you requested. The rest of PlantDoc is ready—choose a safe starting point below or return to the home screen.
            </p>

            <div className="mx-auto mt-5 max-w-md rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-left font-mono text-[10px] text-white/45 sm:text-xs">
              <span className="mr-2 text-[#5EEAD4]">ROUTE</span>
              <span className="break-all text-white/75">{location.pathname}{location.search}</span>
            </div>

            <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                className="h-11 rounded-2xl bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#059669] px-6 font-extrabold text-black shadow-[0_0_28px_rgba(45,212,191,0.35)] transition-transform hover:scale-[1.02]"
              >
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                  Go to PlantDoc home
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              {canGoBack && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="h-11 rounded-2xl border-white/20 bg-white/5 px-6 text-white hover:border-[#2DD4BF]/50 hover:bg-white/10 hover:text-[#5EEAD4]"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                  Go back
                </Button>
              )}
            </div>
          </div>

          <section className="mt-12 border-t border-white/10 pt-8" aria-labelledby="recovery-heading">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5EEAD4]">Recovery paths</p>
                <h2 id="recovery-heading" className="mt-1 text-lg font-bold text-white sm:text-xl">
                  Keep caring for your plants
                </h2>
              </div>
              <span className="hidden font-mono text-[10px] text-white/35 sm:block">PLANTDOC / READY</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {RECOVERY_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="group rounded-2xl border border-white/10 bg-black/35 p-4 transition-colors hover:border-[#2DD4BF]/45 hover:bg-[#2DD4BF]/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4]"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2DD4BF]/25 bg-[#2DD4BF]/10 text-[#5EEAD4]">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <ArrowRight className="h-4 w-4 text-white/25 transition-transform group-hover:translate-x-1 group-hover:text-[#5EEAD4]" aria-hidden="true" />
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#5EEAD4]">{item.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/55">{item.description}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default React.memo(NotFound);
