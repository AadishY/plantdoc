
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Leaf } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UploadComponent from '@/components/UploadComponent';
import ResultComponent from '@/components/ResultComponent';
import { diagnosePlant } from '@/services/api';
import { DiagnosisResult } from '@/types/diagnosis';

const DiagnosePage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setDiagnosisResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error('Please upload an image first');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const result = await diagnosePlant(selectedImage);
      setDiagnosisResult(result);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Diagnosis error:', error);
      toast.error('Failed to analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Plant Disease Diagnosis</h1>
            <p className="text-foreground/70 max-w-md mx-auto">
              Upload a clear image of your plant and get an instant AI-powered diagnosis
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="glass-card p-6 rounded-xl shadow-lg animate-enter">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <div className="w-6 h-6 rounded-full bg-plantDoc-primary/20 flex items-center justify-center mr-2">
                  <span className="text-xs font-bold text-plantDoc-primary">1</span>
                </div>
                Upload Your Plant Image
              </h2>
              <UploadComponent onImageSelect={handleImageSelect} />
              
              {selectedImage && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className={`
                      flex items-center gap-2 px-6 py-3 rounded-md text-white font-medium transition-all duration-300
                      ${isAnalyzing 
                        ? 'bg-gray-600/50 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-plantDoc-primary to-plantDoc-secondary hover:from-plantDoc-secondary hover:to-plantDoc-primary shadow-lg hover:shadow-xl'}
                    `}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Plant'
                    )}
                  </button>
                </div>
              )}
            </div>
            
            {isAnalyzing && (
              <div className="text-center py-12 glass-card rounded-xl animate-pulse">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-plantDoc-primary" />
                <p className="mt-4 text-lg">Analyzing your plant image...</p>
                <p className="text-foreground/60">This may take a moment</p>
              </div>
            )}
            
            {diagnosisResult && !isAnalyzing && (
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-plantDoc-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-plantDoc-primary">2</span>
                  </div>
                  <h2 className="text-2xl font-bold">Diagnosis Results</h2>
                </div>
                <ResultComponent result={diagnosisResult} />
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DiagnosePage;
