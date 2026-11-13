/**
 * Campus Event Management & Registration Portal
 * Organizer / Admin Dashboard Controller
 */

const AdminManager = {
  activeViewEventId: null,

  init() {
    this.renderStats();
    this.renderEventsTable();
    this.bindEvents();
  },

  bindEvents() {
    // New Event Form Submit
    const createForm = document.getElementById("createEventForm");
    if (createForm) {
      createForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleCreateEvent(createForm);
      });
    }

    // Export CSV Button
    const exportBtn = document.getElementById("exportAttendeesBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        if (this.activeViewEventId) {
          this.exportAttendeesCSV(this.activeViewEventId);
        }
      });
    }

    // Reset Demo Data
    const resetBtn = document.getElementById("resetDemoDataBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to reset all portal data to the initial demonstration state?")) {
          StorageManager.resetToDefaults();
          App.showToast("Portal reset to initial seed data.", "info");
          this.refreshAll();
          App.renderEvents();
        }
      });
    }
  },

  refreshAll() {
    this.renderStats();
    this.renderEventsTable();
  },

  renderStats() {
    const stats = StorageManager.getStats();

    const totalEventsEl = document.getElementById("statTotalEvents");
    const totalRegsEl = document.getElementById("statTotalRegistrations");
    const totalCapacityEl = document.getElementById("statTotalCapacity");
    const occupancyEl = document.getElementById("statOccupancyRate");
    const soldOutEl = document.getElementById("statSoldOutEvents");

    if (totalEventsEl) totalEventsEl.textContent = stats.totalEvents;
    if (totalRegsEl) totalRegsEl.textContent = stats.totalRegistered;
    if (totalCapacityEl) totalCapacityEl.textContent = stats.totalCapacity;
    if (occupancyEl) occupancyEl.textContent = `${stats.overallOccupancy}%`;
    if (soldOutEl) soldOutEl.textContent = stats.soldOutCount;
  },

  renderEventsTable() {
    const tbody = document.getElementById("adminEventsTableBody");
    if (!tbody) return;

    const events = StorageManager.getEvents();
    if (events.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted" style="padding: 2rem;">
            No campus events created yet. Click "+ Create New Event" to get started.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = events.map(evt => {
      const booked = Number(evt.registeredCount) || 0;
      const capacity = Number(evt.capacity) || 0;
      const isFull = booked >= capacity;
      const pct = capacity > 0 ? Math.min(100, Math.round((booked / capacity) * 100)) : 0;

      let statusBadge = "";
      if (isFull) {
        statusBadge = `<span class="badge badge-danger"><i class="fas fa-lock"></i> Housefull (100%)</span>`;
      } else if (pct >= 85) {
        statusBadge = `<span class="badge badge-warning"><i class="fas fa-fire"></i> Fast Filling (${pct}%)</span>`;
      } else {
        statusBadge = `<span class="badge badge-success"><i class="fas fa-check"></i> Open (${pct}%)</span>`;
      }

      return `
        <tr>
          <td>
            <div class="fw-bold">${this.escapeHTML(evt.title)}</div>
            <small class="text-muted"><i class="fas fa-tag"></i> ${this.escapeHTML(evt.category)} &bull; ID: ${evt.id}</small>
          </td>
          <td>
            <div>${this.escapeHTML(evt.date)}</div>
            <small class="text-muted">${this.escapeHTML(evt.time)}</small>
          </td>
          <td>
            <span class="venue-cell"><i class="fas fa-map-marker-alt"></i> ${this.escapeHTML(evt.venue)}</span>
          </td>
          <td>
            <div class="seat-progress-sm">
              <div class="seat-progress-bar ${isFull ? 'bg-danger' : pct >= 85 ? 'bg-warning' : 'bg-primary'}" style="width: ${pct}%"></div>
            </div>
            <small class="fw-bold">${booked} / ${capacity} seats (${capacity - booked} left)</small>
          </td>
          <td>${statusBadge}</td>
          <td>
            <div class="action-btn-group">
              <button class="btn btn-sm btn-outline-primary" onclick="AdminManager.openAttendeesModal('${evt.id}')" title="View Registered Attendees">
                <i class="fas fa-users"></i> Attendees (${booked})
              </button>
              <button class="btn btn-sm btn-outline-danger" onclick="AdminManager.handleDeleteEvent('${evt.id}', '${this.escapeHTML(evt.title)}')" title="Delete Event">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  handleCreateEvent(form) {
    const title = form.eventTitle.value.trim();
    const category = form.eventCategory.value;
    const organizer = form.eventOrganizer.value.trim();
    const date = form.eventDate.value;
    const time = form.eventTime.value.trim();
    const venue = form.eventVenue.value.trim();
    const capacity = parseInt(form.eventCapacity.value, 10);
    const description = form.eventDescription.value.trim();
    const eligibility = form.eventEligibility.value.trim();
    const bannerImage = form.eventBannerUrl.value.trim();
    const tags = form.eventTags.value.trim();

    if (!title || !date || !venue || isNaN(capacity) || capacity <= 0) {
      App.showToast("Please fill in all mandatory fields with valid values.", "error");
      return;
    }

    const result = StorageManager.createEvent({
      title,
      category,
      organizer,
      date,
      time,
      venue,
      capacity,
      description,
      eligibility,
      bannerImage,
      tags
    });

    if (result.success) {
      App.showToast(`Event "${title}" published successfully!`, "success");
      form.reset();
      App.closeModal("createEventModal");
      this.refreshAll();
      App.renderEvents();
    }
  },

  handleDeleteEvent(eventId, eventTitle) {
    if (confirm(`Are you sure you want to delete "${eventTitle}"? This will cancel all student bookings for this event.`)) {
      const res = StorageManager.deleteEvent(eventId);
      if (res.success) {
        App.showToast(`Event deleted.`, "info");
        this.refreshAll();
        App.renderEvents();
      }
    }
  },

  openAttendeesModal(eventId) {
    this.activeViewEventId = eventId;
    const event = StorageManager.getEventById(eventId);
    if (!event) return;

    const attendees = StorageManager.getRegistrationsByEvent(eventId);
    const modalTitle = document.getElementById("attendeesModalEventTitle");
    const attendeeCountBadge = document.getElementById("attendeesModalCount");
    const tbody = document.getElementById("attendeesListTableBody");

    if (modalTitle) modalTitle.textContent = event.title;
    if (attendeeCountBadge) attendeeCountBadge.textContent = `${attendees.length} / ${event.capacity} registered`;

    if (attendees.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted" style="padding: 2.5rem;">
            <i class="fas fa-user-clock fa-2x mb-2" style="display:block; opacity: 0.4;"></i>
            No students have registered for this event yet.
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = attendees.map((att, idx) => {
        const timeStr = new Date(att.registeredAt).toLocaleString("en-IN", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });

        return `
          <tr>
            <td>${idx + 1}</td>
            <td>
              <span class="badge badge-booking-code">${this.escapeHTML(att.bookingId)}</span>
            </td>
            <td>
              <div class="fw-bold">${this.escapeHTML(att.studentName)}</div>
              <small class="text-muted"><i class="fas fa-id-card"></i> Reg: ${this.escapeHTML(att.regNo)}</small>
            </td>
            <td>
              <div>${this.escapeHTML(att.email)}</div>
              <small class="text-muted"><i class="fas fa-phone-alt"></i> ${this.escapeHTML(att.phone)}</small>
            </td>
            <td>
              <div>${this.escapeHTML(att.department)}</div>
              <small class="text-muted">${this.escapeHTML(att.year)}</small>
            </td>
            <td>
              <div class="small text-muted">${timeStr}</div>
              <button class="btn btn-xs btn-outline-danger mt-1" onclick="AdminManager.cancelAttendeeRegistration('${att.bookingId}')" title="Cancel this student registration">
                <i class="fas fa-times"></i> Cancel
              </button>
            </td>
          </tr>
        `;
      }).join("");
    }

    App.openModal("attendeesModal");
  },

  cancelAttendeeRegistration(bookingId) {
    if (confirm(`Cancel booking ${bookingId} and restore seat?`)) {
      const res = StorageManager.cancelRegistration(bookingId);
      if (res.success) {
        App.showToast("Registration cancelled and seat restored.", "info");
        this.openAttendeesModal(this.activeViewEventId);
        this.refreshAll();
        App.renderEvents();
      }
    }
  },

  exportAttendeesCSV(eventId) {
    const event = StorageManager.getEventById(eventId);
    if (!event) return;

    const attendees = StorageManager.getRegistrationsByEvent(eventId);
    if (attendees.length === 0) {
      App.showToast("No attendees to export for this event.", "warning");
      return;
    }

    // Build CSV content
    const headers = ["S.No", "Ticket ID", "Student Name", "Registration Number", "Email", "Phone", "Department", "Academic Year", "Event Title", "Registered At"];
    const rows = attendees.map((att, idx) => [
      idx + 1,
      `"${att.bookingId}"`,
      `"${att.studentName.replace(/"/g, '""')}"`,
      `"${att.regNo}"`,
      `"${att.email}"`,
      `"${att.phone}"`,
      `"${att.department.replace(/"/g, '""')}"`,
      `"${att.year}"`,
      `"${event.title.replace(/"/g, '""')}"`,
      `"${att.registeredAt}"`
    ]);

    const csvString = [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const cleanFileName = event.title.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase().slice(0, 30);
    link.setAttribute("href", url);
    link.setAttribute("download", `Attendees_${cleanFileName}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    App.showToast("Attendee CSV roster downloaded successfully!", "success");
  },

  escapeHTML(str) {
    return TicketManager.escapeHTML(str);
  }
};
