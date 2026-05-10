document.documentElement.classList.add("can-reveal");

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const revealItems = document.querySelectorAll(".reveal");

let lastScrollY = window.scrollY;
let ticking = false;

const setHeaderState = () => {
  const currentScrollY = window.scrollY;
  const isScrollingDown = currentScrollY > lastScrollY;
  const navIsOpen = navMenu.classList.contains("is-open");

  header.classList.toggle("is-scrolled", currentScrollY > 18);
  header.classList.toggle("is-hidden", isScrollingDown && currentScrollY > 140 && !navIsOpen);

  lastScrollY = currentScrollY;
};

const closeMenu = () => {
  navMenu.classList.remove("is-open");
  navToggle.classList.remove("is-active");
  header.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-label", "Menu openen");
};

const onScroll = () => {
  if (ticking) return;

  window.requestAnimationFrame(() => {
    setHeaderState();
    ticking = false;
  });

  ticking = true;
};

setHeaderState();
window.addEventListener("scroll", onScroll, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.classList.toggle("is-active", isOpen);
  header.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-label", isOpen ? "Menu sluiten" : "Menu openen");
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -42px",
  }
);

revealItems.forEach((item) => revealObserver.observe(item));
