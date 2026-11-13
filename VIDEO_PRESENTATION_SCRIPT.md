# Campus Event Management & Registration Portal
## Video Presentation Script (5 Marks)

> **Duration:** 3.5 to 5 Minutes  
> **Format:** Screen recording with team members' camera/voice narration  
> **Rubric Coverage:** Problem Statement & Motivation (1m), Proposed Solution & Tech Stack (1m), Live Working Demonstration (2m), Key Outcomes & Team Contribution (1m).  

---

### 🎬 Scene 1: Introduction, Problem Identification & Motivation
- **Time:** `0:00 - 0:50` (50 seconds)
- **Speaker:** Member 1
- **Visual on Screen:** Title Slide or Portal Homepage (`index.html`)

**Spoken Script:**
> *"Hello respected evaluators and faculty members. Today, our team is presenting our CA1 Project-Based Assessment titled **'Campus Event Management & Registration Portal'**, developed under Problem Statement 7.
>
> On any active university campus like Lovely Professional University, hundreds of events—from mega cultural fests and 24-hour hackathons to guest workshops and sports tournaments—are organized throughout the semester. 
> 
> However, managing these registrations manually or through ad-hoc online forms leads to critical problems: **halls get overcrowded beyond legal fire-safety capacity, students have no live visibility into seat availability, duplicate registrations waste limited slots, and paper slips are easy to misplace or forge**.
> 
> To solve this, we built a modern, responsive web application that streamlines campus event discovery, enforces strict real-time seat limits, prevents over-registration, and provides instant, verifiable QR e-ticket passes."*

---

### 🎬 Scene 2: Proposed Solution & Technical Architecture
- **Time:** `0:50 - 1:30` (40 seconds)
- **Speaker:** Member 2
- **Visual on Screen:** Brief slide showing Tech Stack & Architecture diagram, or browser dev tools showing clean file structure.

**Spoken Script:**
> *"To ensure high performance, zero server lag, and 100% deployment portability, we engineered the solution using **Semantic HTML5, Modern CSS3 with CSS Grid and Flexbox, and Vanilla JavaScript ES6+**.
>
> For data management, we implemented an encapsulated `localStorage` engine in `storage.js` that guarantees client-side data persistence across reloads. 
> 
> Furthermore, we built a standalone SVG QR-code generation engine in `ticket.js` and custom `@media print` rules, enabling students to download or print high-resolution passes without relying on third-party APIs or heavy libraries."*

---

### 🎬 Scene 3: Live Demonstration of Student Features
- **Time:** `1:30 - 2:45` (1 minute 15 seconds)
- **Speaker:** Member 1 & Member 2
- **Visual on Screen:** Live screen recording of the running web application in browser.

**Action Steps to Record:**
1. **Show Event Catalog & Filtering:**
   - Type `"Hack"` or `"AI"` in the search bar. Show instant filtering.
   - Click category filter pills: *Technical*, *Cultural*, *Workshops*.
   - Point out the **Live Capacity Meter** on cards:
     > *"Notice our live seat gauge: Green for open events, Yellow for fast-filling events with under 15 seats left, and Red for Housefull events."*
2. **Demonstrate Over-Registration Lock:**
   - Scroll to `HackSprint 24-Hour Hackathon`:
     > *"Here, the hackathon has reached 100/100 capacity. Notice how the system automatically displays a 'HOUSEFULL' badge, locks over-registration, and completely disables the Register button."*
3. **Perform a Live Registration:**
   - Click "Register Now" on *OneIndia 2026 Cultural Fest* (which has 12 seats remaining).
   - Fill in student details:
     - Name: `Rohan Gupta`
     - Reg No: `12309876`
     - Email: `rohan.12309876@lpu.in`
     - Department: `Computer Science & Engineering`
     - Academic Year: `3rd Year`
   - Click **Confirm & Generate E-Ticket**:
     > *"The moment we click register, the system atomically updates the seat count, saves the booking, and instantly generates this official electronic pass with a unique Pass Code, perforated ticket stub, and deterministic QR Code."*
   - Click **Print / Download PDF** to show the clean print preview.
4. **Demonstrate "My Passes" Lookup:**
   - Click "My Passes" in the top navbar.
   - Enter Reg No `12309876` and click Search. Show the retrieved ticket pass.

---

### 🎬 Scene 4: Live Demonstration of Organizer / Admin Dashboard
- **Time:** `2:45 - 3:50` (1 minute 05 seconds)
- **Speaker:** Member 3
- **Visual on Screen:** Switching to the "Organizer Admin" tab.

**Action Steps to Record:**
1. **Show Admin KPIs:**
   - Point to Total Events, Registrations, Total Capacity, and Overall Occupancy Rate (e.g., `85%`).
2. **Publish a New Event:**
   - Click `+ Create New Event`.
   - Title: `Campus Esports League 2026`
   - Category: `Sports`
   - Seat Capacity: `60`
   - Date & Venue: `2026-12-15`, `Uni-Auditorium Block 34`
   - Submit: Show the new event immediately appearing on the table and in the student catalog.
3. **Show Attendee Roster & CSV Export:**
   - Click **Attendees** next to *OneIndia 2026*.
   - Show the verified student roster with registration numbers and timestamps.
   - Click **Export Roster (CSV)** and show the generated `.csv` file downloaded to the browser.

---

### 🎬 Scene 5: Key Outcomes, Member Contributions & Conclusion
- **Time:** `3:50 - 4:40` (50 seconds)
- **Speaker:** All Members (or alternating sentences)
- **Visual on Screen:** Slide or Summary Page with Team Names, Reg Nos, and Roles.

**Spoken Script:**
- **Member 1:** *"In conclusion, our platform successfully addresses all requirements of Problem Statement 7 by delivering an intuitive UI, foolproof seat-capacity enforcement, and verifiable digital passes."*
- **Member 2:** *"As for individual contributions: Member 1 handled the UI architecture, CSS Grid/Flexbox design system, and print styling. Member 2 developed the core JavaScript engine, atomic capacity locking, and localStorage data persistence."*
- **Member 3:** *"Member 3 developed the Organizer Console, real-time KPI metrics, dynamic CSV roster export, and the standalone QR code generator.
The complete source code is maintained on GitHub and deployed live on GitHub Pages. Thank you for your time!"*

---

## 🎥 Recording Tips for the Team:
1. **Resolution:** Record at 1080p (1920x1080) for sharp text readability.
2. **Audio:** Use a clean microphone or headset to ensure voice clarity.
3. **Zoom Level:** Set browser zoom to 100% or 110% so evaluators can easily read student names, seat numbers, and ticket badges.
4. **Upload:** Upload the recording to Google Drive (set access to *"Anyone with the link can view"*) or unlisted YouTube video, and paste the URL into your Excel submission file.
