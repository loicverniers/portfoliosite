const root = document.documentElement;
const body = document.body;
const canvas = document.querySelector("[data-void]");
const ctx = canvas.getContext("2d");
const cursor = document.querySelector("[data-cursor]");
const progress = document.querySelector("[data-progress]");
const calmButton = document.querySelector("[data-calm]");
const worksScene = document.querySelector(".scene-works");
const worksTrack = document.querySelector("[data-track]");
const magneticItems = document.querySelectorAll(".magnetic");
const tiltItems = document.querySelectorAll("[data-tilt]");
const projectPanels = document.querySelectorAll("[data-project]");

let width = 0;
let height = 0;
let dpr = 1;
let particles = [];
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let targetCursorX = 0;
let targetCursorY = 0;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (start, end, amount) => start + (end - start) * amount;

const resizeCanvas = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const particleCount = width < 720 ? 44 : 86;
  particles = Array.from({ length: particleCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    z: Math.random() * 0.9 + 0.1,
    r: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.18,
    hue: Math.random() > 0.72 ? "blue" : "warm",
  }));
};

const drawVoid = () => {
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = "lighter";

  particles.forEach((particle) => {
    particle.x += particle.vx + mouseX * particle.z * 0.08;
    particle.y += particle.vy + mouseY * particle.z * 0.06;

    if (particle.x < -20) particle.x = width + 20;
    if (particle.x > width + 20) particle.x = -20;
    if (particle.y < -20) particle.y = height + 20;
    if (particle.y > height + 20) particle.y = -20;

    const gradient = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.r * 10
    );
    const color =
      particle.hue === "blue" ? "91, 140, 255" : Math.random() > 0.985 ? "178, 53, 75" : "200, 173, 120";

    gradient.addColorStop(0, `rgba(${color}, ${0.13 * particle.z})`);
    gradient.addColorStop(1, `rgba(${color}, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r * 10, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalCompositeOperation = "source-over";
  requestAnimationFrame(drawVoid);
};

const updateScrollState = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const scrollRatio = maxScroll > 0 ? clamp(window.scrollY / maxScroll, 0, 1) : 0;
  root.style.setProperty("--scroll", scrollRatio.toFixed(4));
  if (progress) progress.style.height = `${scrollRatio * 100}%`;

  if (worksScene && worksTrack && window.innerWidth > 980) {
    const rect = worksScene.getBoundingClientRect();
    const travel = worksScene.offsetHeight - window.innerHeight;
    const local = travel > 0 ? clamp(-rect.top / travel, 0, 1) : 0;
    const overflow = Math.max(0, worksTrack.scrollWidth - window.innerWidth + 140);
    worksTrack.style.setProperty("--works-x", `${local * overflow}`);
  }
};

const updatePointer = (event) => {
  const normalizedX = event.clientX / window.innerWidth - 0.5;
  const normalizedY = event.clientY / window.innerHeight - 0.5;

  mouseX = normalizedX;
  mouseY = normalizedY;
  targetCursorX = event.clientX;
  targetCursorY = event.clientY;
  root.style.setProperty("--mx", normalizedX.toFixed(4));
  root.style.setProperty("--my", normalizedY.toFixed(4));
  cursor.classList.add("is-active");
};

const animateCursor = () => {
  cursorX = lerp(cursorX, targetCursorX, 0.18);
  cursorY = lerp(cursorY, targetCursorY, 0.18);
  cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
  requestAnimationFrame(animateCursor);
};

magneticItems.forEach((item) => {
  item.addEventListener("mouseenter", () => cursor.classList.add("is-link"));
  item.addEventListener("mouseleave", () => {
    cursor.classList.remove("is-link");
    item.style.transform = "";
  });

  item.addEventListener("mousemove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate3d(${x * 0.12}px, ${y * 0.16}px, 0)`;
  });
});

tiltItems.forEach((item) => {
  item.addEventListener("mousemove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    item.style.transform = `rotateX(${y * -10}deg) rotateY(${x * 12}deg) translateZ(12px)`;
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "";
  });
});

projectPanels.forEach((panel) => {
  panel.addEventListener("mousemove", (event) => {
    const image = panel.querySelector(".project-image");
    const rect = panel.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    if (image) {
      image.style.setProperty("--hover-x", `${x}%`);
      image.style.setProperty("--hover-y", `${y}%`);
    }
  });
});

calmButton.addEventListener("click", () => {
  body.classList.toggle("is-calm");
  calmButton.innerHTML = body.classList.contains("is-calm")
    ? "<span></span> Motion on"
    : "<span></span> Calm mode";
});

window.addEventListener("resize", () => {
  resizeCanvas();
  updateScrollState();
});

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("pointermove", updatePointer, { passive: true });
window.addEventListener("pointerleave", () => cursor.classList.remove("is-active"));

resizeCanvas();
updateScrollState();
drawVoid();
animateCursor();
