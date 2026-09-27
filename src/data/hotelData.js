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
  
];
