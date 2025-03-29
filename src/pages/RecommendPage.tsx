
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPlantRecommendations, getClimateDatabByLocation } from '@/services/api';
import { Loader2, Leaf } from 'lucide-react';
import { PlantRecommendation, GrowingConditions } from '@/types/recommendation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const soilTypes = ["Clay", "Sandy", "Loamy", "Chalky", "Peaty", "Silty"];
const sunlightOptions = ["Full Sun", "Partial Sun", "Shade"];

const RecommendPage = () => {
  const [recommendations, setRecommendations] = useState<PlantRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const climateData = await getClimateDatabByLocation(country, state, city);
      setTemperature(climateData.temperature);
      setRainfall(climateData.rainfall);
      setHumidity(climateData.humidity);
      
      toast({
        title: "Climate data retrieved",
        description: `Average temperature: ${climateData.temperature}°C, Rainfall: ${climateData.rainfall}mm, Humidity: ${climateData.humidity}%`,
      });
    } catch (error) {
      console.error('Error fetching climate data:', error);
      toast({
        title: "Failed to get climate data",
        description: "Using default values instead",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetRecommendations = async () => {
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Find the Perfect Plants for Your Garden</h1>
        <p className="text-center mb-8 max-w-3xl mx-auto">
          Tell us about your growing conditions, and we'll recommend plants that will thrive in your environment.
        </p>
        
        <Tabs defaultValue="location" className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="conditions">Growing Conditions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="location" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleLocationSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country*</Label>
                      <Input 
                        id="country" 
                        value={country} 
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="e.g. United States" 
                        required
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City (Optional)</Label>
                      <Input 
                        id="city" 
                        value={city} 
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. San Francisco" 
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Retrieving climate data...
                      </>
                    ) : "Get Climate Data For This Location"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Climate Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Average Temperature (°C)</Label>
                  <Input 
                    id="temperature" 
                    type="number" 
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rainfall">Annual Rainfall (mm)</Label>
                  <Input 
                    id="rainfall" 
                    type="number" 
                    value={rainfall}
                    onChange={(e) => setRainfall(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="humidity">Average Humidity (%)</Label>
                  <Input 
                    id="humidity" 
                    type="number" 
                    value={humidity}
                    onChange={(e) => setHumidity(Number(e.target.value))}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="conditions" className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="soil-type">Soil Type</Label>
                      <Select value={soilType} onValueChange={setSoilType}>
                        <SelectTrigger>
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
                        <SelectTrigger>
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
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Acidic (3.5)</span>
                      <span>Neutral (7)</span>
                      <span>Alkaline (9)</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
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
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              onClick={handleGetRecommendations} 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding plants...
                </>
              ) : (
                <>
                  <Leaf className="mr-2 h-5 w-5" />
                  Get Plant Recommendations
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
        
        {recommendations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Recommended Plants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((plant, index) => (
                <Card key={index} className="overflow-hidden h-full flex flex-col">
                  <CardContent className="pt-6 flex-grow">
                    <h3 className="font-bold text-xl mb-2">{plant.name}</h3>
                    <p className="text-sm text-muted-foreground italic mb-3">{plant.scientificName}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm">{plant.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Growth:</span> {plant.growthTime}
                        </div>
                        <div>
                          <span className="font-medium">Water:</span> {plant.waterNeeds}
                        </div>
                        <div>
                          <span className="font-medium">Sunlight:</span> {plant.sunlight}
                        </div>
                        <div>
                          <span className="font-medium">Season:</span> {plant.bestSeason}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-1">Care Instructions:</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {plant.careInstructions.map((instruction, idx) => (
                            <li key={idx}>{instruction}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default RecommendPage;
