export interface Property {
  id: string;
  title: string;
  location: string;
  city: string;
  rent: number;
  deposit: number;
  type: string;
  bhk: number;
  furnished: "Furnished" | "Semi-Furnished" | "Unfurnished";
  verified: boolean;
  image: string;
  images: string[];
  ownerName: string;
  ownerPhone: string;
  ownerAvatar: string;
  description: string;
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  balcony: number;
  parking: boolean;
  availableFrom: string;
  postedDate: string;
  area: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "tenant" | "owner";
  avatar: string;
  verified: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  text: string;
  sent: boolean;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: "inquiry" | "approved" | "saved" | "message" | "reminder";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

const propertyImages = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
  "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80",
  "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=600&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
];

const interiorImages = [
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
];

export const properties: Property[] = [
  {
    id: "1",
    title: "Sunny 2BHK Apartment in Koramangala",
    location: "Koramangala, 5th Block",
    city: "Bangalore",
    rent: 25000,
    deposit: 100000,
    type: "Apartment",
    bhk: 2,
    furnished: "Semi-Furnished",
    verified: true,
    image: propertyImages[0],
    images: [propertyImages[0], ...interiorImages.slice(0, 3)],
    ownerName: "Rahul Sharma",
    ownerPhone: "+91 98765 43210",
    ownerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    description: "A beautiful, well-ventilated 2BHK apartment in the heart of Koramangala. Close to major IT parks, restaurants, and shopping centers. The apartment features modern interiors with ample natural light.",
    amenities: ["WiFi", "Power Backup", "Lift", "Security", "Gym", "Parking"],
    bedrooms: 2,
    bathrooms: 2,
    balcony: 1,
    parking: true,
    availableFrom: "2026-04-01",
    postedDate: "2026-03-20",
    area: 1100,
  },
  {
    id: "2",
    title: "Spacious 3BHK Villa in Whitefield",
    location: "Whitefield, ITPL Road",
    city: "Bangalore",
    rent: 45000,
    deposit: 200000,
    type: "Villa",
    bhk: 3,
    furnished: "Furnished",
    verified: true,
    image: propertyImages[7],
    images: [propertyImages[7], ...interiorImages.slice(1, 4)],
    ownerName: "Priya Patel",
    ownerPhone: "+91 87654 32109",
    ownerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    description: "Luxurious 3BHK villa with a private garden and modern amenities. Perfect for families looking for a premium living experience in Whitefield.",
    amenities: ["Garden", "Swimming Pool", "Clubhouse", "Security", "Parking", "Power Backup"],
    bedrooms: 3,
    bathrooms: 3,
    balcony: 2,
    parking: true,
    availableFrom: "2026-04-15",
    postedDate: "2026-03-18",
    area: 2200,
  },
  {
    id: "3",
    title: "Modern 1BHK Studio in Indiranagar",
    location: "Indiranagar, 12th Main",
    city: "Bangalore",
    rent: 18000,
    deposit: 50000,
    type: "Apartment",
    bhk: 1,
    furnished: "Furnished",
    verified: true,
    image: propertyImages[1],
    images: [propertyImages[1], ...interiorImages.slice(0, 2)],
    ownerName: "Amit Kumar",
    ownerPhone: "+91 76543 21098",
    ownerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    description: "Compact and stylish 1BHK studio perfect for working professionals. Located in vibrant Indiranagar with easy access to nightlife and dining.",
    amenities: ["WiFi", "AC", "Washing Machine", "Security", "Lift"],
    bedrooms: 1,
    bathrooms: 1,
    balcony: 1,
    parking: false,
    availableFrom: "2026-04-01",
    postedDate: "2026-03-22",
    area: 650,
  },
  {
    id: "4",
    title: "Cozy 2BHK Flat in HSR Layout",
    location: "HSR Layout, Sector 2",
    city: "Bangalore",
    rent: 22000,
    deposit: 80000,
    type: "Apartment",
    bhk: 2,
    furnished: "Semi-Furnished",
    verified: false,
    image: propertyImages[2],
    images: [propertyImages[2], ...interiorImages],
    ownerName: "Sneha Reddy",
    ownerPhone: "+91 65432 10987",
    ownerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
    description: "Well-maintained 2BHK flat in a quiet residential area. Close to parks, schools, and public transport. Ideal for small families.",
    amenities: ["Power Backup", "Lift", "Security", "Children's Play Area"],
    bedrooms: 2,
    bathrooms: 2,
    balcony: 1,
    parking: true,
    availableFrom: "2026-05-01",
    postedDate: "2026-03-15",
    area: 1050,
  },
  {
    id: "5",
    title: "Premium 3BHK in Electronic City",
    location: "Electronic City, Phase 1",
    city: "Bangalore",
    rent: 30000,
    deposit: 150000,
    type: "Apartment",
    bhk: 3,
    furnished: "Unfurnished",
    verified: true,
    image: propertyImages[3],
    images: [propertyImages[3], ...interiorImages.slice(0, 3)],
    ownerName: "Vikram Singh",
    ownerPhone: "+91 54321 09876",
    ownerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    description: "Spacious 3BHK apartment in a gated community with world-class amenities. Perfect for tech professionals working in Electronic City.",
    amenities: ["Swimming Pool", "Gym", "Clubhouse", "Tennis Court", "Security", "Power Backup", "Parking"],
    bedrooms: 3,
    bathrooms: 2,
    balcony: 2,
    parking: true,
    availableFrom: "2026-04-10",
    postedDate: "2026-03-19",
    area: 1600,
  },
  {
    id: "6",
    title: "Charming 1BHK in JP Nagar",
    location: "JP Nagar, 6th Phase",
    city: "Bangalore",
    rent: 14000,
    deposit: 40000,
    type: "Apartment",
    bhk: 1,
    furnished: "Unfurnished",
    verified: true,
    image: propertyImages[4],
    images: [propertyImages[4], ...interiorImages.slice(1, 3)],
    ownerName: "Meera Iyer",
    ownerPhone: "+91 43210 98765",
    ownerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80",
    description: "Affordable 1BHK apartment in a peaceful neighborhood. Great for students and young professionals starting their career.",
    amenities: ["Power Backup", "Water Supply", "Security"],
    bedrooms: 1,
    bathrooms: 1,
    balcony: 0,
    parking: false,
    availableFrom: "2026-04-01",
    postedDate: "2026-03-21",
    area: 550,
  },
  {
    id: "7",
    title: "Luxury 4BHK Penthouse in MG Road",
    location: "MG Road, Brigade Gateway",
    city: "Bangalore",
    rent: 85000,
    deposit: 400000,
    type: "Penthouse",
    bhk: 4,
    furnished: "Furnished",
    verified: true,
    image: propertyImages[5],
    images: [propertyImages[5], ...interiorImages],
    ownerName: "Arjun Mehta",
    ownerPhone: "+91 32109 87654",
    ownerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80",
    description: "Ultra-luxurious penthouse with panoramic city views. Features Italian marble flooring, modular kitchen, and a private terrace garden.",
    amenities: ["Terrace Garden", "Concierge", "Gym", "Swimming Pool", "Jacuzzi", "Home Theater", "Parking"],
    bedrooms: 4,
    bathrooms: 4,
    balcony: 3,
    parking: true,
    availableFrom: "2026-04-20",
    postedDate: "2026-03-23",
    area: 3500,
  },
  {
    id: "8",
    title: "Budget-Friendly 2BHK in Marathahalli",
    location: "Marathahalli, ORR",
    city: "Bangalore",
    rent: 16000,
    deposit: 60000,
    type: "Apartment",
    bhk: 2,
    furnished: "Semi-Furnished",
    verified: false,
    image: propertyImages[6],
    images: [propertyImages[6], ...interiorImages.slice(0, 2)],
    ownerName: "Deepak Gupta",
    ownerPhone: "+91 21098 76543",
    ownerAvatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&q=80",
    description: "Affordable 2BHK apartment close to the Outer Ring Road. Easy commute to major IT corridors and well-connected by public transport.",
    amenities: ["Lift", "Power Backup", "Security", "Parking"],
    bedrooms: 2,
    bathrooms: 1,
    balcony: 1,
    parking: true,
    availableFrom: "2026-04-05",
    postedDate: "2026-03-17",
    area: 950,
  },
];

