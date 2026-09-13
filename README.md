# PlantDoc AI 🌿

> **Next-Generation Botanical AI Vision, Neural Lesion Mapping & Clinical Plant Health Engine**

[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini_Vision-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)

---

<p align="center">
  <img src="public/bannerr.jpg" alt="PlantDoc AI Showcase Banner" width="100%" style="border-radius: 14px; box-shadow: 0 20px 50px rgba(0,0,0,0.8); border: 1px solid rgba(45, 212, 191, 0.2);" />
</p>

---

## 🌟 Overview

**PlantDoc AI** is a state-of-the-art botanical intelligence platform engineered for home gardeners, commercial nurseries, and agronomists. By coupling **parallel neural vision segmentation** with **real-world commercial treatment protocols** and **live Wikimedia Foundation REST API synchronization**, PlantDoc AI delivers sub-second disease diagnosis, interactive localized foliar coordinates, and verified recovery strategies.

> 📖 **Developer & AI Agent Guide**: For complete system architecture and codebase specifications, see [AGENTS.md](AGENTS.md).

---

## 📸 Platform Showcase

### 🔬 1. Neural Foliar Lesion Localization & Pathology Scanner
Isolates necrotic lesions, chlorotic yellow halos, and active sporulation centers with sub-pixel 2D bounding boxes and interactive pathology coordinate inspection `[ymin, xmin, ymax, xmax]`.

<p align="center">
  <img src="public/demo/diagonosis.webp" alt="AI Lesion Localization Scanner" width="88%" style="border-radius: 12px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.1);" />
</p>

---

### 🏥 2. Clinical Diagnosis & Vital Health Telemetry
Formulates full clinical pathology dossiers including diagnostic match certainty, pathogen classification, foliar vitality scores, recovery prognosis, and sunlight/hydration metrics.

<p align="center">
  <img src="public/demo/diagnosis%20fullscreen.webp" alt="Clinical Diagnosis Fullscreen Overview" width="92%" style="border-radius: 12px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.1);" />
</p>

---

### 🔬 3. Diagnostic Result Case Studies & Lesion Segments
Explore real-world botanical pathology diagnoses, sub-pixel multi-spot lesion bounding boxes, and clinical telemetry dossiers across diverse foliar diseases:

<details>
<summary><b>🔍 Expand to View Real-World Diagnostic Case Studies (Specimens 1–6)</b></summary>
<br/>

#### Specimen Analysis & Clinical Protocol Overview
<p align="center">
  <img src="public/demo/diagonosis%202.webp" alt="Clinical Treatment Protocol & Inspector" width="92%" style="border-radius: 12px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.1);" />
</p>

#### Case Study #1: Early Blight & Foliar Necrosis Localization
<p align="center">
  <img src="public/demo/diagnosis-ex1.webp" alt="Diagnosis Case Study 1 - Early Blight" width="92%" style="border-radius: 12px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.1);" />
</p>

#### Case Study #2: Multi-Spot Septoria & Concentric Ring Lesions
<p align="center">
  <img src="public/demo/diagnosis-ex2.webp" alt="Diagnosis Case Study 2 - Septoria Spot" width="92%" style="border-radius: 12px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.1);" />
</p>

#### Case Study #3: Powdery Mildew & Chlorotic Halo Spread
<p align="center">
  <img src="public/demo/diagnosis-ex3.webp" alt="Diagnosis Case Study 3 - Powdery Mildew" width="92%" style="border-radius: 12px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.1);" />
</p>

#### Case Study #4: Bacterial Leaf Spot & Marginal Burn
<p align="center">
  <img src="public/demo/diagnosis-ex4.webp" alt="Diagnosis Case Study 4 - Bacterial Spot" width="92%" style="border-radius: 12px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.1);" />
</p>

#### Case Study #5: Rust Pustules & Micro-Spot Localization
<p align="center">
  <img src="public/demo/diagnosis-ex5.webp" alt="Diagnosis Case Study 5 - Rust Pustules" width="92%" style="border-radius: 12px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.1);" />
</p>

</details>

---

### 🌾 4. Climate-Adaptive Recommendation Engine
Selects top botanical species matching your regional climate (temperature, rainfall, soil NPK) backed by authentic **Wikimedia REST API** profiles, high-resolution photography, and care guides.

<p align="center">
  <img src="public/demo/recommendations.webp" alt="Climate-Matched Species Recommendations" width="92%" style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);" />
</p>

---

## ✨ Key Platform Features

