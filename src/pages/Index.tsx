import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlantDocHeroStage from "@/components/PlantDocHeroStage";
import ParallaxSection from "@/components/ParallaxSection";
import MetricsShowcase from "@/components/MetricsShowcase";
import SpotlightCard from "@/components/SpotlightCard";
import { 
  Sparkles, 
  Scan, 
  Wand2, 
  ArrowRight, 
  HelpCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Zap, 
  Activity 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does PlantDoc AI achieve spatial lesion localization?",
    answer: "PlantDoc AI utilizes an advanced neural vision diagnostics architecture that identifies the plant species and clinical disease classification, while computing precise 2D spatial bounding box coordinates [ymin, xmin, ymax, xmax] around individual necrotic lesions."
  },
  {
    question: "Does PlantDoc AI use synthetic or mock placeholder data?",
    answer: "No. All plant recommendation photography, taxonomic summaries, and cultivation profiles are pulled directly from authentic Wikimedia Foundation REST APIs, guaranteeing genuine botanical photography and verified scientific data."
  },
  {
    question: "What remediation guidelines are provided after diagnosis?",
    answer: "Each diagnostic report contains a 4-tier triage breakdown: 1) Immediate Isolation Actions, 2) Bio-Organic Formulations (Neem, Potassium Bicarbonate, Milk spray), 3) Targeted Chemical Prescriptions with exact active ingredients, and 4) NPK Fertilizer & Soil Adjustment protocols."
  },
  {
    question: "Which plant species and crops are supported?",
    answer: "PlantDoc AI supports 38+ major agricultural and horticultural crop families including Solanaceae (tomatoes, peppers, potatoes), Cucurbits (cucumbers, squash, melons), Rosaceae (apples, strawberries, peaches), Vitaceae (grapes), and common household ornamentals."
  },
  {
    question: "How does the climate-matched plant recommendation engine work?",
    answer: "Our engine analyzes your geographic region's temperature, annual precipitation, soil texture, pH, and sunlight exposure to match species hardiness zones, providing instant companion plant suggestions."
  }
];

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden selection:bg-[#2DD4BF]/30 selection:text-white">
      <Header />
      
      {/* 🌿 1. Page 1 Hero: Strict 100dvh Zero-Overflow Stage */}
      <PlantDocHeroStage />
      
      {/* 💎 2. Dynamic Main Content Below Hero */}
      <main id="features-section" className="flex-grow relative z-10 space-y-6 md:space-y-10">
        
        {/* Section 2: Core Vision & Agronomic Intelligence (Spotlight Cards) */}
        <ParallaxSection />

        {/* Section 3: Clinical Benchmarks */}
        <MetricsShowcase />

        {/* Section 4: 3-Step Clinical Workflow */}
        <section className="py-8 md:py-12 container mx-auto px-4 relative z-10 max-w-6xl content-visibility-auto">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#5EEAD4] text-xs font-semibold mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Simple 3-Step Protocol
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-3">
              How PlantDoc AI <span className="bg-gradient-to-r from-white via-emerald-100 to-[#2DD4BF] bg-clip-text text-transparent">Protects Crops</span>
            </h2>
            <p className="text-foreground/75 text-sm md:text-base">
              A clinical pipeline designed for home gardeners, commercial nurseries, and agricultural specialists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Foliage Photo",
                desc: "Snap a photo of the affected plant leaf, stem, or fruit with clear natural lighting."
              },
              {
                step: "02",
                title: "Computer Vision Analysis",
                desc: "Our dual-model system identifies the species and maps localized disease lesions with 2D bounding boxes."
              },
              {
                step: "03",
                title: "Clinical Treatment Plan",
                desc: "Follow interactive triage checklists, organic recipes, and chemical dosage prescriptions."
              }
            ].map((step, idx) => (
              <SpotlightCard
                key={idx}
                className="p-8 text-left relative overflow-hidden group"
              >
                <div className="text-5xl font-mono font-extrabold text-[#2DD4BF]/25 group-hover:text-[#2DD4BF]/60 transition-colors mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#5EEAD4] transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-foreground/75 leading-relaxed">
                  {step.desc}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </section>

        {/* Section 7: FAQ Accordion */}
        <section className="py-10 md:py-14 container mx-auto px-4 relative z-10 max-w-4xl content-visibility-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#5EEAD4] text-xs font-semibold mb-3">
              <HelpCircle className="h-3.5 w-3.5" />
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              Everything You Need to Know
            </h2>
            <p className="text-foreground/75 text-sm">
              Answers regarding computer vision diagnostics, Wikimedia data, and clinical treatment.
            </p>
          </div>

          <div className="bg-black/55 backdrop-blur-3xl rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-white/10 rounded-2xl px-5 bg-white/[0.03] hover:border-[#2DD4BF]/40 transition-colors"
                >
                  <AccordionTrigger className="text-sm sm:text-base font-semibold text-white hover:text-[#5EEAD4] py-4 text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-foreground/80 leading-relaxed pb-4 pt-1">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Section 8: Closing Radiant Beacon CTA */}
        <section className="py-10 md:py-14 container mx-auto px-4 relative z-10 max-w-5xl content-visibility-auto">
          <div className="relative rounded-3xl p-8 sm:p-12 md:p-16 bg-gradient-to-br from-[#0a2013]/90 via-black to-[#05140b]/80 backdrop-blur-3xl border border-[#2DD4BF]/50 shadow-[0_0_60px_rgba(45,212,191,0.3)] overflow-hidden text-center transform-gpu">
            
            {/* Ambient Radial Flare */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#2DD4BF]/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#5EEAD4] text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                Start Diagnosing Instantly
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
                Protect Your Plants with <br />
                <span className="bg-gradient-to-r from-white via-emerald-200 to-[#2DD4BF] bg-clip-text text-transparent">
                  Clinical-Grade AI Vision
                </span>
              </h2>

              <p className="text-foreground/80 text-sm sm:text-base leading-relaxed">
                Join thousands of gardeners and agricultural professionals relying on PlantDoc AI for rapid lesion localization and proven recovery protocols.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#059669] hover:from-[#5EEAD4] hover:via-[#34D399] hover:to-[#10B981] text-black font-extrabold px-9 py-6 rounded-full shadow-[0_0_35px_rgba(45,212,191,0.55)] transition-transform hover:scale-105 border border-[#5EEAD4]/60"
                >
                  <Link to="/diagnose" className="flex items-center gap-2">
                    <Scan className="h-5 w-5" />
                    <span>Launch Disease Scanner</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>

                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto bg-black/60 hover:bg-black/80 text-white font-semibold px-9 py-6 rounded-full backdrop-blur-2xl transition-transform hover:scale-105 border border-white/20 hover:border-[#2DD4BF]/60 hover:text-[#5EEAD4] shadow-lg"
                >
                  <Link to="/recommend" className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-[#2DD4BF]" />
                    <span>Get Plant Recommendations</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* 💧 Floating Liquid Glass Footer */}
      <Footer />
    </div>
  );
};

export default Index;
