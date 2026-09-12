import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Scan, 
  Sparkles, 
  Compass, 
  ArrowRight, 
  Heart, 
  Droplet, 
  Leaf, 
  ShieldCheck, 
  Layers, 
  Smile,
  Flower2
} from "lucide-react";
import { DoodleLostPlant } from "@/components/ui/BotanicalDoodles";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { motion, AnimatePresence } from "framer-motion";

const GOOD_LUCK_BLESSINGS = [
  "May your leaves stay lush, your roots run deep, and your soil remain fertile! 🌱",
  "Good luck on your botanical journey! Remember, even the tallest redwood began as a tiny seed.",
  "May your sunlight be golden, your water balanced, and pests never find your garden! 🌿",
  "Sending you green thumb blessings and abundant harvest energy! ✨",
  "May your photosynthesis be vibrant and every bloom bring joy to your day! 🌸"
];

const NotFound: React.FC = () => {
  useDocumentTitle(
    "404 — Specimen Not Found • PlantDoc AI",
    "The requested botanical specimen or page could not be located in our nursery database."
  );

  const location = useLocation();
  const [blessingIdx, setBlessingIdx] = useState(0);
  const [waterCount, setWaterCount] = useState(0);
  const [isBlooming, setIsBlooming] = useState(false);

  useEffect(() => {
    // Pick a random blessing on load
    setBlessingIdx(Math.floor(Math.random() * GOOD_LUCK_BLESSINGS.length));
  }, []);

  const handleWaterSprout = () => {
    const next = waterCount + 1;
    setWaterCount(next);
    if (next >= 3) {
      setIsBlooming(true);
    }
  };

  const handleNextBlessing = () => {
    setBlessingIdx((prev) => (prev + 1) % GOOD_LUCK_BLESSINGS.length);
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden selection:bg-[#2DD4BF]/30 selection:text-white bg-[#060a08]">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-16 relative z-10 flex flex-col items-center justify-center">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#2DD4BF]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#10B981]/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-3xl mx-auto text-center space-y-8">
          
          {/* Top Status & 404 Route Pill */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-[#2DD4BF]/40 text-[#5EEAD4] text-xs font-mono backdrop-blur-xl shadow-[0_0_20px_rgba(45,212,191,0.2)]"
          >
            <Compass className="h-3.5 w-3.5 text-[#2DD4BF] animate-spin" style={{ animationDuration: '10s' }} />
            <span>404: Uncharted Coordinates Trail</span>
            <span className="text-white/40">|</span>
            <code className="text-white/80 bg-white/10 px-2 py-0.5 rounded text-[11px] truncate max-w-[180px] sm:max-w-xs">
              {location.pathname}
            </code>
          </motion.div>

          {/* Central Whimsical Hand-Drawn Doodle Showcase */}
          <div className="relative flex flex-col items-center justify-center my-2">
            <div className="relative">
              {/* Hand-Drawn Lost Plant Doodle */}
              <DoodleLostPlant className="w-48 h-48 sm:w-60 sm:h-60 mx-auto filter drop-shadow-[0_0_35px_rgba(45,212,191,0.4)]" />

              {/* Interactive Blooming Crown Effect when watered */}
              <AnimatePresence>
                {isBlooming && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0, y: 10 }}
                    animate={{ scale: 1.1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold shadow-[0_0_25px_rgba(244,63,94,0.6)] flex items-center gap-1.5 border border-white/30"
                  >
                    <Flower2 className="h-3.5 w-3.5 animate-bounce" />
                    <span>Nourished & Blooming! 🌸</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Interactive "Water the Lost Sprout" Mini-delight */}
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={handleWaterSprout}
                className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#2DD4BF]/20 border border-white/15 hover:border-[#2DD4BF]/50 text-xs font-medium text-white/90 hover:text-[#5EEAD4] transition-all duration-300 backdrop-blur-xl active:scale-95"
                title="Click to water this lost sprout"
              >
                <Droplet className="h-3.5 w-3.5 text-[#2DD4BF] group-hover:animate-bounce" />
                <span>
                  {waterCount === 0 ? "Give water to the sprout" : `Watered ${waterCount}x ${isBlooming ? "✨ (Full Bloom!)" : ""}`}
                </span>
              </button>
            </div>
          </div>

          {/* Heading and Narrative */}
          <div className="space-y-3 max-w-xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white">
              Lost in the Foliage?
            </h1>
            <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
              This botanical path seems to have wandered into uncharted soil. But don't worry—no gardener is truly lost when there are seeds to sow!
            </p>
          </div>

          {/* ✨ Good Luck & Botanical Blessing Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#2DD4BF]/15 via-black/60 to-[#10B981]/15 border border-[#2DD4BF]/40 backdrop-blur-2xl max-w-lg mx-auto shadow-[0_0_35px_rgba(45,212,191,0.2)] text-left relative overflow-hidden"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#5EEAD4] shrink-0 mt-0.5">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-[#5EEAD4] uppercase tracking-wider">
                    Good Luck Blessing
                  </span>
                  <button 
                    onClick={handleNextBlessing}
                    className="text-[10px] font-mono text-white/60 hover:text-[#5EEAD4] underline cursor-pointer"
                  >
                    Next blessing &rarr;
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed italic">
                  "{GOOD_LUCK_BLESSINGS[blessingIdx]}"
                </p>
              </div>
            </div>
          </motion.div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              asChild
              className="w-full sm:w-auto bg-gradient-to-r from-[#2DD4BF] via-[#10B981] to-[#059669] hover:from-[#5EEAD4] hover:via-[#34D399] hover:to-[#10B981] text-black font-extrabold px-8 py-6 text-sm sm:text-base rounded-full shadow-[0_0_30px_rgba(45,212,191,0.5)] transition-all hover:scale-105"
            >
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Return to Sanctuary (Home)
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto bg-black/50 hover:bg-black/80 text-white font-semibold border-white/20 hover:border-[#2DD4BF]/60 hover:text-[#5EEAD4] py-6 text-sm sm:text-base rounded-full hover:scale-105 backdrop-blur-xl shadow-lg"
            >
              <Link to="/diagnose">
                <Scan className="h-4 w-4 mr-2" />
                Diagnose Foliage
              </Link>
            </Button>
          </div>

          {/* Quick Shortcut Navigation Grid */}
          <div className="pt-6 border-t border-white/10 max-w-2xl mx-auto">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white/60 mb-4">
              Explore Verified Sections
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <Link 
                to="/diagnose" 
                className="p-4 rounded-2xl bg-black/40 hover:bg-white/[0.08] border border-white/10 hover:border-[#2DD4BF]/40 transition-all group backdrop-blur-xl"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Scan className="h-4 w-4 text-[#2DD4BF] group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white group-hover:text-[#5EEAD4]">Disease Vision</span>
                </div>
                <p className="text-[11px] text-white/60 leading-normal">
                  Upload leaf photo for 2D lesion boxes & chemical Rx.
                </p>
              </Link>

              <Link 
                to="/recommend" 
                className="p-4 rounded-2xl bg-black/40 hover:bg-white/[0.08] border border-white/10 hover:border-[#2DD4BF]/40 transition-all group backdrop-blur-xl"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Leaf className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white group-hover:text-[#5EEAD4]">Flora Match</span>
                </div>
                <p className="text-[11px] text-white/60 leading-normal">
                  Climate-adaptive species from Wikimedia REST API.
                </p>
              </Link>

              <Link 
                to="/about" 
                className="p-4 rounded-2xl bg-black/40 hover:bg-white/[0.08] border border-white/10 hover:border-[#2DD4BF]/40 transition-all group backdrop-blur-xl"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Layers className="h-4 w-4 text-teal-300 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white group-hover:text-[#5EEAD4]">Architecture</span>
                </div>
                <p className="text-[11px] text-white/60 leading-normal">
                  Neural vision pipelines & creator agronomy mission.
                </p>
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default React.memo(NotFound);
