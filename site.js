
window.RB = window.RB || {};

RB.config = {
  whatsapp: "919999999999",
  phone: "+91-99999-99999",
  email: "hello@redblacktech.com",
  webinar1Link: "",
  webinar2Link: "",
  formEndpoint: "",
  webinarPayment1: "",
  webinarPayment2: ""
};

function waLink(message){
  const num = RB.config.whatsapp.replace(/\D/g,'');
  return "https://wa.me/" + num + "?text=" + encodeURIComponent(message);
}

function setConfigLinks(){
  document.querySelectorAll("[data-wa]").forEach(a=>{
    a.href = waLink(a.dataset.wa || "Hello RedBlack Tech, I have a business enquiry.");
  });
  document.querySelectorAll("[data-call]").forEach(a=>{
    a.href = "tel:" + RB.config.phone.replace(/[^\d+]/g,'');
  });
  document.querySelectorAll("[data-email]").forEach(a=>{
    a.href = "mailto:" + RB.config.email;
  });
  const w1=document.querySelector("[data-webinar-link='1']");
  const w2=document.querySelector("[data-webinar-link='2']");
  if(w1 && RB.config.webinar1Link) w1.href=RB.config.webinar1Link;
  if(w2 && RB.config.webinar2Link) w2.href=RB.config.webinar2Link;
}

RB.toggleMenu=function(){
  document.getElementById("navLinks")?.classList.toggle("open");
};

RB.leadSubmit = async function(form){
  const note=form.querySelector("[data-note]");
  const payload=Object.fromEntries(new FormData(form).entries());
  payload.page=location.pathname;
  payload.utm_source=new URLSearchParams(location.search).get("utm_source")||"";
  payload.utm_medium=new URLSearchParams(location.search).get("utm_medium")||"";
  payload.utm_campaign=new URLSearchParams(location.search).get("utm_campaign")||"";

  if(!RB.config.formEndpoint){
    note.className="success";
    note.textContent="Form captured in demo mode. Add the Google Apps Script URL in site.js to store it in your CRM sheet.";
    const msg=`RedBlack Tech enquiry%0AName: ${payload.name||""}%0ACompany: ${payload.company||""}%0AService: ${payload.service||""}%0APhone: ${payload.phone||""}%0AEmail: ${payload.email||""}%0ARequirement: ${payload.message||""}`;
    window.open(waLink(msg.replace(/%0A/g,"\n")),"_blank");
    form.reset(); return;
  }
  try{
    await fetch(RB.config.formEndpoint,{method:"POST",body:JSON.stringify(payload),mode:"no-cors"});
    note.className="success";
    note.textContent="Thank you. Your enquiry has been received.";
    form.reset();
  }catch(e){
    note.className="notice";
    note.textContent="The form could not be submitted. Please use WhatsApp or call us.";
  }
};

document.addEventListener("DOMContentLoaded",()=>{
  setConfigLinks();
  document.querySelectorAll("#navLinks a").forEach(a=>a.addEventListener("click",()=>document.getElementById("navLinks")?.classList.remove("open")));
  document.querySelectorAll("[data-lead-form]").forEach(f=>f.addEventListener("submit",e=>{e.preventDefault();RB.leadSubmit(f)}));
  document.querySelectorAll("[data-wa]").forEach(a=>a.addEventListener("click",()=>{}));
  const y=document.querySelector("[data-year]"); if(y)y.textContent=new Date().getFullYear();
});