| Capability | Technical Implementation | Practical Clinical Benefit |
| :--- | :--- | :--- |
| **Scientific Veracity & Anti-Hallucination** | Dual-tier verification & specimen validation | **Zero fabricated diseases**: explicitly rejects non-botanical images or marks ambiguous foliage as inconclusive. |
| **Multi-Scale Spatial Lesion Grounding** | `gemini-robotics-er-2-preview` + NMS IoU filtering | Pinpoints both **macro affected disease zones** (blight scorch, marginal burn) and **micro focal spots** (10 to 45+ detections, `IoU > 0.65`). |
| **Gemma 4 Climate Recommendation Engine** | `gemma-4-26b-a4b-it` (Primary) & `gemma-4-31b-it` (Failover) | High-speed agronomic matching (~4s response) against regional temperature, precipitation, and soil profiles. |
| **Interactive 5-Option Season Engine** | Real-time seasonal planting calendar sync | Curates species by seasonal window (**All Seasons**, **Spring**, **Summer**, **Autumn**, **Winter**) with timeline badges. |
| **Spectral NDVI Chlorophyll Analysis** | Simulated multispectral foliar mapping | Visualizes photosynthetic vigor, chlorophyll breakdown, and sub-clinical symptom margins. |
| **Infection Stage & Severity Horizon** | Dynamic progression timeline with phase details | Interactive 4-phase progression tracker revealing symptoms and intervention windows per stage. |
| **5-Tier Clinical Treatment Matrix** | Validated retail formulations (*Daconil*, *Bonide*, *Monterey*) | Exact commercial chemical, bio-fungicidal, and organic mixing ratios and application cycles. |
| **Client-Side WebP Downsampling** | Offscreen HTML5 Canvas downsampler | **99% network payload reduction** (~80KB transfers, 5x–10x API latency speedup). |
| **Interactive Dual-Mask Hero Stage** | Synchronized `topLayerRef` + `baseLayerRef` masks | Necrotic holes reveal background; zero dark shapes rendered over typography in empty air. |
| **Verified Botanical Taxonomy** | Live Wikimedia Foundation REST APIs | **Zero synthetic mock images**; authentic high-res botanical taxonomy and care guides. |
| **120Hz Kinetic Inertia Scroll** | Lenis smooth scroll + GSAP RAF ticker sync | Buttery-smooth, jitter-free kinetic scroll pacing across desktop and mobile. |
| **Zero-Allocation Animation Loops** | In-place reverse mutation & `Float32Array` buffers | **0 bytes per frame allocations**; completely eliminates garbage-collection frame drops. |

---

## 🔬 Diagnostics & Anti-Hallucination Pipeline

PlantDoc AI operates on a rigorous, two-stage clinical verification pipeline designed so that **no information is strictly preferred over false information**:

```
[ User Foliage Upload ]
         │
         ▼
[ Offscreen Canvas Compression (WebP @ 0.85, 1280px max) ]
         │
         ├─────────────────────────────────────────┐
         ▼                                         ▼
[ Clinical Pathology Engine ]             [ Spatial Lesion Grounding ]
Primary: gemini-3.8-flash                 Model: gemini-robotics-er-2-preview
Failovers: 3.7-flash -> 3.6-flash          - Macro disease zones + micro spot grounding
- Botanical validity check                - Sub-pixel bounding boxes [ymin, xmin, ymax, xmax]
- Species identification (>80% cert)      - Coordinate normalization (0-1000 -> CSS %)
- Health verification (no ghost disease)  - IoU Calculation & Non-Maximum Suppression (IoU > 0.65)
- Commercial prescription dossier         - Broad aspect ratio tolerance (up to 9.0:1)
         │                                         │
         └────────────────────┬────────────────────┘
                              ▼
           [ Unified Clinical Dossier & Telemetry ]
           - Interactive Foliar Lesion Inspector (10-45+ detections)
           - Spectral NDVI Chlorophyll Mode
           - 5-Tier Remediation Matrix & Retail Brand Prescriptions
```

---

## 🌾 Botanical Recommendation & Seasonal Intelligence Engine

