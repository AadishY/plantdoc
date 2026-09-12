import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPlantRecommendations, getClimateDatabByLocation, formatRecommendationError } from '@/services/api';
import { PlantGridSkeleton } from '@/components/ui/skeleton-loaders';
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { DoodleEmptyState } from "@/components/ui/DoodleEmptyState";
import { AiModeToggle, AiProcessingMode } from "@/components/AiModeToggle";
import { 
  Loader2, 
  Leaf, 
  Sun, 
  Droplet, 
  ThermometerSun, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  ShoppingBag, 
  CheckCircle2, 
  Calendar, 
  Wand2, 
  Check, 
  Search, 
  SlidersHorizontal, 
  Apple, 
  Flower2, 
  Wheat, 
  Salad, 
  ShieldCheck, 
  Zap, 
  Layers, 
  HeartHandshake, 
  Clock,
  Minus,
  Plus,
  Heart,
  Copy,
  Maximize2,
  ArrowUpDown,
  Filter,
  Download,
  Share2,
  Sprout,
  Snowflake,
  X
} from 'lucide-react';
import { PlantRecommendation, GrowingConditions, PlantCategory, PlantingSeason } from '@/types/recommendation';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardContent, EnhancedCardTitle, EnhancedCardDescription } from '@/components/ui/enhanced-card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const soilTypes = ["Loamy", "Clay", "Sandy", "Chalky", "Peaty", "Silty"];
const sunlightOptions = ["Full Sun", "Partial Sun", "Shade"];

const plantTypeOptions: { label: string; value: PlantCategory; icon: React.ReactNode; desc: string }[] = [
  { label: 'Mix (Default)', value: 'Mix', icon: <Sparkles className="h-4 w-4" />, desc: 'Balanced variety' },
  { label: 'Crops & Veggies', value: 'Crops', icon: <Wheat className="h-4 w-4" />, desc: 'High-yield food' },
  { label: 'Fruit Trees', value: 'Fruit', icon: <Apple className="h-4 w-4" />, desc: 'Trees & berries' },
  { label: 'Flowers', value: 'Flower', icon: <Flower2 className="h-4 w-4" />, desc: 'Ornamentals' },
  { label: 'Herbs', value: 'Herbs', icon: <Salad className="h-4 w-4" />, desc: 'Aromatic & culinary' }
];

