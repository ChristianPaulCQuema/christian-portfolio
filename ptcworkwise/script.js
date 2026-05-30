const galleryGroups = [
  {
    name: "General / Auth",
    range: "01 to 04",
    files: [
      "01_landing_page_ui.png",
      "02_login_page_ui.png",
      "03_create_account_page_ui.png",
      "04_forgot_password_page_ui.png"
    ]
  },
  {
    name: "HR Module",
    range: "05 to 25",
    files: [
      "05_hr_dashboard_ui.png",
      "06_hr_manage_accounts_ui.png",
      "07_hr_create_user_form_ui.png",
      "08_hr_pending_account_approval_ui.png",
      "09_hr_total_employees_ui.png",
      "10_hr_employee_201_file_ui.png",
      "11_hr_departments_list_ui.png",
      "12_hr_manage_department_ui.png",
      "13_hr_announcements_ui.png",
      "14_hr_documents_ui.png",
      "15_hr_request_document_ui.png",
      "16_hr_upload_document_ui.png",
      "17_hr_document_view_ui.png",
      "18_hr_reports_ui.png",
      "19_hr_request_report_ui.png",
      "20_hr_report_view_ui.png",
      "21_hr_faculty_load_schedule_ui.png",
      "22_hr_tasks_reminders_ui.png",
      "23_hr_create_task_ui.png",
      "24_hr_task_calendar_ui.png",
      "25_hr_chat_ui.png"
    ]
  },
  {
    name: "Dean / Assistant Dean Module",
    range: "26 to 45",
    files: [
      "26_dean_dashboard_ui.png",
      "27_dean_announcements_ui.png",
      "28_dean_department_overview_ui.png",
      "29_dean_manage_professors_ui.png",
      "30_dean_documents_ui.png",
      "31_dean_request_document_ui.png",
      "32_dean_upload_document_ui.png",
      "33_dean_reports_ui.png",
      "34_dean_upload_report_ui.png",
      "35_dean_schedule_dashboard_ui.png",
      "36_dean_create_schedule_ui.png",
      "37_dean_curriculum_manager_ui.png",
      "38_dean_schedule_view_ui.png",
      "39_dean_schedule_sheet_ui.png",
      "40_dean_availability_ui.png",
      "41_dean_tasks_ui.png",
      "42_dean_task_calendar_ui.png",
      "43_dean_chat_ui.png",
      "44_dean_profile_ui.png",
      "45_dean_change_password_ui.png"
    ]
  },
  {
    name: "Employee Module",
    range: "46 to 62",
    files: [
      "46_employee_dashboard_ui.png",
      "47_employee_announcements_ui.png",
      "48_employee_departments_ui.png",
      "49_employee_department_view_ui.png",
      "50_employee_documents_ui.png",
      "51_employee_request_document_ui.png",
      "52_employee_upload_document_ui.png",
      "53_employee_reports_ui.png",
      "54_employee_upload_report_ui.png",
      "55_employee_schedule_ui.png",
      "56_employee_set_availability_ui.png",
      "57_employee_assigned_schedule_ui.png",
      "58_employee_tasks_ui.png",
      "59_employee_task_calendar_ui.png",
      "60_employee_chat_ui.png",
      "61_employee_profile_ui.png",
      "62_employee_change_password_ui.png"
    ]
  }
];

const gallerySections = document.getElementById("gallerySections");
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
  const withoutNumber = filename
    .replace(/^\d+_/, "")
    .replace(/_ui\.png$/i, "")
    .replace(/\.png$/i, "");

  return withoutNumber
    .split("_")
    .map(part => {
      if (part.toLowerCase() === "hr") return "HR";
      if (part === "201") return "201";
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
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
  const groupsWithImages = [];

  for (const group of galleryGroups) {
    const images = [];

    for (const file of group.files) {
      const src = `screenshots/${file}`;
      if (await imageExists(src)) {
        images.push({
          src,
          file,
          group: group.name,
          title: toTitle(file)
        });
      }
    }

    if (images.length) {
      groupsWithImages.push({ ...group, images });
      availableImages = availableImages.concat(images);
    }
  }

  gallerySections.innerHTML = "";

  groupsWithImages.forEach(group => {
    const section = document.createElement("article");
    section.className = "gallery-section";
    section.innerHTML = `
      <div class="gallery-section-header">
        <p class="eyebrow">${group.range}</p>
        <h3>${group.name}</h3>
      </div>
    `;

    const grid = document.createElement("div");
    grid.className = "gallery-grid";

    group.images.forEach(image => {
      const index = availableImages.indexOf(image);
      grid.appendChild(createGalleryCard(image, index));
    });

    section.appendChild(grid);
    gallerySections.appendChild(section);
  });

  galleryCount.textContent = availableImages.length
    ? `${availableImages.length} available screenshots loaded.`
    : "No screenshots found in ptcworkwise/screenshots/.";
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
