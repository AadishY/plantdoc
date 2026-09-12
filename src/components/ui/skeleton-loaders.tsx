import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Scan, Leaf, ShieldAlert } from 'lucide-react';

/**
 * 🌿 PlantCardSkeleton — Shimmering botanical card skeleton loader
 */
export const PlantCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl bg-black/45 backdrop-blur-2xl border border-white/10 p-6 space-y-5 overflow-hidden shadow-2xl relative">
      {/* Shimmer Ambient Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#2DD4BF]/10 rounded-full blur-2xl pointer-events-none animate-pulse" />

      {/* Image Skeleton */}
      <div className="relative aspect-[16/10] w-full rounded-2xl bg-white/[0.04] overflow-hidden flex items-center justify-center border border-white/10">
        <Skeleton className="w-full h-full bg-white/[0.06]" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent animate-shimmer" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full bg-white/10" />
          <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
        </div>
      </div>

      {/* Title & Binomial Skeleton */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40 rounded-lg bg-white/15" />
          <Skeleton className="h-5 w-16 rounded-full bg-[#2DD4BF]/20" />
        </div>
        <Skeleton className="h-4 w-28 rounded bg-white/10" />
      </div>

      {/* Description */}
      <div className="space-y-1.5 pt-1">
        <Skeleton className="h-3.5 w-full rounded bg-white/10" />
        <Skeleton className="h-3.5 w-5/6 rounded bg-white/10" />
      </div>

      {/* Agronomic Meters Grid Skeleton */}
      <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/10">
        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
          <Skeleton className="h-3 w-16 bg-white/10" />
          <Skeleton className="h-4 w-24 bg-white/15" />
        </div>
        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
          <Skeleton className="h-3 w-16 bg-white/10" />
          <Skeleton className="h-4 w-20 bg-white/15" />
        </div>
      </div>

      {/* 4-Season Calendar Skeleton */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <Skeleton className="h-3.5 w-28 bg-white/10" />
        <div className="grid grid-cols-4 gap-1.5">
          <Skeleton className="h-7 rounded-lg bg-white/10" />
          <Skeleton className="h-7 rounded-lg bg-white/10" />
          <Skeleton className="h-7 rounded-lg bg-white/10" />
          <Skeleton className="h-7 rounded-lg bg-white/10" />
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-28 rounded-full bg-white/10" />
        <Skeleton className="h-8 w-28 rounded-full bg-white/10" />
      </div>
    </div>
  );
};

/**
 * 🌿 PlantGridSkeleton — 6-card shimmer grid loader for RecommendPage
 */
export const PlantGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {Array.from({ length: count }).map((_, idx) => (
        <PlantCardSkeleton key={idx} />
      ))}
    </div>
  );
};

/**
 * 🔬 DiagnosisResultSkeleton — Full clinical dossier shimmer loader
 */
export const DiagnosisResultSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Header Badge & Specimen Name Skeleton */}
      <div className="p-8 rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/15 shadow-2xl relative overflow-hidden space-y-4 text-center">
        <div className="flex justify-center gap-2">
          <Skeleton className="h-6 w-36 rounded-full bg-[#2DD4BF]/20" />
          <Skeleton className="h-6 w-28 rounded-full bg-emerald-500/20" />
        </div>
        <Skeleton className="h-10 w-3/5 mx-auto rounded-xl bg-white/20" />
        <Skeleton className="h-5 w-2/5 mx-auto rounded-lg bg-white/10" />
      </div>

      {/* 2-Column: Segmentation Viewer Skeleton & Vital Score Rings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Foliar Lesion Canvas Skeleton (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/15 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-48 rounded bg-white/15" />
            <Skeleton className="h-7 w-24 rounded-full bg-white/10" />
          </div>
          <div className="aspect-[4/3] w-full rounded-2xl bg-white/[0.04] border border-white/10 relative overflow-hidden flex items-center justify-center">
            <Skeleton className="w-full h-full bg-white/[0.06]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/40">
              <Scan className="h-12 w-12 text-[#2DD4BF]/50 animate-pulse" />
              <span className="text-xs font-mono">Synthesizing Spatial Lesion Overlay...</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-10 rounded-xl bg-white/10" />
            <Skeleton className="h-10 rounded-xl bg-white/10" />
            <Skeleton className="h-10 rounded-xl bg-white/10" />
          </div>
        </div>

        {/* Right: Vital Score Rings & Telemetry (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/15 p-6 space-y-6">
          <Skeleton className="h-6 w-36 rounded bg-white/15" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                <Skeleton className="w-14 h-14 rounded-full bg-white/10" />
                <Skeleton className="h-3 w-16 bg-white/10" />
              </div>
            ))}
          </div>
          <div className="space-y-3 pt-2 border-t border-white/10">
            <Skeleton className="h-4 w-full bg-white/10" />
            <Skeleton className="h-4 w-4/5 bg-white/10" />
            <Skeleton className="h-4 w-3/4 bg-white/10" />
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <Skeleton className="h-4 w-32 bg-white/15" />
            <Skeleton className="h-3 w-full bg-white/10" />
            <Skeleton className="h-3 w-2/3 bg-white/10" />
          </div>
        </div>
      </div>

      {/* Bottom: Clinical Protocol Tabs Skeleton */}
      <div className="rounded-3xl bg-black/60 backdrop-blur-2xl border border-white/15 p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((t) => (
            <Skeleton key={t} className="h-9 w-28 rounded-full bg-white/10" />
          ))}
        </div>
        <div className="space-y-4 pt-2">
          <Skeleton className="h-6 w-48 rounded bg-white/15" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-28 rounded-2xl bg-white/[0.04] border border-white/10" />
            <Skeleton className="h-28 rounded-2xl bg-white/[0.04] border border-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
};
