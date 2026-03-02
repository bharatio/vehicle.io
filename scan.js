/* =========================================================
   Bharat.io – QR Scan Engine (FINAL)
   File: scan.js

   Purpose:
   - Read QR ID from URL
   - Check registration status
   - Show owner contact + profession
   - Handle inactive / invalid QR
========================================================= */

/* =========================
   CONFIGURATION
========================= */

/*
  STEP 1 (MANDATORY):
  Google Sheet ko "Publish to web" karo (CSV)

  Google Sheet columns (ORDER MAT BADALNA):
  A = QR_ID
  B = Vehicle_Number
  C = Mobile
  D = Email
  E = Profession
  F = Work_Description
  G = Consent (YES)

  Publish link yahan paste karo
*/

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/YOUR_SHEET_ID/pub?output=csv";

/* =========================
   HELPERS
========================= */

// URL se query param nikaalna
function getParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// CSV text ko rows me convert
function parseCSV(text) {
  return text
    .trim()
    .split("\n")
    .map(row =>
      row
        .split(",")
        .map(cell =>
          cell
            .replace(/^"|"$/g, "")
            .trim()
        )
    );
}

// Basic HTML safety
function escapeHTML(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* =========================
   MAIN LOGIC
========================= */

const container = document.querySelector(".container");
const qrId = getParam("id");

// QR ID missing
if (!qrId) {
  container.innerHTML = `
    <h2>Invalid QR Code</h2>
    <p>
      This QR code link appears to be incomplete or invalid.
      Please check the sticker and try again.
    </p>
  `;
  throw new Error("QR ID missing");
}

// Fetch Google Sheet CSV
fetch(SHEET_CSV_URL)
  .then(response => response.text())
  .then(csvText => {
    const rows = parseCSV(csvText);
    const data = rows.slice(1); // header hata diya

    // QR ID match
    const record = data.find(row => row[0] === qrId);

    // QR not registered
    if (!record) {
      container.innerHTML = `
        <h2>QR Not Registered</h2>
        <p>
          This QR sticker is not yet connected to a vehicle owner.
          Please ask the owner to register the QR on Bharat.io.
        </p>

        <a href="register.html" class="btn-primary">
          Register This QR
        </a>
      `;
      return;
    }

    // Extract data
    const vehicle = escapeHTML(record[1]);
    const phone = escapeHTML(record[2]);
    const email = escapeHTML(record[3]);
    const profession = escapeHTML(record[4]);
    const work = escapeHTML(record[5]);
    const consent = (record[6] || "").toUpperCase();

    // Consent check
    if (consent !== "YES") {
      container.innerHTML = `
        <h2>Access Disabled</h2>
        <p>
          The vehicle owner has not enabled public contact for this QR.
          Please use alternative methods if this is an emergency.
        </p>
      `;
      return;
    }

    // Build UI
    container.innerHTML = `
      <h2>Vehicle Owner Contact</h2>

      <div class="owner-card">

        ${vehicle ? `
          <div class="info-row">
            <span class="label">Vehicle Number</span>
            <span class="value">${vehicle}</span>
          </div>
        ` : ""}

        ${profession ? `
          <div class="info-row">
            <span class="label">Profession</span>
            <span class="value">${profession}</span>
          </div>
        ` : ""}

        ${work ? `
          <div class="info-row">
            <span class="label">About</span>
            <span class="value">${work}</span>
          </div>
        ` : ""}

        <div class="action-buttons">
          ${phone ? `
            <a href="tel:${phone}" class="btn-primary full">
              📞 Call Vehicle Owner
            </a>
          ` : ""}

          ${phone ? `
            <a href="https://wa.me/${phone.replace(/\D/g, "")}" 
               class="btn-secondary full">
              💬 WhatsApp Message
            </a>
          ` : ""}

          ${email ? `
            <a href="mailto:${email}" class="btn-secondary full">
              ✉️ Email Owner
            </a>
          ` : ""}
        </div>

      </div>

      <p class="note">
        This contact information is shared only for parking assistance
        or emergency situations. Misuse is discouraged.
      </p>
    `;
  })
  .catch(error => {
    console.error(error);
    container.innerHTML = `
      <h2>Something Went Wrong</h2>
      <p>
        We were unable to load vehicle details at this time.
        Please try again later.
      </p>
    `;
  });
