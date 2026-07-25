/* Skill and technology data as a classic script so the portfolio works from
   direct file opening, a local server, and Vercel without any runtime fetch.

   No proficiency levels, percentages, or years are stored here by design:
   the stack is presented as the toolset used across the systems in this
   portfolio, and the capability groups describe work performed, not rankings. */

/* Flat technology list used to build the animated stack marquee.
   `icon` maps to assets/icons/tech/<icon>.svg — all stored
   locally so they render offline and during direct file opening. */
window.PORTFOLIO_SKILLS = [
  { name: "HTML5", icon: "html5", category: "Front-End" },
  { name: "CSS3", icon: "css3", category: "Front-End" },
  { name: "JavaScript", icon: "javascript", category: "Front-End" },
  { name: "TypeScript", icon: "typescript", category: "Front-End" },
  { name: "Bootstrap", icon: "bootstrap", category: "Front-End" },
  { name: "Tailwind CSS", icon: "tailwind", category: "Front-End" },
  { name: "React", icon: "react", category: "Front-End" },
  { name: "Angular", icon: "angular", category: "Front-End" },
  { name: "Next.js", icon: "nextjs", category: "Front-End" },
  { name: "PHP", icon: "php", category: "Back-End" },
  { name: "Laravel", icon: "laravel", category: "Back-End" },
  { name: "CodeIgniter", icon: "codeigniter", category: "Back-End" },
  { name: "C#", icon: "csharp", category: "Back-End" },
  { name: "ASP.NET Core", icon: "dotnetcore", category: "Back-End" },
  { name: "MySQL", icon: "mysql", category: "Database" },
  { name: "MariaDB", icon: "mariadb", category: "Database" },
  { name: "SQL Server", icon: "sqlserver", category: "Database" },
  { name: "Flutter", icon: "flutter", category: "Mobile" },
  { name: "Dart", icon: "dart", category: "Mobile" },
  { name: "Git", icon: "git", category: "Tools" },
  { name: "GitHub", icon: "github", category: "Tools" },
  { name: "Vercel", icon: "vercel", category: "Tools" },
  { name: "Visual Studio Code", icon: "vscode", category: "Tools" }
];

/* Capability groups. Each entry describes work actually performed across the
   systems documented in this portfolio and in day-to-day IT support. */
window.PORTFOLIO_SKILL_GROUPS = [
  {
    id: "frontend",
    title: "Front-End Development",
    description: "Interfaces built for real operational use, on every screen size.",
    items: [
      "Responsive web design",
      "Component-based UI design",
      "Dashboard and admin interfaces",
      "Accessible, keyboard-operable interfaces",
      "Form design and client-side validation",
      "Light and dark theme systems"
    ]
  },
  {
    id: "backend",
    title: "Back-End & API Development",
    description: "Server-side logic, access control, and the workflows behind the screens.",
    items: [
      "REST API development and integration",
      "Authentication and authorization",
      "Role-based access control",
      "Server-side validation",
      "File upload and document handling",
      "Session and account management"
    ]
  },
  {
    id: "database",
    title: "Database & System Architecture",
    description: "Data models planned from the workflow, not bolted on afterwards.",
    items: [
      "Relational database design (ERD)",
      "SQL and query optimisation",
      "CRUD operations and data integrity",
      "Requirements analysis",
      "UML and flowchart documentation",
      "Technical documentation"
    ]
  },
  {
    id: "support",
    title: "IT Technical Support & Deployment",
    description: "Hands-on support for the people, devices, and systems that run day to day.",
    items: [
      "Windows workstation support",
      "Hardware and software troubleshooting",
      "Printer setup and troubleshooting",
      "Network and connectivity checks",
      "Microsoft 365 and Outlook support",
      "IT asset inventory and QR/barcode workflows",
      "System deployment and testing",
      "User technical support"
    ]
  }
];
