/* Experience data as a classic script so the portfolio works from direct file opening,
   a local server, and Vercel without any runtime fetch.

   Project delivery records are NOT duplicated here — they are derived from
   window.PORTFOLIO_PROJECTS so there is exactly one authoritative project
   dataset. This file holds only the responsibility groups. */

window.PORTFOLIO_EXPERIENCE = [
  {
    id: "it-support",
    eyebrow: "IT Technical Support",
    title: "Keeping people, devices, and systems working",
    groups: [
      {
        title: "Devices & software",
        items: [
          "Desktop and laptop troubleshooting",
          "Windows workstation support",
          "Software installation and configuration",
          "Device setup and deployment"
        ]
      },
      {
        title: "Connectivity & peripherals",
        items: [
          "Printer setup and troubleshooting",
          "Network and Wi-Fi connectivity checks",
          "Microsoft 365 and Outlook support",
          "User assistance and issue resolution"
        ]
      },
      {
        title: "Assets & inventory",
        items: [
          "IT equipment inventory",
          "Asset identification and documentation",
          "QR and barcode asset workflows",
          "Equipment auditing and record keeping"
        ]
      }
    ]
  },
  {
    id: "freelance-dev",
    eyebrow: "Freelance Full-Stack Development",
    title: "Planning, building, and delivering working systems",
    groups: [
      {
        title: "Planning",
        items: ["Requirement analysis", "UI and workflow planning", "Database design"]
      },
      {
        title: "Implementation",
        items: [
          "Responsive front-end development",
          "Back-end implementation",
          "Authentication and permissions",
          "CRUD functionality and dashboards"
        ]
      },
      {
        title: "Delivery",
        items: [
          "Testing and debugging",
          "Demo preparation",
          "Deployment and documentation"
        ]
      }
    ]
  }
];
