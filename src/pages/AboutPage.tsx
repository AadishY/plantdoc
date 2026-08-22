import React from 'react';
import { 
  Github, 
  Leaf, 
  User, 
  School, 
  MapPin, 
  Instagram, 
  Code, 
  Sparkles, 
  ExternalLink,
  Cpu,
  Scan,
  Globe,
  FlaskConical,
  Layers,
  Heart
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.4 } 
  }
};

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Header />
      
      <main className="flex-1 py-12 md:py-16 container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* Header Banner */}
          <motion.div 
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#5EEAD4] text-xs font-semibold mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Creator & Botanical Intelligence Architecture
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-emerald-100 to-[#2DD4BF] bg-clip-text text-transparent mb-3">
              About PlantDoc AI
            </h1>
            <p className="text-foreground/75 text-sm sm:text-base">
              Empowering growers worldwide with clinical-grade computer vision diagnostics and verified botanical data.
            </p>
          </motion.div>
          
          {/* Creator Profile Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-black/45 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.1)] relative"
          >
            <div className="flex flex-col md:flex-row">
              {/* Left Column: Creator Identity */}
              <div className="md:w-5/12 bg-gradient-to-br from-[#2DD4BF]/15 via-black/40 to-[#059669]/10 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-white/10 relative">
                
                {/* Botanical Avatar Orb */}
                <div className="relative mb-5">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#2DD4BF]/30 to-[#059669]/20 flex items-center justify-center border-2 border-[#2DD4BF]/50 shadow-[0_0_35px_rgba(45,212,191,0.35)]">
                    <Leaf className="h-16 w-16 text-[#2DD4BF]" />
                  </div>
                  <span className="absolute bottom-1 right-1 px-2 py-0.5 rounded-full bg-black/90 border border-[#2DD4BF]/40 text-[10px] font-mono text-[#5EEAD4]">
                    CREATOR
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-1">
                  Aadish Kumar Yadav
                </h2>
                <p className="text-xs text-[#5EEAD4] font-medium mb-4">
                  Creator & AI Engineer
                </p>

                <p className="text-xs text-foreground/75 leading-relaxed max-w-xs mb-6">
                  Passionate about combining neural vision intelligence with agronomy to safeguard crops and assist home gardeners.
                </p>

                {/* Social & Code Links */}
                <div className="flex items-center gap-3">
                  <a 
                    href="https://github.com/AadishY/PlantDoc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all hover:scale-105"
                    title="GitHub Repository"
                  >
                    <Github className="h-4 w-4" />
                  </a>

                  <a 
                    href="https://instagram.com/yo.akatsuki" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#2DD4BF]/20 hover:bg-[#2DD4BF]/30 text-[#5EEAD4] border border-[#2DD4BF]/30 transition-all hover:scale-105"
                    title="Instagram Profile"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Right Column: Bio & Core Focus Info */}
              <div className="md:w-7/12 p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-[#2DD4BF]" />
                    Creator & Vision
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                    I am Aadish Kumar Yadav, Creator and AI Engineer of PlantDoc AI. I engineered this platform to bridge advanced neural computer vision with botanical agronomy, delivering rapid foliar lesion localization, clinical recovery prescriptions, and climate-matched flora recommendations for growers worldwide.
                  </p>
                </div>

                {/* Focus Area Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex items-center gap-3">
                    <Code className="h-4 w-4 text-[#2DD4BF] shrink-0" />
                    <div>
                      <span className="font-semibold text-white block">Neural Vision Systems</span>
                      <span className="text-foreground/60 text-[11px]">Spatial Lesion Segmentation</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 flex items-center gap-3">
                    <Globe className="h-4 w-4 text-[#2DD4BF] shrink-0" />
                    <div>
                      <span className="font-semibold text-white block">Botanical Agronomy</span>
                      <span className="text-foreground/60 text-[11px]">Verified Wikimedia Ecosystem</span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Mission */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-[#2DD4BF]" />
                    The PlantDoc Mission
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                    Agricultural yields are threatened every season by early-stage fungal, bacterial, and nutritional stress. PlantDoc AI provides sub-second computer vision lesion segmentation, clinical triage protocols, and climate matching so any grower can protect their plants immediately.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Technology Architecture Grid */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-1">
                Core Architectural Pillars
              </h2>
              <p className="text-xs text-foreground/70">
                How PlantDoc AI delivers clinical-grade botanical diagnostics
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="glass-card p-6 rounded-2xl border border-white/15 hover:border-plantDoc-primary/40 transition-all space-y-3">
                <div className="p-3 rounded-xl bg-plantDoc-primary/20 text-plantDoc-primary w-fit border border-plantDoc-primary/30">
                  <Scan className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Neural Lesion Mapping
                </h3>
                <p className="text-xs text-foreground/75 leading-relaxed">
                  Localizes disease lesions, chlorotic halo zones, and active necrotic centers directly on foliage photos using normalized 2D bounding boxes.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/15 hover:border-blue-400/40 transition-all space-y-3">
                <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 w-fit border border-blue-500/30">
                  <Globe className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Wikimedia Verified Media
                </h3>
                <p className="text-xs text-foreground/75 leading-relaxed">
                  Direct connection to Wikimedia REST APIs retrieves authentic high-resolution botanical photography, care guides, and Wikipedia profiles.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/15 hover:border-purple-400/40 transition-all space-y-3">
                <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 w-fit border border-purple-500/30">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Clinical Triage Matrix
                </h3>
                <p className="text-xs text-foreground/75 leading-relaxed">
                  Provides actionable emergency isolation checklists, exact biological bio-fungicide recipes, active chemical dosages, and 30-day recovery timelines.
                </p>
              </div>
            </div>
          </div>

          {/* Technology Badges */}
          <div className="glass-card-intense p-6 rounded-2xl border border-white/10 flex flex-wrap items-center justify-center gap-3">
            {[
              "React 18",
              "TypeScript",
              "Lenis Smooth Scroll",
              "GSAP Animation Engine",
              "Tailwind CSS",
              "Wikimedia REST API",
              "AI Lesion Localization",
              "Vite"
            ].map((tech, idx) => (
              <Badge 
                key={idx} 
                className="bg-white/5 hover:bg-white/10 text-white border border-white/15 px-3 py-1 text-xs font-mono"
              >
                {tech}
              </Badge>
            ))}
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default React.memo(AboutPage);
