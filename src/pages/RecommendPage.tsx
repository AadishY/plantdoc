import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, SunMedium, Droplet, Thermometer, Sprout, MessageSquare, Search } from "lucide-react";

interface PlantRecommendation {
  name: string;
  scientificName: string;
  description: string;
  careLevel: string;
  light: string;
  water: string;
  humidity: string;
  temperature: string;
  imageUrl: string;
}

const mockRecommendations: PlantRecommendation[] = [
  {
    name: "Snake Plant",
    scientificName: "Sansevieria trifasciata",
    description: "A hardy succulent that can survive in low light conditions and with minimal watering.",
    careLevel: "Easy",
    light: "Low to bright indirect light",
    water: "Allow soil to dry completely between waterings",
    humidity: "Low to average",
    temperature: "60-85°F (15-29°C)",
    imageUrl: "https://images.unsplash.com/photo-1572686292343-4bb9b3366d96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "Pothos",
    scientificName: "Epipremnum aureum",
    description: "A trailing vine with heart-shaped leaves that's nearly impossible to kill.",
    careLevel: "Easy",
    light: "Low to bright indirect light",
    water: "Allow top inch of soil to dry between waterings",
    humidity: "Average",
    temperature: "65-85°F (18-29°C)",
    imageUrl: "https://images.unsplash.com/photo-1594141640813-45ca7488db79?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "Peace Lily",
    scientificName: "Spathiphyllum",
    description: "Elegant white flowers and glossy leaves that thrive in lower light conditions.",
    careLevel: "Moderate",
    light: "Low to medium indirect light",
    water: "Keep soil moist but not soggy",
    humidity: "High",
    temperature: "65-80°F (18-27°C)",
    imageUrl: "https://images.unsplash.com/photo-1616173758552-1ce1be0d0769?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "ZZ Plant",
    scientificName: "Zamioculcas zamiifolia",
    description: "Glossy, dark green leaves that can tolerate neglect and low light conditions.",
    careLevel: "Easy",
    light: "Low to bright indirect light",
    water: "Allow soil to dry completely between waterings",
    humidity: "Low to average",
    temperature: "60-75°F (16-24°C)",
    imageUrl: "https://images.unsplash.com/photo-1632321941219-d6e89558682e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
  },
];

const RecommendPage: React.FC = () => {
  const [lightLevel, setLightLevel] = useState<string>("");
  const [careLevel, setCareLevel] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recommendations, setRecommendations] = useState<PlantRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("criteria");
  const { toast } = useToast();

  const handleSearch = useCallback(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      let filtered = [...mockRecommendations];
      
      if (lightLevel) {
        filtered = filtered.filter(plant => 
          plant.light.toLowerCase().includes(lightLevel.toLowerCase())
        );
      }
      
      if (careLevel) {
        filtered = filtered.filter(plant => 
          plant.careLevel.toLowerCase() === careLevel.toLowerCase()
        );
      }
      
      if (searchTerm) {
        filtered = filtered.filter(plant => 
          plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plant.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setRecommendations(filtered);
      setIsLoading(false);
      setActiveTab("results");
      
      if (filtered.length === 0) {
        toast({
          title: "No plants found",
          description: "Try adjusting your criteria for more results.",
          variant: "destructive",
        });
      } else {
        toast({
          title: `Found ${filtered.length} plants`,
          description: "Check out these recommendations based on your criteria.",
        });
      }
    }, 1500);
  }, [lightLevel, careLevel, searchTerm, toast]);

  const handleReset = useCallback(() => {
    setLightLevel("");
    setCareLevel("");
    setSearchTerm("");
    setRecommendations([]);
    setActiveTab("criteria");
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="container mx-auto px-4 py-8 max-w-6xl"
    >
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8" />
            Plant Recommendations
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the perfect plants for your space based on your specific conditions and preferences
          </p>
        </div>

        <Separator className="my-6" />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="criteria">Search Criteria</TabsTrigger>
            <TabsTrigger value="results" disabled={recommendations.length === 0}>
              Results ({recommendations.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="criteria">
            <Card className="p-6 border rounded-xl shadow-md bg-gradient-to-br from-background to-green-50/30">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Find Your Perfect Plant Match</h2>
                  <p className="text-muted-foreground">
                    Tell us about your environment and preferences to get personalized plant recommendations
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="light-level" className="flex items-center gap-2">
                        <SunMedium className="h-4 w-4 text-primary" />
                        Light Conditions
                      </Label>
                      <Select value={lightLevel} onValueChange={setLightLevel}>
                        <SelectTrigger id="light-level">
                          <SelectValue placeholder="Select light level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Light</SelectItem>
                          <SelectItem value="medium">Medium Light</SelectItem>
                          <SelectItem value="bright">Bright Indirect Light</SelectItem>
                          <SelectItem value="direct">Direct Sunlight</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="care-level" className="flex items-center gap-2">
                        <Sprout className="h-4 w-4 text-primary" />
                        Care Level
                      </Label>
                      <Select value={careLevel} onValueChange={setCareLevel}>
                        <SelectTrigger id="care-level">
                          <SelectValue placeholder="Select care level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy (Low Maintenance)</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="difficult">Difficult (Expert)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="search" className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-primary" />
                        Search by Name or Feature
                      </Label>
                      <Input
                        id="search"
                        placeholder="E.g., air purifying, pet-friendly, succulent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div className="bg-primary/10 rounded-lg p-4 mt-2">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        Pro Tip
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Looking for specific benefits? Try searching for "air purifying", "low water", "pet friendly", or "beginner friendly".
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                  <Button 
                    onClick={handleSearch} 
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"></div>
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                    {isLoading ? "Finding Plants..." : "Find Plants"}
                  </Button>
                  
                  <Button variant="outline" onClick={handleReset} disabled={isLoading}>
                    Reset
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="results">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Recommended Plants</h2>
                <Button variant="outline" onClick={handleReset}>
                  New Search
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((plant, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden h-full flex flex-col">
                      <div className="aspect-video relative">
                        <img 
                          src={plant.imageUrl} 
                          alt={plant.name} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            plant.careLevel === "Easy" 
                              ? "bg-green-100 text-green-800" 
                              : plant.careLevel === "Moderate"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {plant.careLevel}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5 flex-grow flex flex-col">
                        <h3 className="text-xl font-semibold">{plant.name}</h3>
                        <p className="text-sm text-primary italic mb-3">{plant.scientificName}</p>
                        <p className="text-muted-foreground text-sm mb-4 flex-grow">
                          {plant.description}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3 mt-auto">
                          <div className="flex items-start gap-2">
                            <SunMedium className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium">Light</p>
                              <p className="text-xs text-muted-foreground">{plant.light}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2">
                            <Droplet className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium">Water</p>
                              <p className="text-xs text-muted-foreground">{plant.water}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2">
                            <Thermometer className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium">Temperature</p>
                              <p className="text-xs text-muted-foreground">{plant.temperature}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2">
                            <Droplet className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium">Humidity</p>
                              <p className="text-xs text-muted-foreground">{plant.humidity}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {recommendations.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No plants found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria to find more plants.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default RecommendPage;
