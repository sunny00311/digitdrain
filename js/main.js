/**
 * NaliSentry - Landing Page Interactions & Animations
 */

document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Navigation Toggle
  const mobileToggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      const isOpen = navLinks.classList.contains("open");
      mobileToggle.innerHTML = isOpen
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    // Close on link click
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
      });
    });
  }

  // Smooth number counter animation for Statistics Section
  const counters = document.querySelectorAll(".counter-value");
  let hasAnimated = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute("data-target"), 10);
      const duration = 1500;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, stepTime);
    });
  }

  // Intersection Observer for triggering counters when scrolled into view
  const statsSection = document.getElementById("stats");
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated) {
        hasAnimated = true;
        runCounters();
      }
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  } else {
    runCounters();
  }

  // Interactive Mock Pin preview in Hero section
  const mockPins = document.querySelectorAll(".mock-pin");
  const heroAlertBox = document.getElementById("hero-mock-alert");

  if (heroAlertBox) {
    const pinData = {
      "p1": {
        title: "CRITICAL — NS-014",
        desc: "Nehru Nagar Culvert Drain reached 84 cm (Limit 80 cm). Immediate suction required.",
        time: "Just now",
        class: "critical"
      },
      "p2": {
        title: "WARNING — NS-005",
        desc: "ITO Junction Spillway water level at 74 cm. Sluice gate monitoring active.",
        time: "5 mins ago",
        class: "warning"
      },
      "p3": {
        title: "NORMAL — NS-001",
        desc: "Connaught Place Central Sump at 42 cm. Gravity storm runoff optimal.",
        time: "10 mins ago",
        class: "normal"
      }
    };

    mockPins.forEach(pin => {
      pin.addEventListener("click", () => {
        const id = pin.dataset.id;
        const data = pinData[id];
        if (data) {
          heroAlertBox.innerHTML = `
            <div class="alert-badge-icon" style="background: var(--status-${data.class}-bg); border-color: var(--status-${data.class}); color: var(--status-${data.class});">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <div class="alert-details">
              <h4 style="color: var(--status-${data.class});">${data.title}</h4>
              <p>${data.desc}</p>
              <div class="meta">Telemetry: Active • ${data.time}</div>
            </div>
          `;
        }
      });
    });
  }
});
