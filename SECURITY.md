# Security Policy 🛡️

At **PlantDoc AI**, we take security, privacy, and data protection seriously. Because PlantDoc AI is a client-side botanical intelligence application processing image uploads and interacting with cloud AI endpoints, maintaining a secure computing posture is critical.

---

## Supported Versions

We provide security updates and patches for the following versions:

| Version | Supported | Notes |
| :--- | :--- | :--- |
| `1.x.x` (current `main`) | ✅ Supported | Actively maintained |
| `< 1.0.0` | ❌ End of Life | Please upgrade to `main` |

---

## Reporting a Vulnerability

If you believe you have found a security vulnerability or sensitive information exposure in PlantDoc AI, **please do not open a public GitHub issue**. Instead, report it privately through one of the following channels:

1. **GitHub Private Vulnerability Reporting**:
   - Navigate to the **Security** tab of this repository.
   - Click **Report a vulnerability** to submit an advisory draft directly to maintainers.

2. **Direct Security Contact**:
   - Send an email to the repository owner at: **aadish14146yadav@gmail.com**
   - Please include:
     - A description of the vulnerability and its potential impact.
     - Step-by-step instructions or proof-of-concept (PoC) to reproduce the issue.
     - Any proposed remediations or mitigation suggestions.

### Our Commitment
* **Initial Acknowledgment**: We will acknowledge receipt of your report within **48 hours**.
* **Assessment & Fix**: We will work to investigate, validate, and develop a patch promptly.
* **Coordinated Disclosure**: We request reasonable time to patch the issue before any public disclosure. We are happy to credit security researchers in release notes if desired.

---

## Client-Side Security & Architectural Posture

### 1. API Key Handling
* **Zero Hardcoded Secrets**: All API tokens (`GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY`) must be configured as **server-side** environment variables and are never checked into Git.
* **Server-Side AI Gateway**: The browser never holds a provider key. All model traffic is proxied through the same-origin `/api/ai/*` gateway (`functions/api/ai/[[path]].ts` on Cloudflare Pages, `server/viteAiProxyPlugin.ts` in development), which attaches credentials upstream and allowlists the permitted model routes. No `?key=` URL ever appears in the network tab.
* **Client-Side Environment**: In a Vite Single Page Application (SPA), variables prefixed with `VITE_` are embedded into the client bundle. For public production deployments, maintainers should enforce API key restrictions (e.g., HTTP Referrer restrictions in Google Cloud Console / AI Studio) to restrict calls exclusively to authorized domain origins.

### 2. Client-Side Image Privacy
* **Ephemeral In-Memory Processing**: Uploaded foliage photographs are processed client-side via HTML5 Canvas compression (`prepareImageForAPI`) and transmitted via TLS/HTTPS directly to Google AI Studio endpoints.
* **Zero Persistent User Image Storage**: PlantDoc AI does not retain, database, or monetize user photographic data on external proprietary servers.

### 3. Service Availability & Abuse Protection
* PlantDoc AI intentionally does **not** enforce a client-side request rate limiter. A browser-only counter is not a reliable security boundary and can be bypassed by clients.
* The app detects offline state, uses finite request deadlines, and relies on model-provider failover for a responsive user experience.
* For production billing or abuse controls, deploy AI calls behind a server-side or edge proxy and enforce authentication, provider-key restrictions, and rate limits there. Provider quotas and policies may still apply independently of the app.

---

Thank you for helping keep PlantDoc AI and our community safe! 🌿
