# KISEM Annual Report FY 2025-26
**Kotak–IIT Madras Save Energy Mission | Executed by IIT Gandhinagar**

A world-class interactive data storytelling website for the KISEM annual report — built with React, TypeScript, Vite, TailwindCSS, GSAP, Framer Motion, Mapbox GL, and Apache ECharts.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Parse Excel data (regenerate JSON)
npm run parse-data

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📊 Data Pipeline

The website dynamically reads from the Excel workbook:

```
IIT Gandhinagar KISEM - Audit Master Data Sheet Latest 2025-26.xlsx
```

To regenerate the JSON data after Excel updates:
```bash
npm run parse-data
```

This reads all sheets and outputs: `src/data/kisem-data.json`

---

## 🗺️ Mapbox Setup

Get a free Mapbox access token at https://account.mapbox.com/

Create `.env` file:
```
VITE_MAPBOX_TOKEN=pk.your_mapbox_token_here
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.tsx          # Liquid glass navbar
│   ├── Hero.tsx            # Fullscreen video hero
│   ├── YearInNumbers.tsx   # Animated KPI cards
│   ├── AuditMap.tsx        # Interactive Mapbox map
│   ├── FourYearJourney.tsx # Year-over-year timeline
│   ├── EnergySavings.tsx   # Energy analysis charts
│   ├── IndustryVerticals.tsx # Sector breakdown
│   ├── AssessmentFunnel.tsx  # Cluster → Audit funnel
│   ├── ScopeOfAssessment.tsx # 17 assessment areas
│   ├── RoiScatter.tsx      # Investment vs savings scatter
│   ├── TopProjects.tsx     # Sortable project leaderboard
│   ├── BaselineEnergy.tsx  # Energy baseline cards
│   ├── PaidAudits.tsx      # WRI paid audits section
│   ├── Instruments.tsx     # Equipment gallery
│   ├── Partnerships.tsx    # Partner showcase
│   ├── Contact.tsx         # CTA and contact form
│   └── Footer.tsx          # Footer
├── data/
│   ├── index.ts            # Data utilities & constants
│   └── kisem-data.json     # Generated from Excel
├── types/
│   └── index.ts            # TypeScript types
├── App.tsx                 # Main app with Lenis scroll
├── main.tsx                # React entry point
└── index.css               # Design system CSS
scripts/
└── parse-excel.cjs         # Excel → JSON parser
```

---

## 🎨 Design System

- **Dark theme** with deep navy (`#020818`) background
- **Accent colors**: Emerald green (`#00e5a0`), Royal blue (`#0066ff`)
- **Glassmorphism** cards with backdrop blur
- **GSAP** for hero character-by-character animation
- **Framer Motion** for scroll-triggered animations
- **Lenis** for buttery smooth scrolling
- **Inter** font family throughout

---

## 📈 Sections

1. **Hero** — Fullscreen video, headline animation, floating stats card
2. **Year in Numbers** — 12 animated KPI counters from Excel data
3. **Audit Map** — Interactive Mapbox with 60 markers, sector/FY filters, project drawer
4. **Four Year Journey** — Year cards + multi-tab ECharts (audits, savings, CO₂, ECMs)
5. **Energy Savings** — Trend lines, electrical vs thermal analysis
6. **Industry Verticals** — Sector cards + pie chart + bar chart with drill-down
7. **Assessment Funnel** — Clusters → Walkthrough → Detailed → Paid audit flow
8. **Scope of Assessment** — 17 hover-reveal assessment categories
9. **ROI Analysis** — Investment vs savings scatter plot, bubble size = ROI quality
10. **Top Projects** — Sortable leaderboard (savings, CO₂, ROI, implementation)
11. **Baseline Energy** — Plant-level energy footprint cards
12. **Paid Audits** — WRI Surat textile benchmarking programme
13. **Instruments** — Professional equipment gallery
14. **Partnerships** — Institution showcase with logos
15. **Contact & CTA** — Request audit form, partner cards, contact details
16. **Footer** — Navigation, logos, legal

---

## 🌐 Deployment (Vercel)

1. Push to GitHub
2. Import to Vercel
3. Add environment variable: `VITE_MAPBOX_TOKEN`
4. Deploy

Build command: `npm run build`
Output directory: `dist`
