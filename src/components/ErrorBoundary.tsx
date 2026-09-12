import React, { Component, ErrorInfo, ReactNode, useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Scan, 
  Leaf, 
  Sparkles, 
  Compass, 
  Droplet, 
  Flower2, 
  Layers, 
  Code2, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp,
  ShieldAlert,
  ArrowRight
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

const BOTANICAL_REMEDIES = [
  "Even healthy plants face occasional storms. A quick rinse and reboot restores photosynthesis! 🌿",
  "Patience is the gardener's greatest tool. Your botanical data has been safeguarded in local storage. 🌱",
  "Roots grow strongest through resilience. Reloading the diagnostic canvas will re-calibrate all sensory reticles. ✨",
  "Like pruning dead foliage, clearing the cache paves the way for fresh, vigorous blooms! 🌸"
];

// Rich 404-grade Botanical Error Fallback View
const DiagnosticCanvasNoticeView: React.FC<{
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
}> = ({ error, errorInfo, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [waterCount, setWaterCount] = useState(0);
  const [isBlooming, setIsBlooming] = useState(false);
  const [remedyIdx, setRemedyIdx] = useState(0);

  useEffect(() => {
    setRemedyIdx(Math.floor(Math.random() * BOTANICAL_REMEDIES.length));
  }, []);

  const handleWaterSprout = () => {
    const next = waterCount + 1;
    setWaterCount(next);
    if (next >= 3) {
      setIsBlooming(true);
    }
  };

  const handleCopyError = () => {
    const errorText = `PlantDoc Error: ${error?.message || 'Unknown error'}\n\nStack:\n${error?.stack || ''}\n\nComponent Stack:\n${errorInfo?.componentStack || ''}`;
    navigator.clipboard.writeText(errorText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#060a08] text-white flex flex-col justify-between relative overflow-x-hidden selection:bg-[#2DD4BF]/30 selection:text-white">
      {/* Background Volumetric Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#2DD4BF]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#10B981]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle Matrix Grid Texture */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(45, 212, 191, 0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Header Bar */}
      <header className="w-full px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-xl relative z-20 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2DD4BF] to-[#10B981] flex items-center justify-center text-black font-bold shadow-[0_0_15px_rgba(45,212,191,0.4)]">
            <Leaf className="h-4 w-4" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white group-hover:text-[#5EEAD4] transition-colors">
            PlantDoc <span className="text-[#2DD4BF]">AI</span>
          </span>
        </a>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => { window.location.href = '/diagnose'; }}
            size="sm"
            className="bg-[#2DD4BF]/15 hover:bg-[#2DD4BF]/25 text-[#5EEAD4] border border-[#2DD4BF]/40 rounded-full text-xs h-8 px-3.5 gap-1.5"
          >
            <Scan className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Diagnose Leaf</span>
          </Button>
          <Button
            onClick={() => { window.location.href = '/'; }}
            variant="outline"
            size="sm"
            className="border-white/20 hover:bg-white/10 text-white rounded-full text-xs h-8 px-3 gap-1.5"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Home</span>
          </Button>
        </div>
      </header>

      {/* Main Showcase Hero */}
      <main className="container mx-auto px-4 py-8 sm:py-12 relative z-10 flex flex-col items-center justify-center max-w-4xl text-center space-y-7">
        
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/75 border border-amber-500/40 text-amber-300 text-xs font-mono backdrop-blur-xl shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
          <span>Diagnostic Canvas Notice • Specimen Safeguard</span>
          <span className="text-white/40">|</span>
          <span className="text-white/80">Active Protection</span>
        </div>

        {/* Hand-Drawn Doodle Showcase */}
        <div className="relative flex flex-col items-center justify-center my-1">
          <div className="relative">
            <DoodleLostPlant className="w-44 h-44 sm:w-56 sm:h-56 mx-auto filter drop-shadow-[0_0_35px_rgba(45,212,191,0.35)]" />

            {isBlooming && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-[#2DD4BF] text-black text-xs font-black shadow-[0_0_25px_rgba(45,212,191,0.6)] flex items-center gap-1.5 border border-white/40 animate-bounce">
                <Flower2 className="h-3.5 w-3.5 text-black" />
                <span>Recovered & Re-calibrated! 🌿</span>
              </div>
            )}
          </div>

          {/* Interactive Sprout Revival */}
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={handleWaterSprout}
              className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#2DD4BF]/20 border border-white/15 hover:border-[#2DD4BF]/50 text-xs font-medium text-white/90 hover:text-[#5EEAD4] transition-all duration-300 backdrop-blur-xl active:scale-95"
              title="Click to nourish the recovery canvas"
            >
              <Droplet className="h-3.5 w-3.5 text-[#2DD4BF] group-hover:animate-bounce" />
              <span>
                {waterCount === 0 ? "Nourish the diagnostic canvas" : `Calibrated ${waterCount}x ${isBlooming ? "✨ (Active)" : ""}`}
              </span>
            </button>
          </div>
        </div>

        {/* Headline & Explanation */}
        <div className="space-y-3 max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Diagnostic Canvas Notice
          </h1>
          <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
            The neural diagnostic engine encountered a temporary rendering anomaly. Your session is safe—reloading or restarting the scan will restore full clinical telemetry.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md mx-auto pt-2">
          <Button
            onClick={onReset}
            className="w-full sm:w-auto flex-1 bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#059669] text-black font-extrabold hover:opacity-95 text-xs sm:text-sm h-11 px-6 rounded-2xl gap-2 shadow-[0_0_25px_rgba(45,212,191,0.4)]"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reload Diagnostic Canvas</span>
          </Button>

          <Button
            onClick={() => { window.location.href = '/diagnose'; }}
            variant="outline"
            className="w-full sm:w-auto flex-1 border-white/20 hover:border-[#2DD4BF]/60 bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm h-11 px-5 rounded-2xl gap-2 backdrop-blur-xl"
          >
            <Scan className="h-4 w-4 text-[#2DD4BF]" />
            <span>Diagnose New Leaf</span>
          </Button>
        </div>

        {/* Botanical Blessing Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-[#2DD4BF]/15 via-black/60 to-[#10B981]/15 border border-[#2DD4BF]/40 backdrop-blur-2xl max-w-lg mx-auto shadow-[0_0_35px_rgba(45,212,191,0.15)] text-left relative overflow-hidden">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#5EEAD4] shrink-0 mt-0.5">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div className="space-y-1 flex-1">
              <span className="text-[11px] font-mono font-bold text-[#5EEAD4] uppercase tracking-wider block">
                Botanical Resilience Note
              </span>
              <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed italic">
                "{BOTANICAL_REMEDIES[remedyIdx]}"
              </p>
            </div>
          </div>
        </div>

        {/* Collapsible Technical Diagnostics */}
        <div className="w-full max-w-xl mx-auto pt-2">
          <button
            onClick={() => setShowTechDetails(!showTechDetails)}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-white/60 hover:text-[#5EEAD4] transition-colors py-1 px-3 rounded-lg hover:bg-white/5"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>{showTechDetails ? "Hide Technical Diagnostics" : "View Technical Diagnostics"}</span>
            {showTechDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {showTechDetails && (
            <div className="mt-3 p-4 rounded-2xl bg-black/85 border border-white/15 text-left font-mono text-xs space-y-3 backdrop-blur-2xl animate-fade-in shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-red-400 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>{error?.name || 'Error'}: {error?.message || 'Unknown Exception'}</span>
                </span>
                <button
                  onClick={handleCopyError}
                  className="flex items-center gap-1 text-[11px] text-white/70 hover:text-white bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-md transition-colors"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? "Copied" : "Copy Log"}</span>
                </button>
              </div>

              {error?.stack && (
                <div className="max-h-40 overflow-y-auto text-[11px] text-white/60 bg-black/60 p-2.5 rounded-lg border border-white/10 leading-relaxed select-text">
                  <pre className="whitespace-pre-wrap">{error.stack}</pre>
                </div>
              )}

              {errorInfo?.componentStack && (
                <div className="max-h-32 overflow-y-auto text-[10px] text-white/50 bg-black/60 p-2.5 rounded-lg border border-white/10 leading-relaxed select-text">
                  <span className="text-white/70 font-semibold block mb-1">Component Stack:</span>
                  <pre className="whitespace-pre-wrap">{errorInfo.componentStack}</pre>
                </div>
              )}
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-white/50 border-t border-white/10 bg-black/40 backdrop-blur-xl relative z-20">
        <span>PlantDoc AI • Clinical Botanical Vision Safeguard</span>
      </footer>
    </div>
  );
};

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
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
