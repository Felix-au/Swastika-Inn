export const HOTEL_INFO = {
  name: "Hotel Swastika Inn",
  subtitle: "Rooms • Banquet • Lawn",
  tagline: "Ayodhya Dham's Premier Hospitality & Celebration Haven",
  phonePrimary: "+916393556011",
  phoneSecondary: "+919415406011",
  phoneDisplayPrimary: "+91 63935 56011",
  phoneDisplaySecondary: "+91 94154 06011",
  email: "swastika.ayodhyaji@gmail.com",
  address: "Near Muhavara Bypass, Ayodhya, Uttar Pradesh – 224123",
  googleMapsUrl: "https://maps.google.com/?q=Hotel+Swastika+Inn+Ayodhya",
  whatsappNumber: "916393556011",
  checkInTime: "12:00 PM",
  checkOutTime: "11:00 AM",
};

export const ROOMS_DATA = [
  {
    id: "executive-king",
    title: "Executive King Suite",
    category: "Suites",
    tag: "Most Popular",
    heroImage: "/images/room-executive-king.jpeg",
    gallery: [
      "/images/room-executive-king.jpeg",
      "/images/room-executive-king-angle.jpeg",
      "/images/bathroom-modern.jpeg",
      "/images/corridor.jpeg"
    ],
    bedType: "1 King Size Bed",
    capacity: "2 Adults + 1 Child",
    size: "320 sq. ft.",
    description:
      "Indulge in royal comfort featuring a tufted rich red velvet headboard, designer floral accent wall, Persian runner rug, and twin plush cream leather bucket lounge chairs.",
    highlights: [
      "Tufted Red Velvet King Bed",
      "Cream Leather Bucket Chairs",
      "Attached Western Bath & Geyser",
      "Silent Split Air Conditioning",
      "Wall-Mounted Smart LED TV",
      "Designer Ambient Cove Lighting"
    ],
    bathroom: {
      image: "/images/bathroom-modern.jpeg",
      type: "Attached Western Bath",
      features: "Hot water geyser, rain shower, chrome mixers, hygiene health faucet, full height tiles"
    }
  },
  {
    id: "family-triple-suite",
    title: "Family Triple Suite (Room 107)",
    category: "Family",
    tag: "Ideal for Families & Groups",
    heroImage: "/images/room-family-twin.jpeg",
    gallery: [
      "/images/room-family-twin.jpeg",
      "/images/room-family-wardrobe.jpeg",
      "/images/room-family-balcony.jpeg",
      "/images/bathroom-tiles.jpeg"
    ],
    bedType: "1 Double Bed + 1 Single Bed",
    capacity: "3 to 4 Guests",
    size: "360 sq. ft.",
    description:
      "Spacious family accommodation configured with two beds, large wardrobe with dressing mirror, customized entertainment console, luggage stools, and direct private balcony access.",
    highlights: [
      "1 Double Bed + 1 Single Bed",
      "Private Balcony Access",
      "Full Height Wardrobe & Dressing Mirror",
      "Custom Wooden TV & Storage Console",
      "Attached Modern Bath with Geyser",
      "Individual Climate Control AC"
    ],
    bathroom: {
      image: "/images/bathroom-tiles.jpeg",
      type: "Attached Western Bath",
      features: "Hindware hot water geyser, overhead shower, mirror vanity, non-slip tiled flooring"
    }
  },
  {
    id: "deluxe-double",
    title: "Deluxe King / Double Room",
    category: "Deluxe",
    tag: "Contemporary Comfort",
    heroImage: "/images/room-deluxe-double.jpeg",
    gallery: [
      "/images/room-deluxe-double.jpeg",
      "/images/room-deluxe-amenities.jpeg",
      "/images/bathroom-geyser-shower.jpeg"
    ],
    bedType: "1 King / Double Bed",
    capacity: "2 Guests",
    size: "290 sq. ft.",
    description:
      "Modern aesthetic room featuring a soothing geometric accent wall, studded headboard, in-room mini-fridge/cooler, tea & coffee counter, and comfortable twin armchairs with coffee table.",
    highlights: [
      "Plush Studded Double Bed",
      "Personal In-Room Mini-Fridge",
      "Electric Tea & Coffee Kettle",
      "Twin Armchairs & Coffee Table",
      "Attached Bathroom with Geyser",
      "Full Split Air Conditioning"
    ],
    bathroom: {
      image: "/images/bathroom-geyser-shower.jpeg",
      type: "Attached Western Bath",
      features: "Instant hot water geyser, wall shower, chrome mixer taps, modern sanitary ware"
    }
  },
  {
    id: "damask-twin",
    title: "Damask Twin Room",
    category: "Deluxe",
    tag: "Classic Elegance",
    heroImage: "/images/room-damask-twin.jpeg",
    gallery: [
      "/images/room-damask-twin.jpeg",
      "/images/bathroom-modern.jpeg"
    ],
    bedType: "1 Double Bed + 1 Single Bed",
    capacity: "3 Guests",
    size: "310 sq. ft.",
    description:
      "Adorned in classic monochrome damask wallpaper, offering flexible sleeping arrangements with two beds, vanity dressing mirror, electric kettle, and cozy lounge seating.",
    highlights: [
      "Classic Damask Motif Feature Wall",
      "Dual Bed Sleeping Setup",
      "Electric Kettle & Tea Setup",
      "Attached Western Bathroom",
      "High Efficiency Split AC",
      "High-Speed Wi-Fi"
    ],
    bathroom: {
      image: "/images/bathroom-modern.jpeg",
      type: "Attached Western Bath",
      features: "Modern ceramic commode, geyser, hot/cold shower mixers, vanity"
    }
  },
  {
    id: "standard-queen",
    title: "Standard Queen Room",
    category: "Standard",
    tag: "Cozy & Peaceful",
    heroImage: "/images/room-standard-queen.jpeg",
    gallery: [
      "/images/room-standard-queen.jpeg",
      "/images/bathroom-tiles.jpeg"
    ],
    bedType: "1 Queen Size Bed",
    capacity: "2 Guests",
    size: "250 sq. ft.",
    description:
      "A serene and comfortable haven featuring warm ambient lighting, textured wave-pattern feature wall, wooden queen bed with plush linen, and modern attached bathroom.",
    highlights: [
      "Comfortable Queen Size Bed",
      "Textured Feature Wall",
      "Attached Western Bathroom with Geyser",
      "Split Air Conditioning",
      "Wall Mounted TV",
      "Daily Housekeeping"
    ],
    bathroom: {
      image: "/images/bathroom-tiles.jpeg",
      type: "Attached Western Bath",
      features: "Water heater, overhead shower, sanitized western toilet"
    }
  }
];

