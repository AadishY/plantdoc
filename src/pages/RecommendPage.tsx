import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/Header";
import { getPlantRecommendations, getClimateDatabByLocation } from '@/services/api';
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
  Salad
} from 'lucide-react';
import { PlantRecommendation, GrowingConditions, PlantCategory } from '@/types/recommendation';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardContent, EnhancedCardTitle, EnhancedCardDescription } from '@/components/ui/enhanced-card';

const soilTypes = ["Loamy", "Clay", "Sandy", "Chalky", "Peaty", "Silty"];
const sunlightOptions = ["Full Sun", "Partial Sun", "Shade"];

const plantTypeOptions: { label: string; value: PlantCategory; icon: React.ReactNode; desc: string }[] = [
  { label: 'Mix (Default)', value: 'Mix', icon: <Sparkles className="h-4 w-4" />, desc: 'Balanced variety' },
  { label: 'Crops & Veggies', value: 'Crops', icon: <Wheat className="h-4 w-4" />, desc: 'High-yield food' },
  { label: 'Fruit Trees', value: 'Fruit', icon: <Apple className="h-4 w-4" />, desc: 'Trees & berries' },
  { label: 'Flowers', value: 'Flower', icon: <Flower2 className="h-4 w-4" />, desc: 'Ornamentals' },
  { label: 'Herbs', value: 'Herbs', icon: <Salad className="h-4 w-4" />, desc: 'Aromatic & culinary' }
];

