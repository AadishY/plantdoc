
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 md:py-12 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Plant Disease Diagnosis</h1>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Upload Your Plant Image</h2>
              <UploadComponent onImageSelect={handleImageSelect} />
              
              {selectedImage && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className={`
                      flex items-center gap-2 px-6 py-3 rounded-md text-white font-medium
                      ${isAnalyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-plantDoc-primary hover:bg-plantDoc-secondary'}
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
              <div className="text-center py-8">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-plantDoc-primary" />
                <p className="mt-4 text-lg">Analyzing your plant image...</p>
                <p className="text-gray-500">This may take a moment</p>
              </div>
            )}
            
            {diagnosisResult && !isAnalyzing && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Diagnosis Results</h2>
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
