/* =========================================================
   Bharat.io – QR Scan Engine (FINAL STABLE)
   File: scan.js
========================================================= */


/* =========================
   CONFIGURATION
========================= */

const SHEET_API =
"https://opensheet.elk.sh/12OsU8oViB-MztQLh1Ly7zSCPOaCAPBWb45TtUpIcg2c/Form%20Responses%201";


/* =========================
   HELPERS
========================= */

function getParam(name){

const params = new URLSearchParams(window.location.search);

return params.get(name);

}


function escapeHTML(text){

if(!text) return "";

return text
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")

}



/* =========================
   PAGE ELEMENT
========================= */

const container = document.querySelector(".container");


/* =========================
   GET QR ID
========================= */

const qrId = getParam("id");


if(!qrId){

container.innerHTML = `

<h2>Invalid QR Code</h2>

<p>
This QR code link appears incomplete.
Please scan the sticker again.
</p>

`;

throw new Error("QR ID missing");

}



/* =========================
   FETCH SHEET DATA
========================= */

fetch(SHEET_API)

.then(response => response.json())

.then(data =>{


/* =========================
   FIND USER
========================= */

const record = data.find(

row => String(row["Sticker ID"]) === String(qrId)

);



/* =========================
   NOT REGISTERED
========================= */

if(!record){

container.innerHTML = `

<h2>QR Not Registered</h2>

<p>

This QR sticker is not connected
to any vehicle owner yet.

</p>

<a href="register.html" class="btn-primary">
Register This QR
</a>

`;

return;

}



/* =========================
   READ DATA
========================= */

const vehicle =
escapeHTML(record["Vehicle Number"]);

const phone =
escapeHTML(record["Mobile Number"]);

const profession =
escapeHTML(record["Profession / Business Title"]);

const email =
escapeHTML(record["Email (Optional)"]);

const work =
escapeHTML(record["Work Description (Max 30–40 words)"]);

const consent =
escapeHTML(record["Consent (Required)"]);



/* =========================
   CONSENT CHECK
========================= */

if(!consent.toLowerCase().includes("agree")){

container.innerHTML = `

<h2>Access Disabled</h2>

<p>

The vehicle owner has not enabled
public contact for this QR.

</p>

`;

return;

}



/* =========================
   BUILD UI
========================= */

container.innerHTML = `

<h2>Owner Information</h2>

<div class="owner-card">


<div class="info-row">

<span class="label">
Vehicle Number
</span>

<span class="value">
${vehicle}
</span>

</div>


${profession ? `

<div class="info-row">

<span class="label">
Profession
</span>

<span class="value">
${profession}
</span>

</div>

` : ""}


${work ? `

<div class="info-row">

<span class="label">
About
</span>

<span class="value">
${work}
</span>

</div>

` : ""}


<div class="action-buttons">


<a href="tel:${phone}"

class="btn-primary full">

📞 Call Vehicle Owner

</a>


<a href="https://wa.me/${phone.replace(/\D/g,"")}"

class="btn-secondary full">

💬 WhatsApp Message

</a>


${email ? `

<a href="mailto:${email}"

class="btn-secondary full">

✉ Email Owner

</a>

` : ""}


</div>

</div>


<p class="note">

⚠ This system must not be used
for promotional calls or spam.

</p>

`;

})


.catch(error =>{


console.error(error);


container.innerHTML = `

<h2>System Error</h2>

<p>

Unable to load vehicle details.

Please try again later.

</p>

`;

});
