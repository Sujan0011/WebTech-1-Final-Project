document.addEventListener("DOMContentLoaded", function () {
  var btn = document.querySelector(".menu");
  var links = document.querySelector(".links");
  if (btn && links) btn.addEventListener("click", function () { links.classList.toggle("open"); });
  var form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var phone = form.phone.value.trim();
    var message = form.message.value.trim();
    var err = document.getElementById("err");
    var ok = document.getElementById("ok");
    if (name.length < 2 || phone.length < 7 || message.length < 8) {
      err.textContent = "Please add your name, a phone number, and a short message.";
      ok.textContent = "";
      return;
    }
    err.textContent = "";
    ok.textContent = "Noted on this device. This form does not send a message yet — call or visit the yard.";
    form.reset();
  });
});