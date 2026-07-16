const header = document.getElementById("site-header");
const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");
const progressIndicator = document.getElementById("progress-indicator");
const currentYear = document.getElementById("current-year");
const carouselTrack = document.querySelector("[data-carousel-track]");
const carouselPrev = document.querySelector("[data-carousel-prev]");
const carouselNext = document.querySelector("[data-carousel-next]");
const ctaBannerMedia = document.querySelector(".cta-banner-media");
const ctaBannerSection = document.querySelector(".cta-banner-section");
const finalCtaMedia = document.querySelector(".final-cta-media");
const finalCtaSection = document.querySelector(".final-cta");
const heroVideo = document.getElementById("hero-video");
const heroVideoToggle = document.getElementById("hero-video-toggle");
const aboutVideo = document.getElementById("about-video");
const aboutVideoToggle = document.getElementById("about-video-toggle");
const noticeModal = document.querySelector("[data-notice-modal]");
let autoplayInterval = null;
let heroAudioUnlocked = false;
let aboutAudioUnlocked = false;

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

function updateProgress() {
  if (!progressIndicator) return;

  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
  progressIndicator.style.width = `${Math.min(progress, 100)}%`;
}

function closeMenu() {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

window.addEventListener("scroll", () => {
  updateHeader();
  updateProgress();
  updateParallax();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) {
    closeMenu();
  }
});

if (currentYear) {
  currentYear.textContent = ` ${new Date().getFullYear()}`;
}

function updateParallax() {
  if (ctaBannerMedia && ctaBannerSection) {
    const rect = ctaBannerSection.getBoundingClientRect();
    const offset = rect.top * -0.18;
    ctaBannerMedia.style.transform = `translateY(calc(-8% + ${offset}px)) scale(1.2)`;
  }

  if (finalCtaMedia && finalCtaSection) {
    const finalRect = finalCtaSection.getBoundingClientRect();
    const finalOffset = finalRect.top * -0.16;
    finalCtaMedia.style.transform = `translateY(calc(-6% + ${finalOffset}px)) scale(1.14)`;
  }
}

function scrollCarousel(direction) {
  if (!carouselTrack) return;

  const firstCard = carouselTrack.querySelector(".testimonial-card");
  const step = firstCard ? firstCard.getBoundingClientRect().width + 24 : 320;
  const maxScrollLeft = carouselTrack.scrollWidth - carouselTrack.clientWidth;
  const nextPosition = carouselTrack.scrollLeft + direction * step;

  if (direction > 0 && nextPosition >= maxScrollLeft - 4) {
    carouselTrack.scrollTo({
      left: 0,
      behavior: "smooth",
    });
    return;
  }

  if (direction < 0 && carouselTrack.scrollLeft <= 4) {
    carouselTrack.scrollTo({
      left: maxScrollLeft,
      behavior: "smooth",
    });
    return;
  }

  carouselTrack.scrollBy({
    left: direction * step,
    behavior: "smooth",
  });
}

function startCarouselAutoplay() {
  if (!carouselTrack) return;
  stopCarouselAutoplay();
  autoplayInterval = window.setInterval(() => {
    scrollCarousel(1);
  }, 3500);
}

function stopCarouselAutoplay() {
  if (autoplayInterval) {
    window.clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
}

if (carouselPrev && carouselNext && carouselTrack) {
  carouselPrev.addEventListener("click", () => scrollCarousel(-1));
  carouselNext.addEventListener("click", () => scrollCarousel(1));
  carouselTrack.addEventListener("mouseenter", stopCarouselAutoplay);
  carouselTrack.addEventListener("mouseleave", startCarouselAutoplay);
  carouselPrev.addEventListener("mouseenter", stopCarouselAutoplay);
  carouselPrev.addEventListener("mouseleave", startCarouselAutoplay);
  carouselNext.addEventListener("mouseenter", stopCarouselAutoplay);
  carouselNext.addEventListener("mouseleave", startCarouselAutoplay);
  startCarouselAutoplay();
}

if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.volume = 1;
  heroVideo.play().catch(() => {});
}

if (aboutVideo) {
  aboutVideo.muted = true;
  aboutVideo.volume = 1;
  aboutVideo.play().catch(() => {});
}

function updateVideoSoundControl(video, toggle, enableSound) {
  if (!video || !toggle) return;

  video.muted = !enableSound;
  video.volume = 1;
  video.play().catch(() => {});
  toggle.classList.toggle("is-on", enableSound);
  toggle.setAttribute("aria-label", enableSound ? "Desativar som" : "Ativar som");
}

function unlockHeroVideoAudio() {
  if (!heroVideo || heroAudioUnlocked) return;

  updateVideoSoundControl(heroVideo, heroVideoToggle, true);
  heroAudioUnlocked = true;
  updateVideoSoundControl(aboutVideo, aboutVideoToggle, false);
  aboutAudioUnlocked = false;

  window.removeEventListener("pointerdown", unlockHeroVideoAudio);
  window.removeEventListener("touchstart", unlockHeroVideoAudio);
  window.removeEventListener("keydown", unlockHeroVideoAudio);
}

if (heroVideo && heroVideoToggle) {
  heroVideoToggle.addEventListener("click", () => {
    const enableSound = heroVideo.muted;
    updateVideoSoundControl(heroVideo, heroVideoToggle, enableSound);
    heroAudioUnlocked = enableSound;

    if (enableSound) {
      updateVideoSoundControl(aboutVideo, aboutVideoToggle, false);
      aboutAudioUnlocked = false;
    }
  });
}

if (aboutVideo && aboutVideoToggle) {
  aboutVideoToggle.addEventListener("click", () => {
    const enableSound = aboutVideo.muted;
    updateVideoSoundControl(aboutVideo, aboutVideoToggle, enableSound);
    aboutAudioUnlocked = enableSound;

    if (enableSound) {
      updateVideoSoundControl(heroVideo, heroVideoToggle, false);
      heroAudioUnlocked = false;
    }
  });
}

function closeNoticeModal() {
  if (!noticeModal) return;
  noticeModal.classList.remove("is-visible");
  document.body.classList.remove("modal-open");
}

if (noticeModal) {
  noticeModal.classList.add("is-visible");
  document.body.classList.add("modal-open");

  noticeModal.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.hasAttribute("data-notice-close")) {
      closeNoticeModal();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && noticeModal.classList.contains("is-visible")) {
      closeNoticeModal();
    }
  });
}

window.addEventListener("pointerdown", unlockHeroVideoAudio, { once: true });
window.addEventListener("touchstart", unlockHeroVideoAudio, { once: true });
window.addEventListener("keydown", unlockHeroVideoAudio, { once: true });

updateHeader();
updateProgress();
updateParallax();
