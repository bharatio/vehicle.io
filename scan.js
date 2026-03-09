/* =========================================================
   Bharat.io – QR Scan Engine (Business Website Version)
   File: scan.js
   ========================================================= */


/* ===============================
   CONFIGURATION
================================ */

const SHEET_API =
"https://opensheet.elk.sh/12OsU8oViB-MztQLh1Ly7zSCPOaCAPBWb45TtUpIcg2c/Form%20Responses%201";


/* ===============================
   GLOBAL ELEMENTS
================================ */

const container = document.querySelector(".container");
const ownerContainer = document.getElementById("ownerData");


/* ===============================
   HELPERS
================================ */

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


function normalize(value){

if(!value) return "";
return String(value).trim();

}



/* ===============================
   LOADING UI
================================ */

function showLoading(){

ownerContainer.innerHTML = `

<div class="owner-card">

<h3>Loading Profile</h3>

<p>

Please wait while we retrieve the profile
information from Bharat.io database.

</p>

</div>

`;

}



/* ===============================
   ERROR UI
================================ */

function showError(){

ownerContainer.innerHTML = `

<div class="owner-card">

<h3>System Error</h3>

<p>

Unable to load profile information.

Please try again later.

</p>

</div>

`;

}



/* ===============================
   CONSENT BLOCK
================================ */

function showConsentBlocked(){

ownerContainer.innerHTML = `

<div class="owner-card">

<h3>Access Disabled</h3>

<p>

The user has disabled public contact access
for this QR profile.

</p>

</div>

`;

}



/* ===============================
   BUILD PROFILE
================================ */

function renderOwner(record){

/* ===============================
   BASIC DATA
================================ */

const vehicle = escapeHTML(record["Vehicle Number"]);
const phone = escapeHTML(record["Mobile Number"]);

const businessName = escapeHTML(record["Business Name (Optional)"]);
const profession = escapeHTML(record["Profession / Business Title"]);

const email = escapeHTML(record["Email (Optional)"]);

const work = escapeHTML(record["Work Description (Max 30–40 words)"]);
const services = escapeHTML(record["Services"]);

const website = record["Website Link (Optional)"];
const instagram = record["Instagram Profile Link (Optional)"];
const facebook = record["Facebook Page Link (Optional)"];

const photo = record["Business Photo Link (Optional)"];


/* ===============================
   PROFILE TYPE
================================ */

let title = "Vehicle Contact";

if(businessName || services || work){

title = businessName || "Business Profile";

}



/* ===============================
   BUILD HTML
================================ */

ownerContainer.innerHTML = `

<div class="owner-card">


<h2 class="company-title">

${title}

</h2>


${photo ? `

<img src="${photo}"

class="business-photo">

` : ""}


<div class="info-row">

<span class="label">Vehicle Number</span>

<span class="value">${vehicle}</span>

</div>


${profession ? `

<div class="profile-block">

<span class="label">Profession</span>

<p class="profile-text">${profession}</p>

</div>

` : ""}


${work ? `

<div class="profile-block">

<span class="label">About</span>

<p class="profile-text">${work}</p>

</div>

` : ""}


${services ? `

<div class="profile-block">

<span class="label">Services</span>

<p class="profile-text">${services}</p>

</div>

` : ""}


<div class="action-buttons">


${phone ? `

<a href="tel:${phone}"

class="btn-primary full">

📞 Call

</a>

` : ""}


${phone ? `

<a href="https://wa.me/${phone.replace(/\D/g,"")}"

class="btn-secondary full">

💬 WhatsApp

</a>

` : ""}


${email ? `

<a href="mailto:${email}"

class="btn-secondary full">

✉ Email

</a>

` : ""}


${website ? `

<a href="${website}"

target="_blank"

class="btn-secondary full">

🌐 Website

</a>

` : ""}


${instagram ? `

<a href="${instagram}"

target="_blank"

class="btn-secondary full">

📷 Instagram

</a>

` : ""}


${facebook ? `

<a href="${facebook}"

target="_blank"

class="btn-secondary full">

👍 Facebook

</a>

` : ""}


</div>


</div>


<p class="note">

This profile is provided through Bharat.io.

Please use responsibly for genuine communication only.

</p>

`;

document.getElementById("orderBtn").style.display = "block";

}



/* ===============================
   MAIN
================================ */

function initQR(){

const qrId = normalize(getParam("id"));


if(!qrId){

container.innerHTML = `

<h2>Invalid QR Code</h2>

<p>

This QR link appears incomplete.

Please scan the sticker again.

</p>

`;

return;

}


showLoading();


fetch(SHEET_API)

.then(res => res.json())

.then(data =>{

const record = data.find(

row => normalize(row["Sticker ID"]) === qrId

);


if(!record){

window.location.href =
"register.html?id=" + encodeURIComponent(qrId);

return;

}


const consent = normalize(record["Consent (Required)"]).toLowerCase();


if(!consent.includes("agree")){

showConsentBlocked();
return;

}


renderOwner(record);


})

.catch(error =>{

console.error(error);
showError();

});

}



/* ===============================
   INIT
================================ */

document.addEventListener(

"DOMContentLoaded",

initQR

);
