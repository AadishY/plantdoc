
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AboutPlantProps {
  plantData: {
    description: string;
    origin: string;
    common_uses: string[];
    growing_conditions: string;
  };
}

const AboutPlant = ({ plantData }: AboutPlantProps) => {
  if (!plantData) return null;
  
  return (
    <Card className="glass-card shadow-xl border-none overflow-hidden hover:shadow-plantDoc-primary/20 transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-plantDoc-primary/20 to-plantDoc-secondary/20 border-b border-white/10">
        <CardTitle className="text-xl text-center">About This Plant (Not 100% correct)</CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        <div>
          <h3 className="text-md font-medium text-plantDoc-primary mb-1">Description</h3>
          <p className="text-foreground/80">{plantData.description}</p>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-plantDoc-primary mb-1">Origin</h3>
          <p className="text-foreground/80">{plantData.origin}</p>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-plantDoc-primary mb-1">Common Uses</h3>
          <ul className="list-disc pl-5 text-foreground/80">
            {plantData.common_uses.map((use, index) => (
              <li key={index} className="mb-1">{use}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-plantDoc-primary mb-1">Growing Conditions</h3>
          <p className="text-foreground/80">{plantData.growing_conditions}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutPlant;
