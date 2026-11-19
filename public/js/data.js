// SYNAPSE 2027 Master Data
// Initiated by VERVE Club, IILM University Gurugram | Site by Mayank

const SYNAPSE_DATA = {
  meta: {
    name: "SYNAPSE 2027",
    tagline: "48-HOUR CONVERGENCE SUMMIT",
    university: "IILM University, Gurugram",
    club: "VERVE Club (Technical & Innovation Body)",
    author: "Site by Mayank",
    coordinates: "28.4595° N, 77.0266° E",
    location: "Sector 53, Golf Course Road, Gurugram, Haryana",
    timeline: "January 2027 • 48 Hours Continuous",
    prizePoolTotal: "₹5,00,000+",
    attendeesExpected: "5,000+",
    institutionsRepresented: "30+"
  },

  tracks: [
    {
      id: "software",
      code: "TRACK 01",
      name: "Software & AI Engineering",
      color: "#C90016",
      desc: "Full-stack code sprints, GenAI agent architectures, distributed systems, and decentralized protocols."
    },
    {
      id: "robotics",
      code: "TRACK 02",
      name: "Robotechthon Combat Arena",
      color: "#111111",
      desc: "30kg combat robotics cage matches, autonomous rovers, line-followers, and high-speed obstacle courses."
    },
    {
      id: "startup",
      code: "TRACK 03",
      name: "Tech Tank Venture Showcase",
      color: "#9C0019",
      desc: "Collegiate startup pitches, angel investor panel, product-market fit evaluation, and instant term sheets."
    },
    {
      id: "cultural",
      code: "TRACK 04",
      name: "Bollywood & EDM Cultural Night",
      color: "#FF1A35",
      desc: "High-voltage star musical performance, amphitheater laser show, celebrity DJ set, and food carnival."
    },
    {
      id: "gaming",
      code: "TRACK 05",
      name: "eSports & Creative Media",
      color: "#5F5E5E",
      desc: "LAN tournaments (Valorant, BGMI, FIFA), speed UI/UX design duels, and generative creative arts."
    }
  ],

  events: [
    {
      id: "hackathon-24h",
      title: "SOFTWARE HACKATHON // 24-HOUR SPRINT",
      track: "software",
      trackName: "Software & AI",
      tagline: "Flagship 24-Hour Non-stop Software Product Building Battle",
      format: "Squad (2-4 Devs)",
      slots: "60 Squads Cap",
      fee: 499,
      prizePool: "₹1,50,000",
      venue: "Central Computing Lab (Block A)",
      timeline: "Day 01, 10:00 AM – Day 02, 10:00 AM",
      desc: "Assemble your squad to architect, code, and deploy disruptive solutions in Generative AI, Decentralized Infrastructure, Autonomous Agents, and FinTech. 24 hours of non-stop caffeinated development backed by industry mentors.",
      rules: [
        "Squad size strictly 2 to 4 members. Cross-college teams permitted.",
        "All code must be authored during the 24-hour window. Pre-built templates disqualified.",
        "GitHub repository commits will be audited with automated telemetry.",
        "Round 1 checkpoint at Hour 12; Final pitch and demo before VC jury at Hour 24."
      ],
      coordinators: [
        { name: "Aarav Sharma (VERVE Tech)", contact: "+91 98112 00011" },
        { name: "Priya Nair (VERVE Lead)", contact: "+91 98112 00012" }
      ]
    },
    {
      id: "robotechthon",
      title: "ROBOTECHTHON // 30KG COMBAT ARENA",
      track: "robotics",
      trackName: "Robotics",
      tagline: "Armored Kinetic Combat Inside High-Tensile Polycarbonate Cage",
      format: "Bot Squad (Up to 5 Builders)",
      slots: "32 Bots Cap",
      fee: 799,
      prizePool: "₹1,25,000",
      venue: "Main Amphitheater Arena",
      timeline: "Day 01, 01:00 PM – Day 02, 04:00 PM",
      desc: "Custom-built mechanical gladiators battle in an enclosed steel and polycarbonate octagon. Spinners, flippers, wedges, and crushing weapons clash for supremacy with automated pit hazards and telemetry tracking.",
      rules: [
        "Bot weight category strictly capped at 30kg (10% safety margin for untethered weapons).",
        "Dual failsafe kill switch mandatory. Voltage limit: 48V DC.",
        "Flame weapons, chemical projectiles, and radio jamming strictly prohibited.",
        "3-minute match duration; scoring based on aggression, damage, and arena control."
      ],
      coordinators: [
        { name: "Rohan Verma (VERVE Robo)", contact: "+91 98112 00013" }
      ]
    },
    {
      id: "tech-tank",
      title: "TECH TANK // VENTURE SHOWCASE",
      track: "startup",
      trackName: "Startup",
      tagline: "Live Pitching Before Top Tier Seed Angels & Venture Funds",
      format: "Founder Duo / Solo",
      slots: "20 Startups Cap",
      fee: 299,
      prizePool: "₹1,00,000 + ₹25L Grant Pipeline",
      venue: "Executive Auditorium (Block B)",
      timeline: "Day 02, 11:00 AM – 03:00 PM",
      desc: "Got a working prototype or validated MVP? Step inside the Tech Tank to pitch live before active angels and startup incubators. Instant mentorship, on-the-spot grants, and incubator incubation access.",
      rules: [
        "10-minute slot: 5-minute pitch deck + 5-minute rigorous investor Q&A.",
        "Working demo or clickable prototype required.",
        "Evaluation criteria: Problem severity, market size, defensibility, and team traction."
      ],
      coordinators: [
        { name: "Ananya Goel (IILM E-Cell)", contact: "+91 98112 00014" }
      ]
    },
    {
      id: "bollywood-night",
      title: "BOLLYWOOD CONCERT // STAR PERFORMER NIGHT",
      track: "cultural",
      trackName: "Cultural",
      tagline: "Celebrity Musical Night & High-Voltage DJ Set",
      format: "All-Access Pass Holder",
      slots: "Open Campus",
      fee: 399,
      prizePool: "Star Night Experience",
      venue: "IILM Football Grounds",
      timeline: "Day 02, 07:00 PM – 11:00 PM",
      desc: "Unwind after 48 hours of intense competition. The grand festival finale features a headline Bollywood playback sensation, laser pyrotechnics, campus food festival, and DJ closing set.",
      rules: [
        "Entry strictly restricted to verified SYNAPSE digital pass holders with valid college ID.",
        "Wristbands issued at gate must be worn throughout the concert.",
        "Zero-tolerance security policy for prohibited substances."
      ],
      coordinators: [
        { name: "VERVE Cultural Committee", contact: "verve@iilm.edu" }
      ]
    },
    {
      id: "prompt-agents",
      title: "PROMPTHON // AGENTIC WORKFLOWS",
      track: "software",
      trackName: "Software & AI",
      tagline: "Architect Autonomous Multi-Agent AI Systems in 4 Hours",
      format: "Solo / Duo",
      slots: "40 Slots",
      fee: 199,
      prizePool: "₹30,000",
      venue: "AI Research Lab 03",
      timeline: "Day 01, 02:00 PM – 06:00 PM",
      desc: "Prompt engineering has evolved into agentic choreography. Compete to build autonomous agents that resolve complex multi-step real-world problems under timed benchmark tests.",
      rules: ["Evaluation based on task accuracy, tool call efficiency, and token economics."],
      coordinators: [{ name: "VERVE AI Lead", contact: "ai@iilm.edu" }]
    },
    {
      id: "ctf-cyber",
      title: "CAPTURE THE FLAG // JEOPARDY CTF",
      track: "software",
      trackName: "Software & AI",
      tagline: "Offensive Security, Reverse Engineering & Cryptography Challenge",
      format: "Duo Squad",
      slots: "30 Squads",
      fee: 249,
      prizePool: "₹35,000",
      venue: "Cyber Defense Hub",
      timeline: "Day 01, 08:00 PM – 02:00 AM",
      desc: "Overnight cybersecurity clash testing Binary Exploitation, Web vulnerabilities, Forensics, and Hardware hacking on an isolated local target network.",
      rules: ["Attacking CTF infrastructure or opponent machines results in instant disqualification."],
      coordinators: [{ name: "CyberSec Cell", contact: "ctf@iilm.edu" }]
    },
    {
      id: "line-follower",
      title: "ROBO-RACE // AUTONOMOUS ROVER SPRINT",
      track: "robotics",
      trackName: "Robotics",
      tagline: "PID-Tuned High Speed Autonomous Line Tracking",
      format: "Team (2-3 Members)",
      slots: "35 Teams",
      fee: 299,
      prizePool: "₹30,000",
      venue: "Robotics Arena Annex",
      timeline: "Day 01, 11:30 AM – 03:30 PM",
      desc: "Autonomous rovers navigate a dynamic high-friction track filled with acute hairpins, bridge climbs, inverted loops, and light-varying checkpoints.",
      rules: ["Time-trial format. Smallest elapsed run time with minimum manual touches wins."],
      coordinators: [{ name: "VERVE Hardware", contact: "hardware@iilm.edu" }]
    },
    {
      id: "drone-racing",
      title: "DRONE GRAND PRIX // INDOOR FPV",
      track: "robotics",
      trackName: "Robotics",
      tagline: "High-Speed First-Person View Micro-Drone Obstacle Sprint",
      format: "Solo Pilot",
      slots: "20 Pilots",
      fee: 399,
      prizePool: "₹40,000",
      venue: "Indoor Sports Complex",
      timeline: "Day 02, 10:00 AM – 02:00 PM",
      desc: "Pilots strap on FPV goggles and navigate micro whoops through glowing neon gates, corkscrews, and air-drop zones inside a safety netted stadium.",
      rules: ["3S max battery; prop guards mandatory."],
      coordinators: [{ name: "Aero Club", contact: "aero@iilm.edu" }]
    },
    {
      id: "esports-valorant",
      title: "ESPORTS SHOWDOWN // VALORANT & BGMI",
      track: "gaming",
      trackName: "Gaming & Media",
      tagline: "Collegiate 5v5 Tactical Shooter LAN Tournament",
      format: "5-Player Squad",
      slots: "16 Squads",
      fee: 499,
      prizePool: "₹45,000",
      venue: "E-Gaming Arena (Room 402)",
      timeline: "Day 01, 04:00 PM – Day 02, 02:00 AM",
      desc: "Single-elimination LAN tournament broadcast live with high-refresh monitors and caster telemetry.",
      rules: ["Standard competitive ruleset. Bring your own peripherals."],
      coordinators: [{ name: "eSports Society", contact: "gaming@iilm.edu" }]
    },
    {
      id: "uiux-sprint",
      title: "DESIGN-A-THON // 6-HOUR UI/UX CRUCIBLE",
      track: "gaming",
      trackName: "Gaming & Media",
      tagline: "Rapid Design of High-Fidelity Design Systems",
      format: "Solo / Duo",
      slots: "30 Participants",
      fee: 199,
      prizePool: "₹25,000",
      venue: "Design Studio (Block C)",
      timeline: "Day 01, 01:00 PM – 07:00 PM",
      desc: "Transform a complex legacy user workflow into a stunning, accessible, neo-brutalist interaction system.",
      rules: ["Submissions evaluated on accessibility, design token clarity, and prototype delight."],
      coordinators: [{ name: "Design Guild", contact: "design@iilm.edu" }]
    },
    {
      id: "general-fest-pass",
      title: "GENERAL FEST PASS // ALL-ACCESS ATTENDEE",
      track: "general",
      trackName: "General Fest",
      tagline: "Full Campus Access, Keynotes, Project Expo & Tech Stalls",
      format: "Individual Student",
      slots: "Unlimited (Pre-Reg)",
      fee: 0,
      prizePool: "Keynotes & Certifications",
      venue: "Entire IILM Campus",
      timeline: "Both Days (Full 48 Hours)",
      desc: "Official attendee pass providing admission to all tech keynote sessions, startup showcase expo, robotics gallery, networking lounges, and digital participation badge.",
      rules: ["Free registration. Valid college ID card required at entry."],
      coordinators: [{ name: "VERVE Helpdesk", contact: "help@iilm.edu" }]
    }
  ],

  schedule: {
    day1: [
      { time: "09:00 AM", title: "Registration Desk & Pass Verification", venue: "Main Gate 01", stage: "Registration", status: "UPCOMING" },
      { time: "10:00 AM", title: "Grand Opening Ceremony & Keynote Address", venue: "Executive Auditorium", stage: "Main Stage", status: "UPCOMING" },
      { time: "11:00 AM", title: "Software Hackathon: Problem Statements Released", venue: "Central Computing Lab", stage: "Hackathon Lab", status: "UPCOMING" },
      { time: "11:30 AM", title: "Robo-Race: Autonomous Rover Time Trials", venue: "Robotics Arena Annex", stage: "Robo Arena", status: "UPCOMING" },
      { time: "01:00 PM", title: "Robotechthon Combat Arena: Preliminary Fights", venue: "Main Amphitheater", stage: "Robo Arena", status: "UPCOMING" },
      { time: "02:00 PM", title: "Prompthon: Agentic AI Systems Kickoff", venue: "AI Lab 03", stage: "Hackathon Lab", status: "UPCOMING" },
      { time: "04:00 PM", title: "eSports Valorant: Group Stage Matches", venue: "Room 402", stage: "Gaming Arena", status: "UPCOMING" },
      { time: "08:00 PM", title: "Midnight CTF: Cybersecurity Battle Commences", venue: "Cyber Defense Hub", stage: "Hackathon Lab", status: "UPCOMING" },
      { time: "11:00 PM", title: "Hackathon Checkpoint 01: Mentorship Review", venue: "Central Computing Lab", stage: "Hackathon Lab", status: "UPCOMING" }
    ],
    day2: [
      { time: "08:00 AM", title: "Sunrise Breakfast & Code Freeze Warning", venue: "Cafeteria Terrace", stage: "Main Stage", status: "UPCOMING" },
      { time: "10:00 AM", title: "Software Hackathon Code Freeze & Final Demos", venue: "Central Computing Lab", stage: "Hackathon Lab", status: "UPCOMING" },
      { time: "10:00 AM", title: "Indoor FPV Drone Grand Prix", venue: "Indoor Sports Complex", stage: "Robo Arena", status: "UPCOMING" },
      { time: "11:00 AM", title: "Tech Tank: Venture Showcase Live Pitches", venue: "Executive Auditorium", stage: "Main Stage", status: "UPCOMING" },
      { time: "02:00 PM", title: "Robotechthon Combat Arena: Quarter & Semifinals", venue: "Main Amphitheater", stage: "Robo Arena", status: "UPCOMING" },
      { time: "04:30 PM", title: "Robotechthon Grand Championship Bout", venue: "Main Amphitheater", stage: "Robo Arena", status: "UPCOMING" },
      { time: "05:30 PM", title: "Grand Awards Ceremony & Prize Distribution", venue: "Executive Auditorium", stage: "Main Stage", status: "UPCOMING" },
      { time: "07:00 PM", title: "Gates Open: Bollywood & Star Cultural Night", venue: "Football Grounds", stage: "Cultural Stage", status: "UPCOMING" },
      { time: "08:00 PM", title: "Celebrity Artist Live Performance & DJ Set", venue: "Football Grounds", stage: "Cultural Stage", status: "UPCOMING" }
    ]
  },

  faqs: [
    {
      q: "Who is organizing SYNAPSE 2027?",
      a: "SYNAPSE 2027 is proudly initiated and organized by VERVE Club—the premier student technical and innovation council of IILM University Gurugram, in collaboration with academic departments and student bodies."
    },
    {
      q: "Who is eligible to participate?",
      a: "Any enrolled student from any recognized university, engineering college, polytechnic, or school across India is eligible with a valid student identity card."
    },
    {
      q: "How does the registration and payment work?",
      a: "Select your desired event or general attendee pass on this portal. Complete the quick form, confirm payment via instant UPI QR or Card, and your confirmed holographic pass will be immediately generated and delivered to your email inbox with an entry QR code."
    },
    {
      q: "Will food and accommodation be provided for Hackathon participants?",
      a: "Yes! 24-hour hackathon participants and combat robotics teams will be provided meals, midnight snacks, coffee, and rest zones on campus during the festival."
    },
    {
      q: "How do I reach IILM University Gurugram?",
      a: "The campus is conveniently situated on Golf Course Road, Sector 53, Gurugram. It is directly accessible via Rapid Metro (Sector 53-54 Station is within 5 minutes walking distance) and 25 minutes from IGI Airport New Delhi."
    },
    {
      q: "Can I participate in multiple events?",
      a: "Yes, as long as the schedules of your selected events do not conflict. You can register for multiple events and manage all passes on your profile."
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SYNAPSE_DATA;
}
