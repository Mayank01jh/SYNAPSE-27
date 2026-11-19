# SYNAPSE '27 — Tech Fest 2027

Official website UI prototypes and design assets for **SYNAPSE '27 / Tech Fest 2027** at **IILM University, Gurugram**.

---

## 🚀 Overview

SYNAPSE '27 is the flagship annual technology festival of IILM University, bringing together students, developers, tech enthusiasts, and creators for a 48-hour convergence summit featuring hackathons, robotics competitions, tech-talks, startup showcases, and cultural celebrations.

---

## 📁 Repository Structure

```
├── stitch_tech_fest_2027_website_ui/
│   ├── about_tech_fest_2027_iilm_university/         # About Section & Mission
│   ├── animated_svg/                                 # Interactive & animated SVGs
│   ├── clubs_partners_tech_fest_2027_iilm_university/# Student clubs & brand partners
│   ├── contact_faqs_tech_fest_2027_iilm_university/  # FAQ and contact directory
│   ├── dynamic_high_tech_robotics_competition_arena/ # Robotics battle arena assets
│   ├── electrifying_college_tech_bollywood_night/    # Cultural & Bollywood night
│   ├── events_directory_tech_fest_2027/              # Complete events listing
│   ├── event_details_software_hackathon/             # 24-hr Hackathon details
│   ├── festival_schedule_tech_fest_2027/             # Full itinerary & timeline
│   ├── gallery_photo_archive_tech_fest_2027/         # Past edition photo highlights
│   ├── home_mobile_tech_fest_2027/                   # Mobile-responsive landing UI
│   ├── home_tech_fest_2027_iilm_university_1-6/      # Desktop landing page variations
│   ├── kinetic_editorial_festival/                   # Editorial & typography layouts
│   ├── registration_tech_fest_2027/                  # Registration portal & passes
│   ├── registration_pass_print_tech_fest_2027/       # Printable entry passes & badges
│   ├── robotechthon_arena_tech_fest_2027/            # Robo-wars & robotics challenges
│   ├── tech_bollywood_night_tech_fest_2027/          # Star performer & concert section
│   ├── tech_tank_startup_showcase_tech_fest_2027/    # Pitch competition & VC showcase
│   ├── three.js/                                     # 3D interactive graphics & canvas
│   └── tracks_tech_fest_2027_iilm_university/        # Competition tracks (AI, Web3, IoT)
├── .gitignore
└── README.md
```

---

## 🎨 Tech Stack & Highlights

- **Tailwind CSS** with custom neo-brutalist / cyber-editorial design system
- **Space Grotesk, Anton & JetBrains Mono** typography
- **Google Material Symbols** icons
- **Three.js** dynamic 3D elements
- **Responsive design** optimized for mobile, tablet, and desktop

---

## 💻 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Full-Stack Application
```bash
npm start
```

The application will start on **`http://localhost:3000`**:
- **Main Festival Portal**: `http://localhost:3000/`
- **Gate QR Scanner & Verifier**: `http://localhost:3000/verify.html`
- **Organizer Admin Console**: `http://localhost:3000/admin.html`
- **API Health Telemetry**: `http://localhost:3000/api/health`

---

## ⚡ Backend, Database & Email Dispatch

- **Native SQLite Database (`synapse.db`)**: Tracks student registrations, payment confirmations (`CAPTURED`/`PENDING`), and gate admissions.
- **Automated Ticket Emailing**: Uses Nodemailer to send official entry passes with high-resolution QR codes, security instructions, and print previews (falls back to Ethereal test inbox in development).
- **Gate Security Scanner (`/verify.html`)**: Mobile camera QR scanner for VERVE coordinators at the gate to prevent pass duplicates.
- **Organizer Console (`/admin.html`)**: Real-time registration and revenue analytics with one-click CSV roster export.

---

## 🏛️ Credits & Attribution

- **Initiator & Organizer**: **VERVE Club**, IILM University, Gurugram
- **Architecture & Development**: **Site by Mayank**