export const conversations: Message[] = [
  {
    id: "c1",
    senderId: "u2",
    senderName: "Rahul Sharma",
    senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    lastMessage: "Sure, you can visit the property tomorrow at 10 AM.",
    timestamp: "2:30 PM",
    unread: 2,
    messages: [
      { id: "m1", text: "Hi, I'm interested in the 2BHK in Koramangala. Is it still available?", sent: true, timestamp: "2:15 PM" },
      { id: "m2", text: "Yes, it's still available! Would you like to schedule a visit?", sent: false, timestamp: "2:20 PM" },
      { id: "m3", text: "That would be great! When can I come?", sent: true, timestamp: "2:25 PM" },
      { id: "m4", text: "Sure, you can visit the property tomorrow at 10 AM.", sent: false, timestamp: "2:30 PM" },
    ],
  },
  {
    id: "c2",
    senderId: "u3",
    senderName: "Priya Patel",
    senderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    lastMessage: "The rent includes maintenance charges.",
    timestamp: "Yesterday",
    unread: 0,
    messages: [
      { id: "m5", text: "Hello, does the rent include maintenance?", sent: true, timestamp: "Yesterday" },
      { id: "m6", text: "The rent includes maintenance charges.", sent: false, timestamp: "Yesterday" },
    ],
  },
  {
    id: "c3",
    senderId: "u4",
    senderName: "Amit Kumar",
    senderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    lastMessage: "I'll share the agreement draft by tomorrow.",
    timestamp: "Mon",
    unread: 0,
    messages: [
      { id: "m7", text: "Can you send me the rental agreement?", sent: true, timestamp: "Mon" },
      { id: "m8", text: "I'll share the agreement draft by tomorrow.", sent: false, timestamp: "Mon" },
    ],
  },
];

