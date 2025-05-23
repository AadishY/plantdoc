import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPlantRecommendations, getClimateDatabByLocation } from '@/services/api';
import { Loader2, Leaf, Sun, CloudSun, Droplet, ThermometerSun } from 'lucide-react';
import { PlantRecommendation, GrowingConditions } from '@/types/recommendation';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from 'framer-motion';
import DynamicBackground from "@/components/DynamicBackground";
import { EnhancedCard, EnhancedCardHeader, EnhancedCardContent, EnhancedCardTitle, EnhancedCardFooter, EnhancedCardDescription } from '@/components/ui/enhanced-card';

const soilTypes = ["Clay", "Sandy", "Loamy", "Chalky", "Peaty", "Silty"];
const sunlightOptions = ["Full Sun", "Partial Sun", "Shade"];

const RecommendPage = () => {
  const [recommendations, setRecommendations] = useState<PlantRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClimateFetching, setIsClimateFetching] = useState(false);
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState(25);
  const [rainfall, setRainfall] = useState(150);
  const [humidity, setHumidity] = useState(60);
  const [ph, setPh] = useState(7);
  const [soilType, setSoilType] = useState(soilTypes[2]); // Default to Loamy
  const [sunlight, setSunlight] = useState(sunlightOptions[0]); // Default to Full Sun
  const [nitrogen, setNitrogen] = useState(50);
  const [phosphorus, setPhosphorus] = useState(50);
  const [potassium, setPotassium] = useState(50);

  useEffect(() => {
    const fetchClimateData = async () => {
      if (country && state) {
        setIsClimateFetching(true);
        try {
          const climateData = await getClimateDatabByLocation(country, state, city);
          setTemperature(climateData.temperature);
          setRainfall(climateData.rainfall);
          setHumidity(climateData.humidity);
          
          toast({
            title: "Climate data updated",
            description: `Data retrieved for ${city ? city + ', ' : ''}${state}, ${country}`,
          });
        } catch (error) {
          console.error('Error fetching climate data:', error);
          toast({
            title: "Couldn't get climate data",
            description: "Using default values instead",
            variant: "destructive",
          });
        } finally {
          setIsClimateFetching(false);
        }
      }
    };

    const debounceTimer = setTimeout(() => {
      if (country && state) {
        fetchClimateData();
      }
    }, 1000); // Debounce 1 second

    return () => clearTimeout(debounceTimer);
  }, [country, state, city]);

  const handleGetRecommendations = async () => {
    if (!country || !state) {
      toast({
        title: "Missing information",
        description: "Please provide at least country and state/region",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const conditions: GrowingConditions = {
        country,
        state,
        city,
        temperature,
        rainfall,
        humidity,
        ph,
        soilType,
        sunlight,
        nitrogen: nitrogen / 100, // Convert to decimal
        phosphorus: phosphorus / 100,
        potassium: potassium / 100
      };
      
      const plantRecommendations = await getPlantRecommendations(conditions);
      setRecommendations(plantRecommendations);
      
      toast({
        title: "Recommendations ready",
        description: `Found ${plantRecommendations.length} plants that match your conditions`,
      });
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to get plant recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <DynamicBackground />
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary bg-clip-text text-transparent">Find Perfect Plants for Your Garden</h1>
          <p className="text-foreground/70 max-w-3xl mx-auto">
            Enter your location and growing conditions to discover plants that will thrive in your environment.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <EnhancedCard className="max-w-4xl mx-auto shadow-lg shadow-plantDoc-primary/5 glass-card">
            <EnhancedCardHeader>
              <EnhancedCardTitle>Your Growing Environment</EnhancedCardTitle>
              <EnhancedCardDescription>Tell us about your location and we'll recommend suitable plants</EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent className="space-y-6">
              {/* Location Section */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country*</Label>
                    <Input 
                      id="country" 
                      value={country} 
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United States" 
                      required
                      className="glass-input border-plantDoc-primary/20 focus-visible:ring-plantDoc-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Region*</Label>
                    <Input 
                      id="state" 
                      value={state} 
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. California" 
                      required
                      className="glass-input border-plantDoc-primary/20 focus-visible:ring-plantDoc-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City (Optional)</Label>
                    <Input 
                      id="city" 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. San Francisco"
                      className="glass-input border-plantDoc-primary/20 focus-visible:ring-plantDoc-primary/30"
                    />
                  </div>
                </div>

                {isClimateFetching && (
                  <div className="flex items-center justify-center text-sm text-plantDoc-primary">
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Updating climate data...
                  </div>
                )}
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="advanced-options" className="border-plantDoc-primary/20">
                    <AccordionTrigger className="text-plantDoc-primary hover:text-plantDoc-secondary transition-colors">
                      Advanced Growing Conditions
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6">
                      {/* Climate Information */}
                      <div className="space-y-4 pt-2">
                        <h3 className="text-lg font-semibold">Climate Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="temperature">Temperature (°C)</Label>
                            <Input 
                              id="temperature" 
                              type="number" 
                              value={temperature}
                              onChange={(e) => setTemperature(Number(e.target.value))}
                              className="glass-input border-plantDoc-primary/20 focus-visible:ring-plantDoc-primary/30"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="rainfall">Rainfall (mm)</Label>
                            <Input 
                              id="rainfall" 
                              type="number" 
                              value={rainfall}
                              onChange={(e) => setRainfall(Number(e.target.value))}
                              className="glass-input border-plantDoc-primary/20 focus-visible:ring-plantDoc-primary/30"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="humidity">Humidity (%)</Label>
                            <Input 
                              id="humidity" 
                              type="number" 
                              value={humidity}
                              onChange={(e) => setHumidity(Number(e.target.value))}
                              min="0"
                              max="100"
                              className="glass-input border-plantDoc-primary/20 focus-visible:ring-plantDoc-primary/30"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Soil and Sunlight */}
                      <div className="space-y-4 border-t pt-4 border-plantDoc-primary/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="soil-type">Soil Type</Label>
                            <Select value={soilType} onValueChange={setSoilType}>
                              <SelectTrigger className="glass-input border-plantDoc-primary/20 focus:ring-plantDoc-primary/30">
                                <SelectValue placeholder="Select soil type" />
                              </SelectTrigger>
                              <SelectContent>
                                {soilTypes.map((type) => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sunlight">Sunlight</Label>
                            <Select value={sunlight} onValueChange={setSunlight}>
                              <SelectTrigger className="glass-input border-plantDoc-primary/20 focus:ring-plantDoc-primary/30">
                                <SelectValue placeholder="Select sunlight level" />
                              </SelectTrigger>
                              <SelectContent>
                                {sunlightOptions.map((option) => (
                                  <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="ph">Soil pH</Label>
                            <span>{ph}</span>
                          </div>
                          <Slider
                            id="ph"
                            min={3.5}
                            max={9}
                            step={0.1}
                            value={[ph]}
                            onValueChange={(value) => setPh(value[0])}
                            className="py-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Acidic (3.5)</span>
                            <span>Neutral (7)</span>
                            <span>Alkaline (9)</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Nutrients */}
                      <div className="space-y-4 border-t pt-4 border-plantDoc-primary/10">
                        <h3 className="text-lg font-semibold">Soil Nutrient Levels (%)</h3>
                        
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="nitrogen">Nitrogen (N)</Label>
                              <span>{nitrogen}%</span>
                            </div>
                            <Slider
                              id="nitrogen"
                              min={0}
                              max={100}
                              step={1}
                              value={[nitrogen]}
                              onValueChange={(value) => setNitrogen(value[0])}
                              className="py-2"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="phosphorus">Phosphorus (P)</Label>
                              <span>{phosphorus}%</span>
                            </div>
                            <Slider
                              id="phosphorus"
                              min={0}
                              max={100}
                              step={1}
                              value={[phosphorus]}
                              onValueChange={(value) => setPhosphorus(value[0])}
                              className="py-2"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="potassium">Potassium (K)</Label>
                              <span>{potassium}%</span>
                            </div>
                            <Slider
                              id="potassium"
                              min={0}
                              max={100}
                              step={1}
                              value={[potassium]}
                              onValueChange={(value) => setPotassium(value[0])}
                              className="py-2"
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              <Button 
                onClick={handleGetRecommendations} 
                className="w-full bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary hover:from-plantDoc-primary/90 hover:to-plantDoc-secondary/90 text-white animate-pulse-glow" 
                size="lg"
                disabled={isLoading || !country || !state}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Finding plants...
                  </>
                ) : (
                  <>
                    <Leaf className="mr-2 h-5 w-5" />
                    Get Plant Recommendations
                  </>
                )}
              </Button>
            </EnhancedCardContent>
          </EnhancedCard>
        </motion.div>
        
        {recommendations.length > 0 && (
          <motion.div 
            className="mt-12"
            variants={containerAnimation}
            initial="hidden"
            animate="show"
          >
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary bg-clip-text text-transparent">
              Recommended Plants for Your Garden
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((plant, index) => (
                <motion.div key={index} variants={itemAnimation}>
                  <EnhancedCard 
                    className="h-full flex flex-col"
                    glassIntensity="medium"
                    borderGlow={true}
                  >
                    <EnhancedCardHeader className="pb-2">
                      <EnhancedCardTitle className="text-xl">{plant.name}</EnhancedCardTitle>
                      <EnhancedCardDescription className="italic">{plant.scientificName}</EnhancedCardDescription>
                    </EnhancedCardHeader>
                    <EnhancedCardContent className="pt-4 flex-grow">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm">{plant.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <ThermometerSun className="h-4 w-4 text-plantDoc-primary" />
                            <span className="font-medium">Growth:</span> {plant.growthTime}
                          </div>
                          <div className="flex items-center gap-2">
                            <Droplet className="h-4 w-4 text-plantDoc-primary" />
                            <span className="font-medium">Water:</span> {plant.waterNeeds}
                          </div>
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4 text-plantDoc-primary" />
                            <span className="font-medium">Light:</span> {plant.sunlight}
                          </div>
                          <div className="flex items-center gap-2">
                            <CloudSun className="h-4 w-4 text-plantDoc-primary" />
                            <span className="font-medium">Season:</span> {plant.bestSeason}
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t border-plantDoc-primary/10">
                          <h4 className="font-medium mb-1 text-plantDoc-primary">Care Instructions:</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            {plant.careInstructions.map((instruction, idx) => (
                              <li key={idx}>{instruction}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </EnhancedCardContent>
                  </EnhancedCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default RecommendPage;
