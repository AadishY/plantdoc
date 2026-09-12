# Contributing to PlantDoc AI 🌿🤖

Thank you for your interest in contributing to **PlantDoc AI**! PlantDoc AI is an open-source, client-side botanical intelligence platform delivering real-time plant disease diagnosis, multi-scale foliar lesion segmentation, clinical treatment protocols, and climate-matched plant recommendations.

We welcome contributions from agronomists, botanists, software engineers, and AI researchers.

---

## 📑 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Local Development Setup](#local-development-setup)
- [Coding Standards & Conventions](#coding-standards--conventions)
- [Scientific Veracity & Anti-Hallucination Protocol](#scientific-veracity--anti-hallucination-protocol)
- [Submitting Pull Requests](#submitting-pull-requests)
- [Commit Convention](#commit-convention)

---

## Code of Conduct

This project and everyone participating in it is governed by the [PlantDoc AI Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior following the guidelines in the Code of Conduct.

---

## How Can I Contribute?

You can contribute in many ways:
* **Reporting Bugs**: Let us know about UI glitches, rate-limit bottlenecks, or coordinate mapping errors.
* **Pathology & Botanical Corrections**: Help refine botanical diagnoses, scientific binominal nomenclature, retail fungicide prescriptions, or NPK ratios.
* **Feature Requests**: Suggest new botanical models, vision capabilities, or regional climate presets.
* **Code Contributions**: Submit PRs to improve performance, add unit tests, or refine components.
* **Documentation**: Enhance [README.md](README.md), [AGENTS.md](AGENTS.md), or code documentation.

---

## Local Development Setup

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **Package Manager**: `npm` (v9+)
* **Google AI Studio API Key**: Required for Gemini Vision & Gemma models ([Get a key](https://aistudio.google.com/))
* **Groq API Key (Optional)**: For optional fast mode botanical recommendations ([Get a key](https://console.groq.com/))

### Steps

1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/<your-username>/plantdoc.git
   cd plantdoc
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Populate your keys:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_GROQ_API_KEY=your_groq_api_key_here
   VITE_WIKIMEDIA_USER_AGENT=PlantDoc/1.0 (https://plantdoc.app; contact@plantdoc.app)
   ```
   > ⚠️ **CRITICAL SECURITY NOTE**: Never commit `.env` or real API keys to GitHub. `.env` is listed in `.gitignore`.

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Run Typechecks & Production Build**
   ```bash
   # TypeScript Type Check
   npx tsc --noEmit

   # Production Build
   npm run build
   ```

---

## Coding Standards & Conventions

1. **Strict TypeScript Hygiene**:
   * All code must compile with **0 compiler errors** (`npx tsc --noEmit`).
   * Explicitly type all API inputs, outputs, and component props. Avoid `any` where possible.
2. **Component Architecture**:
   * Use functional React 18 components with TypeScript (`.tsx`).
   * Leverage `React.memo`, `useCallback`, and `useMemo` for heavy components to isolate render trees and maintain 120fps performance.
   * Do not use non-standard attributes on standard elements (e.g. use standard React `loading="lazy"` / `decoding="async"`).
3. **Styling & Design System**:
   * Style with Tailwind CSS v3 using the defined botanical HSL tokens (`emerald`, `teal`, `glass-surface`, deep foliar black `#060807`).
   * Ensure mobile responsiveness down to 320px width.
4. **Performance Architecture**:
   * Maintain zero-allocation loops for animation stages (e.g. inside canvas render loops).
   * Lazy load routes and heavy dependencies with `Suspense` and `React.lazy`.

---

## Scientific Veracity & Anti-Hallucination Protocol

PlantDoc AI enforces a strict principle: **"Giving no information is strictly preferred over giving false information."**

* **Zero Ghost Diseases**: If a leaf specimen is healthy, the system must report `is_healthy: true`, `severity: "None"`, and `lesions: []`. Do not invent fake micro-pathologies.
* **Non-Plant Rejection**: Non-botanical images (human faces, pets, objects) must be rejected with confidence `0`.
* **Zero Synthetic Fallback Bounding Boxes**: Never inject artificial mock boxes or hardcoded coordinates when segmentation fails or returns empty.
* **Authentic Media**: Always source authentic photographs and taxonomy via the official Wikimedia Foundation REST API. Never use generic placeholder images.

---

## Submitting Pull Requests

1. **Create a Feature Branch**:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Commit Your Changes**:
   Follow conventional commit messages (see below).

3. **Verify Pre-Flight Checks**:
   Before pushing, ensure:
   * `npx tsc --noEmit` passes with 0 errors.
   * `npm run build` succeeds cleanly.
   * No API keys or secret credentials are staged.

4. **Push and Open a PR**:
   ```bash
   git push origin feat/your-feature-name
   ```
   Open a Pull Request on GitHub against the `main` branch. Complete all sections of the [Pull Request Template](.github/pull_request_template.md).

---

## Commit Convention

We adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification:

* `feat:` A new feature or capability (e.g. `feat: add winter hardiness filter to season engine`)
* `fix:` A bug fix (e.g. `fix: prevent box clipping on panoramic leaf aspect ratios`)
* `docs:` Documentation changes only (e.g. `docs: update AGENTS.md with Gemma 4 cascade`)
* `perf:` A code change that improves performance (e.g. `perf: memoize lesion coordinate stepper`)
* `refactor:` A code change that neither fixes a bug nor adds a feature
* `test:` Adding missing tests or correcting existing tests
* `chore:` Changes to the build process or auxiliary tools

---

Thank you for helping make PlantDoc AI more accurate, performant, and helpful for growers around the world! 🌿🌻
