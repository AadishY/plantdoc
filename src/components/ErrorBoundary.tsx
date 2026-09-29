import React, { Component, ErrorInfo, ReactNode, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Code2,
  Copy,
  Home,
  Leaf,
  RefreshCw,
  Scan,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DoodleLostPlant } from '@/components/ui/BotanicalDoodles';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

const DiagnosticCanvasNoticeView: React.FC<{
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
}> = ({ error, errorInfo, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [showTechDetails, setShowTechDetails] = useState(false);

  const handleCopyError = async () => {
    const errorText = `PlantDoc Error: ${error?.message || 'Unknown error'}\n\nStack:\n${error?.stack || ''}\n\nComponent Stack:\n${errorInfo?.componentStack || ''}`;

    try {
      await navigator.clipboard.writeText(errorText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access is optional; the diagnostics remain readable on screen.
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#060a08] text-white selection:bg-[#2DD4BF]/30 selection:text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_50%_10%,rgba(45,212,191,0.14),transparent_64%)]" />

      <header className="relative z-20 flex w-full items-center justify-between border-b border-white/10 bg-black/45 px-4 py-3 backdrop-blur-xl sm:px-8">
        <a href="/" className="group flex items-center gap-2" aria-label="PlantDoc home">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2DD4BF] to-[#10B981] text-black shadow-[0_0_15px_rgba(45,212,191,0.4)]">
            <Leaf className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-extrabold tracking-tight text-white group-hover:text-[#5EEAD4]">
            PlantDoc <span className="text-[#2DD4BF]">AI</span>
          </span>
        </a>
        <a href="/diagnose" className="inline-flex items-center gap-1.5 rounded-full border border-[#2DD4BF]/35 bg-[#2DD4BF]/10 px-3 py-1.5 text-xs font-semibold text-[#5EEAD4] hover:bg-[#2DD4BF]/20">
          <Scan className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Start a new scan</span>
          <span className="sm:hidden">New scan</span>
        </a>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-12 text-center sm:py-16">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/35 bg-amber-500/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300 sm:text-xs">
          <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
          Safe recovery mode
        </div>

        <div className="mb-5 flex items-center gap-4 rounded-[2rem] border border-white/10 bg-black/35 px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:gap-6 sm:px-8 sm:py-5">
          <DoodleLostPlant className="h-28 w-28 sm:h-36 sm:w-36" />
          <div className="text-left">
            <div className="font-mono text-3xl font-black tracking-tight text-amber-300 sm:text-5xl">Oops</div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45 sm:text-xs">Unexpected interruption</div>
          </div>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
          PlantDoc needs a quick reset.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-foreground/75 sm:text-base">
          The interface hit an unexpected error. Reload the workspace, or start a fresh diagnosis if you were in the middle of a scan.
        </p>

        <div className="mt-7 flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <Button
            onClick={onReset}
            className="h-11 flex-1 rounded-2xl bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#059669] font-extrabold text-black shadow-[0_0_28px_rgba(45,212,191,0.35)]"
          >
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Reload workspace
          </Button>
          <Button asChild variant="outline" className="h-11 flex-1 rounded-2xl border-white/20 bg-white/5 text-white hover:border-[#2DD4BF]/50 hover:bg-white/10 hover:text-[#5EEAD4]">
            <a href="/">
              <Home className="mr-2 h-4 w-4" aria-hidden="true" />
              Go home
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        </div>

        <div className="mt-8 w-full max-w-xl border-t border-white/10 pt-5 text-left">
          <button
            type="button"
            onClick={() => setShowTechDetails((visible) => !visible)}
            className="mx-auto flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-mono text-white/55 transition-colors hover:bg-white/5 hover:text-[#5EEAD4]"
            aria-expanded={showTechDetails}
          >
            <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
            {showTechDetails ? 'Hide technical details' : 'Show technical details'}
            {showTechDetails ? <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" /> : <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />}
          </button>

          {showTechDetails && (
            <div className="mt-3 space-y-3 rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-xs shadow-xl">
              <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                <span className="flex min-w-0 items-start gap-1.5 text-rose-300">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="break-words">{error?.name || 'Error'}: {error?.message || 'Unknown exception'}</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyError}
                  className="inline-flex shrink-0 items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 text-[11px] text-white/70 hover:bg-white/15 hover:text-white"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" aria-hidden="true" /> : <Copy className="h-3 w-3" aria-hidden="true" />}
                  {copied ? 'Copied' : 'Copy log'}
                </button>
              </div>
              {error?.stack && (
                <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap break-words rounded-lg border border-white/10 bg-black/55 p-2.5 text-[11px] leading-relaxed text-white/60 select-text">{error.stack}</pre>
              )}
              {errorInfo?.componentStack && (
                <div className="max-h-32 overflow-y-auto rounded-lg border border-white/10 bg-black/55 p-2.5 text-[10px] leading-relaxed text-white/50 select-text">
                  <span className="mb-1 block font-semibold text-white/70">Component stack</span>
                  <pre className="whitespace-pre-wrap break-words">{errorInfo.componentStack}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-black/35 py-4 text-center text-xs text-white/45">
        PlantDoc AI · Your plant-care workspace is ready when you are.
      </footer>
    </div>
  );
};

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PlantDoc Uncaught Error Boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <DiagnosticCanvasNoticeView
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
