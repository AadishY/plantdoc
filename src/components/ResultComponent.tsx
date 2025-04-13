
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Droplet, Thermometer, Leaf, Info, Shield, AlertTriangle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { DiagnosisResult } from '@/types/diagnosis';
import { motion } from 'framer-motion';
import { EnhancedCard, EnhancedCardHeader, EnhancedCardTitle, EnhancedCardContent } from '@/components/ui/enhanced-card';

interface ResultComponentProps {
  result: DiagnosisResult;
}

const ResultComponent: React.FC<ResultComponentProps> = ({ result }) => {
  // Function to determine severity color
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Function to convert confidence to percentage for progress bar
  const getConfidencePercentage = (confidence: number) => {
    return Math.round(confidence);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Disease Diagnosis Card */}
      <motion.div variants={itemVariants}>
        <EnhancedCard hoverEffect="both">
          <EnhancedCardHeader className="pb-2">
            <EnhancedCardTitle className="text-xl flex items-center">
              <Info className="h-5 w-5 mr-2 text-plantDoc-primary" />
              Diagnosis Result
            </EnhancedCardTitle>
            <CardDescription>
              Analysis for {result.plant} plant
            </CardDescription>
          </EnhancedCardHeader>
          <EnhancedCardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">{result.disease.name}</h3>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-sm text-foreground/70">Confidence:</span>
                  <div className="flex-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      <Progress value={getConfidencePercentage(result.disease.confidence)} className="h-2" />
                    </motion.div>
                  </div>
                  <span className="text-sm font-medium">{result.disease.confidence}%</span>
                </div>
              </div>
              
              <div className="mt-2 flex items-center">
                <span className="text-sm text-foreground/70 mr-2">Severity:</span>
                <motion.span 
                  className={`text-sm font-medium px-2 py-0.5 rounded-full text-white flex items-center gap-1 ${getSeverityColor(result.disease.severity)}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  {result.disease.severity === 'High' && <AlertTriangle className="h-3 w-3" />}
                  {result.disease.severity}
                </motion.span>
              </div>
            </div>
          </EnhancedCardContent>
        </EnhancedCard>
      </motion.div>

      {/* Treatment & Prevention Card */}
      <motion.div variants={itemVariants}>
        <EnhancedCard hoverEffect="both">
          <EnhancedCardHeader>
            <EnhancedCardTitle className="text-xl flex items-center">
              <Leaf className="h-5 w-5 mr-2 text-plantDoc-primary" />
              Treatment & Prevention
            </EnhancedCardTitle>
          </EnhancedCardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="treatment" className="w-full">
              <TabsList className="w-full grid grid-cols-3 rounded-none bg-muted/50 p-0 h-12">
                <TabsTrigger value="treatment" className="rounded-none data-[state=active]:bg-plantDoc-primary/20">Treatment</TabsTrigger>
                <TabsTrigger value="causes" className="rounded-none data-[state=active]:bg-plantDoc-primary/20">Causes</TabsTrigger>
                <TabsTrigger value="prevention" className="rounded-none data-[state=active]:bg-plantDoc-primary/20">Prevention</TabsTrigger>
              </TabsList>
              <div className="p-6">
                <TabsContent value="treatment" className="mt-0">
                  <motion.ul 
                    className="space-y-2 list-none"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {result.treatment.steps.map((step, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start gap-2 backdrop-blur-sm bg-black/10 p-3 rounded-lg hover:bg-black/20 transition-all duration-300"
                        variants={itemVariants}
                        whileHover={{ x: 5 }}
                      >
                        <motion.div 
                          className="w-5 h-5 rounded-full bg-plantDoc-primary/20 flex-shrink-0 flex items-center justify-center mt-0.5"
                          whileHover={{ backgroundColor: 'rgba(76, 175, 80, 0.4)', scale: 1.1 }}
                        >
                          <span className="text-xs font-medium">{index+1}</span>
                        </motion.div>
                        <span>{step}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </TabsContent>
                <TabsContent value="causes" className="mt-0">
                  <motion.ul 
                    className="space-y-2 list-none"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {result.causes?.map((cause, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start gap-2 backdrop-blur-sm bg-black/10 p-3 rounded-lg hover:bg-black/20 transition-all duration-300"
                        variants={itemVariants}
                        whileHover={{ x: 5 }}
                      >
                        <motion.div 
                          className="w-5 h-5 rounded-full bg-plantDoc-primary/20 flex-shrink-0 flex items-center justify-center mt-0.5"
                          whileHover={{ backgroundColor: 'rgba(76, 175, 80, 0.4)', scale: 1.1 }}
                        >
                          <Shield className="h-3 w-3 text-plantDoc-primary" />
                        </motion.div>
                        <span>{cause}</span>
                      </motion.li>
                    )) || <p>No specific causes listed.</p>}
                  </motion.ul>
                </TabsContent>
                <TabsContent value="prevention" className="mt-0">
                  <motion.ul 
                    className="space-y-2 list-none"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {result.treatment.prevention.map((tip, index) => (
                      <motion.li 
                        key={index} 
                        className="flex items-start gap-2 backdrop-blur-sm bg-black/10 p-3 rounded-lg hover:bg-black/20 transition-all duration-300"
                        variants={itemVariants}
                        whileHover={{ x: 5 }}
                      >
                        <motion.div 
                          className="w-5 h-5 rounded-full bg-plantDoc-primary/20 flex-shrink-0 flex items-center justify-center mt-0.5"
                          whileHover={{ backgroundColor: 'rgba(76, 175, 80, 0.4)', scale: 1.1 }}
                        >
                          <Shield className="h-3 w-3 text-plantDoc-primary" />
                        </motion.div>
                        <span>{tip}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </EnhancedCard>
      </motion.div>

      {/* Recommendations Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Fertilizer Recommendation Card */}
        <motion.div variants={itemVariants}>
          <EnhancedCard hoverEffect="both">
            <EnhancedCardHeader>
              <EnhancedCardTitle className="text-xl flex items-center">
                <Droplet className="h-5 w-5 mr-2 text-plantDoc-primary" />
                Fertilizer Recommendation
              </EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent className="p-6">
              <div className="space-y-3">
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-2 h-2 rounded-full bg-plantDoc-primary"></div>
                  <h3 className="font-medium">Recommended:</h3>
                </motion.div>
                <motion.p 
                  className="text-foreground/80 pl-4 backdrop-blur-sm bg-black/10 p-3 rounded-lg hover:bg-black/20 transition-all duration-300"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {result.fertilizer_recommendation.type}
                </motion.p>
                
                <Separator className="my-3 bg-foreground/10" />
                
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-2 h-2 rounded-full bg-plantDoc-primary"></div>
                  <h3 className="font-medium">Application:</h3>
                </motion.div>
                <motion.p 
                  className="text-foreground/80 pl-4 backdrop-blur-sm bg-black/10 p-3 rounded-lg hover:bg-black/20 transition-all duration-300"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {result.fertilizer_recommendation.application}
                </motion.p>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </motion.div>

        {/* Care Recommendations Card */}
        <motion.div variants={itemVariants}>
          <EnhancedCard hoverEffect="both">
            <EnhancedCardHeader>
              <EnhancedCardTitle className="text-xl flex items-center">
                <Thermometer className="h-5 w-5 mr-2 text-plantDoc-primary" />
                Care Recommendations
              </EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent className="p-6">
              <motion.ul 
                className="space-y-2 list-none"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {result.care_recommendations.map((tip, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start gap-2 backdrop-blur-sm bg-black/10 p-3 rounded-lg hover:bg-black/20 transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div 
                      className="w-5 h-5 rounded-full bg-plantDoc-primary/20 flex-shrink-0 flex items-center justify-center mt-0.5"
                      whileHover={{ backgroundColor: 'rgba(76, 175, 80, 0.4)', scale: 1.1 }}
                    >
                      <Leaf className="h-3 w-3 text-plantDoc-primary" />
                    </motion.div>
                    <span>{tip}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </EnhancedCardContent>
          </EnhancedCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultComponent;
