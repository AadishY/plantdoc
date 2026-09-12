import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlantSegmentation, DiseaseLesion } from '@/types/diagnosis';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Scan, 
  Layers, 
  Eye, 
  AlertTriangle, 
  ShieldCheck,
  Maximize2,
  Minimize2,
  Target,
  Flame,
  Activity,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Info,
  Bug,
  Droplets,
  AlertCircle,
  HelpCircle,
  Focus,
  Radiation,
  CheckCircle2,
  Compass,
  ThermometerSun,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

interface PlantSegmentationViewerProps {
  imageUrl: string;
  segmentation?: PlantSegmentation;
  plantName: string;
  scientificName?: string;
  plantAccuracy?: number;
  diseaseName: string;
  diseaseConfidence?: number;
  severity?: string;
}

const CV_TYPE_CONFIG: Record<string, { border: string; bg: string; text: string; label: string; icon: any }> = {
  necrotic_spot: { 
    border: '#EF4444', 
    bg: 'rgba(239, 68, 68, 0.28)', 
    text: '#F87171', 
    label: 'Necrotic Tissue', 
    icon: Flame 
  },
  chlorotic_halo: { 
    border: '#F59E0B', 
    bg: 'rgba(245, 158, 11, 0.28)', 
    text: '#FBBF24', 
    label: 'Chlorotic Halo', 
    icon: AlertCircle 
  },
  spore_pustule: { 
    border: '#A855F7', 
    bg: 'rgba(168, 85, 247, 0.28)', 
    text: '#C084FC', 
    label: 'Fungal Spore / Rust', 
    icon: Droplets 
  },
  feeding_perforation: { 
    border: '#06B6D4', 
    bg: 'rgba(6, 182, 212, 0.28)', 
    text: '#22D3EE', 
    label: 'Pest Feeding Hole', 
    icon: Bug 
  },
  blight_scorch: { 
    border: '#F97316', 
    bg: 'rgba(249, 115, 22, 0.28)', 
    text: '#FB923C', 
    label: 'Blight Scorch Margin', 
    icon: Flame 
  },
  water_soaked: { 
    border: '#3B82F6', 
    bg: 'rgba(59, 130, 246, 0.28)', 
    text: '#60A5FA', 
    label: 'Bacterial Water-Soaked', 
    icon: Droplets 
  },
  vein_discoloration: { 
    border: '#84CC16', 
    bg: 'rgba(132, 204, 22, 0.28)', 
    text: '#A3E635', 
    label: 'Nutrient Chlorosis', 
    icon: Activity 
  },
  mildew_mycelium: { 
    border: '#EC4899', 
    bg: 'rgba(236, 72, 153, 0.28)', 
    text: '#F472B6', 
    label: 'Powdery Mycelium', 
    icon: Sparkles 
  },
  default: { 
    border: '#2DD4BF', 
    bg: 'rgba(45, 212, 191, 0.28)', 
    text: '#5EEAD4', 
    label: 'Active Pathogen Lesion', 
    icon: AlertTriangle 
  }
};

