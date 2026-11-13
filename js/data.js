/**
 * Campus Event Management & Registration Portal
 * Default Seed Data
 */

const SEED_EVENTS = [
  {
    id: "evt-001",
    title: "OneIndia 2026 - Mega Cultural Fest",
    category: "Cultural",
    organizer: "Student Welfare Wing & Cultural Council",
    date: "2026-11-20",
    time: "10:00 AM - 08:00 PM",
    venue: "Shanti Devi Mittal Auditorium (Block 32)",
    capacity: 350,
    registeredCount: 338, // 12 seats left -> demonstrates low seat warning
    description: "The grand annual celebration of cultural diversity, folk dances, musical bands, theatrical performances, and traditional cuisines from every state of India. Open to all students.",
    eligibility: "All undergraduate and postgraduate students with valid University ID.",
    bannerImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    tags: ["Cultural", "Music", "Dance", "Food Fest"],
    rules: [
      "Carry valid University Identity Card at the entry gate.",
      "Reporting time is strictly 30 minutes before commencement.",
      "Outside food, beverages, and restricted items are not permitted."
    ]
  },
  {
    id: "evt-002",
    title: "HackSprint: 24-Hour Flagship Hackathon",
    category: "Technical",
    organizer: "Department of Computer Science & Coding Club",
    date: "2026-11-25",
    time: "09:00 AM (24 Hours)",
    venue: "Innovation Lab & Computing Complex (Block 34)",
    capacity: 100,
    registeredCount: 100, // SOLD OUT -> demonstrates over-registration lock
    description: "An intensive 24-hour non-stop hackathon where student teams design, build, and pitch software and hardware solutions in AI, Web3, Smart Cities, and HealthTech.",
    eligibility: "Teams of 2 to 4 students from CSE, IT, ECE, or related engineering streams.",
    bannerImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    tags: ["Hackathon", "Coding", "AI", "Prizes"],
    rules: [
      "Bring your own laptops, chargers, and development kits.",
      "Original code only; pre-existing repositories are disqualified.",
      "Mentors will conduct milestone check-ins every 6 hours."
    ]
  },
  {
    id: "evt-003",
    title: "Applied Generative AI & LLM Systems Masterclass",
    category: "Workshop",
    organizer: "Centre for AI & Machine Learning Research",
    date: "2026-11-28",
    time: "02:00 PM - 05:30 PM",
    venue: "Seminar Hall 301, Block 36",
    capacity: 80,
    registeredCount: 46, // Plenty of seats
    description: "Hands-on workshop covering Retrieval-Augmented Generation (RAG), fine-tuning small language models, multi-agent workflows, and deploying AI applications to cloud infrastructure.",
    eligibility: "Basic familiarity with Python programming and basic Git knowledge.",
    bannerImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    tags: ["AI/ML", "Python", "Hands-on", "Certificate"],
    rules: [
      "Pre-install Python 3.10+ and VS Code on your personal laptop.",
      "Participation certificate will be issued to registered attendees who attend full session."
    ]
  },
  {
    id: "evt-004",
    title: "Inter-School Sports Gala & Track Championship",
    category: "Sports",
    organizer: "Directorate of Sports & Physical Education",
    date: "2026-12-02",
    time: "08:00 AM - 06:00 PM",
    venue: "University Main Athletic Stadium",
    capacity: 250,
    registeredCount: 110,
    description: "Annual multi-discipline sports meet featuring 100m/400m sprint heats, relay races, high jump, long jump, badminton, and basketball tournament finals.",
    eligibility: "Open to all enrolled students across all disciplines and departments.",
    bannerImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
    tags: ["Athletics", "Championship", "Medals", "Fitness"],
    rules: [
      "Sports gear and running shoes mandatory.",
      "Physical fitness self-declaration required during check-in."
    ]
  },
  {
    id: "evt-005",
    title: "Future of Tech: Industry Leadership Conclave",
    category: "Seminar",
    organizer: "Corporate Relations & Placement Cell",
    date: "2026-12-05",
    time: "11:00 AM - 03:00 PM",
    venue: "Uni-Auditorium 2 (Block 13)",
    capacity: 200,
    registeredCount: 88,
    description: "Executive keynote speakers, panel discussions, and career breakout sessions featuring industry directors and tech founders discussing emerging employment horizons.",
    eligibility: "Pre-final and final year students of all branches.",
    bannerImage: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
    tags: ["Career", "Industry", "Networking", "Leadership"],
    rules: [
      "Formal or semi-formal dress code required.",
      "Q&A session will be conducted at the end of each keynote."
    ]
  },
  {
    id: "evt-006",
    title: "Autonomous Robotics & Drone Arena Showdown",
    category: "Technical",
    organizer: "Robotics & Automation Society (RAS)",
    date: "2026-12-10",
    time: "10:00 AM - 04:00 PM",
    venue: "Central Indoor Gymnasium (Block 18)",
    capacity: 90,
    registeredCount: 32,
    description: "Line-follower bot speed trials, robo-soccer, maze solving, and FPV drone racing through obstacle courses. Real-time telemetry tracking and live leaderboard display.",
    eligibility: "Engineering and technology students with working bot/drone prototypes.",
    bannerImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    tags: ["Robotics", "Drones", "Hardware", "Competition"],
    rules: [
      "Robots must comply with weight and dimension regulations in the handbook.",
      "All LiPo batteries must be inspected by safety officers before flight/drive."
    ]
  }
];

const SEED_REGISTRATIONS = [
  {
    bookingId: "TKT-2026-8819",
    eventId: "evt-001",
    eventTitle: "OneIndia 2026 - Mega Cultural Fest",
    studentName: "Aarav Sharma",
    regNo: "12304918",
    email: "aarav.12304918@lpu.in",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    phone: "+91 98765 43210",
    registeredAt: "2026-11-10T14:22:00"
  },
  {
    bookingId: "TKT-2026-4402",
    eventId: "evt-001",
    eventTitle: "OneIndia 2026 - Mega Cultural Fest",
    studentName: "Priya Nair",
    regNo: "12201844",
    email: "priya.12201844@lpu.in",
    department: "Bio-Technology",
    year: "4th Year",
    phone: "+91 98111 22334",
    registeredAt: "2026-11-11T09:15:00"
  },
  {
    bookingId: "TKT-2026-9051",
    eventId: "evt-002",
    eventTitle: "HackSprint: 24-Hour Flagship Hackathon",
    studentName: "Rohan Verma",
    regNo: "12311902",
    email: "rohan.12311902@lpu.in",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    phone: "+91 99887 76655",
    registeredAt: "2026-11-09T18:40:00"
  },
  {
    bookingId: "TKT-2026-3199",
    eventId: "evt-003",
    eventTitle: "Applied Generative AI & LLM Systems Masterclass",
    studentName: "Ananya Patel",
    regNo: "12408821",
    email: "ananya.12408821@lpu.in",
    department: "Electronics & Communication",
    year: "2nd Year",
    phone: "+91 97654 32109",
    registeredAt: "2026-11-12T11:05:00"
  }
];
