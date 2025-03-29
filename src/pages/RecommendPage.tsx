
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Leaf, Loader2, Cloud, Droplets, Thermometer, MapPin, Globe, Sprout } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PlantRecommendation } from '@/types/recommendation';
import { getPlantRecommendations, getClimateDatabByLocation } from '@/services/api';

const RecommendPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [recommendations, setRecommendations] = useState<PlantRecommendation[] | null>(null);
  const [imagesLoading, setImagesLoading] = useState<boolean>(false);
  
  // Form state
  const [formData, setFormData] = useState({
    nitrogen: 50,
    phosphorus: 50,
    potassium: 50,
    ph: 7,
    rainfall: 150,
    temperature: 25,
    humidity: 60,
    country: '',
    state: '',
    city: '',
    soilType: 'loamy',
    sunlight: 'full'
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const fetchClimateData = async () => {
    if (!formData.country || !formData.state) {
      toast.error('Please enter your country and state/province');
      return;
    }

    setIsLocationLoading(true);
    try {
      const climateData = await getClimateDatabByLocation(
        formData.country,
        formData.state,
        formData.city
      );
      
      setFormData(prev => ({
        ...prev,
        temperature: climateData.temperature,
        rainfall: climateData.rainfall,
        humidity: climateData.humidity
      }));
      
      toast.success('Climate data updated based on your location!');
    } catch (error) {
      console.error('Failed to get climate data:', error);
      toast.error('Failed to retrieve climate data. Using default values.');
    } finally {
      setIsLocationLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      setImagesLoading(true);
      const result = await getPlantRecommendations(formData);
      setRecommendations(result);
      toast.success('Plant recommendations generated!');
    } catch (error) {
      console.error('Recommendation error:', error);
      toast.error('Failed to generate recommendations. Please try again.');
    } finally {
      setIsLoading(false);
      setImagesLoading(false);
    }
  };

  // Effect to automatically fetch climate data when location is entered
  useEffect(() => {
    if (formData.country && formData.state) {
      const debounceTimer = setTimeout(() => {
        fetchClimateData();
      }, 1500); // Debounce to avoid multiple calls
      
      return () => clearTimeout(debounceTimer);
    }
  }, [formData.country, formData.state]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/50">
      <Header />
      
      <main className="flex-1 py-8 md:py-12 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-enter">
            <div className="inline-flex items-center justify-center p-2 bg-plantDoc-primary/20 rounded-full mb-4">
              <Sprout className="h-6 w-6 text-plantDoc-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Plant Recommendations</h1>
            <p className="text-foreground/70 max-w-md mx-auto">
              Get personalized plant suggestions based on your growing conditions
            </p>
          </div>
          
          <Card className="glass-card shadow-xl border-none mb-8 hover:border-plantDoc-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle>Growing Conditions</CardTitle>
              <CardDescription>
                Provide information about your location and growing environment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location Information */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="country" className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-plantDoc-primary" />
                        Country
                      </Label>
                      <Input 
                        id="country" 
                        placeholder="Enter your country" 
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="glass-input focus:border-plantDoc-primary/50"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="state" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-plantDoc-primary" />
                        State/Province
                      </Label>
                      <Input 
                        id="state" 
                        placeholder="Enter your state" 
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="glass-input focus:border-plantDoc-primary/50"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="city" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-plantDoc-primary" />
                        City (Optional)
                      </Label>
                      <Input 
                        id="city" 
                        placeholder="Enter your city" 
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="glass-input focus:border-plantDoc-primary/50"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="soilType">Soil Type</Label>
                      <Select 
                        value={formData.soilType} 
                        onValueChange={(value) => handleInputChange('soilType', value)}
                      >
                        <SelectTrigger className="glass-input">
                          <SelectValue placeholder="Select soil type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sandy">Sandy</SelectItem>
                          <SelectItem value="loamy">Loamy</SelectItem>
                          <SelectItem value="clay">Clay</SelectItem>
                          <SelectItem value="silt">Silty</SelectItem>
                          <SelectItem value="peaty">Peaty</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="sunlight">Sunlight Exposure</Label>
                      <Select 
                        value={formData.sunlight} 
                        onValueChange={(value) => handleInputChange('sunlight', value)}
                      >
                        <SelectTrigger className="glass-input">
                          <SelectValue placeholder="Select sunlight exposure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Full Sun</SelectItem>
                          <SelectItem value="partial">Partial Sun</SelectItem>
                          <SelectItem value="shade">Shade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Climate Data (Auto-filled but editable) */}
                  <div className="space-y-4">
                    <div className="p-3 border border-plantDoc-primary/20 rounded-lg bg-plantDoc-primary/5">
                      <p className="text-sm mb-2 text-plantDoc-primary">
                        {isLocationLoading ? 'Fetching climate data...' : 'Climate data is automatically estimated based on your location'}
                      </p>
                      
                      <div>
                        <Label htmlFor="temperature" className="flex items-center gap-2">
                          <Thermometer className="text-plantDoc-primary h-4 w-4" />
                          Average Temperature (°C)
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Slider
                            id="temperature"
                            min={0}
                            max={40}
                            step={1}
                            value={[formData.temperature]}
                            onValueChange={(value) => handleInputChange('temperature', value[0])}
                            className="flex-1"
                          />
                          <span className="w-8 text-center">{formData.temperature}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label htmlFor="rainfall" className="flex items-center gap-2">
                          <Droplets className="text-plantDoc-primary h-4 w-4" />
                          Annual Rainfall (mm)
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Slider
                            id="rainfall"
                            min={0}
                            max={3000}
                            step={10}
                            value={[formData.rainfall]}
                            onValueChange={(value) => handleInputChange('rainfall', value[0])}
                            className="flex-1"
                          />
                          <span className="w-14 text-center">{formData.rainfall}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label htmlFor="humidity" className="flex items-center gap-2">
                          <Cloud className="text-plantDoc-primary h-4 w-4" />
                          Humidity (%)
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Slider
                            id="humidity"
                            min={0}
                            max={100}
                            step={1}
                            value={[formData.humidity]}
                            onValueChange={(value) => handleInputChange('humidity', value[0])}
                            className="flex-1"
                          />
                          <span className="w-8 text-center">{formData.humidity}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="ph">Soil pH</Label>
                      <div className="flex items-center space-x-2">
                        <Slider
                          id="ph"
                          min={3}
                          max={10}
                          step={0.1}
                          value={[formData.ph]}
                          onValueChange={(value) => handleInputChange('ph', value[0])}
                          className="flex-1"
                        />
                        <span className="w-8 text-center">{formData.ph}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="advanced" className="cursor-pointer">Show Advanced Options</Label>
                        <Switch
                          id="advanced"
                          checked={showAdvanced}
                          onCheckedChange={setShowAdvanced}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Advanced Options */}
                {showAdvanced && (
                  <div className="space-y-4 pt-4 border-t border-white/10 animate-fade-in">
                    <h3 className="text-lg font-medium">Advanced Soil Composition</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="nitrogen">Nitrogen (N) %</Label>
                        <div className="flex items-center space-x-2">
                          <Slider
                            id="nitrogen"
                            min={0}
                            max={100}
                            step={1}
                            value={[formData.nitrogen]}
                            onValueChange={(value) => handleInputChange('nitrogen', value[0])}
                            className="flex-1"
                          />
                          <span className="w-8 text-center">{formData.nitrogen}</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="phosphorus">Phosphorus (P) %</Label>
                        <div className="flex items-center space-x-2">
                          <Slider
                            id="phosphorus"
                            min={0}
                            max={100}
                            step={1}
                            value={[formData.phosphorus]}
                            onValueChange={(value) => handleInputChange('phosphorus', value[0])}
                            className="flex-1"
                          />
                          <span className="w-8 text-center">{formData.phosphorus}</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="potassium">Potassium (K) %</Label>
                        <div className="flex items-center space-x-2">
                          <Slider
                            id="potassium"
                            min={0}
                            max={100}
                            step={1}
                            value={[formData.potassium]}
                            onValueChange={(value) => handleInputChange('potassium', value[0])}
                            className="flex-1"
                          />
                          <span className="w-8 text-center">{formData.potassium}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-center pt-4">
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary hover:shadow-lg transition-shadow text-white px-8 py-3 text-lg rounded-lg hover:scale-105 transition-transform"
                    disabled={isLoading || !formData.country || !formData.state}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Generating Recommendations...
                      </>
                    ) : (
                      'Get Plant Recommendations'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Results Section */}
          {recommendations && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-center">Recommended Plants</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((plant, index) => (
                  <Card key={index} className="glass-card overflow-hidden border-none hover:shadow-plantDoc-primary/20 hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] group">
                    <div className="h-44 overflow-hidden relative">
                      {imagesLoading ? (
                        <div className="w-full h-full flex items-center justify-center bg-plantDoc-primary/5">
                          <Loader2 className="h-8 w-8 text-plantDoc-primary animate-spin" />
                        </div>
                      ) : (
                        <img 
                          src={plant.generatedImageUrl || plant.imageUrl || "https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&w=600"} 
                          alt={plant.name} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <p className="text-white font-medium">{plant.scientificName}</p>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="group-hover:text-plantDoc-primary transition-colors">{plant.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="px-2 py-1 rounded-full bg-plantDoc-primary/10 text-xs">
                            {plant.waterNeeds} water
                          </span>
                          <span className="px-2 py-1 rounded-full bg-plantDoc-primary/10 text-xs">
                            {plant.sunlight}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-plantDoc-primary/10 text-xs">
                            {plant.growthTime} growth
                          </span>
                        </div>
                        <p className="line-clamp-3 text-foreground/80">{plant.description}</p>
                        
                        {plant.careInstructions && plant.careInstructions.length > 0 && (
                          <div className="pt-2 mt-2 border-t border-white/10">
                            <p className="font-medium mb-1">Care Tips:</p>
                            <ul className="list-disc pl-5 text-foreground/80 text-xs">
                              {plant.careInstructions.slice(0, 2).map((tip, i) => (
                                <li key={i}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecommendPage;