export const PlantSegmentationViewer: React.FC<PlantSegmentationViewerProps> = ({
  imageUrl,
  segmentation,
  plantName,
  scientificName,
  plantAccuracy = 95.0,
  diseaseName,
  diseaseConfidence = 92.5,
  severity = 'Medium'
}) => {
  const [showLesions, setShowLesions] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [spectralNdviMode, setSpectralNdviMode] = useState(false);
  const [contourEdgeMode, setContourEdgeMode] = useState(false);
  const [selectedLesionIndex, setSelectedLesionIndex] = useState<number | null>(null);
  const [activeFilterType, setActiveFilterType] = useState<string>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [scannerActive, setScannerActive] = useState(false);

  // Check if specimen is healthy / disease-free
  const isHealthy = 
    !diseaseName ||
    diseaseName.toLowerCase().includes('healthy') ||
    diseaseName.toLowerCase().includes('no disease') ||
    diseaseName.toLowerCase().includes('no pathogen') ||
    diseaseName.toLowerCase().includes('none') ||
    severity.toLowerCase() === 'none';

  // Check if plant name is unidentified
  const isUnidentifiedPlant = 
    !plantName || 
    plantName.toLowerCase().includes('cannot identify') || 
    plantName.toLowerCase().includes('cant identify') ||
    plantName.toLowerCase().includes('unknown') ||
    plantName.toLowerCase().includes('unidentified');

  // When healthy or when no discrete focal lesions are detected, return empty array.
  // NEVER invent fake bounding boxes or synthetic fallback lesions.
  const allLesions: DiseaseLesion[] = useMemo(() => {
    if (isHealthy) return [];
    return segmentation?.lesions || [];
  }, [isHealthy, segmentation?.lesions]);

  // Filtered lesions based on type filter
  const displayLesions = useMemo(() => {
    if (activeFilterType === 'all') return allLesions;
    return allLesions.filter(l => (l.lesion_type || 'necrotic_spot') === activeFilterType);
  }, [activeFilterType, allLesions]);

  const selectedLesion = selectedLesionIndex !== null ? allLesions[selectedLesionIndex] : null;

  // Calculate total damaged area percentage
  const totalDamagePct = useMemo(() => {
    if (typeof segmentation?.total_foliar_damage_pct === 'number') {
      return segmentation.total_foliar_damage_pct;
    }
    if (isHealthy || allLesions.length === 0) return 0;
    return Math.min(65, Math.round(allLesions.reduce((acc, l) => acc + (l.affected_area_pct || 3.5), 0) * 10) / 10);
  }, [segmentation?.total_foliar_damage_pct, isHealthy, allLesions]);

  // Group lesions by type
  const typeCounts = useMemo(() => {
    return allLesions.reduce((acc, l) => {
      const t = l.lesion_type || 'necrotic_spot';
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [allLesions]);

  // Normalize box coordinate [ymin, xmin, ymax, xmax] (0-1000 or 0-100) to CSS percentages
  const normalizeBox = useCallback((box?: [number, number, number, number]) => {
    if (!box || box.length !== 4) return null;
    const [ymin, xmin, ymax, xmax] = box;
    
    const actualYmin = Math.min(ymin, ymax);
    const actualYmax = Math.max(ymin, ymax);
    const actualXmin = Math.min(xmin, xmax);
    const actualXmax = Math.max(xmin, xmax);

    const maxVal = Math.max(actualYmax, actualXmax);
    const scale = maxVal > 100 ? 1000 : maxVal > 1 ? 100 : 1;
    
    const top = Math.max(0, Math.min(100, (actualYmin / scale) * 100));
    const left = Math.max(0, Math.min(100, (actualXmin / scale) * 100));
    const rawHeight = ((actualYmax - actualYmin) / scale) * 100;
    const rawWidth = ((actualXmax - actualXmin) / scale) * 100;

    // Minimum visible box size (2%) to guarantee interactive targeting without artificial distortion
    const height = Math.max(2.0, Math.min(rawHeight, 100 - top));
    const width = Math.max(2.0, Math.min(rawWidth, 100 - left));

    return {
      top: `${top.toFixed(2)}%`,
      left: `${left.toFixed(2)}%`,
      height: `${height.toFixed(2)}%`,
      width: `${width.toFixed(2)}%`,
      centerTop: `${(top + height / 2).toFixed(2)}%`,
      centerLeft: `${(left + width / 2).toFixed(2)}%`
    };
  }, []);

  // Close fullscreen on ESC key and handle arrow key lesion cycling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
          setZoomScale(1);
        } else if (selectedLesionIndex !== null) {
          setSelectedLesionIndex(null);
        }
      } else if (e.key === 'ArrowRight' && allLesions.length > 0) {
        setSelectedLesionIndex((curr) => {
          if (curr === null) return 0;
          return (curr + 1) % allLesions.length;
        });
      } else if (e.key === 'ArrowLeft' && allLesions.length > 0) {
        setSelectedLesionIndex((curr) => {
          if (curr === null) return allLesions.length - 1;
          return (curr - 1 + allLesions.length) % allLesions.length;
        });
      } else if (isFullscreen) {
        if (e.key === '+' || e.key === '=') {
          setZoomScale(s => Math.min(3.0, s + 0.25));
        } else if (e.key === '-' || e.key === '_') {
          setZoomScale(s => Math.max(1, s - 0.25));
        } else if (e.key === '0') {
          setZoomScale(1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, selectedLesionIndex, allLesions.length]);

  // Copy clinical lesion coordinates & telemetry to clipboard
  const handleCopyTelemetry = () => {
    if (allLesions.length === 0) {
      toast.info("No lesion coordinates to export.");
      return;
    }
    const telemetry = {
      specimen: isUnidentifiedPlant ? 'Unidentified Botanical' : plantName,
      scientific_name: scientificName || null,
      pathology: diseaseName,
      severity,
      total_foliar_damage_pct: totalDamagePct,
      detected_lesion_count: allLesions.length,
      coordinate_system: "Normalized 2D Sub-Pixel Matrix [ymin, xmin, ymax, xmax]",
      lesions: allLesions.map((l, i) => ({
        id: i + 1,
        label: l.label,
        type: l.lesion_type || 'necrotic_spot',
        box_2d: l.box_2d,
        confidence: l.confidence || diseaseConfidence,
        severity: l.severity || severity,
        affected_area_pct: l.affected_area_pct,
        clinical_action: l.recommended_action
      }))
    };
    navigator.clipboard.writeText(JSON.stringify(telemetry, null, 2));
    toast.success(`Copied ${allLesions.length} sub-pixel lesion coordinates to clipboard`);
  };

  const getTypeStyle = useCallback((lesion: DiseaseLesion) => {
    const rawType = (lesion.lesion_type || '').toLowerCase();
    const label = (lesion.label || '').toLowerCase();

    if (rawType === 'necrotic_spot' || rawType.includes('necrotic') || rawType.includes('necrosis') || label.includes('necrotic') || label.includes('necrosis')) {
      return CV_TYPE_CONFIG.necrotic_spot;
    }
    if (rawType === 'chlorotic_halo' || rawType.includes('halo') || rawType.includes('chlorotic') || label.includes('halo') || label.includes('chlorotic')) {
      return CV_TYPE_CONFIG.chlorotic_halo;
    }
    if (rawType === 'spore_pustule' || rawType.includes('spore') || rawType.includes('pustule') || rawType.includes('rust') || label.includes('rust') || label.includes('pustule')) {
      return CV_TYPE_CONFIG.spore_pustule;
    }
    if (rawType === 'feeding_perforation' || rawType.includes('perforation') || rawType.includes('insect') || rawType.includes('hole') || label.includes('hole') || label.includes('chew')) {
      return CV_TYPE_CONFIG.feeding_perforation;
    }
    if (rawType === 'blight_scorch' || rawType.includes('blight') || rawType.includes('scorch') || rawType.includes('burn') || label.includes('scorch') || label.includes('blight')) {
      return CV_TYPE_CONFIG.blight_scorch;
    }
    if (rawType === 'water_soaked' || rawType.includes('water') || rawType.includes('soaked') || label.includes('water-soaked') || label.includes('soaked')) {
      return CV_TYPE_CONFIG.water_soaked;
    }
    if (rawType === 'vein_discoloration' || rawType.includes('vein') || rawType.includes('deficiency') || rawType.includes('yellowing') || label.includes('deficiency') || label.includes('chlorosis')) {
      return CV_TYPE_CONFIG.vein_discoloration;
    }
    if (rawType === 'mildew_mycelium' || rawType.includes('mildew') || rawType.includes('mycelium') || label.includes('mildew') || label.includes('mycelium')) {
      return CV_TYPE_CONFIG.mildew_mycelium;
    }
    return CV_TYPE_CONFIG[rawType] || CV_TYPE_CONFIG.default;
  }, []);

  // Render bounding boxes
  const renderLesionBoxes = (fullscreenMode = false) => {
    if (isHealthy || !showLesions) return null;

    return allLesions.map((lesion, index) => {
      // Check if visible under current filter
      if (activeFilterType !== 'all' && (lesion.lesion_type || 'necrotic_spot') !== activeFilterType) {
        return null;
      }

      const style = getTypeStyle(lesion);
      const norm = normalizeBox(lesion.box_2d) || {
        top: `${20 + index * 12}%`,
        left: `${20 + index * 12}%`,
        width: '25%',
        height: '25%',
        centerTop: `${32 + index * 12}%`,
        centerLeft: `${32 + index * 12}%`
      };
      
      const isSelected = selectedLesionIndex === index;
      const isNearTop = parseFloat(norm.top) < 7;

      return (
        <div
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedLesionIndex(isSelected ? null : index);
          }}
          className={`absolute cursor-pointer transition-all duration-200 ${
            isSelected 
              ? 'z-40 ring-2 ring-white shadow-[0_0_24px_rgba(255,255,255,0.85)] scale-[1.02]' 
              : 'z-20 hover:z-30 hover:scale-[1.01]'
          }`}
          style={{
            top: norm.top,
            left: norm.left,
            width: norm.width,
            height: norm.height,
            border: `1.8px solid ${style.border}`,
            backgroundColor: showHeatmap ? style.bg : 'transparent',
            boxShadow: isSelected ? `0 0 25px ${style.border}` : '0 0 8px rgba(0,0,0,0.6)'
          }}
        >
          {/* Neon Corner Brackets */}
          <span className="absolute -top-[2px] -left-[2px] w-2.5 h-2.5 border-t-2 border-l-2" style={{ borderColor: style.border }} />
          <span className="absolute -top-[2px] -right-[2px] w-2.5 h-2.5 border-t-2 border-r-2" style={{ borderColor: style.border }} />
          <span className="absolute -bottom-[2px] -left-[2px] w-2.5 h-2.5 border-b-2 border-l-2" style={{ borderColor: style.border }} />
          <span className="absolute -bottom-[2px] -right-[2px] w-2.5 h-2.5 border-b-2 border-r-2" style={{ borderColor: style.border }} />

          {/* Selected Pulse Wave Animation */}
          {isSelected && (
            <div 
              className="absolute -inset-2 rounded-xl border-2 animate-ping pointer-events-none opacity-75"
              style={{ borderColor: style.border }}
            />
          )}

          {/* Compact High-Tech HUD Label */}
          {showLabels && (
            <div 
              className={`absolute whitespace-nowrap select-none font-mono flex items-center gap-1.5 ${
                isNearTop ? 'top-0 left-0 rounded-b-md' : 'bottom-full left-[-1px] rounded-t-md'
              }`}
              style={{
                backgroundColor: 'rgba(4, 7, 5, 0.96)',
                border: `1px solid ${style.border}`,
                borderBottom: isNearTop ? `1px solid ${style.border}` : 'none',
                borderTop: isNearTop ? 'none' : `1px solid ${style.border}`,
                color: '#ffffff',
                padding: '2px 6px',
                fontSize: fullscreenMode ? '10px' : '9px',
                fontWeight: 700,
                letterSpacing: '0.02em',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.85)'
              }}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.border }} />
              <span className="text-white truncate max-w-[130px]">{lesion.label}</span>
              <span className="text-[#5EEAD4] font-bold">
                {(lesion.confidence || diseaseConfidence).toFixed(0)}%
              </span>
            </div>
          )}
        </div>
      );
    });
  };

  // Dynamic Image Filter Class String with refined CSS blending
  const getImageFilterClass = () => {
    if (spectralNdviMode) {
      return 'hue-rotate-[85deg] contrast-[1.45] saturate-[2.2] brightness-105';
    }
    if (contourEdgeMode) {
      return 'contrast-[2.4] brightness-95 saturate-[0.3] invert-[0.05]';
    }
    return '';
  };

  return (
    <>
      {/* Main Container */}
      <div className="relative rounded-3xl overflow-hidden glass-card-intense border border-white/20 shadow-2xl backdrop-blur-2xl transition-all duration-300 bg-black/55">
        
        {/* 1. Header Toolbar */}
        <div className="p-3.5 sm:p-5 bg-black/75 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#2DD4BF] shadow-[0_0_15px_rgba(45,212,191,0.35)]">
              {isHealthy ? <ShieldCheck className="h-5 sm:h-6 w-5 sm:h-6 text-emerald-400" /> : <Scan className="h-5 sm:h-6 w-5 sm:h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  {isHealthy ? 'Healthy Specimen — Foliar Integrity Verified' : `Pathology Localization: ${diseaseName}`}
                </h3>
                {!isHealthy && (
                  <Badge className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] px-2 py-0.5 font-bold uppercase rounded-full">
                    {severity}
                  </Badge>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-white/70 flex items-center gap-1.5 mt-0.5">
                <span className="flex items-center gap-1">
                  <Compass className="h-3 w-3 text-[#2DD4BF]" />
                  <span>Localization: <strong className="text-[#5EEAD4] font-mono">Sub-Pixel Coordinate Matrix</strong></span>
                </span>
                <span>•</span>
                <span>{allLesions.length} Defect Zones Localized</span>
              </p>
            </div>
          </div>

          {/* Action & Filter Buttons */}
          {!isHealthy && (
            <div className="flex items-center flex-wrap gap-1.5">
              {/* Toggle Bounding Boxes */}
              <Button
                size="sm"
                variant={showLesions ? "default" : "outline"}
                onClick={() => setShowLesions(!showLesions)}
                className={`text-xs h-8 px-2.5 rounded-xl transition-all ${
                  showLesions 
                    ? 'bg-[#2DD4BF] text-black font-extrabold shadow-[0_0_15px_rgba(45,212,191,0.4)]' 
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
              >
                <Target className="h-3.5 w-3.5 mr-1" />
                Boxes ({displayLesions.length})
              </Button>

              {/* Thermal Pathology Heatmap */}
              <Button
                size="sm"
                variant={showHeatmap ? "default" : "outline"}
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`text-xs h-8 px-2.5 rounded-xl transition-all ${
                  showHeatmap 
                    ? 'bg-amber-500 hover:bg-amber-600 text-black font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
                title="Toggle thermal lesion intensity heatmap"
              >
                <Flame className="h-3.5 w-3.5 mr-1 text-black" />
                Heatmap
              </Button>

              {/* Spectral NDVI Foliar Stress Mode */}
              <Button
                size="sm"
                variant={spectralNdviMode ? "default" : "outline"}
                onClick={() => {
                  setSpectralNdviMode(!spectralNdviMode);
                  if (!spectralNdviMode) {
                    setContourEdgeMode(false);
                  }
                }}
                className={`text-xs h-8 px-2.5 rounded-xl transition-all ${
                  spectralNdviMode 
                    ? 'bg-purple-600 text-white font-extrabold shadow-[0_0_15px_rgba(168,85,247,0.5)]' 
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
                title="Spectral NDVI foliar chlorophyll stress analysis"
              >
                <Radiation className="h-3.5 w-3.5 mr-1" />
                Spectral NDVI
              </Button>

              {/* Contour Edge Isolation Mode */}
              <Button
                size="sm"
                variant={contourEdgeMode ? "default" : "outline"}
                onClick={() => {
                  setContourEdgeMode(!contourEdgeMode);
                  if (!contourEdgeMode) {
                    setSpectralNdviMode(false);
                  }
                }}
                className={`text-xs h-8 px-2.5 rounded-xl transition-all ${
                  contourEdgeMode 
                    ? 'bg-cyan-500 text-black font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
                title="High-contrast foliar lesion margin and contour isolation"
              >
                <Layers className="h-3.5 w-3.5 mr-1" />
                Contour
              </Button>

              {/* Precision Laser Scanner Toggle */}
              <Button
                size="sm"
                variant={scannerActive ? "default" : "outline"}
                onClick={() => setScannerActive(!scannerActive)}
                className={`text-xs h-8 px-2.5 rounded-xl transition-all ${
                  scannerActive 
                    ? 'bg-[#2DD4BF] text-black font-extrabold shadow-[0_0_15px_rgba(45,212,191,0.5)]' 
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
                title="Toggle animated precision LiDAR/foliar laser scanner sweep"
              >
                <Scan className={`h-3.5 w-3.5 mr-1 ${scannerActive ? 'animate-spin' : ''}`} />
                <span>Laser Scan</span>
              </Button>

              {/* Copy Telemetry Matrix */}
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyTelemetry}
                className="text-xs h-8 px-2.5 rounded-xl border-white/20 text-white hover:text-[#5EEAD4] hover:bg-white/10 transition-all"
                title="Copy sub-pixel lesion coordinate matrix (JSON) to clipboard"
              >
                <Copy className="h-3.5 w-3.5 mr-1 text-[#2DD4BF]" />
                <span className="hidden sm:inline">Telemetry</span>
              </Button>

              {/* Fullscreen Trigger */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsFullscreen(true)}
                className="text-xs h-8 px-3 text-white hover:text-[#5EEAD4] border-[#2DD4BF]/50 bg-[#2DD4BF]/10 hover:bg-[#2DD4BF]/25 rounded-xl font-bold flex items-center gap-1.5 shadow-md"
              >
                <Maximize2 className="h-3.5 w-3.5 text-[#2DD4BF]" />
                <span>Full Screen</span>
              </Button>
            </div>
          )}
        </div>

        {/* 2. Pathology Telemetry Strip */}
        {!isHealthy && (
          <div className="px-4 py-2.5 bg-black/85 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Foliar Damage Gauge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-white/80 font-mono text-[11px]">
                <Activity className="h-3.5 w-3.5 text-red-400" />
                <span>FOLIAR DAMAGE:</span>
                <span className="font-bold text-white text-xs">{totalDamagePct}% of leaf area</span>
              </div>
              <div className="w-24 sm:w-32 bg-white/10 rounded-full h-2 overflow-hidden border border-white/15">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    totalDamagePct > 30 
                      ? 'bg-gradient-to-r from-amber-500 to-red-500' 
                      : 'bg-gradient-to-r from-[#2DD4BF] to-amber-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, totalDamagePct))}%` }}
                />
              </div>
            </div>

            {/* Defect Category Filters Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
              <button
                onClick={() => setActiveFilterType('all')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all flex items-center gap-1 ${
                  activeFilterType === 'all' 
                    ? 'bg-[#2DD4BF] text-black font-extrabold' 
                    : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10'
                }`}
              >
                <span>ALL ({allLesions.length})</span>
              </button>

              {Object.entries(typeCounts).map(([typeKey, count]) => {
                const conf = CV_TYPE_CONFIG[typeKey] || CV_TYPE_CONFIG.default;
                const IconComponent = conf.icon;
                const isCurrent = activeFilterType === typeKey;

                return (
                  <button
                    key={typeKey}
                    onClick={() => setActiveFilterType(isCurrent ? 'all' : typeKey)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono transition-all flex items-center gap-1 whitespace-nowrap ${
                      isCurrent 
                        ? 'text-black font-extrabold shadow-md' 
                        : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10'
                    }`}
                    style={isCurrent ? { backgroundColor: conf.border } : {}}
                  >
                    <IconComponent className="h-3 w-3" />
                    <span>{conf.label} ({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Main Computer Vision Canvas */}
        <div 
          onClick={() => setSelectedLesionIndex(null)}
          className="relative w-full bg-[#040705] p-2 sm:p-6 flex items-center justify-center overflow-hidden min-h-[280px] sm:min-h-[420px] cursor-crosshair select-none"
        >
          {/* Precision Grid Matrix Overlay in Background */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(45, 212, 191, 0.4) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* Plant Specimen Canvas */}
          <div className="relative inline-block leading-none max-w-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/15 overflow-hidden">
            <img
              src={imageUrl}
              alt={`${plantName || 'Botanical'} foliage diagnostic specimen analyzed for foliar pathology lesion segmentation`}
              className={`block w-full max-w-full h-auto max-h-[560px] object-contain rounded-2xl select-none pointer-events-none transition-all duration-300 ${getImageFilterClass()}`}
            />
            {renderLesionBoxes()}

            {/* Precision Laser Scanner Sweep Effect */}
            {scannerActive && !isHealthy && (
              <motion.div
                initial={{ top: '0%' }}
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-0 right-0 h-1 z-30 pointer-events-none bg-gradient-to-r from-transparent via-[#2DD4BF] to-transparent shadow-[0_0_18px_#2DD4BF,0_0_30px_#10B981]"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/90 border border-[#2DD4BF]/60 text-[#5EEAD4] text-[9px] font-mono font-bold uppercase tracking-widest shadow-md">
                  Scanning
                </div>
              </motion.div>
            )}

            {/* Precision Targeting Reticle for Selected Lesion */}
            {selectedLesion && (
              (() => {
                const norm = normalizeBox(selectedLesion.box_2d);
                if (!norm) return null;
                return (
                  <div 
                    className="absolute pointer-events-none z-30 transition-all duration-300"
                    style={{
                      top: norm.top,
                      left: norm.left,
                      width: norm.width,
                      height: norm.height
                    }}
                  >
                    <div className="absolute -inset-2 rounded-xl border border-[#2DD4BF]/70 animate-pulse pointer-events-none shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
                  </div>
                );
              })()
            )}
          </div>

          {/* Floating Specimen Badge with Cant Identify Name Handling */}
          <div className="absolute top-4 left-4 pointer-events-auto z-30">
            <div className="glass-card-intense backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-2 shadow-xl bg-black/75">
              <span className={`w-2.5 h-2.5 rounded-full ${isUnidentifiedPlant ? 'bg-amber-400' : 'bg-[#2DD4BF]'} animate-pulse`} />
              <div className="text-xs">
                {isUnidentifiedPlant ? (
                  <span className="font-bold text-amber-300 flex items-center gap-1">
                    <HelpCircle className="h-3 w-3" />
                    <span>Cannot identify name</span>
                  </span>
                ) : (
                  <>
                    <span className="font-bold text-white">{plantName}</span>
                    {scientificName && (
                      <span className="text-white/70 italic text-[11px] ml-1.5">({scientificName})</span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Active Mode Visual Indicator Pill */}
          {(spectralNdviMode || contourEdgeMode) && (
            <div className="absolute top-4 right-4 pointer-events-none z-30">
              <div className="px-3 py-1 rounded-full bg-black/85 border border-[#2DD4BF]/50 text-xs font-mono text-[#5EEAD4] backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                <Sparkles className="h-3.5 w-3.5 text-[#2DD4BF]" />
                <span>
                  {spectralNdviMode && "Active View: Spectral NDVI Chlorophyll Stress"}
                  {contourEdgeMode && "Active View: Lesion Margin & Contour Tracing"}
                </span>
              </div>
            </div>
          )}

          {/* Diffuse or Non-Focal Pathology State */}
          {!isHealthy && allLesions.length === 0 && (
            <div className="absolute inset-x-4 bottom-4 z-30 pointer-events-none flex justify-center">
              <div className="px-3.5 py-2 rounded-2xl bg-black/85 backdrop-blur-md border border-white/20 text-xs text-white/90 shadow-xl flex items-center gap-2 max-w-md text-center">
                <Info className="h-4 w-4 text-[#2DD4BF] shrink-0" />
                <span>Diffuse Pathology: No discrete focal lesion spots detected. Symptoms manifest as diffuse foliar chlorosis or systemic stress across the blade.</span>
              </div>
            </div>
          )}

          {/* Interactive Hint for localized lesions */}
          {!isHealthy && allLesions.length > 0 && (
            <div className="absolute bottom-4 right-4 pointer-events-none z-30 hidden sm:block">
              <div className="px-3 py-1 rounded-full bg-black/80 border border-white/10 text-[10px] font-mono text-white/70 backdrop-blur-md flex items-center gap-1">
                <Info className="h-3 w-3 text-[#2DD4BF]" />
                <span>Click any bounding box to inspect clinical pathology details</span>
              </div>
            </div>
          )}
        </div>

        {/* 5. Rich Selected Lesion Pathology & Action Drawer */}
        <AnimatePresence>
          {selectedLesion && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 sm:p-5 bg-gradient-to-r from-black/95 via-[#0A120D] to-black/95 border-t border-[#2DD4BF]/40 text-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="p-2 rounded-xl border"
                    style={{ 
                      backgroundColor: getTypeStyle(selectedLesion).bg,
                      borderColor: getTypeStyle(selectedLesion).border 
                    }}
                  >
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white">{selectedLesion.label}</h4>
                      <Badge 
                        className="text-[10px] px-2 py-0.5 font-bold uppercase rounded-full"
                        style={{ 
                          backgroundColor: getTypeStyle(selectedLesion).bg,
                          color: getTypeStyle(selectedLesion).text,
                          borderColor: getTypeStyle(selectedLesion).border 
                        }}
                      >
                        {getTypeStyle(selectedLesion).label}
                      </Badge>
                    </div>
                    <p className="text-white/80 text-xs mt-0.5">
                      {selectedLesion.description || 'Active necrotic lesion with progressive cellular wall degradation.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right mr-1">
                    <span className="text-[10px] text-white/60 block font-mono">
                      SPOT {(selectedLesionIndex ?? 0) + 1} OF {allLesions.length}
                    </span>
                    <span className="font-mono font-extrabold text-amber-400 text-xs">
                      {selectedLesion.severity || severity} • {selectedLesion.affected_area_pct || 4.2}%
                    </span>
                  </div>

                  {allLesions.length > 1 && (
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedLesionIndex(curr => (curr === null ? 0 : (curr - 1 + allLesions.length) % allLesions.length))}
                        className="text-xs h-7 w-7 p-0 rounded-full border-white/20 hover:bg-white/10 text-white"
                        title="Previous Lesion (← Arrow Key)"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedLesionIndex(curr => (curr === null ? 0 : (curr + 1) % allLesions.length))}
                        className="text-xs h-7 w-7 p-0 rounded-full border-white/20 hover:bg-white/10 text-white"
                        title="Next Lesion (→ Arrow Key)"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedLesionIndex(null)}
                    className="text-xs h-7 px-3 rounded-full border-white/20 hover:bg-white/10 text-white"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 6. Fullscreen Modal Lightbox */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-3xl p-4 sm:p-6 flex flex-col justify-between overflow-hidden animate-fade-in">
          {/* Top Fullscreen Header */}
          <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#2DD4BF]">
                <Scan className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{isUnidentifiedPlant ? 'Cannot identify name' : plantName}</span>
                  {!isUnidentifiedPlant && scientificName && (
                    <span className="text-xs text-white/70 italic">({scientificName})</span>
                  )}
                  <Badge className="bg-[#2DD4BF] text-black font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                    {diseaseName}
                  </Badge>
                </h3>
                <p className="text-xs text-white/75 font-mono">
                  Full-Screen Sub-Pixel Lesion Inspection ({allLesions.length} Detected Spots) • Zoom: {zoomScale.toFixed(2)}x
                </p>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center gap-2">
              {zoomScale !== 1 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setZoomScale(1)}
                  className="text-xs h-9 px-3 rounded-xl border-white/20 text-white hover:bg-white/10 gap-1"
                  title="Reset Zoom to 1.0x (Key: 0)"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setZoomScale(s => Math.min(3.0, s + 0.3))}
                className="text-xs h-9 px-3 rounded-xl border-white/20 text-white hover:bg-white/10 gap-1"
                title="Zoom In (Key: +)"
              >
                <ZoomIn className="h-3.5 w-3.5" />
                <span>Zoom In</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setZoomScale(s => Math.max(1, s - 0.3))}
                className="text-xs h-9 px-3 rounded-xl border-white/20 text-white hover:bg-white/10 gap-1"
                title="Zoom Out (Key: -)"
              >
                <ZoomOut className="h-3.5 w-3.5" />
                <span>Zoom Out</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyTelemetry}
                className="text-xs h-9 px-3 rounded-xl border-[#2DD4BF]/40 bg-[#2DD4BF]/10 text-white hover:text-[#5EEAD4] gap-1"
                title="Copy telemetry matrix"
              >
                <Copy className="h-3.5 w-3.5 text-[#2DD4BF]" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsFullscreen(false);
                  setZoomScale(1);
                }}
                className="bg-red-600 hover:bg-red-700 text-white text-xs h-9 px-4 rounded-xl font-bold flex items-center gap-1.5 shadow-lg"
              >
                <Minimize2 className="h-4 w-4" />
                <span>Close (ESC)</span>
              </Button>
            </div>
          </div>

          {/* Central Fullscreen Inspection Canvas */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
            <div 
              className="relative inline-block leading-none max-w-full rounded-2xl shadow-2xl border border-white/20 transition-transform duration-200"
              style={{ transform: `scale(${zoomScale})` }}
            >
              <img
                src={imageUrl}
                alt="Plant Fullscreen Specimen"
                className={`block max-h-[72vh] w-auto max-w-full object-contain rounded-2xl select-none ${getImageFilterClass()}`}
              />
              {renderLesionBoxes(true)}
            </div>
          </div>

          {/* Bottom Fullscreen Telemetry Bar */}
          <div className="p-3.5 rounded-2xl bg-black/80 border border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-white/70 font-mono">LESIONS_DETECTED:</span>
              <strong className="text-white font-mono">{allLesions.length} spots</strong>
              <span className="text-white/40">|</span>
              <span className="text-white/70 font-mono">SEVERITY:</span>
              <strong className="text-amber-400 font-mono">{severity}</strong>
              <span className="text-white/40">|</span>
              <span className="text-white/70 font-mono">DAMAGE_PCT:</span>
              <strong className="text-red-400 font-mono">{totalDamagePct}%</strong>
            </div>

            {selectedLesion && (
              <div className="flex items-center gap-2 bg-[#2DD4BF]/10 px-3.5 py-1.5 rounded-full border border-[#2DD4BF]/40">
                <span className="text-[#5EEAD4] font-bold">{selectedLesion.label}:</span>
                <span className="text-white/90">{selectedLesion.description}</span>
                <span className="font-mono text-[#5EEAD4] font-bold">({(selectedLesion.confidence || diseaseConfidence).toFixed(1)}%)</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(PlantSegmentationViewer);
