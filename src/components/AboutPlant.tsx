
import React from "react";
import { Card } from "./ui/card";
import { Leaf, MapPin, Globe, Info } from "lucide-react";

export interface AboutPlantProps {
  plantInfo: any;
}

const AboutPlant: React.FC<AboutPlantProps> = ({ plantInfo }) => {
  if (!plantInfo) return null;

  return (
    <Card className="p-6 border rounded-xl shadow-md bg-gradient-to-br from-background to-indigo-50/30">
      <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
        <Info className="h-6 w-6 text-indigo-600" />
        About This Plant
      </h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold">Description</h4>
          <p className="text-muted-foreground">{plantInfo.description || "No description available."}</p>
        </div>
        
        {plantInfo.origin && (
          <div>
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Origin
            </h4>
            <p className="text-muted-foreground">{plantInfo.origin}</p>
          </div>
        )}
        
        {plantInfo.common_uses && plantInfo.common_uses.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Common Uses
            </h4>
            <ul className="list-disc pl-5 text-muted-foreground">
              {plantInfo.common_uses.map((use: string, index: number) => (
                <li key={index}>{use}</li>
              ))}
            </ul>
          </div>
        )}
        
        {plantInfo.growing_conditions && (
          <div>
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Growing Conditions
            </h4>
            <p className="text-muted-foreground">{plantInfo.growing_conditions}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AboutPlant;
