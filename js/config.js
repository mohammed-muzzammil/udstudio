/*
  UD Studio — site settings.
  Every page reads this file. Change a value here and it updates everywhere.
  Anything marked TODO is a placeholder waiting for the studio's real details.
*/

// Placeholder photos are free Unsplash images. Swap each for the studio's own
// photo path, e.g. "assets/img/ivory/living-1.jpg", once the photos arrive.
const U = (id, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

window.SITE = {
  name: "UD Studio",
  fullName: "Umme's Design Studio",

  // ── Contact ─────────────────────────────────────────────
  phoneDisplay: "+91 00000 00000",      // TODO
  phoneTel: "+910000000000",            // TODO
  whatsapp: "910000000000",             // TODO: country code + number, digits only
  email: "hello@udstudio.in",           // TODO
  hours: "Mon – Sat · 10:00 am – 7:00 pm", // TODO
  city: "Your City",                    // TODO, e.g. "Nagpur"
  address: "Studio address, Area, City, State 000000", // TODO
  mapsLink: "",                         // TODO: Google Maps share link
  instagram: "",                        // TODO: https://instagram.com/…
  pinterest: "",                        // optional
  linkedin: "",                         // optional

  // ── Enquiry form ────────────────────────────────────────
  // Free: get an access key at https://web3forms.com with the inbox that should
  // receive enquiries, then paste it here. Without a key the form opens the
  // visitor's email app with the message filled in, so nothing is lost.
  web3formsKey: "",                     // TODO

  // ── Studio numbers (shown on Home and Studio) ───────────
  // TODO: replace with real figures, or delete a line to hide it.
  stats: [
    { value: 8,   suffix: "+", label: "Years designing homes" },
    { value: 120, suffix: "+", label: "Homes delivered" },
    { value: 25,  suffix: "+", label: "Offices & commercial spaces" },
    { value: 6,   suffix: "",  label: "Cities" }
  ],

  // ── Founder (Studio page) ───────────────────────────────
  founder: {
    name: "Umme",                       // TODO: full name
    role: "Founder & Principal Designer",
    photo: U("photo-1788927775194-70e9b280dd79", 1200), // TODO: founder portrait
    bio: [
      "TODO: two or three lines about Umme — training, the kind of homes she loves designing, and what clients can expect when they work with her.",
      "TODO: a second paragraph on how the studio works — a small team that stays with each home from first sketch to handover."
    ]
  },

  // ── Client words ────────────────────────────────────────
  // TODO: replace with real client quotes (with their permission).
  testimonials: [
    { quote: "Client quote goes here. A line or two on how it felt to work with the studio and how the home feels now.", name: "Client name", place: "3BHK apartment, City" },
    { quote: "Second client quote. Ideally about something specific — the kitchen that finally works, the light in the living room.", name: "Client name", place: "Villa, City" },
    { quote: "Third client quote, perhaps from an office or commercial client, to show the range of work.", name: "Client name", place: "Office, City" }
  ],

  // ── Featured projects ───────────────────────────────────
  // The first two are featured on the Home page. Add more and they appear on the
  // Work page. Rooms show as tabs; add as many images per room as you like.
  // video.src: an .mp4 path/URL, a YouTube link, or an Instagram reel link.
  projects: [
    {
      slug: "ivory-residence",
      name: "The Ivory Residence",       // TODO: real project name
      kind: "Home",
      type: "4BHK apartment",            // TODO
      location: "City",                  // TODO
      area: "2,400 sq ft",               // TODO
      year: "2025",                      // TODO
      scope: "Full home interiors · Turnkey",
      summary: "TODO: two lines on the brief — who lives here, what they wanted the home to feel like, and the one idea that shaped the design.",
      palette: ["#F3ECE5", "#D9C6B5", "#A9786B", "#3D1108"],
      cover: U("photo-1682184805271-11671b7ecf4c", 2000),
      rooms: [
        { name: "Living room", images: [U("photo-1682184805271-11671b7ecf4c"), U("photo-1618221195710-dd6b41faaea6")] },
        { name: "Bedroom",     images: [U("photo-1757344454333-cc666252e596"), U("photo-1616594039964-ae9021a400a0")] },
        { name: "Kitchen",     images: [U("photo-1683629357963-adf2b1fa9ad9"), U("photo-1638886043487-72d203fa66b6")] },
        { name: "Dining",      images: [U("photo-1635108197695-05184e426907")] },
        { name: "Bath",        images: [U("photo-1753605788101-04d1e653e74a")] }
      ],
      video: { src: "", poster: U("photo-1618221195710-dd6b41faaea6", 1800) } // TODO: walkthrough video
    },
    {
      slug: "teak-house",
      name: "The Teak House",            // TODO: real project name
      kind: "Home",
      type: "3BHK villa",                // TODO
      location: "City",                  // TODO
      area: "3,100 sq ft",               // TODO
      year: "2024",                      // TODO
      scope: "Full home interiors · Modular kitchen",
      summary: "TODO: two lines on the brief — who lives here, what they wanted the home to feel like, and the one idea that shaped the design.",
      palette: ["#EFE7DD", "#C9B39C", "#7D7F63", "#2A1410"],
      cover: U("photo-1745429523617-0d837856ca35", 2000),
      rooms: [
        { name: "Living room", images: [U("photo-1745429523617-0d837856ca35"), U("photo-1787390629829-abb32b3025c5")] },
        { name: "Kitchen",     images: [U("photo-1745429523635-ad375f836bf2"), U("photo-1745429523615-2a82c60bfc02")] },
        { name: "Bedroom",     images: [U("photo-1617098900591-3f90928e8c54")] },
        { name: "Dining",      images: [U("photo-1600488999806-8efb986d87b1")] },
        { name: "Details",     images: [U("photo-1642689703515-1dcf91a784a5"), U("photo-1667312939978-64cf31718a6e")] }
      ],
      video: { src: "", poster: U("photo-1745429523615-2a82c60bfc02", 1800) } // TODO: walkthrough video
    }
  ],

  // ── Hero: the room starts at dusk and its lights switch on ──
  // Use a photo with lamps you can see. Each light is a position on the photo,
  // in % from the left and top, with a glow size in % of the photo's width.
  // The first light is where the light spreads from when the switch is tapped.
  hero: {
    image: U("photo-1682184805271-11671b7ecf4c", 1600),
    lights: [
      { x: 34, y: 33, size: 34 },
      { x: 53, y: 35, size: 34 },
      { x: 50, y: 25, size: 60, soft: true }
    ]
  },

  // ── Extra photos for the "Rooms we've designed" gallery ──
  // Every room photo from the projects above appears there automatically.
  // Add more sample photos here: { src, cat, label }. cat is the filter name.
  gallery: [
    { src: U("photo-1616594039964-ae9021a400a0", 1200), cat: "Bedroom",  label: "Master bedroom" },
    { src: U("photo-1686023858216-4f54c853acf2", 1200), cat: "Kitchen",  label: "Island kitchen" },
    { src: U("photo-1598928506311-c55ded91a20c", 1200), cat: "Living",   label: "Living room" },
    { src: U("photo-1505693416388-ac5ce068fe85", 1200), cat: "Bedroom",  label: "Guest bedroom" },
    { src: U("photo-1706820229870-f9a8c6dac193", 1200), cat: "Dining",   label: "Dining room" },
    { src: U("photo-1742134131017-44d377a611b1", 1200), cat: "Bathroom", label: "Bathroom" },
    { src: U("photo-1706074797611-a02f9ed06439", 1200), cat: "Office",   label: "Office lounge" },
    { src: U("photo-1706074793638-da28b90ea8ae", 1200), cat: "Office",   label: "Conference room" },
    { src: U("photo-1628744876497-eb30460be9f6", 1200), cat: "Living",   label: "Living room" },
    { src: U("photo-1731336478850-6bce7235e320", 1200), cat: "Bedroom",  label: "Wardrobe & bed wall" }
  ],

  // Images used around the site (swap for the studio's own when ready)
  images: {
    sketch:    U("photo-1618221195710-dd6b41faaea6", 1800),
    statement: [U("photo-1667312939978-64cf31718a6e", 400), U("photo-1612196808827-9ff25cb6137a", 400), U("photo-1642689703515-1dcf91a784a5", 400)],
    arch:      U("photo-1788927775194-70e9b280dd79", 1400),
    studio:    U("photo-1603901622056-0a5bee231395", 1600),
    contact:   U("photo-1719760518176-e124a5bcd025", 1600),
    services: {
      homes:      U("photo-1593987314040-8e0ac84ae724", 900),
      kitchens:   U("photo-1683629357963-adf2b1fa9ad9", 900),
      wardrobes:  U("photo-1731336478850-6bce7235e320", 900),
      renovation: U("photo-1600298997393-a06f24d3df68", 900),
      office:     U("photo-1706074797611-a02f9ed06439", 900),
      styling:    U("photo-1642689703515-1dcf91a784a5", 900),
      turnkey:    U("photo-1498075702571-ecb018f3752d", 900)
    }
  },

  builtBy: "Muzzammil"
};
