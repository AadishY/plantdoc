import React, { useState } from 'react';
import { toast } from 'sonner';
import { Leaf, Loader2, Cloud, Droplets, Thermometer } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlantRecommendation } from '@/types/recommendation';
import { getPlantRecommendations } from '@/services/api';

const RecommendPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [recommendations, setRecommendations] = useState<PlantRecommendation[] | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    nitrogen: 50,
    phosphorus: 50,
    potassium: 50,
    ph: 7,
    rainfall: 150,
    temperature: 25,
    humidity: 60,
    state: '',
    city: '',
    soilType: 'loamy',
    sunlight: 'full'
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await getPlantRecommendations(formData);
      setRecommendations(result);
      toast.success('Plant recommendations generated!');
    } catch (error) {
      console.error('Recommendation error:', error);
      toast.error('Failed to generate recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/50">
      <Header />
      
      <main className="flex-1 py-8 md:py-12 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-enter">
            <div className="inline-flex items-center justify-center p-2 bg-plantDoc-primary/20 rounded-full mb-4">
              <Leaf className="h-6 w-6 text-plantDoc-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Plant Recommendations</h1>
            <p className="text-foreground/70 max-w-md mx-auto">
              Get personalized plant recommendations based on your growing conditions
            </p>
          </div>
          
          <Card className="glass-card shadow-xl border-none mb-8">
            <CardHeader>
              <CardTitle>Growing Conditions</CardTitle>
              <CardDescription>
                Provide information about your growing environment to get the best recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Input 
                        id="state" 
                        placeholder="Enter your state" 
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="glass-input"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="city">City (Optional)</Label>
                      <Input 
                        id="city" 
                        placeholder="Enter your city" 
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="glass-input"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="temperature">Average Temperature (°C)</Label>
                      <div className="flex items-center space-x-2">
                        <Thermometer className="text-plantDoc-primary h-4 w-4" />
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
                    
                    <div>
                      <Label htmlFor="rainfall">Annual Rainfall (mm)</Label>
                      <div className="flex items-center space-x-2">
                        <Droplets className="text-plantDoc-primary h-4 w-4" />
                        <Slider
                          id="rainfall"
                          min={0}
                          max={300}
                          step={10}
                          value={[formData.rainfall]}
                          onValueChange={(value) => handleInputChange('rainfall', value[0])}
                          className="flex-1"
                        />
                        <span className="w-12 text-center">{formData.rainfall}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Soil Conditions */}
                  <div className="space-y-4">
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
                    
                    <div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="advanced">Show Advanced Options</Label>
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
                  <div className="space-y-4 pt-4 border-t border-white/10">
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
                    
                    <div>
                      <Label htmlFor="humidity">Humidity %</Label>
                      <div className="flex items-center space-x-2">
                        <Cloud className="text-plantDoc-primary h-4 w-4" />
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
                )}
                
                <div className="flex justify-center pt-4">
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary hover:shadow-lg transition-shadow text-white px-8 py-3 text-lg rounded-lg hover:scale-105 transition-transform"
                    disabled={isLoading}
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
                  <Card key={index} className="glass-card overflow-hidden border-none hover:shadow-plantDoc-primary/20 hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px]">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={plant.imageUrl || "https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&w=600"} 
                        alt={plant.name} 
                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle>{plant.name}</CardTitle>
                      <CardDescription>{plant.scientificName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Growth Time:</span> {plant.growthTime}</p>
                        <p><span className="font-medium">Water Needs:</span> {plant.waterNeeds}</p>
                        <p><span className="font-medium">Sunlight:</span> {plant.sunlight}</p>
                        <p className="line-clamp-3"><span className="font-medium">Description:</span> {plant.description}</p>
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