```
[ Regional Climate Parameters (Temp, Rain, Soil, pH) + Planting Season ]
                                │
                                ▼
              [ Gemma 4 Open Model Family Pipeline ]
          (Fast Mode Optional: OpenRouter Free Models Cascade)
                                │
                                ▼
                [ Wikimedia REST API Engine ]
      Parallel Latin Binomial Resolution (Thumbnails + Care Guides)
                                │
                                ▼
           [ Climate-Matched Botanical Recommendations ]
           - Seasonal suitability tags (Spring, Summer, Autumn, Winter)
           - NPK demands, sunlight hours, water frequency & companion plants
           - One-click JSON Dossier Export & Fullscreen Botanical Dossier
```

---

## ⚡ Performance Benchmarks

- **Display Refresh Rate**: Locked **120fps / 60fps** with zero garbage-collection stutter.
- **Client-Side Image Pre-Processing**: `<50ms` progressive WebP encoding on offscreen Canvas.
- **Payload Compression**: 10MB+ raw DSLR files compressed to **~80KB–150KB** prior to cloud transit.
- **Production Bundle Size**: Optimized Rollup manual chunks (`vendor-react`, `vendor-animation`, `vendor-radix`, `vendor-charts`, `vendor-icons`).
- **Gemma Recommendation Latency**: Fast ~3s–5s response via `gemma-4-26b-a4b-it`.
- **CSS Paint Optimization**: `content-visibility: auto` skips offscreen paint passes.
- **Idle Power Draw**: **0% CPU/GPU overhead** when canvas stages scroll out of viewport.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AadishY/plantdoc.git
   cd plantdoc
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (see `.env.example`):
   ```env
   # Required: Google Gemini API Key (Gemini Vision & Gemma models)
   VITE_GEMINI_API_KEY=your_gemini_api_key_here

   # Optional: Groq API Key (for Fast Mode vision pathology diagnosis)
   VITE_GROQ_API_KEY=your_groq_api_key_here

   # Optional: OpenRouter API Key (for Fast Mode botanical recommendations)
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here

   # Recommended: Custom Wikimedia User-Agent for REST API compliance
   VITE_WIKIMEDIA_USER_AGENT=PlantDoc/1.0 (https://plantdoc.app; contact@plantdoc.app)
   ```

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🏗️ Project Directory Architecture

```
plantdoc/
├── public/
│   ├── demo/                               # Platform screenshot showcases
│   ├── bannerr.jpg                         # 1280x640 Social media & OpenGraph banner
│   ├── main.webp                           # Hero stage healthy foliage
│   ├── main_disease.webp                   # Hero stage pathology reveal layer
│   └── _redirects                          # Cloudflare Pages SPA rewrite rule
├── src/
│   ├── components/
│   │   ├── ClinicalTreatmentProtocol.tsx   # 5-tier treatment matrix & checklist
│   │   ├── DiagnosisVisualizations.tsx     # Vital health metrics & fertilizer cards
│   │   ├── DynamicBackground.tsx           # Adaptive bioluminescent spore canvas
│   │   ├── FixedMobileNav.tsx              # Mobile dock navigation
│   │   ├── Header.tsx                      # Glassmorphic top navigation
│   │   ├── PlantDocHeroStage.tsx           # Interactive 100dvh cursor-masked hero stage
│   │   ├── PlantSegmentationViewer.tsx     # Foliar lesion localization viewer
│   │   ├── ResultComponent.tsx             # Complete diagnostic dashboard
│   │   ├── SmoothScroll.tsx                # Lenis & GSAP ticker integration
│   │   └── SpotlightCard.tsx               # GPU-accelerated cursor spotlight tracking
│   ├── config/
│   │   └── api.config.ts                   # Model endpoints & API configuration
│   ├── pages/
│   │   ├── AboutPage.tsx                   # Creator bio & tech architecture
│   │   ├── DiagnosePage.tsx                # Disease diagnosis engine
│   │   ├── Index.tsx                       # Landing page & feature showcase
│   │   └── RecommendPage.tsx               # Botanical matching & Wikimedia
│   ├── services/
│   │   ├── api.ts                          # Vision diagnosis & WebP compression
│   │   └── wikimedia.ts                    # Live Wikimedia image/article fetcher
│   ├── types/
│   │   ├── diagnosis.ts                    # Pathology & lesion coordinate types
│   │   └── recommendation.ts               # Botanical recommendation schema
│   ├── App.tsx                             # Application root with SmoothScroll & Router
│   ├── index.css                           # Tailwind utilities & performance styles
│   └── main.tsx                            # React entrypoint
├── AGENTS.md                               # Canonical architecture & AI agent guide
├── tailwind.config.ts                      # Design tokens, fonts, and animations
└── vite.config.ts                          # Rollup manualChunks code splitting
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
