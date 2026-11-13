# Campus Event Management & Registration Portal
## CA1 Viva Preparation Guide & Source Code Defense (10 Marks)

This guide covers everything required to secure full marks (10/10) in the **CA1 Viva Evaluation** as outlined in the Lovely Professional University assessment instructions.

---

## 🎯 1. Master Pitch (30-Second Elevator Pitch)

> *"Good morning/afternoon, Sir/Ma'am. Our CA1 project is the **Campus Event Management & Registration Portal**, developed under Problem Statement 7. It is a client-side web application designed to solve three major challenges in university event coordination: **overbooking beyond hall capacity, tedious physical pass verification, and lack of real-time seat transparency**.
>
> We implemented the system using **semantic HTML5, modern CSS3 with custom properties and Flexbox/Grid, and Vanilla JavaScript (ES6+)** with persistent `localStorage`. The platform features **live capacity meters**, an **atomic over-registration lock**, **duplicate registration safeguards**, an **SVG QR-coded printable e-ticket slip**, and an **organizer dashboard with CSV attendee exports**."*

---

## 🏛️ 2. Architectural Walkthrough: How the Code Works

The project follows a clean **Separation of Concerns (SoC)** modular architecture:

```
┌────────────────────────────────────────────────────────┐
│                   index.html (View)                    │
│   Semantic SPA: Header, Hero, Event Grid, Modals, Admin │
└───────────────▲────────────────────────▲───────────────┘
                │                        │
       ┌────────┴────────┐      ┌────────┴────────┐
       │   app.js (Main) │      │ admin.js (Admin)│
       │ Event Filtering │      │ KPI Dashboard   │
       │ Form Validation │      │ Event Creation  │
       │ Modals & Toasts │      │ Attendee Export │
       └────────┬────────┘      └────────┬────────┘
                │                        │
       ┌────────┴────────────────────────┴────────┐
       │             storage.js (Model)            │
       │ LocalStorage CRUD, Atomic Seat Decrement  │
       │ Duplicate Check, Seed Initialization      │
       └────────────────────┬─────────────────────┘
                            │
               ┌────────────┴────────────┐
               │   ticket.js (Utility)   │
               │ SVG QR Matrix Generator │
               │ Printable Stub Renderer │
               └─────────────────────────┘
```

### Module Responsibilities:
1. **`index.html`**: Contains the semantic layout, accessible form structures, modal dialog wrappers, and print target containers.
2. **`css/styles.css`**: Defines CSS variables (`--primary`, `--accent-orange`), responsive Grid/Flexbox containers, perforated ticket design, and `@media print` rules.
3. **`js/data.js`**: Contains realistic campus seed data (fests, hackathons, seminars, pre-registered students) so the app works immediately upon first launch.
4. **`js/storage.js`**: Centralized model layer. Encapsulates all read/write operations to browser `localStorage`, handles capacity boundaries, and enforces unique student registrations.
5. **`js/ticket.js`**: Generates a 21x21 matrix deterministic QR code using pure SVG (no external API or libraries) and formats the admission slip with ticket notches.
6. **`js/admin.js`**: Calculates metrics (occupancy rate, housefull count), manages the event list, handles new event publication, and builds `.csv` files dynamically for download.
7. **`js/app.js`**: Glues the UI together. Handles live debounced search, category pill toggles, availability filtering, student booking submissions, and toast notifications.

---

## 💡 3. Top 10 Technical Viva Questions & Full-Mark Answers

### Q1: How does your portal prevent over-registration?
**Answer:**  
In `js/storage.js`, before adding any new registration, the `registerStudent` method performs an atomic capacity check:
```javascript
const registeredCount = Number(event.registeredCount) || 0;
const capacity = Number(event.capacity) || 0;

if (registeredCount >= capacity) {
  return { success: false, message: "Registration Closed: Maximum capacity reached." };
}
```
If `registeredCount` equals or exceeds `capacity`, the transaction aborts. Additionally, on the UI side in `js/app.js`, when an event has 0 seats left, the card renders a `badge-sold-out` ("HOUSEFULL"), disables the register button (`disabled` attribute), and sets the button text to "Housefull".

---

### Q2: How is data preserved without a backend server or database?
**Answer:**  
We utilize the browser's native **Web Storage API (`localStorage`)**. Data is serialized to JSON strings via `JSON.stringify()` on write and parsed back via `JSON.parse()` on read.  
- Key advantages: Zero server latency, works completely offline, and data persists even when the browser is refreshed or closed.
- The storage keys are scoped under `CAMPUS_EVENTS_V1` and `CAMPUS_REGISTRATIONS_V1`.

---

### Q3: How do you prevent a student from registering multiple times for the same event?
**Answer:**  
In `storage.js`, during `registerStudent`, we query the existing registrations array:
```javascript
const cleanRegNo = studentData.regNo.trim().toUpperCase();
const duplicate = existingRegistrations.find(
  r => r.eventId === eventId && r.regNo.trim().toUpperCase() === cleanRegNo
);
```
If a duplicate registration number is found for that `eventId`, the function rejects the submission and returns the existing ticket details so the student can retrieve their pass instead of creating multiple records.

---

