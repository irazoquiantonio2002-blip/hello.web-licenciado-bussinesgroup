document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById("preloader");
  const minDisplay = new Promise(res => setTimeout(res, 900));
  const pageLoaded = new Promise(res => {
    if (document.readyState === "complete") res();
    else window.addEventListener("load", res);
  });
  Promise.all([minDisplay, pageLoaded]).then(() => {
    preloader.classList.add("loaded");
  });

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  navToggle.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.getElementById("scrollProgress");
  function updateProgress() {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    progressBar.style.width = max > 0 ? (scrolled / max * 100) + "%" : "0%";
  }

  /* ---------- Header / topbar scroll behavior ---------- */
  const header = document.getElementById("header");
  const topbar = document.getElementById("topbar");
  const backToTop = document.getElementById("backToTop");
  let lastY = window.scrollY;

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 20);
    backToTop.classList.toggle("show", y > 500);

    if (y > lastY && y > 140) topbar.classList.add("hide");
    else topbar.classList.remove("hide");
    lastY = y;

    updateProgress();
  }, { passive: true });
  updateProgress();

  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Marquee: duplicate track for seamless loop ---------- */
  const marqueeTrack = document.getElementById("marqueeTrack");
  if (marqueeTrack) {
    marqueeTrack.innerHTML += marqueeTrack.innerHTML;
  }

  /* ---------- Side progress rail ---------- */
  const railLinks = document.querySelectorAll(".rail a");
  if (railLinks.length) {
    const sections = Array.from(railLinks).map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
    const railObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = "#" + entry.target.id;
          railLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === id));
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    sections.forEach(s => railObserver.observe(s));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || (i % 3) * 90;
        setTimeout(() => entry.target.classList.add("in-view"), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated stat counters ---------- */
  const stats = document.querySelectorAll(".stat-num");
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1600;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString("es-MX");
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString("es-MX");
      }
      requestAnimationFrame(tick);
      statObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  stats.forEach(el => statObserver.observe(el));

  /* ---------- Hero typewriter ---------- */
  const typewriterEl = document.getElementById("typewriter");
  const phrases = [
    "Derecho Migratorio",
    "Derechos Humanos",
    "Internacional y Familia",
    "Civil y Penal",
    "Inmobiliario",
    "Corporativo y Compliance",
    "Fiscal",
    "Laboral y Empresarial",
    "Propiedad Intelectual"
  ];
  let phraseIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const current = phrases[phraseIndex];
    if (!deleting) {
      charIndex++;
      typewriterEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
    } else {
      charIndex--;
      typewriterEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, deleting ? 35 : 65);
  }
  setTimeout(typeLoop, 1600);

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".acc-item").forEach(item => {
    const trigger = item.querySelector(".acc-trigger");
    const panel = item.querySelector(".acc-panel");
    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      item.closest(".accordion").querySelectorAll(".acc-item").forEach(other => {
        other.classList.remove("open");
        other.querySelector(".acc-panel").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* ---------- Spotlight hover (cards that follow the cursor) ---------- */
  document.querySelectorAll(".spot").forEach(el => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", (e.clientX - rect.left) + "px");
      el.style.setProperty("--my", (e.clientY - rect.top) + "px");
    });
  });

  /* ---------- Magnetic buttons ---------- */
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  if (!isTouch) {
    document.querySelectorAll(".magnetic").forEach(btn => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = "translate(0,0)"; });
    });
  }

  /* ---------- Contact form -> WhatsApp ---------- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("cf-name").value.trim();
    const email = document.getElementById("cf-email").value.trim();
    const phone = document.getElementById("cf-phone").value.trim();
    const topic = document.getElementById("cf-topic").value;
    const message = document.getElementById("cf-message").value.trim();

    let text = `Hola, mi nombre es ${name}.`;
    if (topic) text += ` Quisiera una consulta sobre ${topic}.`;
    if (message) text += ` ${message}`;
    if (email) text += ` (Correo: ${email})`;
    if (phone) text += ` (Tel: ${phone})`;

    window.open(`https://wa.me/523121162476?text=${encodeURIComponent(text)}`, "_blank");
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
