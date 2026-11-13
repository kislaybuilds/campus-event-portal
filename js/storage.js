/**
 * Campus Event Management & Registration Portal
 * Storage & Data Management Layer (localStorage)
 */

const STORAGE_KEYS = {
  EVENTS: "CAMPUS_EVENTS_V1",
  REGISTRATIONS: "CAMPUS_REGISTRATIONS_V1",
  CURRENT_USER: "CAMPUS_CURRENT_USER_V1"
};

const StorageManager = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(SEED_EVENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(SEED_REGISTRATIONS));
    }
  },

  getEvents() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS)) || [];
    } catch (e) {
      console.error("Error reading events from localStorage", e);
      return SEED_EVENTS;
    }
  },

  getEventById(id) {
    const events = this.getEvents();
    return events.find(e => e.id === id) || null;
  },

  saveEvents(events) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },

  getAllRegistrations() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) || [];
    } catch (e) {
      console.error("Error reading registrations from localStorage", e);
      return [];
    }
  },

  saveRegistrations(registrations) {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
  },

  getRegistrationsByEvent(eventId) {
    const all = this.getAllRegistrations();
    return all.filter(r => r.eventId === eventId);
  },

  getRegistrationsByStudent(regNo) {
    const all = this.getAllRegistrations();
    return all.filter(r => r.regNo && r.regNo.trim().toLowerCase() === regNo.trim().toLowerCase());
  },

  /**
   * Register a student for an event
   * - Prevents over-registration (atomic check)
   * - Prevents duplicate booking for the same registration number
   * - Generates unique ticket/booking ID
   */
  registerStudent(eventId, studentData) {
    const events = this.getEvents();
    const eventIndex = events.findIndex(e => e.id === eventId);

    if (eventIndex === -1) {
      return { success: false, message: "Event not found." };
    }

    const event = events[eventIndex];
    const registeredCount = Number(event.registeredCount) || 0;
    const capacity = Number(event.capacity) || 0;

    // Over-registration check
    if (registeredCount >= capacity) {
      return {
        success: false,
        message: "Registration Closed: This event has already reached maximum capacity (Housefull)."
      };
    }

    // Duplicate registration check
    const existingRegistrations = this.getAllRegistrations();
    const cleanRegNo = studentData.regNo.trim().toUpperCase();
    const duplicate = existingRegistrations.find(
      r => r.eventId === eventId && r.regNo.trim().toUpperCase() === cleanRegNo
    );

    if (duplicate) {
      return {
        success: false,
        message: `Student with Reg No. ${cleanRegNo} is already registered for this event. Ticket ID: ${duplicate.bookingId}`,
        existingTicket: duplicate
      };
    }

    // Generate unique Ticket ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `TKT-${new Date().getFullYear()}-${randomSuffix}`;

    const newRegistration = {
      bookingId,
      eventId: event.id,
      eventTitle: event.title,
      eventCategory: event.category,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      studentName: studentData.studentName.trim(),
      regNo: cleanRegNo,
      email: studentData.email.trim(),
      department: studentData.department,
      year: studentData.year,
      phone: studentData.phone ? studentData.phone.trim() : "N/A",
      registeredAt: new Date().toISOString()
    };

    // Update event seat count
    events[eventIndex].registeredCount = registeredCount + 1;
    this.saveEvents(events);

    // Save registration
    existingRegistrations.push(newRegistration);
    this.saveRegistrations(existingRegistrations);

    return {
      success: true,
      message: "Registration successful! Your e-ticket pass has been generated.",
      ticket: newRegistration,
      event: events[eventIndex]
    };
  },

  cancelRegistration(bookingId) {
    const all = this.getAllRegistrations();
    const targetIndex = all.findIndex(r => r.bookingId === bookingId);

    if (targetIndex === -1) {
      return { success: false, message: "Registration not found." };
    }

    const target = all[targetIndex];
    const events = this.getEvents();
    const eventIndex = events.findIndex(e => e.id === target.eventId);

    if (eventIndex !== -1 && events[eventIndex].registeredCount > 0) {
      events[eventIndex].registeredCount -= 1;
      this.saveEvents(events);
    }

    all.splice(targetIndex, 1);
    this.saveRegistrations(all);

    return { success: true, message: "Registration cancelled successfully." };
  },

  createEvent(eventData) {
    const events = this.getEvents();
    const id = "evt-" + Date.now().toString().slice(-6);

    const newEvent = {
      id,
      title: eventData.title.trim(),
      category: eventData.category || "General",
      organizer: eventData.organizer ? eventData.organizer.trim() : "Campus Organizing Committee",
      date: eventData.date,
      time: eventData.time || "10:00 AM - 05:00 PM",
      venue: eventData.venue ? eventData.venue.trim() : "Main Campus",
      capacity: parseInt(eventData.capacity, 10) || 100,
      registeredCount: 0,
      description: eventData.description ? eventData.description.trim() : "Join us for an exciting campus experience.",
      eligibility: eventData.eligibility ? eventData.eligibility.trim() : "Open to all students.",
      bannerImage: eventData.bannerImage && eventData.bannerImage.trim() !== ""
        ? eventData.bannerImage.trim()
        : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
      tags: eventData.tags ? eventData.tags.split(",").map(t => t.trim()).filter(Boolean) : [eventData.category],
      rules: [
        "Carry valid University Identity Card.",
        "Arrive at least 20 minutes before the scheduled start time.",
        "Follow campus safety and decorum guidelines."
      ]
    };

    events.unshift(newEvent);
    this.saveEvents(events);

    return { success: true, event: newEvent };
  },

  deleteEvent(eventId) {
    let events = this.getEvents();
    const exists = events.some(e => e.id === eventId);
    if (!exists) {
      return { success: false, message: "Event not found." };
    }

    events = events.filter(e => e.id !== eventId);
    this.saveEvents(events);

    // Also remove associated registrations
    let registrations = this.getAllRegistrations();
    registrations = registrations.filter(r => r.eventId !== eventId);
    this.saveRegistrations(registrations);

    return { success: true, message: "Event deleted successfully." };
  },

  getStats() {
    const events = this.getEvents();
    const registrations = this.getAllRegistrations();

    const totalEvents = events.length;
    const totalCapacity = events.reduce((sum, e) => sum + (Number(e.capacity) || 0), 0);
    const totalRegistered = events.reduce((sum, e) => sum + (Number(e.registeredCount) || 0), 0);
    const soldOutCount = events.filter(e => Number(e.registeredCount) >= Number(e.capacity)).length;
    const overallOccupancy = totalCapacity > 0 ? Math.round((totalRegistered / totalCapacity) * 100) : 0;

    let mostPopularEvent = null;
    if (events.length > 0) {
      mostPopularEvent = [...events].sort((a, b) => (b.registeredCount || 0) - (a.registeredCount || 0))[0];
    }

    return {
      totalEvents,
      totalCapacity,
      totalRegistered,
      soldOutCount,
      overallOccupancy,
      mostPopularEvent
    };
  },

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(SEED_EVENTS));
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(SEED_REGISTRATIONS));
    return { success: true, message: "Portal reset to initial demo dataset." };
  }
};
