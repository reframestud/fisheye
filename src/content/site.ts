export const site = {
  name: "FISHEYE",
  legalName: "FISHEYE Architecture & Design",
  tagline: "Architecture & Design",
  phone: "+34 695 658 669",
  phoneHref: "tel:+34695658669",
  email: "fisheye.info@gmail.com",
  emailHref: "mailto:fisheye.info@gmail.com",
  address: "29660 Nueva Andalucía, Marbella, Málaga",
  website: "www.fisheye-interior.com",
  hours: "Weekdays 10:00-19:00",
  whatsapp: "https://api.whatsapp.com/send?phone=34695658669&text=Hello!%20Need%20a%20project",
  telegram: "https://t.me/fisheye_design",
  instagram: "https://www.instagram.com/interior_design_fisheye/",
  behance: "https://www.behance.net/fisheye_studio",
  pinterest: "https://ru.pinterest.com/fisheyepr/",
  stats: [
    { value: "227", label: "Projects designed and implemented" },
    { value: "25", label: "Designers, visualizers, managers" },
    { value: "14", label: "Years since 2009" },
    { value: "19", label: "Cities across our geography" },
  ],
  nav: [
    { href: "/projects", label: "Projects" },
    { href: "/workscheme", label: "Work scheme" },
    { href: "/studio", label: "Studio" },
    { href: "/contact", label: "Contact" },
    { href: "/request", label: "Request" },
  ],
} as const;

export const homeCopy = {
  offer:
    "Timeless, technology-ready interiors for villas and luxury apartments in Marbella.",
  support:
    "Design, on-site author’s supervision, and FF&E procurement, so your property looks better and sells faster.",
  cta: "Start a project",
};

/**
 * Homepage “three worlds”: typology moods grounded in real portfolio projects,
 * not a duplicate of the Selected work case-study strip.
 * Assumption: Villa / Apartment / Coastal from Marbesa, La Alzambra, Miradores Del Sol.
 */
export const homeWorlds = [
  {
    id: "villas",
    label: "Villas",
    mood: "Large-format Marbella residences shaped for light, volume, and market readiness.",
    projectSlug: "marbesa",
  },
  {
    id: "apartments",
    label: "Apartments",
    mood: "Compact luxury living with natural materials and measured accent colour.",
    projectSlug: "apartment-interior-design-in-marbella-la-alzambra",
  },
  {
    id: "coastal",
    label: "Coastal houses",
    mood: "Hillside and coast homes tuned to Mediterranean light and outdoor living.",
    projectSlug: "private-house-interior-design-in-malaga-miradores-del-sol",
  },
] as const;

/** Cinematic Selected work strip: flagship case studies distinct from world tiles. */
export const homeSelectedSlugs = [
  "altos-puente-romano",
  "apartment-interior-design-in-marbella-real-de-la-quinta",
  "apartment-interior-design-in-marbella-modern-cosiness",
] as const;

/** Three offer marks for the homepage pillars band (Design / Supervision / FF&E). */
export const offerMarks = ["Design", "Supervision", "FF&E"] as const;

/**
 * Horizontal dossier cards for Design / Supervision / FF&E.
 * Bodies and plates drawn from existing studio copy and photography only.
 */
export const offerCards = [
  {
    title: "Design",
    body: "Concept, working drawings, and visualization so every room is agreed before build.",
    image: "/images/home/home-01.jpg",
    alt: "Designed Marbella dining and living interior with marble and wood detailing",
  },
  {
    title: "Supervision",
    body: "On-site author’s supervision with weekly visits and photo reports until handover.",
    image: "/images/workscheme/site-07.jpg",
    alt: "Material samples photographed on site during author’s supervision",
  },
  {
    title: "FF&E",
    body: "Furniture, fixtures, and equipment procurement: schedules, salon visits, and delivery checks.",
    image: "/images/workscheme/site-05.jpg",
    alt: "Flooring and finish samples selected for a FISHEYE project",
  },
] as const;

export const pillars = [
  {
    title: "Schedule",
    body: "Work is divided into stages with a contract timetable updated daily. Progress stays visible.",
  },
  {
    title: "Team",
    body: "Each project has a chief designer, lead designer, visualizer, and administrator, available when you need them.",
  },
  {
    title: "Cities",
    body: "Based in Marbella for in-person delivery, with remote supervision when projects travel.",
  },
  {
    title: "Guarantees",
    body: "We work under contract, take responsibility for agreed work, and see projects through.",
  },
  {
    title: "Budget",
    body: "Implementation costs are discussed and recorded. Projects stay within the agreed envelope.",
  },
  {
    title: "Implementation",
    body: "We bring designs to life with contractors who share a culture of precise, respectful finishing.",
  },
] as const;

export const testimonials = [
  {
    name: "Natalia",
    place: "Imara",
    quote:
      "Pleasant, professional communication: flexibility and a real understanding of repair processes. Working with Alexander is word and deed.",
  },
  {
    name: "Marina",
    place: "La Resina Golf",
    quote:
      "Excellent team: clear, high quality, and operational. Special thanks to Alexander for supervising the dream apartment.",
  },
  {
    name: "Nikolai",
    place: "Miradores Del Sol",
    quote:
      "Creative design, inspiring support throughout. We feel aesthetic pleasure every time we come home.",
  },
  {
    name: "Christina Tsiglis",
    place: "Client",
    quote:
      "Each FISHEYE project is individual. They hear wishes, work with colour, and author’s supervision finds the best option on site.",
  },
] as const;