// Memoized Plant Card for heavy performance boost
const PlantCard = React.memo(({ plant }: { plant: PlantRecommendation }) => {
  return (
    <EnhancedCard 
      className="h-full flex flex-col overflow-hidden border border-white/20 glass-card-intense shadow-xl hover:border-[#2DD4BF]/50 rounded-3xl transition-all duration-200 group bg-black/45 backdrop-blur-2xl"
      borderGlow={true}
    >
      {/* Plant Image: Real verified Wikimedia photo */}
      <div className="relative h-52 w-full bg-black/40 overflow-hidden border-b border-white/10">
        {plant.imageUrl ? (
          <img 
            src={plant.imageUrl} 
            alt={plant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 will-change-transform"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#2DD4BF]/10 to-black/40 p-4 text-center">
            <div className="p-3.5 rounded-2xl bg-[#2DD4BF]/20 mb-2 border border-[#2DD4BF]/30">
              <Leaf className="h-8 w-8 text-[#2DD4BF]" />
            </div>
            <span className="text-sm font-bold text-white">{plant.name}</span>
            <span className="text-xs text-foreground/60 italic">{plant.scientificName}</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <Badge className="bg-black/80 backdrop-blur-md text-white border border-white/20 text-[10px] px-2.5 py-0.5 font-medium rounded-full">
            {plant.family || 'Botanical'}
          </Badge>
        </div>

        {/* Wikimedia Verified Tag */}
        {plant.imageUrl && (
          <div className="absolute bottom-2 right-2">
            <Badge className="bg-black/85 backdrop-blur-md text-[#5EEAD4] border border-[#2DD4BF]/40 text-[9px] px-2 py-0.5 font-semibold rounded-full">
              Wikimedia Verified
            </Badge>
          </div>
        )}
      </div>

      {/* Header Info */}
      <EnhancedCardHeader className="pb-2 pt-4">
        <EnhancedCardTitle className="text-xl text-white group-hover:text-[#5EEAD4] transition-colors font-bold">
          {plant.name}
        </EnhancedCardTitle>
        <EnhancedCardDescription className="italic text-xs text-foreground/70">
          {plant.scientificName}
        </EnhancedCardDescription>
      </EnhancedCardHeader>

      {/* Content & Traits */}
      <EnhancedCardContent className="pt-2 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <p className="text-xs text-foreground/85 line-clamp-3 leading-relaxed">
            {plant.description}
          </p>
          
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-black/30 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center gap-1.5 text-foreground/80">
              <ThermometerSun className="h-3.5 w-3.5 text-[#2DD4BF] shrink-0" />
              <span>Growth: <strong className="text-white">{plant.growthTime}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-foreground/80">
              <Droplet className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span>Water: <strong className="text-white">{plant.waterNeeds}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-foreground/80">
              <Sun className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>Light: <strong className="text-white">{plant.sunlight}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-foreground/80">
              <Calendar className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Season: <strong className="text-white">{plant.bestSeason}</strong></span>
            </div>
          </div>

          {/* Companion Plants */}
          {plant.companionPlants && plant.companionPlants.length > 0 && (
            <div className="text-xs">
              <span className="text-foreground/60 mr-1.5">Companion Plants:</span>
              <span className="text-[#5EEAD4] font-medium">
                {plant.companionPlants.join(', ')}
              </span>
            </div>
          )}

          {/* Care Guidelines */}
          <div className="pt-2 border-t border-white/10 space-y-1.5">
            <h4 className="text-xs font-semibold text-plantDoc-primary flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Cultivation Tips:
            </h4>
            <ul className="text-xs space-y-1 text-foreground/80 pl-1">
              {plant.careInstructions.slice(0, 3).map((inst, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-plantDoc-primary font-bold">•</span>
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Verified Resource Links */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2">
          {plant.wikiUrl && (
            <a 
              href={plant.wikiUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10 hover:scale-105"
            >
              <BookOpen className="h-3 w-3 text-[#2DD4BF]" />
              Wikipedia Profile
              <ExternalLink className="h-2.5 w-2.5 opacity-60 ml-0.5" />
            </a>
          )}

          <a 
            href={`https://www.google.com/search?q=${encodeURIComponent(plant.name + ' ' + plant.scientificName + ' gardening care guide')}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full bg-[#2DD4BF]/20 hover:bg-[#2DD4BF]/30 text-[#5EEAD4] transition-all border border-[#2DD4BF]/30 hover:scale-105"
          >
            <Leaf className="h-3 w-3" />
            Care Guide
            <ExternalLink className="h-2.5 w-2.5 opacity-60 ml-0.5" />
          </a>

          <a 
            href={`https://www.google.com/search?q=${encodeURIComponent(plant.name + ' seeds plant buy online')}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-all border border-amber-500/30 hover:scale-105"
          >
            <ShoppingBag className="h-3 w-3" />
            Buy Seeds
            <ExternalLink className="h-2.5 w-2.5 opacity-60 ml-0.5" />
          </a>
        </div>
      </EnhancedCardContent>
    </EnhancedCard>
  );
});

PlantCard.displayName = 'PlantCard';

const RecommendPage = () => {
  const [recommendations, setRecommendations] = useState<PlantRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClimateFetching, setIsClimateFetching] = useState(false);
  const [hasAutoDetectedClimate, setHasAutoDetectedClimate] = useState(false);
  
  // Location States
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  // Selected Plant Type / Category
  const [selectedPlantType, setSelectedPlantType] = useState<PlantCategory>('Mix');

  // Environmental Parameters
  const [temperature, setTemperature] = useState(24);
  const [rainfall, setRainfall] = useState(140);
  const [humidity, setHumidity] = useState(60);
  const [ph, setPh] = useState(6.5);
  const [soilType, setSoilType] = useState(soilTypes[0]);
  const [sunlight, setSunlight] = useState(sunlightOptions[0]);
  const [nitrogen, setNitrogen] = useState(50);
  const [phosphorus, setPhosphorus] = useState(50);
  const [potassium, setPotassium] = useState(50);

  // Search Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Manual Trigger: Auto-detect climate when button clicked
  const handleAutoDetectClimate = async () => {
    if (!country.trim() || !state.trim()) {
      toast.error("Please enter both Country and State/Province first.");
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
      toast.error("Could not auto-fetch climate. You can adjust manually or proceed.");
    } finally {
      setIsClimateFetching(false);
    }
  };

  const handleGetRecommendations = async () => {
    if (!country.trim() || !state.trim()) {
      toast.error("Please enter Country and State/Province to get accurate plant matches.");
      return;
    }

    setIsLoading(true);
    setRecommendations([]);
    
    try {
      const conditions: GrowingConditions = {
        country: country.trim(),
        state: state.trim(),
        city: city.trim(),
        temperature,
        rainfall,
        humidity,
        ph,
        soilType,
        sunlight,
        nitrogen: nitrogen / 100,
        phosphorus: phosphorus / 100,
        potassium: potassium / 100
      };
      
      const plantRecommendations = await getPlantRecommendations(
        conditions, 
        selectedPlantType, 
        hasAutoDetectedClimate
      );
      setRecommendations(plantRecommendations);
      toast.success(`Found 6 recommended ${selectedPlantType === 'Mix' ? 'plants' : selectedPlantType.toLowerCase()} with verified Wikimedia media!`);
    } catch (error: any) {
      console.error('Error getting recommendations:', error);
      toast.error(error?.message || "Failed to get plant recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter(p => {
      const q = searchQuery.toLowerCase();
      return !q || p.name.toLowerCase().includes(q) ||
        p.scientificName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
    });
  }, [recommendations, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 relative z-10">
        {/* Header Hero */}
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#5EEAD4] text-xs mb-3 font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            PlantDoc AI Botanical Matcher & Wikimedia Integration
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-white via-emerald-100 to-[#2DD4BF] bg-clip-text text-transparent">
            Find Perfect Plants for Your Garden
          </h1>
          <p className="text-foreground/80 text-sm md:text-base leading-relaxed">
            Select your plant type and location. PlantDoc AI analyzes regional hardiness to match 6 thriving botanical species, enriched with verified Wikimedia photography.
          </p>
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
                  disabled={isClimateFetching || !country.trim() || !state.trim()}
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
                    Country *
                  </Label>
                  <Input 
                    id="country" 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. United States, India, UK" 
                    required
                    className="glass-input border-white/20 focus-visible:ring-[#2DD4BF] h-10 text-sm rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state" className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                    State / Province *
                  </Label>
                  <Input 
                    id="state" 
                    value={state} 
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. California, Maharashtra, Ontario" 
                    required
                    className="glass-input border-white/20 focus-visible:ring-[#2DD4BF] h-10 text-sm rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                    City (Optional)
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
                        <Label htmlFor="temperature" className="text-xs text-foreground/70">Avg Temperature (°C)</Label>
                        <Input 
                          id="temperature" 
                          type="number" 
                          value={temperature}
                          onChange={(e) => {
                            setTemperature(Number(e.target.value));
                            setHasAutoDetectedClimate(true);
                          }}
                          className="glass-input h-9 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="rainfall" className="text-xs text-foreground/70">Annual Rainfall (mm)</Label>
                        <Input 
                          id="rainfall" 
                          type="number" 
                          value={rainfall}
                          onChange={(e) => {
                            setRainfall(Number(e.target.value));
                            setHasAutoDetectedClimate(true);
                          }}
                          className="glass-input h-9 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="humidity" className="text-xs text-foreground/70">Avg Humidity (%)</Label>
                        <Input 
                          id="humidity" 
                          type="number" 
                          value={humidity}
                          onChange={(e) => {
                            setHumidity(Number(e.target.value));
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
                        <Label className="text-xs text-foreground/70">Soil Texture</Label>
                        <Select value={soilType} onValueChange={(val) => {
                          setSoilType(val);
                          setHasAutoDetectedClimate(true);
                        }}>
                          <SelectTrigger className="glass-input h-9 text-sm">
                            <SelectValue placeholder="Select soil type" />
                          </SelectTrigger>
                          <SelectContent>
                            {soilTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-foreground/70">Sunlight Level</Label>
                        <Select value={sunlight} onValueChange={(val) => {
                          setSunlight(val);
                          setHasAutoDetectedClimate(true);
                        }}>
                          <SelectTrigger className="glass-input h-9 text-sm">
                            <SelectValue placeholder="Select sunlight" />
                          </SelectTrigger>
                          <SelectContent>
                            {sunlightOptions.map((option) => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-foreground/70">
                          <Label htmlFor="ph">Soil pH</Label>
                          <span className="font-semibold text-plantDoc-primary">{ph}</span>
                        </div>
                        <Slider
                          id="ph"
                          min={4.0}
                          max={9.0}
                          step={0.1}
                          value={[ph]}
                          onValueChange={(val) => {
                            setPh(val[0]);
                            setHasAutoDetectedClimate(true);
                          }}
                          className="py-2"
                        />
                      </div>
                    </div>
                    
                    {/* Soil Nutrients NPK */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-white/5">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-foreground/70">
                          <span>Nitrogen (N)</span>
                          <span className="text-plantDoc-primary">{nitrogen}%</span>
                        </div>
                        <Slider min={0} max={100} value={[nitrogen]} onValueChange={(v) => { setNitrogen(v[0]); setHasAutoDetectedClimate(true); }} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-foreground/70">
                          <span>Phosphorus (P)</span>
                          <span className="text-plantDoc-primary">{phosphorus}%</span>
                        </div>
                        <Slider min={0} max={100} value={[phosphorus]} onValueChange={(v) => { setPhosphorus(v[0]); setHasAutoDetectedClimate(true); }} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-foreground/70">
                          <span>Potassium (K)</span>
                          <span className="text-plantDoc-primary">{potassium}%</span>
                        </div>
                        <Slider min={0} max={100} value={[potassium]} onValueChange={(v) => { setPotassium(v[0]); setHasAutoDetectedClimate(true); }} />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Submit Button */}
              <Button 
                onClick={handleGetRecommendations} 
                className="w-full bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#059669] hover:from-[#5EEAD4] hover:via-[#34D399] hover:to-[#10B981] text-black font-extrabold text-base py-6 rounded-full shadow-[0_0_35px_rgba(45,212,191,0.55)] transition-all transform hover:scale-[1.01] border border-[#5EEAD4]/60" 
                size="lg"
                disabled={isLoading || !country.trim() || !state.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin text-black" />
                    Finding 6 Optimal {selectedPlantType === 'Mix' ? 'Plants' : selectedPlantType}...
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
        
        {/* Recommendations Result Grid */}
        {recommendations.length > 0 && (
          <div className="mt-14 space-y-6 animate-fade-in">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4 rounded-xl border border-white/10">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary bg-clip-text text-transparent">
                  Top Recommended {selectedPlantType === 'Mix' ? 'Plants' : selectedPlantType} ({filteredRecommendations.length})
                </h2>
                <p className="text-xs text-foreground/70">Matched for {state}, {country} with verified Wikimedia profiles</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="h-3.5 w-3.5 text-foreground/50 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  placeholder="Search plants by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="glass-input h-9 text-xs pl-8 w-full"
                />
              </div>
            </div>

            {/* Plants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecommendations.map((plant, index) => (
                <PlantCard key={index} plant={plant} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default React.memo(RecommendPage);
