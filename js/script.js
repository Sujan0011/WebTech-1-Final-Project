document.addEventListener("DOMContentLoaded", function () {
  var btn = document.querySelector(".menu");
  var links = document.querySelector(".links");
  if (btn && links) btn.addEventListener("click", function () { links.classList.toggle("open"); });

  document.documentElement.classList.add("js");
  var nodes = document.querySelectorAll(".step, .story, .temple, .panel");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    nodes.forEach(function (el, n) {
      el.classList.add("await");
      el.style.transitionDelay = (n % 5) * 70 + "ms";
    });
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        seen.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    nodes.forEach(function (el) { seen.observe(el); });
  }

  var word = document.getElementById("word");
  if (word) {
    var words = ["pressed.", "shredded.", "washed.", "returned."];
    var i = 0;
    setInterval(function () {
      word.classList.add("swap");
      setTimeout(function () {
        i = (i + 1) % words.length;
        word.textContent = words[i];
        word.classList.remove("swap");
      }, 280);
    }, 1800);
  }

  document.querySelectorAll("a[href$='.html']").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || a.target === "_blank") return;
      e.preventDefault();
      document.body.classList.add("leave");
      setTimeout(function () { window.location.href = a.href; }, 280);
    });
  });

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
    var text = "New enquiry for Nikhil Suppliers\nName: " + name + "\nPhone: " + phone + "\nMessage: " + message;
    window.open("https://wa.me/9779827377237?text=" + encodeURIComponent(text), "_blank");
    ok.textContent = "WhatsApp is open. Press Send so Nikhil gets this on 9827377237.";
    form.reset();
  });
});
