const files = [
  "01-home.png",
  "02-travel-packages.png",
  "03-destination.png",
  "04-contact.png",
  "05-login.png",
  "06-create-account.png",
  "07-package-details-boracay.png",
  "08-admin-dashboard.png",
  "09-admin-bookings.png",
  "10-admin-destinations.png",
  "11-admin-packages.png",
  "12-admin-reports.png",
  "13-admin-inquiries.png",
  "14-admin-settings.png",
  "15-customer-dashboard.png",
  "16-customer-book-new-trip.png",
  "17-customer-my-profile.png"
];

const galleryGrid = document.getElementById("galleryGrid");
const galleryCount = document.getElementById("galleryCount");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeLightboxButton = document.getElementById("closeLightbox");
const prevButton = document.getElementById("prevImage");
const nextButton = document.getElementById("nextImage");
const year = document.getElementById("year");

let availableImages = [];
let currentIndex = 0;

if (year) {
  year.textContent = new Date().getFullYear();
}

function toTitle(filename) {
  return filename
    .replace(/^\d+-/, "")
    .replace(/\.png$/i, "")
    .split("-")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getGroup(filename) {
  if (filename.includes("admin")) return "Admin Module";
  if (filename.includes("customer")) return "Customer Module";
  return "Public / Auth";
}

function imageExists(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

function createGalleryCard(image, index) {
  const button = document.createElement("button");
  button.className = "gallery-card";
  button.type = "button";
  button.setAttribute("aria-label", `Open ${image.title} preview`);
  button.innerHTML = `
    <img src="${image.src}" alt="${image.title} screenshot" loading="lazy">
    <span class="gallery-card-body">
      <span class="gallery-title">${image.title}</span>
      <span class="gallery-label">${image.group}</span>
    </span>
  `;
  button.addEventListener("click", () => openLightbox(index));
  return button;
}

async function renderGallery() {
  for (const file of files) {
    const src = `screenshots/${file}`;
    if (await imageExists(src)) {
      availableImages.push({
        src,
        title: toTitle(file),
        group: getGroup(file)
      });
    }
  }

  galleryGrid.innerHTML = "";
  availableImages.forEach((image, index) => {
    galleryGrid.appendChild(createGalleryCard(image, index));
  });

  galleryCount.textContent = availableImages.length
    ? `${availableImages.length} available screenshots loaded.`
    : "No screenshots found in lakbaygo/screenshots/.";
}

function openLightbox(index) {
  if (!availableImages.length) return;
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add("show");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeLightboxButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function updateLightbox() {
  const image = availableImages[currentIndex];
  lightboxImage.src = image.src;
  lightboxImage.alt = `${image.title} screenshot`;
  lightboxCaption.textContent = `${image.title} - ${image.group}`;
}

function showPrevious() {
  currentIndex = (currentIndex - 1 + availableImages.length) % availableImages.length;
  updateLightbox();
}

function showNext() {
  currentIndex = (currentIndex + 1) % availableImages.length;
  updateLightbox();
}

closeLightboxButton.addEventListener("click", closeLightbox);
prevButton.addEventListener("click", showPrevious);
nextButton.addEventListener("click", showNext);

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("show")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showPrevious();
  if (event.key === "ArrowRight") showNext();
});

renderGallery();
