
import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowUp, Droplet, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-plantDoc-light to-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-plantDoc-dark mb-4">
                  AI-Powered Plant Disease Diagnosis
                </h1>
                <p className="text-lg text-gray-700 mb-6 md:max-w-xl">
                  Upload a photo of your plant and get instant diagnosis, treatment recommendations, 
                  and care tips to help your plants thrive.
                </p>
                <Link to="/diagnose">
                  <Button className="bg-plantDoc-primary hover:bg-plantDoc-secondary text-white font-medium px-6 py-3 text-lg">
                    Diagnose Your Plant
                  </Button>
                </Link>
              </div>
              <div className="flex-1 flex justify-center md:justify-end">
                <div className="relative w-72 h-72 md:w-96 md:h-96">
                  <div className="absolute inset-0 bg-plantDoc-primary rounded-full opacity-10"></div>
                  <img
                    src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80"
                    alt="Healthy plant"
                    className="rounded-full object-cover w-full h-full shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-plantDoc-dark mb-4">How Plant Doc Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our advanced AI technology helps you identify and treat plant diseases with just a photo.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-plantDoc-light rounded-lg p-6 text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <ArrowUp className="text-plantDoc-primary h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload a Photo</h3>
                <p className="text-gray-600">
                  Take a clear picture of your plant showing the affected areas and upload it.
                </p>
              </div>
              
              <div className="bg-plantDoc-light rounded-lg p-6 text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Leaf className="text-plantDoc-primary h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Diagnosis</h3>
                <p className="text-gray-600">
                  Our AI analyzes your plant's condition and identifies any diseases or issues.
                </p>
              </div>
              
              <div className="bg-plantDoc-light rounded-lg p-6 text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Thermometer className="text-plantDoc-primary h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Receive Treatment Plan</h3>
                <p className="text-gray-600">
                  Get personalized recommendations for treatment, prevention, and care.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link to="/diagnose">
                <Button className="bg-plantDoc-primary hover:bg-plantDoc-secondary text-white">
                  Try it Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
