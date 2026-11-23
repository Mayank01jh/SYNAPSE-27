// SYNAPSE '27 Master Data
// Initiated by VERVE Club, IILM University Gurugram
// Authorized via Official Signed Event Proposal Form & Event Flow
// Site by Mayank

const SYNAPSE_DATA = {
  meta: {
    name: "SYNAPSE '27",
    fullName: "SYNAPSE '27 — Annual National Technical Festival",
    tagline: "FLAGSHIP INTER-COLLEGE TECHNICAL FESTIVAL",
    university: "IILM University, Gurugram",
    club: "VERVE Club (Technical & Innovation Body)",
    author: "Site by Mayank",
    coordinates: "28.4595° N, 77.0266° E",
    location: "Auditorium, Café 3, New Building Classes & Lawn Area, IILM University, Sector 53, Gurugram",
    dates: "19th & 20th January 2027",
    timings: "8:00 AM to 6:00 PM",
    budget: "₹4 – 5 Lakhs",
    avgFee: 350,
    attendeesExpected: "BTech Department of IILM & Invited Colleges Nationwide",
    facultyCoordinator: {
      name: "Dr. Mansi Verma",
      role: "Faculty / Club Coordinator",
      email: "mansi.verma@iilm.edu",
      phone: "8800563131"
    },
    convenor: {
      name: "Ayush Gupta",
      role: "Convenor (President, Verve IILM)",
      email: "areyushhh1@gmail.com",
      phone: "9971680698"
    },
    coConvenor: {
      name: "Nilay Nayyar",
      role: "Co-convenor (Vice President, Verve IILM)",
      email: "nilay.nayyar@gmail.com",
      phone: "9871413044"
    }
  },

  tracks: [
    {
      id: "software",
      code: "TRACK 01",
      name: "Software & AI Engineering",
      color: "#C90016",
      desc: "Prompt Wars powered by Hack2Skill, 6-Hour Hackathon, CTF Cybersecurity, and AI Innovations."
    },
    {
      id: "robotics",
      code: "TRACK 02",
      name: "Hardware & Tech Expo",
      color: "#111111",
      desc: "Working models, hardware prototypes, interactive technical projects, and robotics showcase."
    },
    {
      id: "startup",
      code: "TRACK 03",
      name: "Innovation & Pitching",
      color: "#9C0019",
      desc: "Pitch working solutions to judging panels, product-market validation, and idea demonstrations."
    },
    {
      id: "gaming",
      code: "TRACK 04",
      name: "Design & Brain Challenges",
      color: "#5F5E5E",
      desc: "UI/UX Design, Tech Quiz, Treasure Hunt, Tech Pictionary, Logo Guessing, and JAM Sessions."
    },
    {
      id: "general",
      code: "TRACK 05",
      name: "Workshops & Grand Finale",
      color: "#C90016",
      desc: "Expert-led workshops, keynote addresses, Ganesh Vandana welcome, networking, and prize ceremony."
    }
  ],

  events: [
    {
      id: "hackathon-6h",
      title: "6-HOUR HACKATHON // SOFTWARE & HARDWARE+",
      track: "software",
      trackName: "Software & AI",
      tagline: "High-Intensity Innovation Challenge for Real-World Problems",
      format: "Team (2-4 Members)",
      slots: "Day 02 • 9:00 AM – 3:00 PM",
      fee: 350,
      prizePool: "₹50,000+",
      venue: "New Building Classes / Labs",
      timeline: "Day 02 • 9:00 AM – 3:00 PM",
      desc: "A six-hour innovation challenge where teams develop practical solutions to real-world problems. Participants can work on software-based applications or hardware-based prototypes, demonstrating technical skills, creativity, and teamwork.",
      rules: [
        "Squad size: 2 to 4 students per team.",
        "Both software and hardware prototype solutions permitted.",
        "All code and prototypes must be developed during the fest hours.",
        "Final pitch and demo conducted during Innovation Pitching round on Day 2."
      ],
      coordinators: [
        { name: "Ayush Gupta (President, Verve)", contact: "9971680698" },
        { name: "Nilay Nayyar (VP, Verve)", contact: "9871413044" }
      ]
    },
    {
      id: "prompt-wars",
      title: "PROMPT WARS // POWERED BY HACK2SKILL",
      track: "software",
      trackName: "Software & AI",
      tagline: "AI-Based Creative Prompt Engineering Battle",
      format: "Solo / Duo",
      slots: "Day 01 • 10:00 AM – 1:00 PM",
      fee: 350,
      prizePool: "₹25,000+",
      venue: "New Building Computer Labs",
      timeline: "Day 01 • 10:00 AM – 1:00 PM",
      desc: "An AI-based creative competition where participants use their prompt-writing skills to generate innovative outputs using AI tools. Participants are evaluated on creativity, accuracy, originality, and effective use of prompts.",
      rules: [
        "Participants given challenging real-world multi-modal tasks.",
        "Evaluation strictly based on output quality, prompt efficiency, and originality.",
        "Organized in collaboration with Hack2Skill."
      ],
      coordinators: [
        { name: "Ayush Gupta (President, Verve)", contact: "9971680698" }
      ]
    },
    {
      id: "ctf-cyber",
      title: "CAPTURE THE FLAG (CTF) // CYBER DEFENSE",
      track: "software",
      trackName: "Software & AI",
      tagline: "Offensive Security, Cryptography & Vulnerability Cracking",
      format: "Solo / Team of 2",
      slots: "Day 01 • 1:00 PM – 4:30 PM",
      fee: 350,
      prizePool: "₹25,000+",
      venue: "Computer Lab (New Building)",
      timeline: "Day 01 • 1:00 PM – 4:30 PM",
      desc: "A cybersecurity challenge in which participants solve technical puzzles, identify vulnerabilities, and crack security-related challenges to find hidden flags across web security, reverse engineering, and cryptography.",
      rules: [
        "Time limit: 3.5 hours of continuous cracking.",
        "Challenges tiered from beginner to advanced binary exploitation.",
        "Dynamic scoreboard with first-blood bonus points."
      ],
      coordinators: [
        { name: "Nilay Nayyar (VP, Verve)", contact: "9871413044" }
      ]
    },
    {
      id: "uiux-design",
      title: "UI/UX DESIGN COMPETITION",
      track: "gaming",
      trackName: "Design & Media",
      tagline: "Human-Centric Digital Product Interface Sprint",
      format: "Solo / Duo",
      slots: "Day 01 • 1:00 PM – 4:30 PM",
      fee: 350,
      prizePool: "₹20,000+",
      venue: "Design Studio (New Building)",
      timeline: "Day 01 • 1:00 PM – 4:30 PM",
      desc: "Participants will showcase their creativity by designing user-friendly website or application interfaces, focusing on visual appeal, functionality, user journey, and user experience.",
      rules: [
        "Design brief revealed at 1:00 PM on Day 1.",
        "Submissions accepted via Figma, Adobe XD, or interactive prototypes.",
        "Judged on accessibility, visual hierarchy, aesthetic balance, and UX reasoning."
      ],
      coordinators: [
        { name: "Verve Design Lead", contact: "8800563131" }
      ]
    },
    {
      id: "tech-quiz",
      title: "INTER-COLLEGE TECH QUIZ",
      track: "gaming",
      trackName: "Technical Knowledge",
      tagline: "Rapid-Fire Battle on Computing, AI & Emerging Tech",
      format: "Team of 2",
      slots: "Day 01 • 1:00 PM – 4:30 PM",
      fee: 350,
      prizePool: "₹15,000+",
      venue: "Auditorium",
      timeline: "Day 01 • 1:00 PM – 4:30 PM",
      desc: "A knowledge-based competition testing participants' understanding of technology, computers, programming, AI, and current technological developments through an interactive quiz with buzzer rounds.",
      rules: [
        "Preliminary written elimination round followed by top-6 stage buzzer finale.",
        "Covers tech history, quantum computing, AI frontiers, tech trivia, and coding logic."
      ],
      coordinators: [
        { name: "Ayush Gupta", contact: "9971680698" }
      ]
    },
    {
      id: "tech-expo",
      title: "TECH EXPO // INNOVATION EXHIBITION",
      track: "robotics",
      trackName: "Hardware & Expo",
      tagline: "Showcase of Working Models, Hardware & Tech Projects",
      format: "Team (Up to 4)",
      slots: "Day 02 • 9:00 AM – 3:00 PM",
      fee: 350,
      prizePool: "₹30,000+",
      venue: "Lawn Area & Auditorium Foyer",
      timeline: "Day 02 • 9:00 AM – 3:00 PM",
      desc: "An exhibition where participants and teams display their innovative projects, working models, and technological solutions. Visitors, industry guests, and students will interact with different projects.",
      rules: [
        "Working prototype or live model demonstration mandatory.",
        "Display tables, power extension boards, and Wi-Fi provided.",
        "Scoring includes technical innovation, practical utility, and presentation."
      ],
      coordinators: [
        { name: "Nilay Nayyar", contact: "9871413044" }
      ]
    },
    {
      id: "treasure-hunt",
      title: "CAMPUS TECHNICAL TREASURE HUNT",
      track: "gaming",
      trackName: "Campus Quest",
      tagline: "Algorithm Clues, QR Decoders & Physical Campus Hunt",
      format: "Team (3-4 Members)",
      slots: "Day 02 • 10:00 AM – 12:00 PM",
      fee: 350,
      prizePool: "₹15,000+",
      venue: "Campus Ground & Lawn Area",
      timeline: "Day 02 • 10:00 AM – 12:00 PM",
      desc: "A team-based activity where participants solve technical clues, cipher riddles, and programming puzzles to discover hidden checkpoint locations across IILM University campus.",
      rules: [
        "Teams navigate across verified university safety zones.",
        "Fastest team to decode all sequential clues wins.",
        "Smartphone required for scanning encrypted QR checkpoints."
      ],
      coordinators: [
        { name: "Verve Operations Team", contact: "9971680698" }
      ]
    },
    {
      id: "workshops",
      title: "WORKSHOPS ON EMERGING TECHNOLOGIES",
      track: "general",
      trackName: "Workshops",
      tagline: "Hands-on Masterclasses by Industry Practitioners",
      format: "Open Attendee",
      slots: "Day 02 • 4:00 PM – 5:00 PM",
      fee: 0,
      prizePool: "Certificates",
      venue: "Auditorium / Seminar Hall",
      timeline: "Day 02 • 4:00 PM – 5:00 PM",
      desc: "Interactive learning sessions conducted by experts and resource persons, introducing participants to emerging technologies, practical engineering applications, and new technical career skills.",
      rules: [
        "Free entry for all registered SYNAPSE pass holders.",
        "Official certificates of participation awarded."
      ],
      coordinators: [
        { name: "Dr. Mansi Verma", contact: "8800563131" }
      ]
    },
    {
      id: "tech-pictionary",
      title: "TECH PICTIONARY",
      track: "gaming",
      trackName: "Fun & Creativity",
      tagline: "Draw, Guess & Decode Tech Concepts Against the Clock",
      format: "Team of 2",
      slots: "Day 02 • 4:00 PM – 5:00 PM",
      fee: 150,
      prizePool: "₹10,000+",
      venue: "Café 3 / Lawn Area",
      timeline: "Day 02 • 4:00 PM – 5:00 PM",
      desc: "A fun team-based game where participants draw technology-related terms, gadgets, or concepts while their teammates try to guess the answers within a limited time.",
      rules: [
        "No letters, numbers, or spoken verbal hints permitted during drawing.",
        "60 seconds per clue round."
      ],
      coordinators: [
        { name: "Verve Cultural Team", contact: "9871413044" }
      ]
    },
    {
      id: "innovation-pitching",
      title: "INNOVATION PITCHING FINALE",
      track: "startup",
      trackName: "Startup & Pitch",
      tagline: "Present Your Prototype Before the Executive Jury",
      format: "Team (Hackathon & Project Teams)",
      slots: "Day 02 • 4:00 PM – 5:00 PM",
      fee: 350,
      prizePool: "₹25,000+",
      venue: "Auditorium",
      timeline: "Day 02 • 4:00 PM – 5:00 PM",
      desc: "Hackathon and independent innovators present their ideas, demonstrate solutions, and explain the problem addressed, proposed approach, and potential impact before the judging panel.",
      rules: [
        "5-minute slide & demo pitch followed by 3-minute jury Q&A.",
        "Focus on feasibility, originality, and real-world viability."
      ],
      coordinators: [
        { name: "Ayush Gupta", contact: "9971680698" }
      ]
    },
    {
      id: "logo-quiz",
      title: "LOGO GUESSING CHALLENGE",
      track: "gaming",
      trackName: "Brand IQ",
      tagline: "Interactive Quiz on Tech Giants & Global Startups",
      format: "Solo",
      slots: "Day 02 • 4:00 PM – 5:00 PM",
      fee: 150,
      prizePool: "₹8,000+",
      venue: "Seminar Hall",
      timeline: "Day 02 • 4:00 PM – 5:00 PM",
      desc: "An interactive quiz in which participants identify popular technology companies, open-source projects, and brands through their logos, testing their awareness of the tech industry.",
      rules: [
        "Speed and accuracy based digital buzzer rounds.",
        "Multiple rounds from minimalist silhouettes to retro branding."
      ],
      coordinators: [
        { name: "Nilay Nayyar", contact: "9871413044" }
      ]
    },
    {
      id: "jam-session",
      title: "JUST A MINUTE (JAM) SESSION",
      track: "gaming",
      trackName: "Spontaneity",
      tagline: "Speak on Random Tech Topics for 60 Uninterrupted Seconds",
      format: "Solo",
      slots: "Day 02 • 5:00 PM – 5:30 PM",
      fee: 100,
      prizePool: "₹5,000+",
      venue: "Auditorium",
      timeline: "Day 02 • 5:00 PM – 5:30 PM",
      desc: "A fun and interactive Just a Minute activity where participants speak on randomly assigned technology topics for a limited time, testing spontaneity, confidence, humor, and communication skills.",
      rules: [
        "Topics picked randomly on stage.",
        "No hesitation, repetition, or deviation for 60 seconds."
      ],
      coordinators: [
        { name: "Dr. Mansi Verma", contact: "8800563131" }
      ]
    },
    {
      id: "general-fest-pass",
      title: "ALL-ACCESS SYNAPSE '27 PASS",
      track: "general",
      trackName: "General Fest Pass",
      tagline: "Full Access to Both Days: Keynotes, Expo, Networking & Ceremonies",
      format: "Individual Student Pass",
      slots: "Both Days (19 - 20 Jan)",
      fee: 350,
      prizePool: "₹4-5L Festival",
      venue: "Auditorium, Café 3, Lawn Area & All Venues",
      timeline: "19th & 20th January 2027 • 8:00 AM – 6:00 PM",
      desc: "Official gate admission pass for SYNAPSE '27. Grants complete access to Day 1 & Day 2: Welcome ceremony with Ganesh Vandana, Tech Expo, workshops, spectator access to CTF & Hackathon pitches, closing ceremony, and food carnival.",
      rules: [
        "Valid college ID card mandatory for gate entry alongside digital QR pass.",
        "Includes access to high-speed campus Wi-Fi and café amenities."
      ],
      coordinators: [
        { name: "VERVE Club Secretariat", contact: "mansi.verma@iilm.edu" }
      ]
    }
  ],

  schedule: {
    day1: [
      {
        time: "8:00 AM – 9:00 AM",
        stage: "GATE 01 & AUDITORIUM",
        venue: "Auditorium & Café 3",
        title: "Registration, ID Collection & Ganesh Vandana Welcome",
        desc: "Participants complete registration, collect official event badges and holographic passes. Organizers welcome attendees with traditional Ganesh Vandana and guidance to venues.",
        status: "CONFIRMED"
      },
      {
        time: "10:00 AM – 1:00 PM",
        stage: "COMPUTING LABS",
        venue: "New Building Labs",
        title: "Prompt Wars — Powered by Hack2Skill",
        desc: "AI prompt engineering competition where students craft creative prompts to solve multi-modal AI generation challenges.",
        status: "FLAGSHIP"
      },
      {
        time: "1:00 PM – 4:30 PM",
        stage: "CYBER LAB",
        venue: "Computer Lab (New Building)",
        title: "Capture The Flag (CTF) Cyber Defense",
        desc: "High-octane cybersecurity competition with vulnerability cracking, reverse engineering, and web security puzzles.",
        status: "COMPETITION"
      },
      {
        time: "1:00 PM – 4:30 PM",
        stage: "DESIGN LAB",
        venue: "Design Studio (New Building)",
        title: "UI/UX Design Competition",
        desc: "Designers construct user-friendly web and mobile application prototypes focusing on visual polish, UX flows, and usability.",
        status: "COMPETITION"
      },
      {
        time: "1:00 PM – 4:30 PM",
        stage: "MAIN STAGE",
        venue: "Auditorium",
        title: "Inter-College Tech Quiz",
        desc: "Buzzer rounds testing deep knowledge across programming, AI advancements, quantum systems, and tech history.",
        status: "COMPETITION"
      },
      {
        time: "2:00 PM – 3:00 PM",
        stage: "FOOD COURT",
        venue: "Café 3 & Lawn Area",
        title: "Lunch Break & Refreshments",
        desc: "Scheduled break for participants, faculty, volunteers, and organizing members to refresh and network.",
        status: "REFRESHMENTS"
      },
      {
        time: "4:30 PM – 5:30 PM",
        stage: "MAIN STAGE",
        venue: "Auditorium",
        title: "Day 1 Closing Session & Student Networking",
        desc: "Recap of Day 1 results, interaction with peer innovators, discussion of upcoming Day 2 hackathon, and networking.",
        status: "CONVERGENCE"
      }
    ],

    day2: [
      {
        time: "8:00 AM – 9:00 AM",
        stage: "GATE 01",
        venue: "Auditorium",
        title: "Day 2 Registration & Orientation",
        desc: "Participants complete day 2 check-in, receive hackathon rules, mentor assignments, and safety protocols.",
        status: "CONFIRMED"
      },
      {
        time: "9:00 AM – 3:00 PM",
        stage: "HACKATHON ZONE",
        venue: "New Building Classes",
        title: "6-Hour Hackathon (Software & Hardware+)",
        desc: "Six-hour continuous innovation sprint where teams construct functional software applications or hardware-based prototypes.",
        status: "MAIN EVENT"
      },
      {
        time: "9:00 AM – 3:00 PM",
        stage: "EXPO GROUNDS",
        venue: "Lawn Area & Auditorium Foyer",
        title: "Tech Expo // Innovation Exhibition",
        desc: "Open exhibition displaying student working models, engineering innovations, robotics demonstrations, and software tools.",
        status: "EXHIBITION"
      },
      {
        time: "10:00 AM – 12:00 PM",
        stage: "CAMPUS ARENA",
        venue: "Campus Ground & Lawn Area",
        title: "Campus Technical Treasure Hunt",
        desc: "Team-based hunt solving cryptographic clues, algorithmic riddles, and campus checkpoints.",
        status: "ACTIVITY"
      },
      {
        time: "12:00 PM – 1:00 PM",
        stage: "FOOD COURT",
        venue: "Café 3",
        title: "Lunch & Refreshment Break",
        desc: "Re-energize before afternoon pitching and skill workshops.",
        status: "REFRESHMENTS"
      },
      {
        time: "4:00 PM – 5:00 PM",
        stage: "SEMINAR HALL",
        venue: "Auditorium & Seminar Hall",
        title: "Workshops on Emerging Technologies",
        desc: "Interactive technical masterclasses by industry professionals and academicians on state-of-the-art tech.",
        status: "LEARNING"
      },
      {
        time: "4:00 PM – 5:00 PM",
        stage: "RECREATION",
        venue: "Café 3 / Lawn Area",
        title: "Tech Pictionary & Logo Guessing Challenge",
        desc: "Fun, rapid-fire drawing and tech company logo trivia contests for participants.",
        status: "FUN EVENT"
      },
      {
        time: "4:00 PM – 5:00 PM",
        stage: "MAIN STAGE",
        venue: "Auditorium",
        title: "Innovation Pitching (Hackathon Finale)",
        desc: "Top hackathon and prototype teams present live solutions and business viability before the expert judging panel.",
        status: "EVALUATION"
      },
      {
        time: "5:00 PM – 5:30 PM",
        stage: "MAIN STAGE",
        venue: "Auditorium",
        title: "Just A Minute (JAM) Session",
        desc: "Fast-talking, witty 60-second spontaneous tech speaking challenge.",
        status: "ACTIVITY"
      },
      {
        time: "Post 5:30 PM",
        stage: "MAIN STAGE",
        venue: "Auditorium",
        title: "Prize Distribution, Closing Ceremony & Vote of Thanks",
        desc: "Felicitation of winners across all 12+ events, certificate distribution, organizer recognition, and formal conclusion.",
        status: "GRAND FINALE"
      }
    ]
  },

  faqs: [
    {
      q: "What is SYNAPSE '27 and who can participate?",
      a: "SYNAPSE '27 is the flagship inter-college technical festival of IILM University, Gurugram, organized by VERVE Club. Students from BTech departments of IILM University and invited colleges across India are welcome to participate with valid college IDs."
    },
    {
      q: "What are the confirmed festival dates and timings?",
      a: "The festival takes place on 19th & 20th January 2027 from 8:00 AM to 6:00 PM each day at IILM University, Sector 53, Golf Course Road, Gurugram."
    },
    {
      q: "What is the average registration fee?",
      a: "As approved in the official event proposal, the expected registration fee is ₹350 per event/pass. Certain workshops and select sessions are free of charge for registered pass holders."
    },
    {
      q: "How does gate security admission work?",
      a: "Upon completing online registration and payment confirmation, an official digital admission pass with an encrypted QR code is instantly issued and sent to your email. Present this QR pass at Main Gate 01 for security verification."
    },
    {
      q: "Can external college teams stay on campus?",
      a: "Yes, hostel/guesthouse accommodation, high-speed campus Wi-Fi, daytime computer lab/arena access, and main-gate visitor pass clearance are coordinated for external college teams."
    },
    {
      q: "Who can I contact for event coordination?",
      a: "You can reach out to Faculty Coordinator Dr. Mansi Verma (8800563131 / mansi.verma@iilm.edu), Convenor Ayush Gupta (9971680698), or Co-convenor Nilay Nayyar (9871413044)."
    }
  ]
};