export const BANQUET_DATA = [
  {
    id: "banquet-hall",
    title: "Grand Indoor Banquet Hall",
    capacity: "100 – 350+ Guests",
    bestFor: "Weddings, Ring Ceremonies, Tilak, Birthday Parties & Corporate Meets",
    image: "/images/banquet-hall.jpeg",
    secondaryImage: "/images/birthday-stage.jpeg",
    description:
      "Fully air-conditioned indoor banquet hall equipped with comfortable banquet chairs, stage setup, customizable floral/balloon backdrops, and advanced sound infrastructure.",
    features: [
      "Central Air Conditioning",
      "Customizable Celebration Stages",
      "Round Table & Theater Style Seating",
      "Dedicated Stage Lighting & Sound",
      "Adjacent Groom/Bride Dressing Rooms",
      "Direct Guest Elevator & Stair Access"
    ]
  },
  {
    id: "celebration-lawn",
    title: "Royal Open-Air Lawn & Catering Facility",
    capacity: "200 – 700+ Guests",
    bestFor: "Grand Wedding Receptions, Sangeet Nights, Open-Air Galas & Large Gatherings",
    image: "/images/lawn-buffet.jpeg",
    secondaryImage: "/images/event-stage.jpeg",
    description:
      "Expansive outdoor lawn venue with lush green surroundings, canopy fairy lighting, built-in buffet catering lines with food warmers, live music stage, and decorative photo booths.",
    features: [
      "Expansive Open-Air Lawn Area",
      "Built-in Buffet & Live Counter Stalls",
      "Raised Stage for Live Band & DJ",
      "Festive Fairy & Canopy Lighting",
      "Themed Selfie & Photo Booth Corners",
      "Large Courtyard Parking for 50+ Cars"
    ]
  }
];

