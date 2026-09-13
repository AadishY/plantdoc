import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Globe, 
  Eye, 
  MessageSquare, 
  Twitter, 
  Linkedin, 
  Facebook,
  Code
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const OpenGraphPreview: React.FC = () => {
  const [activePlatform, setActivePlatform] = useState<'twitter' | 'facebook' | 'whatsapp' | 'raw'>('twitter');
  const [copied, setCopied] = useState(false);

  const ogData = {
    title: "PlantDoc AI — Plant Disease Diagnosis & Care",
    description: "Instant AI plant disease diagnosis, leaf lesion segmentation, and clinical treatment protocols.",
    url: typeof window !== 'undefined' ? window.location.origin : "https://plantdoc.pages.dev",
    image: "/bannerr.jpg",
    siteName: "PlantDoc AI",
    twitterHandle: "@PlantDocAI"
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(ogData.url);
    setCopied(true);
    toast.success("PlantDoc AI share link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyMetaTags = () => {
    const rawTags = `<!-- Open Graph Meta Tags -->
<meta property="og:site_name" content="${ogData.siteName}" />
<meta property="og:title" content="${ogData.title}" />
<meta property="og:description" content="${ogData.description}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${ogData.url}" />
<meta property="og:image" content="${ogData.url}${ogData.image}" />
<meta property="og:image:width" content="1280" />
<meta property="og:image:height" content="640" />

<!-- Twitter Card Meta Tags -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="${ogData.twitterHandle}" />
<meta name="twitter:title" content="${ogData.title}" />
<meta name="twitter:description" content="${ogData.description}" />
<meta name="twitter:image" content="${ogData.url}${ogData.image}" />`;

    navigator.clipboard.writeText(rawTags);
    toast.success("Open Graph HTML meta tags copied to clipboard!");
  };

  return (
    <div className="w-full rounded-3xl bg-black/60 backdrop-blur-3xl border border-white/15 p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#2DD4BF]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF]/40 text-[#5EEAD4] text-xs font-semibold">
            <Eye className="h-3.5 w-3.5" />
            Social Metadata Live Preview
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Open Graph & Social Share Card
          </h3>
          <p className="text-xs sm:text-sm text-foreground/75">
            Real-time preview of how PlantDoc AI renders across social platforms and messaging crawlers.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCopyLink}
            size="sm"
            className="rounded-full bg-gradient-to-r from-[#2DD4BF] to-[#10B981] text-black font-bold text-xs px-4 h-9 shadow-lg hover:scale-105 transition-all"
          >
            {copied ? <Check className="h-3.5 w-3.5 mr-1.5" /> : <Share2 className="h-3.5 w-3.5 mr-1.5" />}
            {copied ? "Copied Link!" : "Copy Share Link"}
          </Button>

          <Button
            onClick={handleCopyMetaTags}
            variant="outline"
            size="sm"
            className="rounded-full bg-white/5 border-white/15 text-white hover:text-[#5EEAD4] hover:bg-white/10 text-xs px-3 h-9"
            title="Copy raw HTML meta tags"
          >
            <Code className="h-3.5 w-3.5 mr-1.5 text-[#2DD4BF]" />
            Tags
          </Button>
        </div>
      </div>

      {/* Platform Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'twitter', label: 'Twitter / X Card', icon: Twitter },
          { id: 'facebook', label: 'LinkedIn / Facebook', icon: Linkedin },
          { id: 'whatsapp', label: 'WhatsApp / Chat', icon: MessageSquare },
          { id: 'raw', label: 'HTML Meta Tags', icon: Code }
        ].map((p) => {
          const Icon = p.icon;
          const isActive = activePlatform === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePlatform(p.id as any)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all select-none whitespace-nowrap cursor-pointer",
                isActive 
                  ? "bg-[#2DD4BF] text-black shadow-[0_0_18px_rgba(45,212,191,0.5)] font-bold" 
                  : "bg-white/5 text-white/75 hover:text-white hover:bg-white/10 border border-white/10"
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", isActive ? "text-black" : "text-[#2DD4BF]")} />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Platform Rendering Containers */}
      <div className="w-full flex items-center justify-center p-2 sm:p-4 bg-black/40 rounded-2xl border border-white/10">
        
        {/* 1. Twitter / X Card Preview */}
        {activePlatform === 'twitter' && (
          <div className="w-full max-w-xl rounded-2xl overflow-hidden border border-white/20 bg-[#000000] shadow-2xl text-left transition-all duration-300">
            <div className="relative aspect-[1280/640] w-full overflow-hidden bg-black/80">
              <img 
                src={ogData.image} 
                alt="PlantDoc Banner" 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono text-white/90">
                plantdoc.pages.dev
              </div>
            </div>
            <div className="p-4 space-y-1 bg-[#121614] border-t border-white/10">
              <div className="text-[11px] text-white/50 font-mono flex items-center gap-1">
                <span>plantdoc.pages.dev</span>
                <span>•</span>
                <span>By Aadish Kumar Yadav</span>
              </div>
              <h4 className="text-base font-bold text-white leading-snug">
                {ogData.title}
              </h4>
              <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                {ogData.description}
              </p>
            </div>
          </div>
        )}

        {/* 2. LinkedIn / Facebook Feed Preview */}
        {activePlatform === 'facebook' && (
          <div className="w-full max-w-xl rounded-xl overflow-hidden border border-white/15 bg-[#1b221e] shadow-2xl text-left">
            <div className="relative aspect-[1280/640] w-full overflow-hidden">
              <img 
                src={ogData.image} 
                alt="PlantDoc Banner" 
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="p-4 space-y-1 bg-[#151c18] border-t border-white/10">
              <span className="text-[10.5px] uppercase tracking-wider text-emerald-400 font-mono font-bold block">
                PLANTDOC.PAGES.DEV
              </span>
              <h4 className="text-base font-bold text-white leading-snug">
                {ogData.title}
              </h4>
              <p className="text-xs text-white/70 line-clamp-2">
                {ogData.description}
              </p>
            </div>
          </div>
        )}

        {/* 3. WhatsApp / Telegram Chat Bubble Preview */}
        {activePlatform === 'whatsapp' && (
          <div className="w-full max-w-md p-3.5 rounded-2xl rounded-tl-none bg-[#1F2C24] border border-[#2DD4BF]/30 shadow-2xl text-left space-y-2.5">
            <div className="rounded-xl overflow-hidden border border-black/20 bg-black/40">
              <div className="aspect-[1280/640] w-full overflow-hidden">
                <img 
                  src={ogData.image} 
                  alt="PlantDoc Banner" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 bg-[#111B15] space-y-1">
                <h4 className="text-sm font-bold text-white">
                  {ogData.title}
                </h4>
                <p className="text-xs text-white/70 line-clamp-2">
                  {ogData.description}
                </p>
                <span className="text-[10px] text-[#2DD4BF] block font-mono">
                  https://plantdoc.pages.dev
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#2DD4BF]/90 font-mono pt-1">
              <span>https://plantdoc.pages.dev</span>
              <span className="text-white/40 text-[10px]">10:42 AM ✓✓</span>
            </div>
          </div>
        )}

        {/* 4. HTML Meta Tags Inspector */}
        {activePlatform === 'raw' && (
          <div className="w-full max-w-2xl rounded-xl bg-black/80 border border-white/10 p-4 font-mono text-[11.5px] text-[#A7F3D0] space-y-2 overflow-x-auto">
            <div className="flex items-center justify-between text-white/60 text-xs pb-2 border-b border-white/10 font-sans">
              <span>Standard OpenGraph & Twitter Meta Elements</span>
              <Button
                onClick={handleCopyMetaTags}
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-[#2DD4BF] hover:text-white hover:bg-white/10"
              >
                <Copy className="h-3 w-3 mr-1" /> Copy All
              </Button>
            </div>
            <pre className="text-left leading-relaxed text-white/80">
{`<meta property="og:site_name" content="PlantDoc AI" />
<meta property="og:title" content="PlantDoc AI — Plant Disease Diagnosis & Care" />
<meta property="og:description" content="Instant AI plant disease diagnosis, leaf lesion segmentation, and clinical treatment protocols." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://plantdoc.pages.dev" />
<meta property="og:image" content="https://plantdoc.pages.dev/bannerr.jpg" />
<meta property="og:image:width" content="1280" />
<meta property="og:image:height" content="640" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@PlantDocAI" />
<meta name="twitter:title" content="PlantDoc AI — Plant Disease Diagnosis & Care" />
<meta name="twitter:description" content="Instant AI plant disease diagnosis, leaf lesion segmentation, and clinical treatment protocols." />
<meta name="twitter:image" content="https://plantdoc.pages.dev/bannerr.jpg" />`}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
};

export default OpenGraphPreview;
