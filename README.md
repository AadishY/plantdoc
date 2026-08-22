# PlantDoc AI 🌿

> **Next-Generation Botanical AI Vision, Neural Lesion Mapping & Clinical Plant Health Engine**

[![Live Demo](https://img.shields.io/badge/Live-Demo-4CAF50?style=for-the-badge&logo=vercel&logoColor=white)](https://plantdoc.lovable.app/)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 🌟 Overview

**PlantDoc AI** is an advanced botanical diagnostics and regional recommendation platform engineered to empower gardeners, agricultural practitioners, and nurseries. By combining neural vision processing with **precise foliar lesion localization** and **live Wikimedia REST API synchronization**, PlantDoc AI delivers sub-second disease localization and actionable clinical recovery plans.

---

## ✨ Key Features

### 🔬 1. Neural Foliar Lesion Localization
- **Pixel-Accurate Bounding Boxes**: Automatically isolates localized disease symptoms including necrotic lesions, chlorotic yellow halos, and active sporulation centers.
- **Interactive Annotation Viewer**: Direct inspection of individual lesion coordinates, severity tags, and confidence percentages over the uploaded plant photo.
- **Micro-Animations**: Laser radar scanning preview and real-time canvas overlays.

### 🛡️ 2. Clinical Remediation & Treatment Matrix
- **Interactive Emergency Checklist**: Check off emergency triage steps (shears sterilization, plant isolation, canopy pruning).
- **Biological & Organic Arsenal**: Pure cold-pressed neem formulations, *Bacillus subtilis*, *Trichoderma harzianum*, and potassium bicarbonate washes.
- **Targeted Chemical Prescriptions**: Active ingredient recommendations (Copper Hydroxide, Chlorothalonil, Azoxystrobin) with application intervals and dilution rates.
- **30-Day Recovery Timeline**: Structured milestone tracking from day-1 triage to foliar regeneration.

### 🌾 3. Climate-Adaptive Recommendation Engine
- **Plant Category Filtering**: Discover species tailored for **Mix (Default)**, **Crops & Veggies**, **Fruit Trees & Berries**, **Flowers & Ornamentals**, or **Herbs**.
- **Auto-Detect Regional Climate**: Automatically models regional temperature, annual rainfall, humidity, and soil pH based on Country and State/Province.
- **100% Real Wikimedia Images**: Connects directly to the **Wikimedia REST API** to retrieve verified botanical photography, Wikipedia care guides, and seed purchase references with zero synthetic placeholders.

### ⚡ 4. High-Performance Mobile & Glassmorphic Architecture
- **Lenis Smooth Inertia Scroll**: 60/120fps inertia scrolling synchronized with GSAP tickers.
- **Moving Ambient Lighting Orbs**: Pure CSS GPU-accelerated floating lighting orbs with zero CPU overhead.
- **Mobile Touch Optimized**: Responsive bottom navigation with native touch fluidity and safe-area support.

### 📄 5. Clinical PDF Report & Cropped Lesion Scans
- **Pixel-Perfect Cropped Lesion Thumbnails**: High-resolution cropped scans of individual necrotic lesion zones with localized coordinates `[ymin, xmin, ymax, xmax]`.
- **Sleek Dark Mode & Eco Light Mode Print Themes**: Switch between high-tech clinical dark theme and ink-saving white light mode for PDF export and printing.
- **Complete Clinical Summary**: Formulates comprehensive PDF diagnostic reports with health vitality scores, pathogen profiles, fertilizer prescriptions, and 30-day recovery timelines.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AadishY/PlantDoc.git
   cd PlantDoc
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:8080](http://localhost:8080) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🏗️ Project Structure

```
plantdoc/
├── src/
│   ├── components/
│   │   ├── ClinicalTreatmentProtocol.tsx   # 5-tier treatment matrix
│   │   ├── DiagnosisVisualizations.tsx     # Animated Sun/Water/Airflow widgets
│   │   ├── DynamicBackground.tsx           # Floating ambient lighting orbs
│   │   ├── FixedMobileNav.tsx              # Modern mobile dock navigation
│   │   ├── Header.tsx                      # Glassmorphic top navigation
│   │   ├── PlantSegmentationViewer.tsx     # Foliar lesion localization viewer
│   │   ├── ResultComponent.tsx             # Complete diagnostic dashboard
│   │   ├── ScrollProgressBar.tsx           # Viewport progress indicator
│   │   ├── SiteLoader.tsx                  # Initial splash screen
│   │   ├── SmoothScroll.tsx                # Lenis & GSAP ticker integration
│   │   └── UploadComponent.tsx             # Plant upload & laser animation
│   ├── config/
│   │   └── api.config.ts                   # Model endpoints & environment getter
│   ├── pages/
│   │   ├── AboutPage.tsx                   # Creator bio & tech architecture
│   │   ├── DiagnosePage.tsx                # Disease diagnosis engine
│   │   ├── Index.tsx                       # Landing page & parallax showcase
│   │   └── RecommendPage.tsx               # Botanical matching & Wikimedia
│   ├── services/
│   │   ├── api.ts                          # Resilient vision & recommendation API
│   │   └── wikimedia.ts                    # Live Wikimedia image/article fetcher
│   ├── types/
│   │   ├── diagnosis.ts                    # Pathology & lesion coordinate types
│   │   └── recommendation.ts               # Botanical recommendation schema
│   ├── App.tsx                             # Application root with SmoothScroll
│   ├── index.css                           # Tailwind utilities & keyframes
│   └── main.tsx                            # React entrypoint
├── tailwind.config.ts                      # Theme tokens & animations
└── vite.config.ts                          # ManualChunks rollup code splitting
```

---

## 👨‍💻 Creator & Author

- **Author**: Aadish Kumar Yadav (Student Developer)
- **Institution**: Red Rose Public School, Lucknow, India
- **GitHub**: [@AadishY](https://github.com/AadishY/PlantDoc)
- **Instagram**: [@yo.akatsuki](https://instagram.com/yo.akatsuki)
- **Email**: [aadish14146yadav@gmail.com](mailto:aadish14146yadav@gmail.com)

---

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for details.
