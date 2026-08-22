import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PlantDoc Uncaught Error Boundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 text-center">
          <div className="glass-card-intense max-w-md w-full p-8 rounded-3xl border border-red-500/30 shadow-2xl space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <AlertTriangle className="h-7 w-7 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Diagnostic Canvas Notice</h2>
              <p className="text-xs text-foreground/75 leading-relaxed">
                {this.state.error?.message || 'An unexpected rendering anomaly occurred during vision processing.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                onClick={this.handleReset}
                className="w-full sm:w-auto bg-plantDoc-primary text-black font-semibold hover:bg-plantDoc-primary/90 text-xs h-10 px-5 rounded-xl gap-2"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reload Canvas</span>
              </Button>

              <Button
                onClick={() => { window.location.href = '/'; }}
                variant="outline"
                className="w-full sm:w-auto border-white/20 hover:bg-white/10 text-white text-xs h-10 px-5 rounded-xl gap-2"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Return Home</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
