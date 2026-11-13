/**
 * Campus Event Management & Registration Portal
 * Main Application Logic & Student Portal Controller
 */

const App = {
  currentCategory: "All",
  currentSearchQuery: "",
  currentAvailabilityFilter: "all",
  currentSort: "date-asc",
  selectedEventForReg: null,

  init() {
    StorageManager.init();
    this.bindEvents();
    this.renderEvents();
    AdminManager.init();

    // Check URL hash for initial tab routing
    window.addEventListener("hashchange", () => this.handleHashRoute());
    this.handleHashRoute();
  },

  bindEvents() {
    // Search input
    const searchInput = document.getElementById("eventSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.currentSearchQuery = e.target.value.toLowerCase().trim();
        this.renderEvents();
      });
    }

    // Category filter pills
    const catPills = document.querySelectorAll(".category-pill");
    catPills.forEach(pill => {
      pill.addEventListener("click", () => {
        catPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        this.currentCategory = pill.getAttribute("data-category");
        this.renderEvents();
      });
    });

    // Availability filter
    const availFilter = document.getElementById("availabilityFilter");
    if (availFilter) {
      availFilter.addEventListener("change", (e) => {
        this.currentAvailabilityFilter = e.target.value;
        this.renderEvents();
      });
    }

    // Sort select
    const sortSelect = document.getElementById("sortEventsSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.renderEvents();
      });
    }

    // Registration Form submission
    const regForm = document.getElementById("studentRegistrationForm");
    if (regForm) {
      regForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleRegistrationSubmit(regForm);
      });
    }

    // "Find My Tickets" search form
    const findTicketsForm = document.getElementById("findTicketsForm");
    if (findTicketsForm) {
      findTicketsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleFindTickets(findTicketsForm);
      });
    }

    // Print ticket button
    const printBtn = document.getElementById("printTicketBtn");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        TicketManager.printTicket();
      });
    }

    // Close modals on ESC or overlay click
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          this.closeAllModals();
        }
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAllModals();
      }
    });
  },

  handleHashRoute() {
    const hash = window.location.hash || "#events";
    if (hash === "#admin") {
      this.switchView("admin");
    } else if (hash === "#my-tickets") {
      this.switchView("tickets");
    } else {
      this.switchView("events");
    }
  },

  switchView(viewName) {
    const eventsView = document.getElementById("eventsSection");
    const adminView = document.getElementById("adminSection");
    const ticketsView = document.getElementById("myTicketsSection");
    const navLinks = document.querySelectorAll(".nav-link");

    // Hide all
    if (eventsView) eventsView.classList.add("d-none");
    if (adminView) adminView.classList.add("d-none");
    if (ticketsView) ticketsView.classList.add("d-none");
    navLinks.forEach(l => l.classList.remove("active"));

    if (viewName === "admin") {
      if (adminView) adminView.classList.remove("d-none");
      const link = document.querySelector('[data-view="admin"]');
      if (link) link.classList.add("active");
      AdminManager.refreshAll();
      window.location.hash = "#admin";
    } else if (viewName === "tickets") {
      if (ticketsView) ticketsView.classList.remove("d-none");
      const link = document.querySelector('[data-view="tickets"]');
      if (link) link.classList.add("active");
      window.location.hash = "#my-tickets";
    } else {
      if (eventsView) eventsView.classList.remove("d-none");
      const link = document.querySelector('[data-view="events"]');
      if (link) link.classList.add("active");
      this.renderEvents();
      window.location.hash = "#events";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  renderEvents() {
    const grid = document.getElementById("eventsGrid");
    const emptyState = document.getElementById("emptyEventsState");
    const resultsCountEl = document.getElementById("eventsResultsCount");

    if (!grid) return;

    let events = StorageManager.getEvents();

    // 1. Filter by category
    if (this.currentCategory !== "All") {
      events = events.filter(e => e.category.toLowerCase() === this.currentCategory.toLowerCase());
    }

    // 2. Filter by search query
    if (this.currentSearchQuery) {
      events = events.filter(e => {
        const titleMatch = e.title.toLowerCase().includes(this.currentSearchQuery);
        const orgMatch = (e.organizer || "").toLowerCase().includes(this.currentSearchQuery);
        const venueMatch = (e.venue || "").toLowerCase().includes(this.currentSearchQuery);
        const descMatch = (e.description || "").toLowerCase().includes(this.currentSearchQuery);
        const tagMatch = (e.tags || []).some(t => t.toLowerCase().includes(this.currentSearchQuery));
        return titleMatch || orgMatch || venueMatch || descMatch || tagMatch;
      });
    }

    // 3. Filter by availability
    if (this.currentAvailabilityFilter === "available") {
      events = events.filter(e => Number(e.registeredCount) < Number(e.capacity));
    } else if (this.currentAvailabilityFilter === "soldout") {
      events = events.filter(e => Number(e.registeredCount) >= Number(e.capacity));
    }

    // 4. Sort
    events.sort((a, b) => {
      if (this.currentSort === "date-asc") {
        return new Date(a.date) - new Date(b.date);
      } else if (this.currentSort === "date-desc") {
        return new Date(b.date) - new Date(a.date);
      } else if (this.currentSort === "seats-available") {
        const leftA = Number(a.capacity) - Number(a.registeredCount);
        const leftB = Number(b.capacity) - Number(b.registeredCount);
        return leftB - leftA;
      } else if (this.currentSort === "popularity") {
        return Number(b.registeredCount) - Number(a.registeredCount);
      }
      return 0;
    });

    if (resultsCountEl) {
      resultsCountEl.textContent = `Showing ${events.length} campus event${events.length === 1 ? '' : 's'}`;
    }

    if (events.length === 0) {
      grid.innerHTML = "";
      if (emptyState) emptyState.classList.remove("d-none");
      return;
    }

    if (emptyState) emptyState.classList.add("d-none");

    grid.innerHTML = events.map(evt => this.createEventCardHTML(evt)).join("");
  },

  createEventCardHTML(evt) {
    const booked = Number(evt.registeredCount) || 0;
    const capacity = Number(evt.capacity) || 0;
    const remainingSeats = Math.max(0, capacity - booked);
    const isFull = remainingSeats === 0;
    const pct = capacity > 0 ? Math.min(100, Math.round((booked / capacity) * 100)) : 0;

    // Badge indicator
    let seatBadge = "";
    let progressColor = "bg-primary";
    if (isFull) {
      seatBadge = `<span class="event-badge badge-sold-out"><i class="fas fa-lock"></i> HOUSEFULL</span>`;
      progressColor = "bg-danger";
    } else if (remainingSeats <= 15) {
      seatBadge = `<span class="event-badge badge-hurry"><i class="fas fa-fire"></i> ONLY ${remainingSeats} SEATS LEFT!</span>`;
      progressColor = "bg-warning";
    } else {
      seatBadge = `<span class="event-badge badge-open"><i class="fas fa-check-circle"></i> ${remainingSeats} SEATS AVAILABLE</span>`;
      progressColor = "bg-success";
    }

    const formattedDate = new Date(evt.date).toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    return `
      <div class="event-card ${isFull ? 'event-card-full' : ''}">
        <div class="event-card-img-wrapper">
          <img src="${evt.bannerImage}" alt="${TicketManager.escapeHTML(evt.title)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'" />
          <span class="category-tag-floating">${TicketManager.escapeHTML(evt.category)}</span>
          ${seatBadge}
        </div>

        <div class="event-card-body">
          <div class="event-organizer-row">
            <i class="fas fa-user-tie"></i> ${TicketManager.escapeHTML(evt.organizer)}
          </div>

          <h3 class="event-title" title="${TicketManager.escapeHTML(evt.title)}">
            ${TicketManager.escapeHTML(evt.title)}
          </h3>

          <div class="event-meta-grid">
            <div class="meta-item">
              <i class="far fa-calendar-alt text-primary"></i>
              <span>${formattedDate}</span>
            </div>
            <div class="meta-item">
              <i class="far fa-clock text-primary"></i>
              <span>${TicketManager.escapeHTML(evt.time)}</span>
            </div>
            <div class="meta-item full-width">
              <i class="fas fa-map-marker-alt text-danger"></i>
              <span class="venue-text" title="${TicketManager.escapeHTML(evt.venue)}">${TicketManager.escapeHTML(evt.venue)}</span>
            </div>
          </div>

          <!-- Live Seat Availability Gauge -->
          <div class="live-seat-counter">
            <div class="seat-counter-header">
              <span class="seat-label"><i class="fas fa-chair"></i> Live Capacity</span>
              <span class="seat-numbers">
                <strong>${booked}</strong> / ${capacity} booked
              </span>
            </div>
            <div class="seat-progress-track">
              <div class="seat-progress-fill ${progressColor}" style="width: ${pct}%"></div>
            </div>
            <div class="seat-status-subtext">
              ${isFull ? '<span class="text-danger fw-bold"><i class="fas fa-ban"></i> Over-registration locked</span>' : `<span class="text-muted">${remainingSeats} seat${remainingSeats === 1 ? '' : 's'} remaining</span>`}
              <span class="text-muted">${pct}% filled</span>
            </div>
          </div>

          <div class="event-card-actions">
            <button class="btn btn-outline" onclick="App.openEventDetails('${evt.id}')">
              <i class="fas fa-info-circle"></i> Details
            </button>
            <button class="btn ${isFull ? 'btn-disabled' : 'btn-primary'}" 
              ${isFull ? 'disabled' : ''} 
              onclick="App.openRegistrationModal('${evt.id}')">
              ${isFull ? '<i class="fas fa-lock"></i> Housefull' : '<i class="fas fa-ticket-alt"></i> Register Now'}
            </button>
          </div>
        </div>
      </div>
    `;
  },

  openEventDetails(eventId) {
    const event = StorageManager.getEventById(eventId);
    if (!event) return;

    const modal = document.getElementById("eventDetailsModal");
    const container = document.getElementById("eventDetailsContent");
    if (!modal || !container) return;

    const booked = Number(event.registeredCount) || 0;
    const capacity = Number(event.capacity) || 0;
    const remaining = Math.max(0, capacity - booked);
    const isFull = remaining === 0;

    container.innerHTML = `
      <div class="details-modal-header-hero">
        <img src="${event.bannerImage}" alt="${TicketManager.escapeHTML(event.title)}" onerror="this.src='https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'" />
        <div class="hero-overlay">
          <span class="category-tag-floating">${TicketManager.escapeHTML(event.category)}</span>
          <h2>${TicketManager.escapeHTML(event.title)}</h2>
          <p><i class="fas fa-users-cog"></i> Organized by: ${TicketManager.escapeHTML(event.organizer)}</p>
        </div>
      </div>

      <div class="details-modal-body">
        <div class="details-kpi-row">
          <div class="details-kpi">
            <i class="far fa-calendar-check"></i>
            <div>
              <span class="label">Date</span>
              <span class="val">${event.date}</span>
            </div>
          </div>
          <div class="details-kpi">
            <i class="far fa-clock"></i>
            <div>
              <span class="label">Schedule</span>
              <span class="val">${TicketManager.escapeHTML(event.time)}</span>
            </div>
          </div>
          <div class="details-kpi">
            <i class="fas fa-map-marker-alt"></i>
            <div>
              <span class="label">Venue</span>
              <span class="val">${TicketManager.escapeHTML(event.venue)}</span>
            </div>
          </div>
          <div class="details-kpi">
            <i class="fas fa-chair"></i>
            <div>
              <span class="label">Seat Status</span>
              <span class="val ${isFull ? 'text-danger' : 'text-success'}">${isFull ? 'Housefull' : `${remaining} Seats Left`}</span>
            </div>
          </div>
        </div>

        <div class="details-section">
          <h4><i class="fas fa-align-left"></i> About This Event</h4>
          <p>${TicketManager.escapeHTML(event.description)}</p>
        </div>

        <div class="details-section">
          <h4><i class="fas fa-user-graduate"></i> Eligibility Criteria</h4>
          <p>${TicketManager.escapeHTML(event.eligibility)}</p>
        </div>

        <div class="details-section">
          <h4><i class="fas fa-clipboard-list"></i> Guidelines & Instructions</h4>
          <ul class="rules-list">
            ${(event.rules || []).map(r => `<li><i class="fas fa-check-circle text-primary"></i> ${TicketManager.escapeHTML(r)}</li>`).join("")}
          </ul>
        </div>

        <div class="modal-footer-cta">
          <button class="btn btn-secondary" onclick="App.closeModal('eventDetailsModal')">Close</button>
          <button class="btn ${isFull ? 'btn-disabled' : 'btn-primary'}" 
            ${isFull ? 'disabled' : ''} 
            onclick="App.closeModal('eventDetailsModal'); App.openRegistrationModal('${event.id}')">
            ${isFull ? '<i class="fas fa-lock"></i> Registration Full' : '<i class="fas fa-ticket-alt"></i> Proceed to Register'}
          </button>
        </div>
      </div>
    `;

    this.openModal("eventDetailsModal");
  },

  openRegistrationModal(eventId) {
    const event = StorageManager.getEventById(eventId);
    if (!event) return;

    const remaining = Number(event.capacity) - Number(event.registeredCount);
    if (remaining <= 0) {
      this.showToast("Sorry! This event has reached full capacity.", "error");
      return;
    }

    this.selectedEventForReg = event;

    // Populate modal headers
    const titleEl = document.getElementById("regModalEventTitle");
    const metaEl = document.getElementById("regModalEventMeta");
    const seatsEl = document.getElementById("regModalRemainingSeats");

    if (titleEl) titleEl.textContent = event.title;
    if (metaEl) metaEl.innerHTML = `<i class="far fa-calendar-alt"></i> ${event.date} &bull; <i class="fas fa-map-marker-alt"></i> ${event.venue}`;
    if (seatsEl) seatsEl.innerHTML = `<strong>${remaining}</strong> seat${remaining === 1 ? '' : 's'} available before registration closes`;

    // Clear form
    const form = document.getElementById("studentRegistrationForm");
    if (form) form.reset();

    this.openModal("registrationModal");
  },

  handleRegistrationSubmit(form) {
    if (!this.selectedEventForReg) {
      this.showToast("No event selected.", "error");
      return;
    }

    const studentName = form.studentFullName.value.trim();
    const regNo = form.studentRegNo.value.trim();
    const email = form.studentEmail.value.trim();
    const department = form.studentDepartment.value;
    const year = form.studentYear.value;
    const phone = form.studentPhone.value.trim();

    if (!studentName || !regNo || !email || !department || !year) {
      this.showToast("Please complete all required fields.", "error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.showToast("Please enter a valid email address.", "error");
      return;
    }

    // Reg No validation (alphanumeric, min 6 characters)
    if (regNo.length < 5) {
      this.showToast("Please enter a valid Registration Number.", "error");
      return;
    }

    // Attempt booking via StorageManager
    const result = StorageManager.registerStudent(this.selectedEventForReg.id, {
      studentName,
      regNo,
      email,
      department,
      year,
      phone
    });

    if (!result.success) {
      this.showToast(result.message, "error");
      if (result.existingTicket) {
        // Show button to view existing ticket
        setTimeout(() => {
          if (confirm("Would you like to open your existing e-ticket pass now?")) {
            this.closeModal("registrationModal");
            this.showTicketModal(result.existingTicket, this.selectedEventForReg);
          }
        }, 300);
      }
      return;
    }

    // Success!
    this.showToast(result.message, "success");
    this.closeModal("registrationModal");
    this.renderEvents();
    AdminManager.refreshAll();

    // Show generated ticket pass modal immediately
    this.showTicketModal(result.ticket, result.event);
  },

  showTicketModal(registration, event) {
    const ticketContainer = document.getElementById("ticketModalContent");
    if (!ticketContainer) return;

    ticketContainer.innerHTML = TicketManager.renderTicket(registration, event);
    this.openModal("ticketModal");
  },

  handleFindTickets(form) {
    const regNo = form.findRegNo.value.trim();
    const resultsContainer = document.getElementById("myTicketsResults");
    if (!resultsContainer) return;

    if (!regNo) {
      this.showToast("Please enter your Registration Number.", "error");
      return;
    }

    const tickets = StorageManager.getRegistrationsByStudent(regNo);

    if (tickets.length === 0) {
      resultsContainer.innerHTML = `
        <div class="empty-state-card">
          <i class="fas fa-ticket-alt fa-3x text-muted mb-3"></i>
          <h4>No Registrations Found</h4>
          <p class="text-muted">No active event passes were found for Registration Number <strong>${TicketManager.escapeHTML(regNo)}</strong>.</p>
          <a href="#events" class="btn btn-primary mt-2" onclick="App.switchView('events')">
            <i class="fas fa-compass"></i> Explore Campus Events
          </a>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = `
      <div class="my-tickets-header">
        <h4><i class="fas fa-id-card text-primary"></i> Passes registered for ${TicketManager.escapeHTML(regNo)} (${tickets.length})</h4>
      </div>
      <div class="tickets-grid">
        ${tickets.map(t => {
          const event = StorageManager.getEventById(t.eventId) || {};
          return `
            <div class="my-ticket-summary-card">
              <div class="ticket-summary-badge"><i class="fas fa-check-circle"></i> CONFIRMED PASS</div>
              <h5>${TicketManager.escapeHTML(t.eventTitle)}</h5>
              <div class="ticket-summary-meta">
                <div><i class="far fa-calendar-alt"></i> ${TicketManager.escapeHTML(t.eventDate || event.date)} &bull; ${TicketManager.escapeHTML(t.eventTime || event.time)}</div>
                <div><i class="fas fa-map-marker-alt"></i> ${TicketManager.escapeHTML(t.eventVenue || event.venue)}</div>
                <div><i class="fas fa-barcode"></i> Booking Code: <strong>${TicketManager.escapeHTML(t.bookingId)}</strong></div>
              </div>
              <div class="ticket-summary-actions">
                <button class="btn btn-sm btn-primary" onclick='App.showTicketModal(${JSON.stringify(t)}, ${JSON.stringify(event)})'>
                  <i class="fas fa-qrcode"></i> View & Print E-Ticket
                </button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  },

  closeAllModals() {
    document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
    document.body.style.overflow = "";
  },

  showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast-item toast-${type}`;

    let icon = "fa-info-circle";
    if (type === "success") icon = "fa-check-circle";
    if (type === "error") icon = "fa-exclamation-circle";
    if (type === "warning") icon = "fa-exclamation-triangle";

    toast.innerHTML = `
      <i class="fas ${icon} toast-icon"></i>
      <span class="toast-text">${TicketManager.escapeHTML(message)}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
