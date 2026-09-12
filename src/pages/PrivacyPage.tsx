import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Server, 
  Cpu, 
  Database, 
  Globe, 
  Clock, 
  FileText, 
  RefreshCw, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { motion } from "framer-motion";

const PrivacyPage: React.FC = () => {
  useDocumentTitle(
    "Privacy Policy — PlantDoc AI",
    "Discover how PlantDoc AI safeguards your privacy with client-side image downsampling, zero data selling, and ephemeral AI telemetry."
  );

  const lastUpdated = "September 11, 2026";

  const PRINCIPLES = [
    {
      icon: EyeOff,
      title: "Client-Side Processing First",
      desc: "All foliage specimens uploaded for pathology diagnosis are downsampled and converted to WebP format entirely in your browser using HTML5 Canvas before any network dispatch."
    },
    {
      icon: Lock,
      title: "Zero Permanent Foliage Storage",
      desc: "PlantDoc AI does not store, archive, or sell your uploaded foliage photos. Images are used ephemerally to execute clinical diagnostics and discarded immediately after processing."
    },
    {
      icon: ShieldCheck,
      title: "No Biometrics or Personal Tracking",
      desc: "We do not collect facial biometrics, personal identifiers, device hardware serials, or invasive third-party ad-tracking cookies. Your agronomic research remains private."
    },
    {
      icon: Cpu,
      title: "Encrypted AI Diagnostics",
      desc: "Diagnostic payloads are transmitted via modern TLS 1.3 encrypted connections directly to Google Gemini vision & botanical models with zero intermediary surveillance."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#060a08] text-white selection:bg-[#2DD4BF]/30 selection:text-white relative overflow-x-hidden">
      <Header />

      {/* Ambient Atmospheric Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#2DD4BF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-[#10B981]/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 sm:py-16 max-w-4xl relative z-10">
        
        {/* Back navigation */}
        <div className="mb-6">
          <Link to="/">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-black/40 border-white/10 hover:border-[#2DD4BF]/40 text-foreground/80 hover:text-white gap-2 text-xs transition-all backdrop-blur-xl"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-[#2DD4BF]" />
              Return to Nursery
            </Button>
          </Link>
        </div>

        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 text-[#5EEAD4] text-xs font-mono">
            <ShieldCheck className="h-3.5 w-3.5 text-[#2DD4BF]" />
            Privacy & Trust Architecture
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#059669]">Policy</span>
          </h1>
          <p className="text-sm sm:text-base text-foreground/70 leading-relaxed max-w-2xl">
            PlantDoc AI is designed from the ground up to respect your digital privacy and agricultural autonomy. We believe cutting-edge agronomic intelligence should never require sacrificing personal data.
          </p>
          <div className="flex items-center gap-2 text-xs text-foreground/50 font-mono pt-1">
            <Clock className="h-3.5 w-3.5" />
            <span>Effective Date: {lastUpdated}</span>
          </div>
        </motion.div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {PRINCIPLES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl hover:border-[#2DD4BF]/30 transition-all space-y-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
              >
                <div className="w-9 h-9 rounded-xl bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 flex items-center justify-center text-[#2DD4BF]">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-white">{item.title}</h3>
                <p className="text-xs sm:text-sm text-foreground/65 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8 text-sm sm:text-base text-foreground/80 leading-relaxed border-t border-white/10 pt-10">
          
          {/* 1. Collection & Handling */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Database className="h-4 w-4 text-[#2DD4BF]" />
              1. Information We Collect (and What We Don't)
            </h2>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 text-xs sm:text-sm">
              <p className="font-medium text-white">We DO NOT collect:</p>
              <ul className="list-disc list-inside space-y-1 text-foreground/70">
                <li>Personal identities, real names, email addresses, or phone numbers</li>
                <li>Biometric data, facial scans, or background surveillance imagery</li>
                <li>Precise GPS coordinates (only user-selected regional state/country climate parameters)</li>
                <li>Credit card or payment credentials</li>
              </ul>
              <p className="font-medium text-white pt-2">We DO process ephemerally:</p>
              <ul className="list-disc list-inside space-y-1 text-foreground/70">
                <li>Uploaded foliage photos for real-time pathology classification</li>
                <li>Regional climate selections (temperature, rainfall, soil type, pH) to match suitable crops</li>
                <li>Temporary client-side rate limit counters to ensure fair API access</li>
              </ul>
            </div>
          </section>

          {/* 2. Client-Side Processing */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="h-4 w-4 text-[#2DD4BF]" />
              2. Client-Side WebP Downsampling & Data Minimization
            </h2>
            <p className="text-foreground/70 text-xs sm:text-sm">
              Before any photo leaves your device, PlantDoc AI runs an offscreen HTML5 Canvas pipeline (<code className="text-[#5EEAD4] bg-white/10 px-1.5 py-0.5 rounded text-[11px]">prepareImageForAPI</code>). This caps dimensions to 1280px and strips all EXIF metadata (including camera serials, timestamps, and GPS geotags), reducing payloads by over 95% while keeping foliar lesion detail intact.
            </p>
          </section>

          {/* 3. AI Inference & Ephemeral Transmission */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Server className="h-4 w-4 text-[#2DD4BF]" />
              3. AI Inference & Model Providers
            </h2>
            <p className="text-foreground/70 text-xs sm:text-sm">
              Diagnostic queries are evaluated by Google Gemini vision models and open Gemma botanical reasoning models via encrypted Google Cloud endpoints. We do not use user specimen submissions to train public AI models. Data transmitted is ephemeral and processed in real time.
            </p>
          </section>

          {/* 4. Public Botanical Data (Wikimedia Foundation) */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#2DD4BF]" />
              4. Public Botanical Information (Wikimedia Foundation)
            </h2>
            <p className="text-foreground/70 text-xs sm:text-sm">
              To supply real scientific photography and binomial taxonomy, our recommendation engine connects directly to the public <strong className="text-white">Wikimedia Foundation REST API</strong> (<code className="text-[#5EEAD4] bg-white/10 px-1.5 py-0.5 rounded text-[11px]">en.wikipedia.org/api/rest_v1</code>). No user-identifiable data is shared with Wikimedia during these educational requests.
            </p>
          </section>

          {/* 5. Local Storage & Dynamic Cache */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-[#2DD4BF]" />
              5. Local Storage, Cookies & Offline Cache
            </h2>
            <p className="text-foreground/70 text-xs sm:text-sm">
              PlantDoc AI does not use marketing or cross-site tracking cookies. We utilize modern browser <strong className="text-white">localStorage</strong> strictly for:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-foreground/70">
              <li>Saving your recent specimen diagnosis history locally on your device for convenient review</li>
              <li>Maintaining your UI theme and audio preferences</li>
              <li>Tracking the 3-request-per-minute rate limit window</li>
            </ul>
            <p className="text-foreground/70 text-xs sm:text-sm">
              You can clear your local storage at any time via your browser settings or using the button below.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  try {
                    localStorage.removeItem('plantdoc_recent_diagnoses');
                    localStorage.removeItem('plantdoc_api_req_timestamps');
                    alert('Local PlantDoc storage cache cleared successfully.');
                  } catch {}
                }}
                className="rounded-xl bg-white/[0.05] border-white/10 hover:border-red-500/40 text-xs text-foreground/80 hover:text-red-400 gap-2"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Clear Local Storage & Diagnosis Cache
              </Button>
            </div>
          </section>

          {/* 6. Open Source License & Contact */}
          <section className="space-y-3 border-t border-white/10 pt-8">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#2DD4BF]" />
              6. Open Source Transparency & Contact
            </h2>
            <p className="text-foreground/70 text-xs sm:text-sm">
              PlantDoc AI is an open-source agronomic project distributed under the <strong className="text-white">MIT License</strong>. If you have questions regarding data handling, security architecture, or privacy practices, please open an issue on our GitHub repository or contact the lead maintainer:
            </p>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1 text-xs sm:text-sm">
              <p><strong className="text-white">Lead Developer:</strong> Aadish Kumar Yadav</p>
              <p><strong className="text-white">Contact Email:</strong> <a href="mailto:aadish14146yadav@gmail.com" className="text-[#5EEAD4] hover:underline">aadish14146yadav@gmail.com</a></p>
              <p><strong className="text-white">GitHub:</strong> <a href="https://github.com/AadishY/plantdoc" target="_blank" rel="noopener noreferrer" className="text-[#5EEAD4] hover:underline">github.com/AadishY/plantdoc</a></p>
            </div>
          </section>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default React.memo(PrivacyPage);