const seasonOptions: { label: string; value: PlantingSeason; icon: React.ReactNode; desc: string; badgeColor: string }[] = [
  { label: 'All Seasons', value: 'All', icon: <Sparkles className="h-4 w-4" />, desc: 'Year-round & versatile', badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40' },
  { label: 'Spring', value: 'Spring', icon: <Sprout className="h-4 w-4" />, desc: 'Cool-season & early bloom', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { label: 'Summer', value: 'Summer', icon: <Sun className="h-4 w-4" />, desc: 'Heat-loving & sun harvest', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { label: 'Autumn', value: 'Autumn', icon: <Leaf className="h-4 w-4" />, desc: 'Late harvest & cool air', badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
  { label: 'Winter', value: 'Winter', icon: <Snowflake className="h-4 w-4" />, desc: 'Frost-hardy & cold frame', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' }
];

interface PlantCardProps {
  plant: PlantRecommendation; 
  index: number;
  isFavorite?: boolean;
  onToggleFavorite?: (plant: PlantRecommendation) => void;
}

// Memoized Animated Plant Card with Interactive Modal & Micro-interactions
const PlantCard = React.memo(
  React.forwardRef<HTMLDivElement, PlantCardProps>(({ 
    plant, 
    index, 
    isFavorite = false, 
    onToggleFavorite 
  }, ref) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const waterRating = plant.waterRating || 3;
  const matchScore = plant.matchScore || 96;

  const handleCopyCare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const careText = `🌿 ${plant.name} (${plant.scientificName || 'Botanical Specimen'})\n` +
      `• Match Compatibility: ${matchScore}%\n` +
      `• Sunlight: ${plant.sunlight} (${plant.sunlightType || 'Full Sun'})\n` +
      `• Water Requirement: ${plant.waterNeeds} (${waterRating}/5 droplets)\n` +
      `• Soil Preference: ${plant.soilPreference || 'Well-draining'} (pH ${plant.soilPhRange || '6.0–6.8'})\n` +
      `• Harvest Velocity: ${plant.growthVelocityDays || plant.growthTime || 'Seasonal'}\n` +
      `• Care Protocol:\n${plant.careInstructions.map((c, i) => `  ${i + 1}. ${c}`).join('\n')}\n` +
      (plant.companionPlants?.length ? `• Beneficial Companions: ${plant.companionPlants.join(', ')}\n` : '') +
      `— Formulated via PlantDoc AI Botanical Intelligence`;

    navigator.clipboard.writeText(careText);
    setIsCopied(true);
    toast.success(`Copied care guidelines for ${plant.name} to clipboard!`);
    setTimeout(() => setIsCopied(false), 2200);
  };

  return (
    <>
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 28, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ 
          duration: 0.45, 
          delay: Math.min(index * 0.05, 0.45),
          ease: [0.22, 1, 0.36, 1]
        }}
        whileHover={{ y: -5, transition: { duration: 0.25 } }}
        className="h-full flex flex-col"
      >
        <EnhancedCard 
          className="h-full flex flex-col overflow-hidden border border-white/20 glass-card-intense shadow-2xl hover:border-[#2DD4BF]/70 rounded-3xl transition-all duration-300 group bg-black/55 backdrop-blur-2xl relative"
          borderGlow={true}
        >
          {/* Top Rank Floating Ribbon */}
          <div className="absolute -top-1 -left-1 z-20">
            <div className={`px-3 py-1 rounded-br-2xl rounded-tl-3xl text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1 shadow-lg ${
              index === 0 
                ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black shadow-amber-500/30'
                : index === 1
                ? 'bg-gradient-to-r from-[#2DD4BF] to-[#10B981] text-black shadow-teal-500/30'
                : 'bg-black/80 text-white/90 border border-white/20'
            }`}>
              <Sparkles className="h-3 w-3" />
              <span>Rank #{index + 1}</span>
            </div>
          </div>

          {/* Plant Image: Real verified Wikimedia photo */}
          <div 
            onClick={() => setIsDetailOpen(true)}
            className="relative h-56 w-full bg-black/60 overflow-hidden border-b border-white/10 cursor-pointer"
          >
            {plant.imageUrl ? (
              <img 
                src={plant.imageUrl} 
                alt={`${plant.name} (${plant.scientificName || 'Botanical specimen'}) — Wikimedia verified botanical photography`}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out will-change-transform"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#2DD4BF]/15 to-black/60 p-4 text-center">
                <div className="p-4 rounded-2xl bg-[#2DD4BF]/20 mb-2 border border-[#2DD4BF]/40 shadow-[0_0_15px_rgba(45,212,191,0.3)]">
                  <Leaf className="h-9 w-9 text-[#2DD4BF]" />
                </div>
                <span className="text-sm font-extrabold text-white">{plant.name}</span>
                <span className="text-xs text-foreground/60 italic">{plant.scientificName}</span>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-70 group-hover:opacity-50 transition-opacity" />

            {/* Top Right Action & Badges */}
            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
              {/* Favorite Heart Button */}
              {onToggleFavorite && (
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  whileHover={{ scale: 1.15 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(plant);
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                    isFavorite 
                      ? 'bg-rose-500/90 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)]' 
                      : 'bg-black/60 border-white/20 text-white/70 hover:text-white hover:bg-black/80'
                  }`}
                  title={isFavorite ? "Remove from saved plants" : "Save to favorites"}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-white' : ''}`} />
                </motion.button>
              )}

              {/* Match Score Badge */}
              <Badge className="bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#059669] text-black font-black text-xs px-3 py-1 rounded-full shadow-[0_0_20px_rgba(45,212,191,0.7)] border-none">
                {matchScore}% Match
              </Badge>
            </div>

            {/* Inspect Dossier Hover Prompt */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <span className="px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#2DD4BF]/60 text-[#5EEAD4] text-xs font-semibold flex items-center gap-1.5 shadow-2xl">
                <Maximize2 className="h-3.5 w-3.5" />
                Expand Botanical Dossier
              </span>
            </div>

            {/* Bottom Badges on Image */}
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
              <Badge className="bg-black/80 backdrop-blur-md text-white border border-white/20 text-[10px] px-2.5 py-0.5 font-semibold rounded-full shadow-lg">
                {plant.family || 'Botanical'}
              </Badge>

              {plant.imageUrl && (
                <Badge className="bg-black/80 backdrop-blur-md text-[#5EEAD4] border border-[#2DD4BF]/50 text-[10px] px-2.5 py-0.5 font-bold rounded-full shadow-md">
                  Wikimedia Verified
                </Badge>
              )}
            </div>
          </div>

          {/* Header Info */}
          <EnhancedCardHeader className="pb-2 pt-4 px-5">
            <div className="flex items-start justify-between gap-2">
              <div 
                onClick={() => setIsDetailOpen(true)}
                className="cursor-pointer group/title"
              >
                <EnhancedCardTitle className="text-xl md:text-2xl text-white group-hover/title:text-[#5EEAD4] transition-colors font-extrabold tracking-tight flex items-center gap-2">
                  <span>{plant.name}</span>
                </EnhancedCardTitle>
                <EnhancedCardDescription className="italic text-xs text-foreground/75 font-serif mt-0.5">
                  {plant.scientificName}
                </EnhancedCardDescription>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap justify-end shrink-0">
                {plant.season && (
                  <Badge variant="outline" className="text-[10px] font-mono border-[#2DD4BF]/40 text-[#5EEAD4] bg-[#2DD4BF]/10 shadow-[0_0_10px_rgba(45,212,191,0.2)]">
                    {plant.season}
                  </Badge>
                )}
                {plant.hardinessRating && (
                  <Badge variant="outline" className="text-[10px] font-mono border-white/20 text-white/80 shrink-0">
                    {plant.hardinessRating}
                  </Badge>
                )}
              </div>
            </div>
          </EnhancedCardHeader>

          {/* Content & Traits */}
          <EnhancedCardContent className="pt-1 px-5 flex-grow flex flex-col justify-between space-y-4">
            <div className="space-y-3.5">
              <p className="text-xs text-foreground/85 line-clamp-3 leading-relaxed">
                {plant.description}
              </p>

              {/* Compatibility Highlight */}
              {plant.compatibilityReason && (
                <div className="p-2.5 rounded-xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/25 text-[11px] text-[#5EEAD4] flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#2DD4BF]" />
                  <span className="leading-snug">{plant.compatibilityReason}</span>
                </div>
              )}
              
              {/* Quick Metrics Visual Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-black/40 p-3 rounded-2xl border border-white/10">
                {/* Water with Droplet Rating Meter */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-foreground/60 font-medium">
                    <Droplet className="h-3 w-3 text-cyan-400" />
                    <span>Water</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <div 
                        key={lvl} 
                        className={`w-2 h-3.5 rounded-sm transition-all ${
                          lvl <= waterRating ? 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.7)]' : 'bg-white/10'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-white truncate block">{plant.waterNeeds}</span>
                </div>

                {/* Growth Duration */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-foreground/60 font-medium">
                    <Clock className="h-3 w-3 text-[#2DD4BF]" />
                    <span>Harvest</span>
                  </div>
                  <strong className="text-[11px] text-white block truncate">{plant.growthVelocityDays || plant.growthTime || '—'}</strong>
                  {plant.growthRate && <span className="text-[9px] text-foreground/50 truncate block">{plant.growthRate}</span>}
                </div>

                {/* Sunlight */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-foreground/60 font-medium">
                    <Sun className="h-3 w-3 text-amber-400" />
                    <span>Sunlight</span>
                  </div>
                  <strong className="text-[11px] text-white block truncate">{plant.sunlight || '—'}</strong>
                  {plant.sunlightType && <span className="text-[9px] text-amber-300/80 truncate block">{plant.sunlightType}</span>}
                </div>

                {/* Soil pH Range */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-foreground/60 font-medium">
                    <Layers className="h-3 w-3 text-emerald-400" />
                    <span>Soil / pH</span>
                  </div>
                  <strong className="text-[11px] text-white block truncate">
                    {plant.soilPhRange ? `pH ${plant.soilPhRange}` : (plant.soilPreference ? plant.soilPreference : '—')}
                  </strong>
                  {plant.soilPreference && <span className="text-[9px] text-emerald-300/80 truncate block">{plant.soilPreference}</span>}
                </div>
              </div>

              {/* 4-Season Planting Matrix */}
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-white/80 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-[#2DD4BF]" />
                    Seasonal Growth Calendar
                  </span>
                  <span className="text-[10px] text-foreground/60 font-mono">
                    Prime: <strong className="text-[#5EEAD4]">{plant.bestSeason || 'Spring / Summer'}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
                  {[
                    { name: 'Spring', active: plant.seasonalCalendar ? plant.seasonalCalendar.spring : (plant.bestSeason?.toLowerCase().includes('spring') ?? true) },
                    { name: 'Summer', active: plant.seasonalCalendar ? plant.seasonalCalendar.summer : (plant.bestSeason?.toLowerCase().includes('summer') ?? true) },
                    { name: 'Autumn', active: plant.seasonalCalendar ? plant.seasonalCalendar.autumn : ((plant.bestSeason?.toLowerCase().includes('fall') || plant.bestSeason?.toLowerCase().includes('autumn')) ?? false) },
                    { name: 'Winter', active: plant.seasonalCalendar ? plant.seasonalCalendar.winter : (plant.bestSeason?.toLowerCase().includes('winter') ?? false) }
                  ].map((season, idx) => (
                    <div
                      key={idx}
                      className={`py-1.5 px-1 rounded-xl border transition-colors ${
                        season.active 
                          ? 'bg-[#2DD4BF]/20 border-[#2DD4BF]/50 text-[#5EEAD4] shadow-sm' 
                          : 'bg-white/5 border-white/5 text-foreground/40'
                      }`}
                    >
                      {season.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Companion Ecology */}
              {plant.companionPlants && plant.companionPlants.length > 0 && (
                <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
                    <HeartHandshake className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Symbiotic Companion Species</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {plant.companionPlants.map((comp, idx) => (
                      <Badge key={idx} variant="outline" className="text-[10px] bg-black/40 border-emerald-500/30 text-emerald-200">
                        +{comp}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Care Guidelines */}
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#5EEAD4] flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Agronomic Best Practices:
                  </h4>
                  <button
                    type="button"
                    onClick={handleCopyCare}
                    className="text-[11px] font-medium text-[#2DD4BF] hover:text-[#5EEAD4] inline-flex items-center gap-1 transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Plan</span>
                      </>
                    )}
                  </button>
                </div>
                <ul className="text-xs space-y-1 text-foreground/80 pl-1">
                  {plant.careInstructions.slice(0, 3).map((inst, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#2DD4BF] font-extrabold">•</span>
                      <span className="leading-snug">{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Bar & Resource Links */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {plant.wikiUrl && (
                  <a 
                    href={plant.wikiUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 hover:scale-105 font-medium"
                  >
                    <BookOpen className="h-3 w-3 text-[#2DD4BF]" />
                    Wikipedia
                    <ExternalLink className="h-2.5 w-2.5 opacity-60 ml-0.5" />
                  </a>
                )}

                <a 
                  href={`https://www.google.com/search?q=${encodeURIComponent(plant.name + ' ' + plant.scientificName + ' gardening care guide')}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-[#2DD4BF]/20 hover:bg-[#2DD4BF]/30 text-[#5EEAD4] transition-all border border-[#2DD4BF]/40 hover:scale-105 font-medium"
                >
                  <Leaf className="h-3 w-3" />
                  Care
                  <ExternalLink className="h-2.5 w-2.5 opacity-60 ml-0.5" />
                </a>

                <a 
                  href={`https://www.google.com/search?q=${encodeURIComponent(plant.name + ' organic heirloom seeds buy online')}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-all border border-amber-500/40 hover:scale-105 font-medium"
                >
                  <ShoppingBag className="h-3 w-3" />
                  Seeds
                  <ExternalLink className="h-2.5 w-2.5 opacity-60 ml-0.5" />
                </a>
              </div>

              {/* Inspect Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDetailOpen(true)}
                className="text-xs h-7 px-2.5 text-[#5EEAD4] hover:text-white hover:bg-[#2DD4BF]/20 rounded-full border border-[#2DD4BF]/30"
              >
                <Maximize2 className="h-3 w-3 mr-1" />
                Details
              </Button>
            </div>
          </EnhancedCardContent>
        </EnhancedCard>
      </motion.div>

      {/* Expanded Botanical Dossier Modal Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl bg-black/90 backdrop-blur-3xl border border-[#2DD4BF]/40 text-white rounded-3xl p-6 shadow-[0_0_60px_rgba(45,212,191,0.3)] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-2 pb-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <Badge className="bg-gradient-to-r from-[#2DD4BF] to-[#10B981] text-black font-extrabold text-xs px-3 py-1 rounded-full">
                {matchScore}% Climate Compatibility Match
              </Badge>
              {plant.hardinessRating && (
                <Badge variant="outline" className="text-xs border-white/20 text-white/80 font-mono">
                  {plant.hardinessRating}
                </Badge>
              )}
            </div>

            <DialogTitle className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
              <span>{plant.name}</span>
            </DialogTitle>
            <DialogDescription className="text-sm italic text-foreground/75 font-serif">
              {plant.scientificName} {plant.family ? `• Family: ${plant.family}` : ''}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {/* Modal Image Header */}
            {plant.imageUrl && (
              <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-white/15">
                <img 
                  src={plant.imageUrl} 
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3">
                  <Badge className="bg-black/80 backdrop-blur-md text-[#5EEAD4] border border-[#2DD4BF]/50 text-xs px-3 py-1 font-bold rounded-full">
                    Wikimedia Foundation Verified Specimen
                  </Badge>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#2DD4BF] font-bold">
                Botanical Overview
              </h4>
              <p className="text-sm text-foreground/85 leading-relaxed">
                {plant.description}
              </p>
            </div>

            {/* Detailed Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-foreground/60 block">Sunlight</span>
                <strong className="text-white block">{plant.sunlight}</strong>
                <span className="text-[10px] text-amber-300">{plant.sunlightType || 'Full Sun'}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-foreground/60 block">Water Needs</span>
                <strong className="text-white block">{plant.waterNeeds}</strong>
                <span className="text-[10px] text-cyan-400">{waterRating}/5 Droplets</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-foreground/60 block">Soil & pH Range</span>
                <strong className="text-white block truncate">{plant.soilPhRange ? `pH ${plant.soilPhRange}` : 'Standard'}</strong>
                <span className="text-[10px] text-emerald-400 truncate block">{plant.soilPreference || 'Well-draining'}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-foreground/60 block">Harvest Window</span>
                <strong className="text-white block truncate">{plant.growthVelocityDays || plant.growthTime || 'Seasonal'}</strong>
                <span className="text-[10px] text-[#2DD4BF]">{plant.growthRate || 'Steady'}</span>
              </div>
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-foreground/60 block">Prime Season</span>
                <strong className="text-[#5EEAD4] block truncate">{plant.season || plant.bestSeason || 'Spring / Summer'}</strong>
                <span className="text-[10px] text-emerald-300/80">Optimal Growth</span>
              </div>
            </div>

            {/* Companion Ecology Full Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {plant.companionPlants && plant.companionPlants.length > 0 && (
                <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <HeartHandshake className="h-3.5 w-3.5 text-emerald-400" />
                    Symbiotic Companions:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {plant.companionPlants.map((c, i) => (
                      <Badge key={i} className="bg-black/60 text-emerald-200 border-emerald-500/40 text-xs">
                        +{c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {plant.companionAvoid && plant.companionAvoid.length > 0 && (
                <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-1.5">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <X className="h-3.5 w-3.5 text-rose-400" />
                    Avoid Planting Near:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {plant.companionAvoid.map((c, i) => (
                      <Badge key={i} className="bg-black/60 text-rose-200 border-rose-500/40 text-xs">
                        -{c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Full Agronomic Care Procedure */}
            <div className="space-y-2 p-4 rounded-2xl bg-black/40 border border-white/10">
              <h4 className="text-xs font-bold text-[#5EEAD4] flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Step-by-Step Agronomic Care Protocol:
              </h4>
              <ol className="space-y-2 text-xs text-foreground/85">
                {plant.careInstructions.map((inst, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#2DD4BF]/20 text-[#5EEAD4] font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{inst}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
              <Button
                type="button"
                onClick={handleCopyCare}
                className="bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#059669] text-black font-extrabold text-xs px-4 py-2 rounded-full shadow-lg"
              >
                {isCopied ? <Check className="h-3.5 w-3.5 mr-1 text-black" /> : <Copy className="h-3.5 w-3.5 mr-1 text-black" />}
                {isCopied ? "Care Protocol Copied!" : "Copy Full Care Protocol"}
              </Button>

              <div className="flex items-center gap-2">
                {plant.wikiUrl && (
                  <a
                    href={plant.wikiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 inline-flex items-center gap-1.5 transition-colors"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-[#2DD4BF]" />
                    Wikipedia
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                )}
                <Button
                  variant="outline"
                  onClick={() => setIsDetailOpen(false)}
                  className="border-white/20 text-white hover:bg-white/10 text-xs rounded-full"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
  })
);

PlantCard.displayName = 'PlantCard';

const RecommendPage = () => {
  useDocumentTitle(
    "Climate Botanical Recommendations & Hardiness — PlantDoc AI",
    "Discover climate-matched companion crops, trees, flowers, and herbs using verified Wikimedia Foundation botanical profiles."
  );

  const [recommendations, setRecommendations] = useState<PlantRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClimateFetching, setIsClimateFetching] = useState(false);
  const [hasAutoDetectedClimate, setHasAutoDetectedClimate] = useState(false);
  
  // Location States
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  // Plant Quantity State: Default 4, Range 1 to 12
  const [plantCount, setPlantCount] = useState<number>(4);

  // AI Mode State: 'smart' (Google Gemma 4 31B) vs 'fast')
  const [aiMode, setAiMode] = useState<AiProcessingMode>('smart');

  // Selected Plant Type / Category
  const [selectedPlantType, setSelectedPlantType] = useState<PlantCategory>('Mix');

  // Selected Target Season: 'All' (Flexible) | 'Spring' | 'Summer' | 'Autumn' | 'Winter'
  const [selectedSeason, setSelectedSeason] = useState<PlantingSeason>('All');

  // Dynamic Category & Sort states
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'harvest' | 'water' | 'name'>('match');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const handleToggleFavorite = (plant: PlantRecommendation) => {
    const key = plant.id || plant.name;
    setFavorites(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      if (updated[key]) {
        toast.success(`Saved ${plant.name} to favorites`);
      } else {
        toast.info(`Removed ${plant.name} from favorites`);
      }
      return updated;
    });
  };

  // Environmental Parameters (Blank by default — no artificial default values)
  const [temperature, setTemperature] = useState<number | ''>('');
  const [rainfall, setRainfall] = useState<number | ''>('');
  const [humidity, setHumidity] = useState<number | ''>('');
  const [ph, setPh] = useState<number | ''>('');
  const [soilType, setSoilType] = useState<string>('');
  const [sunlight, setSunlight] = useState<string>('');
  const [nitrogen, setNitrogen] = useState<number | ''>('');
  const [phosphorus, setPhosphorus] = useState<number | ''>('');
  const [potassium, setPotassium] = useState<number | ''>('');

  // Search Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Manual Trigger: Auto-detect climate when button clicked
  const handleAutoDetectClimate = async () => {
    if (!country.trim() && !state.trim() && !city.trim()) {
      toast.info("Please enter a Country, State, or City first to auto-detect climate.");
      return;
    }

    setIsClimateFetching(true);
    try {
      const data = await getClimateDatabByLocation(country.trim(), state.trim(), city.trim());
      setTemperature(data.temperature);
      setRainfall(data.rainfall);
      setHumidity(data.humidity);
      setHasAutoDetectedClimate(true);
      toast.success(`Climate auto-detected: ${data.temperature}°C, ${data.rainfall}mm rainfall, ${data.humidity}% humidity`);
    } catch (error) {
      toast.error("Could not auto-fetch climate. You can enter manually or leave blank.");
    } finally {
      setIsClimateFetching(false);
    }
  };

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setRecommendations([]);
    
    try {
      const conditions: GrowingConditions = {
        plantCount,
        mode: aiMode,
        ...(selectedSeason && selectedSeason !== 'All' ? { season: selectedSeason } : {}),
        ...(country.trim() ? { country: country.trim() } : {}),
        ...(state.trim() ? { state: state.trim() } : {}),
        ...(city.trim() ? { city: city.trim() } : {}),
        ...(temperature !== '' && !isNaN(Number(temperature)) ? { temperature: Number(temperature) } : {}),
        ...(rainfall !== '' && !isNaN(Number(rainfall)) ? { rainfall: Number(rainfall) } : {}),
        ...(humidity !== '' && !isNaN(Number(humidity)) ? { humidity: Number(humidity) } : {}),
        ...(ph !== '' && !isNaN(Number(ph)) ? { ph: Number(ph) } : {}),
        ...(soilType && soilType !== 'unspecified' && soilType !== 'any' ? { soilType } : {}),
        ...(sunlight && sunlight !== 'unspecified' && sunlight !== 'any' ? { sunlight } : {}),
        ...(nitrogen !== '' && !isNaN(Number(nitrogen)) ? { nitrogen: Number(nitrogen) / 100 } : {}),
        ...(phosphorus !== '' && !isNaN(Number(phosphorus)) ? { phosphorus: Number(phosphorus) / 100 } : {}),
        ...(potassium !== '' && !isNaN(Number(potassium)) ? { potassium: Number(potassium) / 100 } : {})
      };
      
      const plantRecommendations = await getPlantRecommendations(
        conditions, 
        selectedPlantType, 
        hasAutoDetectedClimate
      );
      setRecommendations(plantRecommendations);
      toast.success(
        `Found ${plantRecommendations.length} recommended ${selectedPlantType === 'Mix' ? 'plants' : selectedPlantType.toLowerCase()} via ${aiMode === 'fast' ? 'Fast Mode' : 'Smart Mode'}!`
      );
    } catch (error: any) {
      const friendlyMsg = formatRecommendationError(error);
      console.warn('[PlantDoc AI]:', friendlyMsg);
      toast.error(friendlyMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Export recommendations as JSON / Text
  const handleExportRecommendations = () => {
    if (recommendations.length === 0) return;
    const exportData = {
      location: { 
        country: country || 'Unspecified', 
        state: state || 'Unspecified', 
        city: city || 'Unspecified' 
      },
      climate: { 
        temperature: temperature !== '' ? temperature : 'Dynamic / Unspecified', 
        rainfall: rainfall !== '' ? rainfall : 'Dynamic / Unspecified', 
        humidity: humidity !== '' ? humidity : 'Dynamic / Unspecified', 
        soilType: soilType || 'Adaptable / Unspecified', 
        ph: ph !== '' ? ph : 'Neutral / Unspecified',
        targetSeason: selectedSeason !== 'All' ? selectedSeason : 'All Seasons'
      },
      speciesCount: recommendations.length,
      recommendations: recommendations.map(p => ({
        name: p.name,
        scientificName: p.scientificName,
        family: p.family,
        category: p.category,
        season: p.season || p.bestSeason || 'All Seasons',
        matchScore: p.matchScore,
        sunlight: p.sunlight,
        waterNeeds: p.waterNeeds,
        soilPreference: p.soilPreference,
        growthVelocityDays: p.growthVelocityDays || p.growthTime,
        careInstructions: p.careInstructions,
        companionPlants: p.companionPlants,
        wikipediaUrl: p.wikiUrl
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plantdoc-recommendations-${(state || country || 'regional').toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded botanical recommendation dossier!");
  };

  const filteredRecommendations = useMemo(() => {
    const list = recommendations.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || p.name.toLowerCase().includes(q) ||
        p.scientificName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.family && p.family.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (activeCategoryFilter === 'All') return true;
      if (activeCategoryFilter === 'Favorites') {
        return !!favorites[p.id || p.name];
      }
      if (activeCategoryFilter === 'Crops') {
        return p.category === 'Crops' || p.description.toLowerCase().includes('crop') || p.description.toLowerCase().includes('vegetable');
      }
      if (activeCategoryFilter === 'Fruit') {
        return p.category === 'Fruit' || p.description.toLowerCase().includes('fruit') || p.description.toLowerCase().includes('tree') || p.description.toLowerCase().includes('berry');
      }
      if (activeCategoryFilter === 'Flower') {
        return p.category === 'Flower' || p.description.toLowerCase().includes('flower') || p.description.toLowerCase().includes('bloom');
      }
      if (activeCategoryFilter === 'Herbs') {
        return p.category === 'Herbs' || p.description.toLowerCase().includes('herb') || p.description.toLowerCase().includes('aromatic');
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'water') {
        return (a.waterRating || 3) - (b.waterRating || 3);
      }
      if (sortBy === 'harvest') {
        const getDays = (str: string) => {
          const match = (str || '').match(/\d+/);
          return match ? parseInt(match[0], 10) : 999;
        };
        return getDays(a.growthVelocityDays || a.growthTime || '') - getDays(b.growthVelocityDays || b.growthTime || '');
      }
      return (b.matchScore || 95) - (a.matchScore || 95);
    });
  }, [recommendations, searchQuery, activeCategoryFilter, sortBy, favorites]);

  // Category counts for quick tabs
  const categoryCounts = useMemo(() => {
    const favoritesCount = Object.values(favorites).filter(Boolean).length;
    return {
      all: recommendations.length,
      favorites: favoritesCount
    };
  }, [recommendations, favorites]);

  return (
    <div className="flex flex-col min-h-screen relative">
      <Header sticky={false} />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 relative z-10">
        {/* Header Hero */}
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#5EEAD4] text-xs mb-3 font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            PlantDoc AI Botanical Intelligence Engine
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-white via-emerald-100 to-[#2DD4BF] bg-clip-text text-transparent">
            Find Perfect Plants for Your Garden
          </h1>
          <p className="text-foreground/80 text-sm md:text-base leading-relaxed mb-6">
            Select your plant type and location. PlantDoc AI analyzes regional hardiness to match thriving botanical species tailored to your local climate.
          </p>

          {/* Smart Mode vs. Fast Mode AI Selector */}
          <div className="flex justify-center">
            <AiModeToggle
              mode={aiMode}
              onChange={setAiMode}
              page="recommend"
            />
          </div>
        </div>
        
        {/* Input Parameters Form Card */}
        <div className="max-w-4xl mx-auto">
          <EnhancedCard className="shadow-2xl glass-card border border-white/20 rounded-3xl overflow-hidden bg-black/45 backdrop-blur-2xl">
            <EnhancedCardHeader className="border-b border-white/10 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <EnhancedCardTitle className="text-xl flex items-center gap-2 text-white">
                    <Leaf className="h-5 w-5 text-[#2DD4BF]" />
                    Growing Location & Conditions
                  </EnhancedCardTitle>
                  <EnhancedCardDescription>
                    Enter your region and choose which botanical category you want to grow.
                  </EnhancedCardDescription>
                </div>

                {/* Auto-Detect Climate Action Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAutoDetectClimate}
                  disabled={isClimateFetching || (!country.trim() && !state.trim() && !city.trim())}
                  className={`border-[#2DD4BF]/40 hover:bg-[#2DD4BF]/10 text-xs gap-1.5 h-9 font-semibold rounded-full transition-all ${hasAutoDetectedClimate ? 'bg-[#2DD4BF]/25 text-[#5EEAD4] border-[#2DD4BF] shadow-[0_0_15px_rgba(45,212,191,0.3)]' : 'text-white hover:text-[#5EEAD4]'}`}
                >
                  {isClimateFetching ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-[#2DD4BF]" />
                      Auto-Detecting...
                    </>
                  ) : hasAutoDetectedClimate ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#2DD4BF]" />
                      Climate Detected ({temperature}°C)
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-3.5 w-3.5 text-[#2DD4BF]" />
                      Auto-Detect Regional Climate
                    </>
                  )}
                </Button>
              </div>
            </EnhancedCardHeader>

            <EnhancedCardContent className="space-y-6 pt-6">
              {/* Location Input Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="country" className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                    Country (Optional)
                  </Label>
                  <Input 
                    id="country" 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. United States, India, UK" 
                    className="glass-input border-white/20 focus-visible:ring-[#2DD4BF] h-10 text-sm rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state" className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                    State / Province (Optional)
                  </Label>
                  <Input 
                    id="state" 
                    value={state} 
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. California, Maharashtra, Ontario" 
                    className="glass-input border-white/20 focus-visible:ring-[#2DD4BF] h-10 text-sm rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                    City / Town (Optional)
                  </Label>
                  <Input 
                    id="city" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Los Angeles, Mumbai, London"
                    className="glass-input border-white/20 focus-visible:ring-[#2DD4BF] h-10 text-sm rounded-xl"
                  />
                </div>
              </div>

              {/* Plant Type Selector (Mix, Crops, Fruit, Flower, Herbs) */}
              <div className="space-y-2.5 pt-2 border-t border-white/10">
                <Label className="text-xs font-semibold uppercase tracking-wider text-foreground/80 flex items-center gap-1.5">
                  <Leaf className="h-3.5 w-3.5 text-[#2DD4BF]" />
                  Select Plant Category to Recommend:
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {plantTypeOptions.map((option) => {
                    const isSelected = selectedPlantType === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedPlantType(option.value)}
                        className={`p-3.5 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition-all ${
                          isSelected 
                            ? 'bg-[#2DD4BF]/25 border-[#2DD4BF] text-white shadow-[0_0_20px_rgba(45,212,191,0.35)] scale-[1.02]' 
                            : 'bg-black/30 border-white/10 hover:border-[#2DD4BF]/40 hover:bg-black/40 text-foreground/80'
                        }`}
                      >
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#2DD4BF] text-black font-bold' : 'bg-white/10 text-[#2DD4BF]'}`}>
                          {option.icon}
                        </div>
                        <span className="text-xs font-bold">{option.label}</span>
                        <span className="text-[10px] text-foreground/60">{option.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Growing Season Selector (All Seasons, Spring, Summer, Autumn, Winter) */}
              <div className="space-y-2.5 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-foreground/80 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#2DD4BF]" />
                    Target Growing & Planting Season:
                  </Label>
                  <span className="text-[11px] font-mono text-[#5EEAD4] bg-[#2DD4BF]/10 px-2.5 py-0.5 rounded-full border border-[#2DD4BF]/25 shadow-sm">
                    {selectedSeason === 'All' ? 'All Seasons (Flexible)' : `${selectedSeason} Season`}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {seasonOptions.map((option) => {
                    const isSelected = selectedSeason === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedSeason(option.value)}
                        className={`p-3.5 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition-all group/btn ${
                          isSelected 
                            ? 'bg-[#2DD4BF]/25 border-[#2DD4BF] text-white shadow-[0_0_20px_rgba(45,212,191,0.35)] scale-[1.02]' 
                            : 'bg-black/30 border-white/10 hover:border-[#2DD4BF]/40 hover:bg-black/40 text-foreground/80'
                        }`}
                      >
                        <div className={`p-2 rounded-xl transition-colors ${isSelected ? 'bg-[#2DD4BF] text-black font-bold' : 'bg-white/10 text-[#2DD4BF] group-hover/btn:text-white'}`}>
                          {option.icon}
                        </div>
                        <span className="text-xs font-bold">{option.label}</span>
                        <span className="text-[10px] text-foreground/60">{option.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Species Quantity Selector (Default: 5, Max: 12) - Compact & Elegant */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 pb-0.5 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-foreground/80 flex items-center gap-1.5 cursor-pointer">
                    <Sparkles className="h-3.5 w-3.5 text-[#2DD4BF]" />
                    <span>Plants to Show:</span>
                  </Label>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#2DD4BF]/20 text-[#5EEAD4] border border-[#2DD4BF]/40">
                    {plantCount} {plantCount === 1 ? 'species' : 'species'}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Stepper with +/- and number */}
                  <div className="flex items-center bg-black/40 border border-white/15 rounded-xl p-0.5">
                    <button
                      type="button"
                      disabled={plantCount <= 1}
                      onClick={() => setPlantCount(prev => Math.max(1, prev - 1))}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:hover:bg-transparent transition-all"
                      title="Decrease plant count"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-[#5EEAD4] font-mono select-none">
                      {plantCount}
                    </span>
                    <button
                      type="button"
                      disabled={plantCount >= 12}
                      onClick={() => setPlantCount(prev => Math.min(12, prev + 1))}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:hover:bg-transparent transition-all"
                      title="Increase plant count"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional Advanced Environmental Sliders */}
              <Accordion type="single" collapsible className="w-full border border-white/10 rounded-xl px-4 bg-black/20">
                <AccordionItem value="advanced-options" className="border-none">
                  <AccordionTrigger className="text-sm font-medium text-plantDoc-primary hover:text-emerald-300 py-3">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      Fine-Tune Climate, Soil Type & Nutrient Levels (Optional)
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-5 pt-2 pb-4">
                    {/* Climate Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs text-foreground/70">
                          <Label htmlFor="temperature">Avg Temperature (°C)</Label>
                          {temperature !== '' && (
                            <button type="button" onClick={() => setTemperature('')} className="text-[10px] text-plantDoc-primary hover:underline">Clear</button>
                          )}
                        </div>
                        <Input 
                          id="temperature" 
                          type="number" 
                          placeholder="Blank (Optional)"
                          value={temperature}
                          onChange={(e) => {
                            const v = e.target.value;
                            setTemperature(v === '' ? '' : Number(v));
                            setHasAutoDetectedClimate(true);
                          }}
                          className="glass-input h-9 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs text-foreground/70">
                          <Label htmlFor="rainfall">Annual Rainfall (mm)</Label>
                          {rainfall !== '' && (
                            <button type="button" onClick={() => setRainfall('')} className="text-[10px] text-plantDoc-primary hover:underline">Clear</button>
                          )}
                        </div>
                        <Input 
                          id="rainfall" 
                          type="number" 
                          placeholder="Blank (Optional)"
                          value={rainfall}
                          onChange={(e) => {
                            const v = e.target.value;
                            setRainfall(v === '' ? '' : Number(v));
                            setHasAutoDetectedClimate(true);
                          }}
                          className="glass-input h-9 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs text-foreground/70">
                          <Label htmlFor="humidity">Avg Humidity (%)</Label>
                          {humidity !== '' && (
                            <button type="button" onClick={() => setHumidity('')} className="text-[10px] text-plantDoc-primary hover:underline">Clear</button>
                          )}
                        </div>
                        <Input 
                          id="humidity" 
                          type="number" 
                          placeholder="Blank (Optional)"
                          value={humidity}
                          onChange={(e) => {
                            const v = e.target.value;
                            setHumidity(v === '' ? '' : Number(v));
                            setHasAutoDetectedClimate(true);
                          }}
                          min="0"
                          max="100"
                          className="glass-input h-9 text-sm"
                        />
                      </div>
                    </div>
                    
                    {/* Soil & Light */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-white/5">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs text-foreground/70">
                          <Label>Soil Texture</Label>
                          {soilType && (
                            <button type="button" onClick={() => setSoilType('')} className="text-[10px] text-plantDoc-primary hover:underline">Clear</button>
                          )}
                        </div>
                        <Select value={soilType || "unspecified"} onValueChange={(val) => {
                          setSoilType(val === "unspecified" ? "" : val);
                          setHasAutoDetectedClimate(true);
                        }}>
                          <SelectTrigger className="glass-input h-9 text-sm">
                            <SelectValue placeholder="Leave blank / Unspecified" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unspecified">Leave blank / Unspecified</SelectItem>
                            {soilTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs text-foreground/70">
                          <Label>Sunlight Level</Label>
                          {sunlight && (
                            <button type="button" onClick={() => setSunlight('')} className="text-[10px] text-plantDoc-primary hover:underline">Clear</button>
                          )}
                        </div>
                        <Select value={sunlight || "unspecified"} onValueChange={(val) => {
                          setSunlight(val === "unspecified" ? "" : val);
                          setHasAutoDetectedClimate(true);
                        }}>
                          <SelectTrigger className="glass-input h-9 text-sm">
                            <SelectValue placeholder="Leave blank / Unspecified" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unspecified">Leave blank / Unspecified</SelectItem>
                            {sunlightOptions.map((option) => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs text-foreground/70">
                          <Label htmlFor="ph">Soil pH</Label>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-plantDoc-primary">
                              {ph !== '' ? ph : 'Blank'}
                            </span>
                            {ph !== '' && (
                              <button type="button" onClick={() => setPh('')} className="text-[10px] text-plantDoc-primary hover:underline">Clear</button>
                            )}
                          </div>
                        </div>
                        <Input 
                          id="ph" 
                          type="number" 
                          step="0.1"
                          min="3.0"
                          max="10.0"
                          placeholder="Blank (e.g. 6.5)"
                          value={ph}
                          onChange={(e) => {
                            const v = e.target.value;
                            setPh(v === '' ? '' : Number(v));
                            setHasAutoDetectedClimate(true);
                          }}
                          className="glass-input h-9 text-sm"
                        />
                      </div>
                    </div>
                    
                    {/* Soil Nutrients NPK */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-white/5">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs text-foreground/70">
                          <span>Nitrogen (N)</span>
                          <div className="flex items-center gap-2">
                            <span className="text-plantDoc-primary">{nitrogen !== '' ? `${nitrogen}%` : 'Blank'}</span>
                            {nitrogen !== '' && (
                              <button type="button" onClick={() => setNitrogen('')} className="text-[10px] text-plantDoc-primary hover:underline">Clear</button>
                            )}
                          </div>
                        </div>
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          placeholder="Blank (Optional)" 
                          value={nitrogen} 
                          onChange={(e) => { const v = e.target.value; setNitrogen(v === '' ? '' : Number(v)); setHasAutoDetectedClimate(true); }}
                          className="glass-input h-9 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs text-foreground/70">
                          <span>Phosphorus (P)</span>
                          <div className="flex items-center gap-2">
                            <span className="text-plantDoc-primary">{phosphorus !== '' ? `${phosphorus}%` : 'Blank'}</span>
                            {phosphorus !== '' && (
                              <button type="button" onClick={() => setPhosphorus('')} className="text-[10px] text-plantDoc-primary hover:underline">Clear</button>
                            )}
                          </div>
                        </div>
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          placeholder="Blank (Optional)" 
                          value={phosphorus} 
                          onChange={(e) => { const v = e.target.value; setPhosphorus(v === '' ? '' : Number(v)); setHasAutoDetectedClimate(true); }}
                          className="glass-input h-9 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs text-foreground/70">
                          <span>Potassium (K)</span>
                          <div className="flex items-center gap-2">
                            <span className="text-plantDoc-primary">{potassium !== '' ? `${potassium}%` : 'Blank'}</span>
                            {potassium !== '' && (
                              <button type="button" onClick={() => setPotassium('')} className="text-[10px] text-plantDoc-primary hover:underline">Clear</button>
                            )}
                          </div>
                        </div>
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          placeholder="Blank (Optional)" 
                          value={potassium} 
                          onChange={(e) => { const v = e.target.value; setPotassium(v === '' ? '' : Number(v)); setHasAutoDetectedClimate(true); }}
                          className="glass-input h-9 text-sm"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Submit Button */}
              <Button 
                onClick={handleGetRecommendations} 
                className="w-full bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#059669] hover:from-[#5EEAD4] hover:via-[#34D399] hover:to-[#10B981] text-black font-extrabold text-base py-6 rounded-full shadow-[0_0_35px_rgba(45,212,191,0.55)] transition-all transform hover:scale-[1.01] border border-[#5EEAD4]/60 cursor-pointer" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin text-black" />
                    Finding Optimal {selectedPlantType === 'Mix' ? 'Plants' : selectedPlantType}...
                  </>
                ) : (
                  <>
                    <Leaf className="mr-2 h-5 w-5" />
                    Get {selectedPlantType} Recommendations
                  </>
                )}
              </Button>
            </EnhancedCardContent>
          </EnhancedCard>
        </div>

        {/* Botanical Climate Intelligence Hub (Loading Stage with PlantGridSkeleton) */}
        {isLoading && (
          <div className="mt-10 space-y-8 max-w-6xl mx-auto">
            <div className="p-8 md:p-10 rounded-3xl bg-black/75 backdrop-blur-3xl border border-[#2DD4BF]/40 text-center space-y-6 shadow-[0_0_50px_rgba(45,212,191,0.25)] relative overflow-hidden animate-fade-in max-w-4xl mx-auto">
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#2DD4BF]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#10B981]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-[#2DD4BF]/30 animate-ping opacity-60" />
                <div className="absolute inset-2 rounded-full border border-[#10B981]/40 animate-pulse" />
                <div className="absolute inset-4 rounded-full border border-dashed border-[#5EEAD4]/60 animate-spin" style={{ animationDuration: '8s' }} />
                <div className="relative p-4 rounded-full bg-gradient-to-br from-[#2DD4BF]/30 to-[#059669]/30 border border-[#2DD4BF]/60 shadow-[0_0_25px_rgba(45,212,191,0.5)]">
                  <Wand2 className="h-8 w-8 text-[#5EEAD4] animate-bounce" style={{ animationDuration: '2s' }} />
                </div>
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#5EEAD4] text-xs font-mono font-semibold">
                  <Sparkles className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>Climate Intelligence & Wikimedia Synchronization</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                  Matching {plantCount} {selectedPlantType === 'Mix' ? 'Botanical Species' : selectedPlantType} for {[city, state, country].map(s => s ? s.trim() : '').filter(Boolean).join(', ') || 'your region'}...
                </h3>
              </div>

              <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden max-w-md mx-auto p-0.5 border border-white/15">
                <div className="bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#34D399] h-full rounded-full animate-progress" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono text-foreground/75 max-w-md mx-auto pt-2">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[#5EEAD4] block font-bold">{temperature !== '' ? `${temperature}°C` : 'Dynamic'} / {rainfall !== '' ? `${rainfall}mm` : 'Regional'}</span>
                  <span>Climate Profile</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[#5EEAD4] block font-bold">{soilType || 'Adapted'}</span>
                  <span>pH {ph !== '' ? ph : 'Neutral'} Matrix</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                  <span className="text-emerald-400 block font-bold">Target: {plantCount} Species</span>
                  <span>Botanical Library</span>
                </div>
              </div>
            </div>

            {/* 🌿 Dynamic Shimmering Skeleton Grid */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#2DD4BF] px-2">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>Generating {plantCount} climate-adapted botanical candidate dossiers...</span>
              </div>
              <PlantGridSkeleton count={plantCount} />
            </div>
          </div>
        )}
        
        {/* Recommendations Result Grid */}
        {recommendations.length > 0 && !isLoading && (
          <div className="mt-14 space-y-6 animate-fade-in">
            {/* Filter, Sort and Search Bar */}
            <div className="glass-card p-5 rounded-3xl border border-white/10 bg-black/55 backdrop-blur-2xl space-y-4 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-emerald-100 to-[#2DD4BF] bg-clip-text text-transparent">
                      Top Recommended {selectedPlantType === 'Mix' ? 'Species' : selectedPlantType} ({filteredRecommendations.length})
                    </h2>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#2DD4BF]/20 text-[#5EEAD4] border border-[#2DD4BF]/40">
                      Target: {plantCount}
                    </span>
                    {selectedSeason !== 'All' && (
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-[0_0_12px_rgba(251,191,36,0.25)]">
                        <Calendar className="h-3 w-3 text-amber-400" />
                        {selectedSeason} Season
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/70 mt-0.5">
                    Matched for {[city, state, country].map(s => s ? s.trim() : '').filter(Boolean).join(', ') || 'your region'} with verified Wikimedia Foundation profiles & high-res photography
                  </p>
                </div>

                {/* Search & Export Actions */}
                <div className="flex items-center gap-2.5 w-full md:w-auto">
                  <div className="relative flex-grow md:w-64">
                    <Search className="h-3.5 w-3.5 text-foreground/50 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                      placeholder="Search species or family..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="glass-input h-9 text-xs pl-8 pr-7 w-full rounded-xl"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-xs"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportRecommendations}
                    className="h-9 px-3 text-xs border-white/15 bg-white/5 text-white/80 hover:text-[#5EEAD4] hover:bg-white/10 rounded-xl shrink-0 flex items-center gap-1.5"
                    title="Export recommendations as JSON"
                  >
                    <Download className="h-3.5 w-3.5 text-[#2DD4BF]" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </div>
              </div>

              {/* Dynamic Filter Tabs & Sort Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                {/* Category & Favorites Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'All', label: 'All', count: categoryCounts.all },
                    { id: 'Crops', label: 'Crops', icon: Wheat },
                    { id: 'Fruit', label: 'Fruit & Trees', icon: Apple },
                    { id: 'Flower', label: 'Flowers', icon: Flower2 },
                    { id: 'Herbs', label: 'Herbs', icon: Sprout },
                    { id: 'Favorites', label: 'Favorites', count: categoryCounts.favorites, icon: Heart }
                  ].map((tab) => {
                    const isTabActive = activeCategoryFilter === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveCategoryFilter(tab.id)}
                        className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${
                          isTabActive
                            ? 'bg-[#2DD4BF]/20 border-[#2DD4BF] text-white font-semibold shadow-[0_0_12px_rgba(45,212,191,0.3)]'
                            : 'bg-white/5 border-white/10 text-foreground/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {Icon && <Icon className={`h-3 w-3 ${tab.id === 'Favorites' ? 'text-rose-400' : 'text-[#2DD4BF]'}`} />}
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                            isTabActive ? 'bg-[#2DD4BF] text-black font-bold' : 'bg-white/10 text-foreground/60'
                          }`}>
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Sort By Select */}
                <div className="flex items-center gap-2 text-xs text-foreground/70 ml-auto">
                  <span className="hidden sm:inline">Sort:</span>
                  <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-0.5">
                    {[
                      { id: 'match', label: 'Match %' },
                      { id: 'harvest', label: 'Harvest' },
                      { id: 'water', label: 'Water' },
                      { id: 'name', label: 'A-Z' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSortBy(s.id as any)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                          sortBy === s.id
                            ? 'bg-[#2DD4BF] text-black font-bold shadow-sm'
                            : 'text-foreground/70 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Plants Grid with Dynamic Animations */}
            {filteredRecommendations.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredRecommendations.map((plant, index) => (
                    <PlantCard 
                      key={plant.id || `${plant.name}-${index}`} 
                      plant={plant} 
                      index={index}
                      isFavorite={!!favorites[plant.id || plant.name]}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <DoodleEmptyState
                type="magnifier"
                badgeText="No Plant Matches"
                title={`No ${selectedPlantType === 'Mix' ? 'species' : selectedPlantType} found matching current filter`}
                description="Try clearing your search keyword, toggling category tabs, or checking your favorites."
                actionText="Clear All Filters"
                onAction={() => {
                  setSearchQuery('');
                  setActiveCategoryFilter('All');
                }}
                secondaryActionText="Reset Category"
                onSecondaryAction={() => {
                  setSearchQuery('');
                  setActiveCategoryFilter('All');
                  setSelectedPlantType('Mix');
                }}
              />
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default React.memo(RecommendPage);
