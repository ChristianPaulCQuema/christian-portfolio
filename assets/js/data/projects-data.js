/* Project data as a classic script so the portfolio works from direct file opening,
   a local server, and Vercel without any runtime fetch.
   Single source of truth for every project shown on this site. */

window.PORTFOLIO_PROJECT_CATEGORIES = [
  {
    "id": "all",
    "label": "All Projects"
  },
  {
    "id": "business-system",
    "label": "Business Systems"
  },
  {
    "id": "booking",
    "label": "Booking Platforms"
  },
  {
    "id": "web-app",
    "label": "Web Applications"
  },
  {
    "id": "mobile",
    "label": "Mobile"
  },
  {
    "id": "website",
    "label": "Websites"
  }
];

window.PORTFOLIO_PROJECT_STATUSES = [
  {
    "id": "live",
    "label": "Live",
    "description": "A public demo is deployed and reachable."
  },
  {
    "id": "demo",
    "label": "Demo",
    "description": "A working demonstration is available inside this portfolio."
  },
  {
    "id": "in-development",
    "label": "Under Development",
    "description": "Documented and captured, but not publicly deployable yet."
  }
];

window.PORTFOLIO_PROJECTS = [
  {
    "id": "bookease-ph",
    "title": "BookEase PH",
    "kicker": "Appointment Booking & Scheduling System",
    "category": "booking",
    "categoryLabel": "Booking Platform",
    "status": "live",
    "statusLabel": "Interactive Demo",
    "featured": true,
    "summary": "A Philippine-focused booking experience with a guided five-step appointment flow and administrative scheduling tools.",
    "overview": "A Philippine-focused appointment booking system for salons, wellness studios, grooming centers, clinics, and service businesses. The public demo provides client booking and administrative scheduling workflows through browser-based data.",
    "problem": "Clients need clear scheduling while staff need organised availability, appointment, service, and customer workflows in one place.",
    "role": "Sole developer. Requirements analysis, interface design, booking-flow logic, admin dashboard, client-side validation, and static deployment.",
    "users": "Clients, staff members, and business administrators.",
    "workflow": "Service → date and time → customer information → review → confirmation. Administrators then manage the resulting records.",
    "features": [
      "Five-step booking and confirmation flow",
      "Administration dashboard and calendar",
      "Appointment, client, service, and reminder management",
      "Light and dark theme support",
      "Client-side validation across every step"
    ],
    "tech": [
      "HTML5",
      "CSS3",
      "JavaScript",
      "LocalStorage",
      "Laravel",
      "MySQL",
      "REST API",
      "Bootstrap"
    ],
    "stack": {
      "Demo build": [
        "HTML5",
        "CSS3",
        "JavaScript",
        "LocalStorage",
        "Responsive Design",
        "Client-Side Validation"
      ],
      "Documented architecture": [
        "PHP",
        "Laravel",
        "MySQL",
        "Eloquent ORM",
        "REST API",
        "RBAC",
        "Queues"
      ]
    },
    "cover": {
      "src": "assets/images/projects/bookease/bookease-home.png",
      "width": 1440,
      "height": 1000,
      "alt": "BookEase PH appointment booking landing page"
    },
    "screenshots": [
      {
        "src": "assets/images/projects/bookease/bookease-home.png",
        "width": 1440,
        "height": 1000,
        "caption": "Landing page"
      },
      {
        "src": "assets/images/projects/bookease/bookease-booking.png",
        "width": 1440,
        "height": 1000,
        "caption": "Service selection step"
      }
    ],
    "links": {
      "live": "https://book-ease-demo.vercel.app/",
      "source": null
    },
    "credentials": [
      {
        "label": "Administrator",
        "value": "admin@bookease.ph / Admin123"
      }
    ],
    "limitations": "The public demo stores data in the browser only. There is no connected production authentication, server database, payment service, or cross-device synchronisation."
  },
  {
    "id": "codexa-cafe-kiosk",
    "title": "Codexa Cafe Kiosk",
    "kicker": "Cafe Ordering, Staff Workflow & Management System",
    "category": "business-system",
    "categoryLabel": "Business System",
    "status": "live",
    "statusLabel": "Interactive Demo",
    "featured": true,
    "summary": "A customer, staff, and administrator cafe workflow covering menu ordering, cart review, and order-status management.",
    "overview": "An interactive cafe ordering system demonstrating customer menu selection, cart processing, staff order management, and administrator workflows through browser-based data.",
    "problem": "Customers need a direct ordering flow while staff need a focused queue and administrators need an operational overview.",
    "role": "Sole developer. Role simulation, menu and cart logic, order-status workflow, touch-friendly interface, and static deployment.",
    "users": "Customers, cafe staff, and administrators.",
    "workflow": "Choose role → browse menu → build cart → review → submit → update status from the staff tools.",
    "features": [
      "Menu browsing, cart, review, and submission",
      "Staff order-status workflow",
      "Administrator operational overview",
      "Touch-friendly kiosk interface",
      "Simulated role-based access"
    ],
    "tech": [
      "HTML5",
      "CSS3",
      "JavaScript",
      "LocalStorage",
      "Laravel",
      "MySQL",
      "REST API",
      "Bootstrap"
    ],
    "stack": {
      "Demo build": [
        "HTML5",
        "CSS3",
        "JavaScript",
        "LocalStorage",
        "Responsive Design",
        "Client-Side Cart"
      ],
      "Documented architecture": [
        "PHP",
        "Laravel",
        "MySQL",
        "REST API",
        "RBAC",
        "Inventory Logic"
      ]
    },
    "cover": {
      "src": "assets/images/projects/codexa-cafe/codexa-cafe-login.png",
      "width": 1440,
      "height": 1000,
      "alt": "Codexa Cafe Kiosk role-based sign-in page"
    },
    "screenshots": [
      {
        "src": "assets/images/projects/codexa-cafe/codexa-cafe-login.png",
        "width": 1440,
        "height": 1000,
        "caption": "Role-based sign-in screen"
      }
    ],
    "links": {
      "live": "https://caffe-kiosk.vercel.app/pages/login.html",
      "source": null
    },
    "credentials": [
      {
        "label": "Customer",
        "value": "customer@demo.com / demo123"
      },
      {
        "label": "Staff",
        "value": "staff@demo.com / demo123"
      },
      {
        "label": "Administrator",
        "value": "admin@demo.com / demo123"
      }
    ],
    "limitations": "Demo roles are simulated in the browser. No server authority, real payment processing, inventory authority, or cross-device order synchronisation is connected."
  },
  {
    "id": "ptc-workwise",
    "title": "PTC WorkWise",
    "kicker": "School HR Information System",
    "category": "business-system",
    "categoryLabel": "Business System",
    "status": "in-development",
    "statusLabel": "Under Development",
    "featured": true,
    "summary": "A role-based employee portal for records, documents, schedules, reports, tasks, and college HR communication.",
    "overview": "A role-based HR and employee system built for Pateros Technological College, covering accounts, employee records, departments, documents, reports, faculty schedules, tasks, announcements, and chat-style communication.",
    "problem": "Academic HR tasks are fragmented across paper records, separate files, schedules, reports, and informal communication channels.",
    "role": "Developer. Role-based interface design across four user groups, records and document modules, scheduling screens, and interface documentation.",
    "users": "HR staff, deans, assistant deans, and employees.",
    "workflow": "Authenticated role → permitted dashboard → records and requests → review, status update, and reporting.",
    "features": [
      "HR, Dean, Assistant Dean, and Employee role dashboards",
      "Employee 201 file and department management",
      "Document request, upload, and review module",
      "Report request and submission module",
      "Faculty load and class schedule builder",
      "Task calendar, announcements, and chat interface"
    ],
    "tech": [
      "HTML5",
      "CSS3",
      "JavaScript",
      "PHP",
      "MySQL",
      "Bootstrap",
      "RBAC"
    ],
    "stack": {
      "Captured interface": [
        "HTML5",
        "CSS3",
        "JavaScript",
        "Bootstrap",
        "Responsive Layouts"
      ],
      "Documented architecture": [
        "PHP",
        "MySQL",
        "Session Auth",
        "RBAC",
        "PDF Generation"
      ]
    },
    "cover": {
      "src": "assets/images/projects/ptc-workwise/05_hr_dashboard_ui.png",
      "width": 1920,
      "height": 1080,
      "alt": "PTC WorkWise HR dashboard"
    },
    "screenshots": [
      {
        "src": "assets/images/projects/ptc-workwise/01_landing_page_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Landing page",
        "group": "Public & Authentication"
      },
      {
        "src": "assets/images/projects/ptc-workwise/02_login_page_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Login page",
        "group": "Public & Authentication"
      },
      {
        "src": "assets/images/projects/ptc-workwise/03_create_account_page_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Create account page",
        "group": "Public & Authentication"
      },
      {
        "src": "assets/images/projects/ptc-workwise/04_forgot_password_page_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Forgot password page",
        "group": "Public & Authentication"
      },
      {
        "src": "assets/images/projects/ptc-workwise/05_hr_dashboard_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "HR dashboard",
        "group": "HR Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/06_hr_manage_accounts_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "HR manage accounts",
        "group": "HR Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/07_hr_create_user_form_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "HR create user form",
        "group": "HR Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/08_hr_pending_account_approval_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "HR pending account approval",
        "group": "HR Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/09_hr_total_employees_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "HR total employees",
        "group": "HR Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/10_hr_employee_201_file_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "HR employee 201 file",
        "group": "HR Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/11_hr_departments_list_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "HR departments list",
        "group": "HR Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/12_hr_manage_department_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "HR manage department",
        "group": "HR Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/13_hr_announcements_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "HR announcements",
        "group": "HR Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/14_hr_documents_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "HR documents",
        "group": "HR Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/15_hr_request_document_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "HR request document",
        "group": "HR Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/16_hr_upload_document_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "HR upload document",
        "group": "HR Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/17_hr_document_view_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "HR document view",
        "group": "HR Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/18_hr_reports_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "HR reports",
        "group": "HR Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/19_hr_request_report_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "HR request report",
        "group": "HR Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/20_hr_report_view_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "HR report view",
        "group": "HR Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/21_hr_faculty_load_schedule_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "HR faculty load schedule",
        "group": "HR Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/22_hr_tasks_reminders_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "HR tasks and reminders",
        "group": "HR Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/23_hr_create_task_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "HR create task",
        "group": "HR Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/24_hr_task_calendar_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "HR task calendar",
        "group": "HR Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/25_hr_chat_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "HR chat",
        "group": "HR Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/26_dean_dashboard_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Dean dashboard",
        "group": "Dean Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/27_dean_announcements_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Dean announcements",
        "group": "Dean Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/28_dean_department_overview_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Dean department overview",
        "group": "Dean Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/29_dean_manage_professors_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Dean manage professors",
        "group": "Dean Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/30_dean_documents_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Dean documents",
        "group": "Dean Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/31_dean_request_document_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Dean request document",
        "group": "Dean Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/32_dean_upload_document_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Dean upload document",
        "group": "Dean Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/33_dean_reports_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Dean reports",
        "group": "Dean Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/34_dean_upload_report_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Dean upload report",
        "group": "Dean Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/35_dean_schedule_dashboard_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Dean schedule dashboard",
        "group": "Dean Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/36_dean_create_schedule_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Dean create schedule",
        "group": "Dean Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/37_dean_curriculum_manager_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Dean curriculum manager",
        "group": "Dean Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/38_dean_schedule_view_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Dean schedule view",
        "group": "Dean Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/39_dean_schedule_sheet_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Dean schedule sheet",
        "group": "Dean Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/40_dean_availability_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Dean availability",
        "group": "Dean Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/41_dean_tasks_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Dean tasks",
        "group": "Dean Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/42_dean_task_calendar_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Dean task calendar",
        "group": "Dean Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/43_dean_chat_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Dean chat",
        "group": "Dean Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/44_dean_profile_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Dean profile",
        "group": "Dean Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/45_dean_change_password_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Dean change password",
        "group": "Dean Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/46_employee_dashboard_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Employee dashboard",
        "group": "Employee Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/47_employee_announcements_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Employee announcements",
        "group": "Employee Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/48_employee_departments_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Employee departments",
        "group": "Employee Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/49_employee_department_view_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Employee department view",
        "group": "Employee Module"
      },
      {
        "src": "assets/images/projects/ptc-workwise/50_employee_documents_ui.png",
        "width": 1920,
        "height": 1080,
        "caption": "Employee documents",
        "group": "Employee Module"
      }
    ],
    "links": {
      "live": null,
      "source": null
    },
    "credentials": [],
    "limitations": "The source repository is private and no public deployment exists. This portfolio presents the captured interface gallery and architecture documentation only."
  },
  {
    "id": "lakbaygo",
    "title": "LakbayGo",
    "kicker": "Travel Booking Platform",
    "category": "booking",
    "categoryLabel": "Booking Platform",
    "status": "in-development",
    "statusLabel": "Under Development",
    "featured": true,
    "summary": "A travel workflow connecting destination discovery, package booking, customer profiles, and administrative management.",
    "overview": "A travel booking platform presenting destinations, package details, customer booking tools, and profile screens, alongside administration for bookings, packages, destinations, reports, inquiries, and settings.",
    "problem": "Travel discovery, booking, customer records, and administration can easily become disconnected across separate tools.",
    "role": "Developer. Public and administrative interface design, booking workflow screens, dashboard layouts, and architecture documentation.",
    "users": "Travel customers and booking administrators.",
    "workflow": "Discover package → sign in → submit booking → manage profile. Administrators review and update the resulting records.",
    "features": [
      "Destination and travel package discovery",
      "Package detail views",
      "Customer login, account creation, and profile",
      "Trip booking workflow",
      "Admin bookings, destinations, and packages management",
      "Administrative reports and inquiry handling"
    ],
    "tech": [
      "HTML5",
      "CSS3",
      "JavaScript",
      "PHP",
      "Laravel",
      "MySQL",
      "Bootstrap",
      "REST API"
    ],
    "stack": {
      "Captured interface": [
        "HTML5",
        "CSS3",
        "JavaScript",
        "Responsive Layouts"
      ],
      "Documented architecture": [
        "PHP",
        "Laravel",
        "Blade",
        "MySQL",
        "REST API",
        "RBAC"
      ]
    },
    "cover": {
      "src": "assets/images/projects/lakbaygo/08-admin-dashboard.png",
      "width": 1351,
      "height": 1572,
      "alt": "LakbayGo travel administration dashboard"
    },
    "screenshots": [
      {
        "src": "assets/images/projects/lakbaygo/01-home.png",
        "width": 1351,
        "height": 2364,
        "caption": "Home page",
        "group": "Public & Authentication"
      },
      {
        "src": "assets/images/projects/lakbaygo/02-travel-packages.png",
        "width": 1351,
        "height": 1833,
        "caption": "Travel packages",
        "group": "Public & Authentication"
      },
      {
        "src": "assets/images/projects/lakbaygo/03-destination.png",
        "width": 1351,
        "height": 1238,
        "caption": "Destination page",
        "group": "Public & Authentication"
      },
      {
        "src": "assets/images/projects/lakbaygo/04-contact.png",
        "width": 1351,
        "height": 1393,
        "caption": "Contact page",
        "group": "Public & Authentication"
      },
      {
        "src": "assets/images/projects/lakbaygo/05-login.png",
        "width": 1366,
        "height": 1000,
        "caption": "Login",
        "group": "Public & Authentication"
      },
      {
        "src": "assets/images/projects/lakbaygo/06-create-account.png",
        "width": 1351,
        "height": 1332,
        "caption": "Create account",
        "group": "Public & Authentication"
      },
      {
        "src": "assets/images/projects/lakbaygo/07-package-details-boracay.png",
        "width": 1351,
        "height": 2436,
        "caption": "Package details — Boracay",
        "group": "Public & Authentication"
      },
      {
        "src": "assets/images/projects/lakbaygo/08-admin-dashboard.png",
        "width": 1351,
        "height": 1572,
        "caption": "Admin dashboard",
        "group": "Admin Module"
      },
      {
        "src": "assets/images/projects/lakbaygo/09-admin-bookings.png",
        "width": 1351,
        "height": 1026,
        "caption": "Admin bookings",
        "group": "Admin Module"
      },
      {
        "src": "assets/images/projects/lakbaygo/10-admin-destinations.png",
        "width": 1351,
        "height": 1176,
        "caption": "Admin destinations",
        "group": "Admin Module"
      },
      {
        "src": "assets/images/projects/lakbaygo/11-admin-packages.png",
        "width": 1351,
        "height": 1586,
        "caption": "Admin packages",
        "group": "Admin Module"
      },
      {
        "src": "assets/images/projects/lakbaygo/12-admin-reports.png",
        "width": 1351,
        "height": 3088,
        "caption": "Admin reports",
        "group": "Admin Module"
      },
      {
        "src": "assets/images/projects/lakbaygo/13-admin-inquiries.png",
        "width": 1351,
        "height": 1264,
        "caption": "Admin inquiries",
        "group": "Admin Module"
      },
      {
        "src": "assets/images/projects/lakbaygo/14-admin-settings.png",
        "width": 1351,
        "height": 2305,
        "caption": "Admin settings",
        "group": "Admin Module"
      },
      {
        "src": "assets/images/projects/lakbaygo/15-customer-dashboard.png",
        "width": 1351,
        "height": 1108,
        "caption": "Customer dashboard",
        "group": "Customer Module"
      },
      {
        "src": "assets/images/projects/lakbaygo/16-customer-book-new-trip.png",
        "width": 1351,
        "height": 1929,
        "caption": "Book a new trip",
        "group": "Customer Module"
      },
      {
        "src": "assets/images/projects/lakbaygo/17-customer-my-profile.png",
        "width": 1351,
        "height": 1731,
        "caption": "Customer profile",
        "group": "Customer Module"
      }
    ],
    "links": {
      "live": null,
      "source": null
    },
    "credentials": [],
    "limitations": "No public booking deployment or verified public source repository exists. This portfolio presents the captured interface gallery and architecture documentation only."
  },
  {
    "id": "mobile-it-inventory",
    "title": "Mobile IT Inventory Scanner",
    "kicker": "Mobile Inventory & Asset Management",
    "category": "mobile",
    "categoryLabel": "Mobile",
    "status": "demo",
    "statusLabel": "Local Demo",
    "featured": true,
    "summary": "A mobile-first equipment workflow for asset registration, record search, and QR-supported inventory tasks.",
    "overview": "A mobile-first equipment workflow for registration, validation, record search, offline storage, and QR-supported inventory tasks. The demo included in this portfolio is fully functional and stores records in your browser.",
    "problem": "Manual asset lists require repetitive data entry and make equipment difficult to locate, validate, and audit.",
    "role": "Sole developer. Mobile-first interface, accessible tab navigation, duplicate-code validation, search filtering, and LocalStorage persistence.",
    "users": "School and small-organisation IT inventory staff.",
    "workflow": "Scan or enter a code → search local records → register or update the asset → synchronise and report.",
    "features": [
      "Equipment registration with duplicate-code prevention",
      "Asset code lookup (QR scan simulation)",
      "Local record search and filtering",
      "Keyboard-operable tab navigation",
      "Live status messaging"
    ],
    "tech": [
      "HTML5",
      "CSS3",
      "JavaScript",
      "LocalStorage",
      "Flutter",
      "Dart",
      "Laravel",
      "MySQL",
      "SQLite"
    ],
    "stack": {
      "Demo build": [
        "HTML5",
        "CSS3",
        "JavaScript",
        "LocalStorage",
        "Accessible Tabs"
      ],
      "Documented architecture": [
        "Flutter",
        "Dart",
        "Laravel API",
        "MySQL",
        "SQLite",
        "Sanctum Tokens"
      ]
    },
    "cover": null,
    "screenshots": [],
    "links": {
      "live": null,
      "demo": "projects/mobile-inventory.html",
      "source": null
    },
    "credentials": [
      {
        "label": "Access",
        "value": "No credentials required — records stay in your browser"
      }
    ],
    "limitations": "The browser demo has no native camera, real QR decoder, server authentication, remote API, or cross-device synchronisation. Preview screenshots are being prepared."
  },
  {
    "id": "jpcs-ptc-website",
    "title": "JPCS PTC Website",
    "kicker": "Organisation & Membership Website",
    "category": "website",
    "categoryLabel": "Website",
    "status": "in-development",
    "statusLabel": "Under Development",
    "featured": false,
    "summary": "An organisation website covering public information, events, membership applications, officers, and member access.",
    "overview": "A public and member-facing website for the Junior Philippine Computer Society chapter at Pateros Technological College, covering organisation identity, events, officers, membership applications, inquiries, and member access.",
    "problem": "Organisation information and membership actions need one structured, responsive destination instead of scattered posts and forms.",
    "role": "Developer. Public and member-facing page design, membership application flow, and events and officers components.",
    "users": "Prospective members, current members, officers, campus users, and school stakeholders.",
    "workflow": "Discover information → submit membership or inquiry → administrator review → authorised member access.",
    "features": [
      "Organisation identity and event information",
      "Membership application workflow",
      "Officers directory",
      "Contact and inquiry handling",
      "Authenticated member area"
    ],
    "tech": [
      "HTML5",
      "CSS3",
      "JavaScript",
      "PHP",
      "MySQL",
      "Bootstrap"
    ],
    "stack": {
      "Captured interface": [
        "HTML5",
        "CSS3",
        "JavaScript",
        "Bootstrap"
      ],
      "Documented architecture": [
        "PHP",
        "MySQL",
        "Session Auth",
        "RBAC"
      ]
    },
    "cover": {
      "src": "assets/images/projects/jpcs/jpcs-home.png",
      "width": 1871,
      "height": 920,
      "alt": "JPCS PTC organisation website home page"
    },
    "screenshots": [
      {
        "src": "assets/images/projects/jpcs/jpcs-home.png",
        "width": 1871,
        "height": 920,
        "caption": "Organisation home page"
      }
    ],
    "links": {
      "live": null,
      "source": null
    },
    "credentials": [],
    "limitations": "The previously supplied live address returned 404 during verification, so no live button is shown. This portfolio presents a screenshot-backed case study instead."
  }
];
