# Campus Event Management & Registration Portal

> **CA1 Project-Based Assessment — Lovely Professional University**  
> **Course:** Web Development / Front-End Technologies  
> **Topic 7:** Campus Event Management & Registration Portal  
> **Tech Stack:** Semantic HTML5, Modern Modular CSS3, Vanilla JavaScript (ES6+), LocalStorage  
> **Deployment:** Zero-build 100% native GitHub Pages / Vercel ready  

---

## 📌 1. Project Overview & Problem Statement

College campuses host a high volume of events throughout the academic year—annual fests, technical hackathons, guest seminars, hands-on workshops, and sports tournaments. Managing event registrations manually or via ad-hoc spreadsheets frequently leads to **over-registration beyond hall capacity, crowd control issues, duplicate submissions, and lack of verifiable entry passes**.

The **Campus Event Management & Registration Portal** solves this by providing a unified web platform that enables:
1. **Students** to discover upcoming campus events, view live remaining seat availability in real time, register with verified details, and receive an instant **downloadable/printable QR E-Ticket Pass**.
2. **Organizers & Administrators** to create and schedule events with strict seat capacity limits, monitor real-time attendance and occupancy rates, inspect verified attendee lists, and **export attendee rosters to CSV/Excel**.
3. **Atomic Over-Registration Prevention**: When an event reaches maximum seating capacity, the system automatically transitions the status to **"Housefull"**, locks registrations, and disables form submission to ensure no overflow.

---

## 🚀 2. Live Demo & Repository Structure

- **GitHub Repository:** `https://github.com/<your-username>/campus-event-portal`
- **Live Deployed URL:** `https://<your-username>.github.io/campus-event-portal/`

### File Structure:
```text
campus-event-portal/
├── index.html                   # Semantic Single-Page Application (SPA) structure
├── css/
│   └── styles.css               # Modern CSS system, Flexbox/Grid, print styles (@media print)
├── js/
│   ├── data.js                  # Default pre-seeded realistic campus events & attendees
│   ├── storage.js               # LocalStorage data persistence layer & atomic booking logic
│   ├── ticket.js                # SVG QR code generator & printable perforated E-Ticket pass
│   ├── admin.js                 # Organizer console, analytics KPIs, CSV export, event CRUD
│   └── app.js                   # Application coordinator, filters, search, modals & toasts
├── CA1_Project_Submission_Sheet.xlsx # Pre-formatted Excel submission file required for UMS
├── VIVA_GUIDE.md                # Complete Viva questions, technical explanations & member scripts
├── VIDEO_PRESENTATION_SCRIPT.md # 3-5 minute video presentation script with speaker roles
└── README.md                    # Comprehensive project documentation
```

---

## 🌟 3. Key Functional Modules

### A. Student Event Discovery & Filtering
- **Keyword Search:** Instant live filtering by title, organizing club, venue, or keywords.
- **Category Filter Pills:** Technical, Cultural, Workshop, Seminar, Sports, and All.
- **Availability Filter:** Filter by "All Statuses", "Seats Available", or "Housefull".
- **Dynamic Sorter:** Sort by earliest date, latest date, most seats available, or popularity.

### B. Live Real-Time Seat Counter & Capacity Lock
- **Visual Progress Bar:** Real-time occupancy percentage meter.
- **Seat Badging:**
  - `🟢 Open`: Plenty of seats remaining.
  - `🟡 Fast Filling`: When 15 or fewer seats remain (with subtle pulsating urgency).
  - `🔴 Housefull`: Locked when booked count equals capacity limit.
- **Atomic Booking Guard:** Prevents race conditions and stops registration submissions once capacity is met.

### C. Student Registration & Duplicate Prevention
- Fields: Full Name, Registration Number, University Email, Department, Academic Year, Contact Number.
- Client-side validation: Email regex format, registration number length check.
- **Duplicate Prevention:** Checks existing records to prevent a student from registering twice for the same event. If already registered, it offers 1-click access to view their existing pass.

