
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Leaf, Upload, Loader2, AlertOctagon } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UploadComponent from '@/components/UploadComponent';
import ResultComponent from '@/components/ResultComponent';
import AboutPlant from '@/components/AboutPlant';
import { diagnosePlant } from '@/services/api';
import { DiagnosisResult } from '@/types/diagnosis';
import { Button } from '@/components/ui/button';

const DiagnosePage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [isValidPlant, setIsValidPlant] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDiagnosisResult(null);
      setIsValidPlant(true);
    }
  };

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDiagnosisResult(null);
      setIsValidPlant(true);
    }
  };

  const handleDiagnose = async () => {
    if (!selectedImage) {
      toast.error('Please upload an image first');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await diagnosePlant(selectedImage);
      
      // Check if the diagnosis found a plant or if it's an invalid image
      if (result.disease.name.toLowerCase().includes("no disease") || 
          result.disease.name.toLowerCase().includes("not a plant") ||
          result.disease.name.toLowerCase().includes("unable to identify")) {
        setIsValidPlant(false);
        toast.error("This doesn't appear to be a plant image. Please upload a clear image of a plant.");
      } else {
        setDiagnosisResult(result);
        toast.success('Diagnosis complete!');
      }
    } catch (error) {
      console.error('Diagnosis error:', error);
      toast.error('Failed to diagnose the plant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setDiagnosisResult(null);
    setIsValidPlant(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Plant Diagnosis</h1>
            <p className="text-foreground/70 max-w-md mx-auto">
              Upload a photo of your plant to diagnose diseases and get treatment recommendations
            </p>
          </div>
          
          <div className="w-full relative">
            <UploadComponent 
              onImageChange={handleImageChange}
              onDrop={handleDrop}
              previewUrl={previewUrl}
              isLoading={isLoading}
              fileInputRef={fileInputRef}
              className="glass-card hover:border-plantDoc-primary/50 transition-all duration-300 transform hover:translate-y-[-5px]"
            />
            
            {!isValidPlant && previewUrl && (
              <div className="mt-4 p-4 border border-red-400 rounded-lg bg-red-100/10 flex items-center text-red-400 gap-2">
                <AlertOctagon className="h-5 w-5" />
                <p>This doesn't appear to be a plant image. Please upload a clear image of a plant.</p>
              </div>
            )}
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleDiagnose}
                disabled={!selectedImage || isLoading}
                className="bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary hover:shadow-lg transition-shadow text-white px-8 py-3 text-lg rounded-lg hover:scale-105 transition-transform fixed bottom-6 right-6 z-10"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Diagnosing...
                  </>
                ) : (
                  <>
                    <Leaf className="h-5 w-5 mr-2" />
                    Diagnose Plant
                  </>
                )}
              </Button>
              
              {previewUrl && (
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="border-plantDoc-primary/50 hover:bg-plantDoc-primary/10 transition-colors"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload New Image
                </Button>
              )}
            </div>
          </div>
          
          {diagnosisResult && (
            <div className="mt-12 space-y-8 animate-fade-in">
              <ResultComponent result={diagnosisResult} />
              
              {/* About Plant Section */}
              {diagnosisResult.about_plant && (
                <div className="mt-8">
                  <AboutPlant plantData={diagnosisResult.about_plant} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DiagnosePage;