export const notifications: Notification[] = [
  { id: "n1", type: "inquiry", title: "New Inquiry Received", description: "A tenant is interested in your 2BHK in Koramangala.", timestamp: "5 min ago", read: false },
  { id: "n2", type: "approved", title: "Property Approved", description: "Your listing for 3BHK in Whitefield has been verified.", timestamp: "1 hour ago", read: false },
  { id: "n3", type: "saved", title: "Property Saved", description: "You saved '1BHK Studio in Indiranagar'.", timestamp: "3 hours ago", read: true },
  { id: "n4", type: "message", title: "New Message", description: "Rahul Sharma sent you a message about property visit.", timestamp: "Yesterday", read: true },
  { id: "n5", type: "reminder", title: "Visit Reminder", description: "You have a property visit scheduled tomorrow at 10 AM.", timestamp: "Yesterday", read: true },
  { id: "n6", type: "inquiry", title: "Inquiry Update", description: "Your inquiry for 2BHK in HSR Layout has been viewed.", timestamp: "2 days ago", read: true },
];

export const mockTenantUser: User = {
  id: "t1",
  name: "Ananya Krishnan",
  email: "ananya@example.com",
  phone: "+91 99887 76655",
  role: "tenant",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  verified: true,
};

export const mockOwnerUser: User = {
  id: "o1",
  name: "Rahul Sharma",
  email: "rahul@example.com",
  phone: "+91 98765 43210",
  role: "owner",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  verified: true,
};
