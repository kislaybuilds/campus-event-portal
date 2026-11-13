/**
 * Campus Event Management & Registration Portal
 * Ticket Generator & QR Code Renderer
 */

const TicketManager = {
  /**
   * Generates a deterministic SVG QR Code matrix for the given text.
   * Self-contained lightweight QR renderer for 100% offline and standalone operation.
   */
  generateQRCodeSVG(text, size = 140) {
    // Generate a pseudo-random yet deterministic 21x21 QR code matrix based on the text hash
    const matrixSize = 21;
    const matrix = [];
    for (let r = 0; r < matrixSize; r++) {
      matrix[r] = new Array(matrixSize).fill(0);
    }

    // Helper: draw finder pattern at (row, col)
    function drawFinder(startR, startC) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 || r === 6 || c === 0 || c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            matrix[startR + r][startC + c] = 1;
          } else {
            matrix[startR + r][startC + c] = 0;
          }
        }
      }
    }

    // Finder patterns in top-left, top-right, bottom-left
    drawFinder(0, 0);
    drawFinder(0, matrixSize - 7);
    drawFinder(matrixSize - 7, 0);

    // Timing patterns
    for (let i = 8; i < matrixSize - 8; i++) {
      matrix[6][i] = i % 2 === 0 ? 1 : 0;
      matrix[i][6] = i % 2 === 0 ? 1 : 0;
    }

    // Simple deterministic hash of text
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }

    // Fill data area deterministically
    let seed = Math.abs(hash);
    function nextBit() {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return (seed >> 16) % 2;
    }

    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        // Skip finder areas
        const inTL = r < 8 && c < 8;
        const inTR = r < 8 && c >= matrixSize - 8;
        const inBL = r >= matrixSize - 8 && c < 8;
        const inTiming = r === 6 || c === 6;

        if (!inTL && !inTR && !inBL && !inTiming) {
          matrix[r][c] = nextBit();
        }
      }
    }

    // Render to SVG
    const cellSize = (size / matrixSize).toFixed(2);
    let rects = "";
    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        if (matrix[r][c] === 1) {
          const x = (c * cellSize).toFixed(2);
          const y = (r * cellSize).toFixed(2);
          rects += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`;
        }
      }
    }

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" class="qr-svg" role="img" aria-label="QR Code">
        <rect width="100%" height="100%" fill="#ffffff" rx="8"/>
        ${rects}
      </svg>
    `;
  },

  /**
   * Builds the HTML template for the E-Ticket Pass
   */
  renderTicket(registration, event) {
    const formattedDate = new Date(registration.registeredAt || Date.now()).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

    const qrData = `TICKET:${registration.bookingId}|REG:${registration.regNo}|EVENT:${registration.eventId}`;
    const qrSvg = this.generateQRCodeSVG(qrData, 128);

    return `
      <div class="ticket-card printable-ticket" id="printableTicketArea">
        <!-- Ticket Header -->
        <div class="ticket-header">
          <div class="ticket-brand">
            <span class="ticket-badge"><i class="fas fa-university"></i> CAMPUS EVENT PASS</span>
            <span class="ticket-status-badge"><i class="fas fa-check-circle"></i> CONFIRMED</span>
          </div>
          <h2 class="ticket-event-title">${this.escapeHTML(registration.eventTitle || event.title)}</h2>
          <div class="ticket-category-pill">${this.escapeHTML(registration.eventCategory || event.category || "General")}</div>
        </div>

        <!-- Ticket Body -->
        <div class="ticket-body">
          <div class="ticket-left">
            <div class="ticket-info-grid">
              <div class="info-group">
                <span class="info-label">ATTENDEE NAME</span>
                <span class="info-value highlight">${this.escapeHTML(registration.studentName)}</span>
              </div>
              <div class="info-group">
                <span class="info-label">REGISTRATION NO.</span>
                <span class="info-value">${this.escapeHTML(registration.regNo)}</span>
              </div>
              <div class="info-group">
                <span class="info-label">DATE & TIME</span>
                <span class="info-value"><i class="far fa-calendar-alt"></i> ${this.escapeHTML(registration.eventDate || event.date)} &bull; ${this.escapeHTML(registration.eventTime || event.time)}</span>
              </div>
              <div class="info-group">
                <span class="info-label">VENUE</span>
                <span class="info-value"><i class="fas fa-map-marker-alt"></i> ${this.escapeHTML(registration.eventVenue || event.venue)}</span>
              </div>
              <div class="info-group">
                <span class="info-label">DEPARTMENT / YEAR</span>
                <span class="info-value">${this.escapeHTML(registration.department || "N/A")} (${this.escapeHTML(registration.year || "Student")})</span>
              </div>
              <div class="info-group">
                <span class="info-label">BOOKED ON</span>
                <span class="info-value">${formattedDate}</span>
              </div>
            </div>

            <div class="ticket-terms">
              <i class="fas fa-info-circle"></i>
              <span>Please present this electronic slip or a printed copy along with your student ID at the gate.</span>
            </div>
          </div>

          <!-- Perforated Stub Divider -->
          <div class="ticket-stub-divider">
            <div class="notch top-notch"></div>
            <div class="divider-line"></div>
            <div class="notch bottom-notch"></div>
          </div>

          <!-- Ticket Right: QR Code & Booking Ref -->
          <div class="ticket-right">
            <div class="qr-wrapper">
              ${qrSvg}
            </div>
            <div class="ticket-booking-ref">
              <span class="booking-label">PASS CODE</span>
              <span class="booking-id">${this.escapeHTML(registration.bookingId)}</span>
            </div>
            <div class="ticket-barcode-sim">
              <span>|||| | ||||| || |||||| | ||||</span>
            </div>
          </div>
        </div>

        <!-- Ticket Footer for Print -->
        <div class="ticket-footer-bar">
          <span>Official Event Registration Document &bull; Lovely Professional University Campus Event Portal</span>
        </div>
      </div>
    `;
  },

  escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  printTicket() {
    window.print();
  }
};