### D. Printable E-Ticket Pass with Deterministic QR Code
- Perforated airline/concert-style ticket stub layout.
- Embedded self-contained **SVG QR Code generator** encoding Pass Code, Reg No, and Event ID.
- Dedicated `@media print` stylesheet: clicking **"Print / Download PDF"** hides navigation, buttons, and dialogs, outputting a clean, high-resolution admission pass ready for physical gate scanning.

### E. "My Passes" Portal
- Students can input their Registration Number to quickly retrieve, inspect, and reprint any active event tickets without logging in.

### F. Organizer & Admin Dashboard
- **Analytics KPIs:** Total events, total active registrations, total seat capacity, overall occupancy percentage, and sold-out count.
- **Event Creator Modal:** Publish new events with custom capacity limits, schedule, venue, guidelines, and tags.
- **Attendee Roster Management:** View registered students per event with timestamp and booking code.
- **CSV Data Export:** 1-click export of attendee rosters into standard `.csv` spreadsheet for gate checking or attendance records.
- **Reset Demo Data:** Restores default campus events for easy testing and demonstrations.

---

## 🛠️ 4. Technology Stack & Design Decisions

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Markup** | HTML5 Semantic Elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`) | Accessible, SEO-friendly, clear DOM tree for viva explanation. |
| **Styling** | Vanilla CSS3 (Custom Properties, Flexbox, CSS Grid) | Zero framework bloat; lightweight, responsive, custom ticket stub aesthetic. |
| **Logic** | Vanilla JavaScript (ES6+ Classes, Objects, Array methods) | No dependencies required; ultra-fast load time, 100% native browser support. |
| **Storage** | Browser `localStorage` API | Persists event changes and student bookings across page refreshes without backend latency. |
| **Pass Print** | CSS `@media print` + Pure SVG QR Matrix Generator | Fully standalone; works offline without third-party QR or PDF libraries. |

---

## 💻 5. Running the Project Locally

No `npm install` or backend server setup is required!

### Option 1: Direct File Open
Double click `index.html` in your file explorer to open it directly in Google Chrome, Microsoft Edge, Safari, or Firefox.

### Option 2: Using Python's Built-in Server (Recommended)
```bash
# Navigate to the project directory
cd path/to/campus-event-portal

# Start a local HTTP server
python3 -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🌐 6. How to Deploy Online (GitHub Pages in 2 Minutes)

1. Create a new repository on your GitHub account named `campus-event-portal`.
2. Push this project code to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/campus-event-portal.git
   git branch -M main
   git push -u origin main
   ```
3. On GitHub, navigate to **Settings** > **Pages** (in the left sidebar).
4. Under **Build and deployment** > **Branch**, select `main` branch and `/ (root)` folder, then click **Save**.
5. Wait 30 seconds. Your live URL will be active at:
   `https://<your-username>.github.io/campus-event-portal/`

---

## 👥 7. Team Contribution Breakdown (For Viva & Evaluation)

| Member | Assigned Role | Key Modules Implemented |
|---|---|---|
| **Member 1** | Frontend Architect & UI/UX | Responsive CSS system, navigation, event cards grid, hero section, and `@media print` ticket pass styling. |
| **Member 2** | JavaScript Core & State Engine | `storage.js` LocalStorage CRUD, atomic over-registration check, duplicate prevention, and search/filter logic. |
| **Member 3** | Admin Dashboard & Ticket Generator | Organizer analytics, attendee roster modal, CSV export utility, and deterministic SVG QR generator. |

---

## 📄 8. Submission Verification Checklist

- [x] All 7 functional requirements of Problem Statement 7 implemented.
- [x] Responsive layout tested on desktop, tablet, and mobile screen sizes.
- [x] LocalStorage persistence verified across page reloads.
- [x] Over-registration locking verified (test event `evt-002` HackSprint shows Housefull).
- [x] Printable E-Ticket verified via Print Preview.
- [x] Excel submission template generated (`CA1_Project_Submission_Sheet.xlsx`).
- [x] Viva preparation guide completed (`VIVA_GUIDE.md`).
- [x] Video presentation script prepared (`VIDEO_PRESENTATION_SCRIPT.md`).