import teamData from "@/content/team.json";

export const team = teamData;

export const workSteps = [
  {
    title: "Contacting the studio",
    body: "Call, email, WhatsApp, or Telegram. The chief designer advises on timing, order, and cost, or you can request a commercial offer.",
    plate: {
      src: "/images/workscheme/site-01.jpg",
      alt: "FISHEYE site process during a project",
    },
  },
  {
    title: "First meeting",
    body: "In person or by video with the chief designer: plans, wishes, timeframe, and budget, with honest terms and never empty promises.",
    plate: {
      src: "/images/workscheme/site-07.jpg",
      alt: "Project site during early coordination",
    },
  },
  {
    title: "Contract and schedule",
    body: "Electronic contract with a stage timetable updated daily, including review windows for your comments.",
    plate: {
      src: "/images/workscheme/site-11.jpg",
      alt: "On-site work after the project schedule begins",
    },
  },
  {
    title: "Measurements",
    body: "Laser survey and photography on site. A measurement plan in 1-2 working days anchors every later drawing.",
    plate: {
      src: "/images/workscheme/measure-plan.jpeg",
      alt: "Measurement plan of the apartment as surveyed",
    },
  },
  {
    title: "Technical specifications",
    body: "Questionnaire, references, and an approved brief album (usually 2-4 working days).",
    plate: {
      src: "/images/workscheme/viz-06.jpeg",
      alt: "Interior visualization used while agreeing the brief",
    },
  },
  {
    title: "Planning solutions",
    body: "Three layout options that respect structure and wet zones, then one refined plan (3-5 days to develop).",
    plate: {
      src: "/images/workscheme/layout-final.jpeg",
      alt: "Final layout option after refinement",
    },
    gallery: [
      {
        src: "/images/workscheme/measure-plan.jpeg",
        alt: "Measurement plan before layout options",
        caption: "Measurement plan",
      },
      {
        src: "/images/workscheme/layout-01.jpeg",
        alt: "Layout option 1",
        caption: "Option 1",
      },
      {
        src: "/images/workscheme/layout-02.jpeg",
        alt: "Layout option 2",
        caption: "Option 2",
      },
      {
        src: "/images/workscheme/layout-03.jpeg",
        alt: "Layout option 3",
        caption: "Option 3",
      },
      {
        src: "/images/workscheme/layout-final.jpeg",
        alt: "Final layout option",
        caption: "Final layout",
      },
    ],
  },
  {
    title: "Visualization",
    body: "Concept collages then photorealistic renders for every room (typically 10-25 working days by area).",
    plate: {
      src: "/images/workscheme/viz-03.jpeg",
      alt: "Photorealistic interior visualization",
    },
    gallery: [
      {
        src: "/images/workscheme/viz-03.jpeg",
        alt: "Interior visualization view",
        caption: "Viz",
      },
      {
        src: "/images/workscheme/viz-04.jpeg",
        alt: "Interior visualization view",
        caption: "Viz",
      },
      {
        src: "/images/workscheme/viz-05.jpeg",
        alt: "Interior visualization view",
        caption: "Viz",
      },
      {
        src: "/images/workscheme/viz-08.jpeg",
        alt: "Interior visualization view",
        caption: "Viz",
      },
      {
        src: "/images/workscheme/viz-09.jpeg",
        alt: "Interior visualization view",
        caption: "Viz",
      },
      {
        src: "/images/workscheme/viz-10.jpeg",
        alt: "Interior visualization view",
        caption: "Viz",
      },
    ],
  },
  {
    title: "Drawings",
    body: "Full working set for builders: demolition, furniture, lighting, electrics, floors, ceilings, and custom elements.",
    plate: {
      src: "/images/workscheme/layout-01.jpeg",
      alt: "Working layout drawing from the design set",
    },
  },
  {
    title: "Bill of materials",
    body: "Excel schedule of finishes, furniture, plumbing, and light: quantities, sources, and average market prices.",
    plate: {
      src: "/images/workscheme/site-02.jpg",
      alt: "Materials and finishes arriving on site",
    },
  },
  {
    title: "Procurement & supervision",
    body: "Supplier proposals, salon visits, delivery checks, weekly site visits, and photo reports until handover.",
    plate: {
      src: "/images/workscheme/site-05.jpg",
      alt: "Author’s supervision visit on the construction site",
    },
    gallery: [
      {
        src: "/images/workscheme/site-03.jpg",
        alt: "Site progress during supervision",
        caption: "Site",
      },
      {
        src: "/images/workscheme/site-04.jpg",
        alt: "Site progress during supervision",
        caption: "Site",
      },
      {
        src: "/images/workscheme/site-06.jpg",
        alt: "Site progress during supervision",
        caption: "Site",
      },
      {
        src: "/images/workscheme/site-09.jpg",
        alt: "Site progress during supervision",
        caption: "Site",
      },
      {
        src: "/images/workscheme/site-12.jpg",
        alt: "Site progress during supervision",
        caption: "Site",
      },
    ],
  },
] as const;
