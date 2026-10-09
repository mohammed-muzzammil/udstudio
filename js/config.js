/*
  UD Studio — site settings.
  Every page reads this file. Change a value here and it updates everywhere.
*/

// Project photo paths
const K = name => `assets/img/khajur/${name}.jpg`;
const H = name => `assets/img/husaini/${name}.jpg`;

window.SITE = {
  name: "UD Studio",
  fullName: "Umme's Design Studio",

  // ── Contact ─────────────────────────────────────────────
  phoneDisplay: "+91 93593 12288",
  phoneTel: "+919359312288",
  whatsapp: "919359312288",             // country code + number, digits only
  email: "aayeman02@gmail.com",
  hours: "",                            // e.g. "Mon – Sat · 10:00 am – 7:00 pm" (hidden while empty)
  city: "Nagpur",
  address: "Shantinagar, Nagpur, Maharashtra",
  mapsLink: "",                         // Google Maps share link (optional)
  instagram: "https://www.instagram.com/ummedesign_studio/",
  instagramHandle: "@ummedesign_studio",
  pinterest: "",
  linkedin: "",

  // ── Enquiry form ────────────────────────────────────────
  // Without a key, the form opens WhatsApp with the enquiry filled in.
  // To receive enquiries in the email inbox instead: get a free access key at
  // https://web3forms.com using the email above, and paste it here.
  web3formsKey: "",

  // ── Studio numbers ──────────────────────────────────────
  // Add only real figures, e.g. { value: 50, suffix: "+", label: "Homes designed" }.
  // The numbers row stays hidden while this list is empty.
  stats: [],

  // ── Founder (Studio page) ───────────────────────────────
  founder: {
    name: "Umme Aayeman",
    role: "Founder & Interior Designer",
    photo: "",                          // optional portrait; the UD Studio mark is shown while empty
    bio: [
      "Umme Aayeman is the founder of UD Studio, an interior design studio based in Shantinagar, Nagpur.",
      "The studio designs complete homes, from living rooms and bedrooms to kitchens and wardrobes, as well as offices, cafés and restaurants. Every project starts with how the people using the space live and work, and every detail is planned around them."
    ]
  },

  // ── Client words ────────────────────────────────────────
  // Approved by each family (Oct 2026). Set approved: false to hide a quote.
  // showClientNames: false shows "Homeowners" instead of the family's name.
  showClientNames: true,
  testimonials: [
    { approved: true, project: "fazal-residence", name: "Mr & Mrs Fazal",
      quote: "Umme understood exactly how we wanted our home to feel. Every room is warm, practical and beautifully finished, and we still notice new details every day." },
    { approved: true, project: "kaludi-residence", name: "Mr & Mrs Kaludi",
      quote: "From the first meeting to the final finishing, the process was smooth and stress-free. Our home looks better than we imagined." },
    { approved: true, project: "engineer-residence", name: "Mr & Mrs Engineer",
      quote: "The room turned out elegant and comfortable at the same time. Thank you, UD Studio, for the care you put into every detail." }
  ],

  // ── Projects ────────────────────────────────────────────
  // The first two are featured on the Home page; all appear on the Work page.
  // Rooms show as tabs and feed the "Rooms we've designed" gallery (category =
  // the gallery filter). Client names stay private unless showClientNames is true.
  projects: [
    {
      slug: "fazal-residence",
      name: "Mr & Mrs Fazal's Residence",
      client: "Mr & Mrs Fazal",
      kind: "Home",
      type: "Complete home",
      location: "Nagpur",
      area: "",                          // e.g. "2,400 sq ft" (hidden while empty)
      year: "",                          // e.g. "2026" (hidden while empty)
      scope: "Complete home interiors",
      summary: "A warm, layered family home. A swing anchors the living room, fluted wood frames the entrance, the master bedroom sits under a glowing arched headboard in plum and ivory, and the second bedroom is built around a deep-blue window seat.",
      palette: ["#EEE7DE", "#A0522D", "#4B2A3A", "#1F3A56"],
      cover: K("living-1"),
      rooms: [
        { name: "Living room",    category: "Living",            images: [K("living-1"), K("living-2"), K("living-3"), K("living-4"), K("living-5"), K("living-6")] },
        { name: "Console & mirrors", category: "Entrance & details", images: [K("entrance-1")] },
        { name: "Kitchen",        category: "Kitchen",           images: [K("kitchen-1"), K("kitchen-2"), K("kitchen-3")] },
        { name: "Master bedroom", category: "Bedroom",           images: [K("master-1"), K("master-2"), K("master-3"), K("master-4"), K("master-5"), K("master-6"), K("master-7"), K("master-8"), K("master-9")] },
        { name: "Second bedroom", category: "Bedroom",           images: [K("bedroom2-1"), K("bedroom2-2"), K("bedroom2-5"), K("bedroom2-3"), K("bedroom2-4"), K("bedroom2-6"), K("bedroom2-7"), K("bedroom2-8"), K("bedroom2-9"), K("bedroom2-10"), K("bedroom2-11"), K("bedroom2-12"), K("bedroom2-13")] },
        { name: "Study & display", category: "Kids & study",     images: [K("study-1"), K("study-2")] }
      ],
      video: { src: "assets/video/khajur-walkthrough.mp4", poster: "assets/video/khajur-walkthrough.jpg", vertical: true }
    },
    {
      slug: "kaludi-residence",
      name: "Mr & Mrs Kaludi's Residence",
      client: "Mr & Mrs Kaludi",
      kind: "Home",
      type: "Complete home",
      location: "Nagpur",
      area: "",
      year: "",
      scope: "Complete home interiors",
      summary: "Bright, clean and easy to live in. Arched wall panels and a rust-orange sofa in the living room, a mint-and-white kitchen that opens onto the dining table, and a playful kids' room with a little house-shaped shelf.",
      palette: ["#F4F1EC", "#C8642E", "#A9C2B6", "#6B4A33"],
      cover: H("living-1"),
      rooms: [
        { name: "Living room", category: "Living",             images: [H("living-1"), H("living-2")] },
        { name: "Main door",   category: "Entrance & details", images: [H("door-1")] },
        { name: "Dining",      category: "Dining",             images: [H("dining-1")] },
        { name: "Kitchen",     category: "Kitchen",            images: [H("kitchen-1")] },
        { name: "Kids' room",  category: "Kids & study",       images: [H("kids-1"), H("kids-2")] },
        { name: "Details",     category: "Entrance & details", images: [H("wash-1"), H("ceiling-1")] }
      ],
      video: { src: "assets/video/husaini-walkthrough.mp4", poster: "assets/video/husaini-walkthrough.jpg", vertical: true }
    },
    {
      slug: "engineer-residence",
      name: "Mr & Mrs Engineer's Residence",
      client: "Mr & Mrs Engineer",
      kind: "Bedroom",
      type: "Bedroom",
      location: "Nagpur",
      area: "",
      year: "",
      scope: "Bedroom interiors",
      summary: "A calm bedroom in grey and teal: a quilted headboard, a full-height wardrobe in white and slate, a study corner lit by brass wall lights, and a cushioned window seat.",
      palette: ["#EDEBE7", "#5E6A70", "#2F5D63", "#B08D57"],
      cover: "assets/video/reel-bedroom.jpg",
      rooms: [],
      video: { src: "assets/video/reel-bedroom.mp4", poster: "assets/video/reel-bedroom.jpg", vertical: true, sound: true }
    }
  ],

  // ── Latest reel (Home page, phone frame) ────────────────
  reel: { project: "engineer-residence", title: "A calm bedroom in grey and teal" },

  // ── Hero: night view (gold lines) ⟷ day view ─────────
  // image: a still of the room (used to draw the night view). video (optional)
  // plays in the day view. lights: lamp positions in % from the left and top;
  // the first is where the light spreads from when the switch is tapped.
  hero: {
    image: "assets/video/hero-bedroom.jpg",
    video: "assets/video/hero-bedroom.mp4",
    lights: [{ x: 55, y: 24, size: 30 }]
  },

  // Extra photos for the gallery beyond the project rooms: { src, cat, label }
  gallery: [],

  // Photos used around the site
  images: {
    sketch:    K("bedroom2-1"),
    statement: [K("bedroom2-12"), K("study-2"), H("kids-2")],
    arch:      K("entrance-1"),
    contact:   H("living-1"),
    services: {
      homes:     K("living-1"),
      kitchens:  K("kitchen-1"),
      wardrobes: K("bedroom2-9"),
      bedrooms:  K("master-1"),
      living:    H("living-1")
    }
  },

  builtBy: "Muzzammil"
};
