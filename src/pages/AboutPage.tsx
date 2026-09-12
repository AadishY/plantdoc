import React from 'react';
import { 
  Github, 
  Leaf, 
  User, 
  Instagram, 
  Code, 
  Sparkles, 
  ExternalLink,
  Cpu,
  Scan,
  Globe,
  FlaskConical,
  Layers,
  Heart,
  ShieldCheck,
  Microscope,
  CheckCircle2,
  Lock,
  Zap,
  Activity,
  ArrowRight,
  Focus,
  Pill,
  Scale
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

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

const AI_MODELS = [
  {
    name: "Gemini 3.8 Flash",
    role: "Clinical Pathology & Prescription Matrix",
    tag: "Primary Pathologist",
    budget: "Thinking (Budget: 1024)",
    description: "Analyzes foliar pathology signatures, computes differential diagnoses, identifies etiology, and formulates 5-tier remediation protocols with commercial retail brand chemicals.",
    icon: Microscope,
    color: "from-[#2DD4BF] to-[#10B981]"
  },
  {
    name: "Gemini Robotics ER-2 Preview",
    role: "Spatial Embodied Lesion Grounding",
    tag: "Spatial Vision",
    budget: "Embodied Reasoning",
    description: "Calculates normalized sub-pixel 2D bounding boxes [ymin, xmin, ymax, xmax] tightly localizing necrotic spots, chlorotic halos, and insect feeding perforations.",
    icon: Focus,
    color: "from-blue-400 to-indigo-500"
  },
  {
    name: "Gemini 3.5 Flash Lite",
    role: "Fast Regional Climate Intelligence",
    tag: "Climate Engine",
    budget: "Low-Latency Reasoning",
    description: "Extracts geographic macro-climate zones, temperature envelopes, precipitation ranges, and soil chemistry profiles from regional queries.",
    icon: Zap,
    color: "from-amber-400 to-orange-500"
  },
  {
    name: "Gemma 4 Open Family",
    role: "Agronomic Botanical Matchmaker",
    tag: "Gemma 4 Architecture",
    budget: "Thinking (includeThoughts: true)",
    description: "Matches environmental climate parameters against optimal botanical candidates with genuine scientific Latin binomials and USDA hardiness compatibility.",
    icon: Leaf,
    color: "from-emerald-400 to-teal-600"
  }
];

const PIPELINE_STAGES = [
  {
    step: "01",
    title: "Offscreen WebP Downsampling",
    subtitle: "Resolution Clamping & Network Acceleration",
    description: "DSLR and smartphone photos are downsampled on an HTML5 canvas to a 1280px bounding box with 0.85 progressive WebP compression, reducing a 15MB file to ~95KB (99% payload reduction).",
    icon: Cpu
  },
  {
    step: "02",
    title: "Parallel Dual-Model Execution",
    subtitle: "Synchronous Pathological & Spatial Inference",
    description: "Simultaneously dispatches the specimen to Gemini 3.8 Flash for etiology and Gemini Robotics ER-2 for spatial coordinates, cutting total diagnostic latency in half.",
    icon: Layers
  },
  {
    step: "03",
    title: "Sub-Pixel IoU & NMS Deduplication",
    subtitle: "Zero Ghost Boxes & Concentric Filtering",
    description: "Candidate lesion bounding boxes pass through an Intersection-over-Union filter with an IoU > 0.55 threshold, discarding duplicate concentric boxes and degenerate frame coordinates.",
    icon: Scan
  },
  {
    step: "04",
    title: "Scientific Veracity Verification",
    subtitle: "Anti-Hallucination & Specimen Rejection",
    description: "Non-plant photos (pets, food, vehicles, indoor objects) are rejected with zero false diagnoses. Only verified retail chemical brands and organic recipes are prescribed.",
    icon: ShieldCheck
  },
  {
    step: "05",
    title: "Live Wikimedia REST Grounding",
    subtitle: "Zero Synthetic or Mock Media",
    description: "Botanical recommendations query the Wikimedia Foundation REST APIs in real time to fetch peer-reviewed Wikipedia summaries, taxonomy classifications, and authentic photography.",
    icon: Globe
  }
];

const AboutPage: React.FC = () => {
  useDocumentTitle(
    "Platform Architecture & Agronomy Mission — PlantDoc AI",
    "Learn about PlantDoc AI's multi-stage neural vision architecture, spatial lesion localization, and clinical prescription algorithms.",
    "/about"
  );

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden touch-pan-y">
      <Header />
      
      <main className="flex-1 py-12 md:py-16 container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* Header Banner */}
          <motion.div 
            className="text-center max-w-3xl mx-auto space-y-4"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#5EEAD4] text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              Agronomy Intelligence & Neural Vision Platform
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-emerald-100 to-[#2DD4BF] bg-clip-text text-transparent">
              Engineered for Plant Health & Agricultural Resilience
            </h1>

            <p className="text-foreground/80 text-sm sm:text-base leading-relaxed">
              PlantDoc AI combines multi-model computer vision, sub-pixel spatial lesion grounding, and real-time botanical encyclopedic databases to provide instant, clinical-grade foliar pathology care to farmers and gardeners worldwide.
            </p>

            {/* Quick Stat Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <span className="px-3 py-1 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-white/90 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-[#2DD4BF]" />
                Parallel Dual-Model Inference
              </span>
              <span className="px-3 py-1 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-white/90 flex items-center gap-1.5">
                <Scan className="h-3.5 w-3.5 text-blue-400" />
                Sub-Pixel IoU & NMS Filtering
              </span>
              <span className="px-3 py-1 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-white/90 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-emerald-400" />
                Live Wikimedia REST API
              </span>
            </div>
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
                  <span className="absolute bottom-1 right-1 px-2.5 py-0.5 rounded-full bg-black/95 border border-[#2DD4BF]/50 text-[10px] font-mono text-[#5EEAD4] font-bold">
                    CREATOR
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-1">
                  Aadish Kumar Yadav
                </h2>
                <p className="text-xs text-[#5EEAD4] font-medium mb-3">
                  Creator & AI Engineer
                </p>

                <p className="text-xs text-foreground/75 leading-relaxed max-w-xs mb-6">
                  Combining advanced computer vision models with agronomic science to democratize plant disease diagnosis and sustainable crop protection.
                </p>

                {/* Social & Code Links */}
                <div className="flex items-center gap-3">
                  <a 
                    href="https://github.com/AadishY/PlantDoc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all hover:scale-105 text-xs font-semibold flex items-center gap-2"
                    title="GitHub Repository"
                  >
                    <Github className="h-4 w-4" />
                    <span>GitHub Repo</span>
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
                    Vision & Engineering Philosophy
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                    I developed PlantDoc AI to solve a critical limitation in consumer gardening and agronomy tools: superficial classifications with no spatial awareness and hallucinated treatments. By marrying spatial embodied reasoning with clinical phytopathology, PlantDoc AI isolates precise necrotic lesion spots on user photos and prescribes commercial retail products with safe chemical dosages and biological alternatives.
                  </p>
                </div>

                {/* Focus Area Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3">
                    <Code className="h-4 w-4 text-[#2DD4BF] shrink-0" />
                    <div>
                      <span className="font-semibold text-white block">Spatial Lesion Vision</span>
                      <span className="text-foreground/60 text-[11px]">Sub-pixel [ymin, xmin, ymax, xmax]</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3">
                    <Globe className="h-4 w-4 text-[#2DD4BF] shrink-0" />
                    <div>
                      <span className="font-semibold text-white block">Scientific Taxonomy</span>
                      <span className="text-foreground/60 text-[11px]">Real Wikimedia Foundation Data</span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Mission */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-[#2DD4BF]" />
                    The Global Agronomic Mission
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                    Crop diseases destroy up to 40% of global agricultural yield annually. Early detection at the micro-lesion stage stops fungal sporulation and bacterial blight before it wipes out whole canopies. PlantDoc AI operates anywhere with zero sign-up barriers, zero advertising cookies, and transparent scientific guidance.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 5-Stage Neural Pipeline Section */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                The 5-Stage Diagnostic Pipeline
              </h2>
              <p className="text-xs sm:text-sm text-foreground/75">
                From raw DSLR/smartphone camera pixels to a sub-pixel lesion overlay and clinical recovery protocol
              </p>
            </div>

            <div className="space-y-4">
              {PIPELINE_STAGES.map((stage, idx) => {
                const IconComponent = stage.icon;
                return (
                  <motion.div
                    key={stage.step}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08, duration: 0.4 }}
                    className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-[#2DD4BF]/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xl group"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 flex items-center justify-center text-[#5EEAD4] font-mono font-bold text-sm shrink-0 group-hover:scale-105 group-hover:bg-[#2DD4BF]/25 transition-all">
                        {stage.step}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">
                            {stage.title}
                          </h3>
                          <span className="text-[10px] font-mono text-[#5EEAD4] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#2DD4BF]/15 border border-[#2DD4BF]/25">
                            {stage.subtitle}
                          </span>
                        </div>
                        <p className="text-xs text-foreground/75 mt-1 leading-relaxed max-w-2xl">
                          {stage.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 group-hover:text-[#5EEAD4] group-hover:border-[#2DD4BF]/30 transition-all shrink-0 hidden md:block">
                      <IconComponent className="h-5 w-5" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* AI Model Architecture Grid */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Specialized AI Model Architecture
              </h2>
              <p className="text-xs sm:text-sm text-foreground/75">
                Every task is handled by a tailored neural engine without synthetic fallbacks
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {AI_MODELS.map((model, idx) => {
                const IconComp = model.icon;
                return (
                  <motion.div
                    key={model.name}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    className="p-6 rounded-3xl bg-black/45 border border-white/15 hover:border-[#2DD4BF]/50 transition-all duration-300 backdrop-blur-2xl space-y-4 flex flex-col justify-between shadow-lg"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-[#2DD4BF]/20 to-[#059669]/10 border border-[#2DD4BF]/30 text-[#5EEAD4]">
                          <IconComp className="h-6 w-6" />
                        </div>
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/80">
                          {model.tag}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {model.name}
                        </h3>
                        <p className="text-xs text-[#5EEAD4] font-medium">
                          {model.role}
                        </p>
                      </div>

                      <p className="text-xs text-foreground/80 leading-relaxed">
                        {model.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-foreground/60">
                      <span>Reasoning Mode:</span>
                      <span className="text-white/90">{model.budget}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Scientific Veracity & Privacy Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-black/40 border border-white/15 backdrop-blur-xl space-y-3">
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 w-fit border border-emerald-500/30">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Zero Synthetic Data
              </h3>
              <p className="text-xs text-foreground/75 leading-relaxed">
                All plant recommendations resolve live Wikipedia photography and Latin binomials from the Wikimedia Foundation REST API. No mock plant catalogs.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-black/40 border border-white/15 backdrop-blur-xl space-y-3">
              <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 w-fit border border-blue-500/30">
                <Pill className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Genuine Retail Prescriptions
              </h3>
              <p className="text-xs text-foreground/75 leading-relaxed">
                Recommends authentic shelf-ready fungicides and pest control (Daconil, Bonide, Mancozeb, Neem) plus exact homemade organic preparations.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-black/40 border border-white/15 backdrop-blur-xl space-y-3">
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 w-fit border border-purple-500/30">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Client-Side Security
              </h3>
              <p className="text-xs text-foreground/75 leading-relaxed">
                Specimens are compressed client-side and streamed securely via memory buffers. No photos are retained or sold to third-party data brokers.
              </p>
            </div>
          </div>

          {/* Technology Badges Matrix */}
          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-center gap-2.5">
            {[
              "React 18 & TypeScript",
              "Gemini 3.7 Flash",
              "Gemini Robotics ER-2",
              "Gemma 4 31B IT",
              "Wikimedia REST APIs",
              "Tailwind CSS v3",
              "Lenis Kinetic Scroll",
              "GSAP ScrollTrigger",
              "Framer Motion",
              "Vite SWC"
            ].map((tech) => (
              <Badge 
                key={tech} 
                className="bg-white/5 hover:bg-white/10 text-white/90 border border-white/15 px-3 py-1 text-xs font-mono"
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

