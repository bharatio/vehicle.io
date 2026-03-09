/* =========================================================
   Bharat.io – QR Scan Engine (Business Website Version)
========================================================= */

const SHEET_API =
"https://opensheet.elk.sh/12OsU8oViB-MztQLh1Ly7zSCPOaCAPBWb45TtUpIcg2c/Form%20Responses%201";


const container = document.querySelector(".container");
const ownerContainer = document.getElementById("ownerData");


function getParam(name){
const params = new URLSearchParams(window.location.search);
return params.get(name);
}

function normalize(v){
if(!v) return "";
return String(v).trim();
}

function escapeHTML(text){
if(!text) return "";
return text
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;");
}


/* ================= LOADING ================= */

function showLoading(){

ownerContainer.innerHTML = `

<div class="owner-card">

<h3>Loading Profile</h3>

<p>Please wait while we retrieve the profile information.</p>

</div>

`;

}


/* ================= ERROR ================= */

function showError(){

ownerContainer.innerHTML = `

<div class="owner-card">

<h3>System Error</h3>

<p>Unable to load profile.</p>

</div>

`;

}


/* ================= OWNER UI ================= */

function renderOwner(record){

const vehicle = escapeHTML(record["Vehicle Number"]);
const phone = escapeHTML(record["Mobile Number"]);
const profession = escapeHTML(record["Profession / Business Title"]);
const about = escapeHTML(record["Work Description (Max 30–40 words)"]);

const company = escapeHTML(record["Business Name"]);
const services = escapeHTML(record["Services"]);
const website = escapeHTML(record["Business Website"]);
const instagram = escapeHTML(record["Instagram Link"]);
const facebook = escapeHTML(record["Facebook Link"]);
const map = escapeHTML(record["Google Maps"]);
const photo = escapeHTML(record["Business Photo"]);
const email = escapeHTML(record["Email (Optional)"]);


/* ================= VEHICLE PROFILE ================= */

if(!company){

ownerContainer.innerHTML = `

<div class="owner-card">

<h3>Vehicle Contact</h3>

<div class="info-row">
<span class="label">Vehicle</span>
<span class="value">${vehicle}</span>
</div>

${profession ? `
<div class="profile-block">
<span class="label">Profession</span>
<p class="profile-text">${profession}</p>
</div>
` : ""}

${about ? `
<div class="profile-block">
<span class="label">About</span>
<p class="profile-text">${about}</p>
</div>
` : ""}

<div class="action-buttons">

${phone ? `
<a href="tel:${phone}" class="btn-primary full">📞 Call</a>
` : ""}

${phone ? `
<a href="https://wa.me/${phone.replace(/\D/g,"")}" class="btn-secondary full">💬 WhatsApp</a>
` : ""}

${email ? `
<a href="mailto:${email}" class="btn-secondary full">✉ Email</a>
` : ""}

</div>

</div>

`;

return;

}


/* ================= BUSINESS WEBSITE ================= */

ownerContainer.innerHTML = `

<div class="profile-card">

${photo ? `
<img src="${photo}" style="width:100%;border-radius:14px;margin-bottom:20px;">
` : ""}

<div class="profile-header">

<div class="profile-name">${company}</div>

<div class="profile-title">${profession || ""}</div>

</div>

${about ? `
<div class="profile-about">

<h4>About</h4>

<p>${about}</p>

</div>
` : ""}


${services ? `
<div class="profile-about">

<h4>Services</h4>

<p>${services}</p>

</div>
` : ""}


<div class="profile-vehicle">

<span class="label">Vehicle</span>

<span class="value">${vehicle}</span>

</div>


<div class="action-buttons">

${phone ? `
<a href="tel:${phone}" class="btn-primary full">📞 Call</a>
` : ""}

${phone ? `
<a href="https://wa.me/${phone.replace(/\D/g,"")}" class="btn-secondary full">💬 WhatsApp</a>
` : ""}

${email ? `
<a href="mailto:${email}" class="btn-secondary full">✉ Email</a>
` : ""}

${website ? `
<a href="${website}" target="_blank" class="btn-secondary full">🌐 Website</a>
` : ""}

${instagram ? `
<a href="${instagram}" target="_blank" class="btn-secondary full">📸 Instagram</a>
` : ""}

${facebook ? `
<a href="${facebook}" target="_blank" class="btn-secondary full">👍 Facebook</a>
` : ""}

${map ? `
<a href="${map}" target="_blank" class="btn-secondary full">📍 Location</a>
` : ""}

</div>

</div>

`;

}


/* ================= MAIN ================= */

function initQR(){

const qrId = normalize(getParam("id"));

if(!qrId){

container.innerHTML = `

<h2>Invalid QR</h2>

<p>Please scan again.</p>

`;

return;

}

showLoading();

fetch(SHEET_API)

.then(r=>r.json())

.then(data=>{

const record = data.find(

row => normalize(row["Sticker ID"]) === qrId

);

if(!record){

window.location.href="register.html?id="+encodeURIComponent(qrId);

return;

}

const consent = normalize(record["Consent (Required)"]).toLowerCase();

if(!consent.includes("agree")){

ownerContainer.innerHTML = `<div class="owner-card"><h3>Access Disabled</h3></div>`;

return;

}

renderOwner(record);

})

.catch(e=>{

console.error(e);

showError();

});

}


document.addEventListener("DOMContentLoaded",initQR);