### Q4: How is the QR Code generated without third-party CDN libraries?
**Answer:**  
In `js/ticket.js`, we implemented a lightweight, self-contained **SVG QR Code generator**. It creates a 21x21 grid matrix, places standard 7x7 finder patterns in the top-left, top-right, and bottom-left corners, places timing pattern lines, and computes a deterministic bit hash of the student pass code and registration number. It then generates SVG `<rect>` elements for each active module. Because it outputs pure SVG vectors, it is ultra-fast, sharp at any print resolution, and works 100% offline.

---

### Q5: How does the printable E-Ticket feature work?
**Answer:**  
We implemented a dedicated **`@media print` stylesheet** inside `css/styles.css`. When the user clicks the "Print / Download PDF" button, `window.print()` is triggered. The print stylesheet uses:
```css
@media print {
  .app-header, .hero-banner, .controls-toolbar, .events-grid, .app-footer, .modal-header, .modal-footer {
    display: none !important;
  }
  .printable-ticket {
    border: 2px solid #000 !important;
    page-break-inside: avoid;
  }
}
```
This hides the navbar, footer, buttons, and backdrop, printing **only** the high-resolution ticket slip on standard A4 or saving it directly as a PDF.

---

### Q6: How does the dynamic search and multi-criteria filtering work?
**Answer:**  
In `js/app.js`, `renderEvents()` runs whenever the search input changes or a filter button is clicked. It chains 4 non-destructive filters on the master events array:
1. **Category Filter**: `events.filter(e => e.category === currentCategory)`
2. **Search Query**: Checks case-insensitively across `title`, `organizer`, `venue`, `description`, and `tags`.
3. **Availability Filter**: Filters by `registeredCount < capacity` (Available) or `>= capacity` (Housefull).
4. **Sort Order**: Uses `Array.prototype.sort()` by date timestamp, remaining seats, or popularity.  
This provides sub-millisecond instant filtering as the student types.

---

### Q7: How does the CSV export in the Admin Dashboard work?
**Answer:**  
In `js/admin.js`, the `exportAttendeesCSV` function retrieves the attendee list for the selected event, maps each student's fields (Ticket ID, Name, Reg No, Department, Year, Timestamp) into comma-separated rows, and prefixes it with column headers.  
Then, it creates a browser in-memory `Blob` of MIME type `text/csv`:
```javascript
const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
const url = URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = url;
link.download = `Attendees_${eventName}.csv`;
link.click();
```
This triggers an immediate download directly in the user's browser without needing any backend server.

---

### Q8: What HTML5 semantic elements did you use and why?
**Answer:**  
Instead of generic `<div>` tags everywhere, we used:
- `<header>`: For the global sticky navigation bar and branding.
- `<nav>`: For view switching links.
- `<main>`: For the core application body.
- `<section>`: For logical views (`#eventsSection`, `#myTicketsSection`, `#adminSection`).
- `<dialog>` / ARIA role attributes (`role="dialog"`, `aria-modal="true"`) for modal dialogs.
- `<footer>`: For university accreditation and metadata.  
Semantic elements improve accessibility (screen reader support) and code maintainability.

---

### Q9: Why did you choose Vanilla JavaScript over a framework like React or Angular for this project?
**Answer:**  
1. **Zero Build Step:** Runs immediately in any browser by opening `index.html`.
2. **Direct Deployment:** Pushes straight to GitHub Pages without compiling or bundler errors.
3. **Deep Conceptual Demonstration:** Demonstrates mastery of foundational core JavaScript concepts: DOM manipulation, event bubbling, array higher-order methods (`map`, `filter`, `reduce`), `localStorage` serialization, and asynchronous event loops.
4. **Performance:** Sub-millisecond initial page load with zero framework bundle overhead.

---

### Q10: If you were to extend this project to production, what would you add?
**Answer:**  
1. **Backend & Database:** Node.js/Express with PostgreSQL or MongoDB for multi-user transactional consistency.
2. **WebSockets (Socket.IO):** For instantaneous live seat count updates pushed to all open student tabs without refreshing.
3. **Authentication:** Single Sign-On (SSO) integration with university UMS student credentials.
4. **Automated Notifications:** Email/SMS confirmations with ticket attachments using SendGrid/Twilio.

---

## 👨‍💻 4. Individual Contribution Defense (Per-Member Scripts)

If evaluated individually, each team member can present their designated ownership:

### Member 1: Frontend Architecture, Responsive UI & Print Engine
- *"I was responsible for the HTML5 semantic structure and the responsive CSS design system in `css/styles.css`. I designed the mobile-first CSS Grid and Flexbox layouts, established the CSS variable color palette, built the perforated concert-style ticket stub styling, and developed the `@media print` rules that allow students to print clean physical passes."*

### Member 2: Core JavaScript Engine, Data Layer & Business Logic
- *"I was responsible for `js/storage.js` and `js/app.js`. I implemented the data persistence layer using `localStorage`, wrote the atomic capacity check that prevents overbooking, created the duplicate registration check that ensures unique student entries, and wired up the real-time search, category filtering, and sorting system."*

### Member 3: Admin Console, Attendee Roster & Ticket Generation
- *"I was responsible for `js/admin.js` and `js/ticket.js`. I developed the organizer dashboard with live KPI analytics (occupancy rate, housefull count), the event creation workflow, the attendee roster modal with client-side CSV download via Blob API, and the standalone SVG QR code generator."*
