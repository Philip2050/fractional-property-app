import { drizzle } from "drizzle-orm/mysql2";
import { properties } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const demoProperties = [
  {
    title: "Premium Commercial Space - Mumbai",
    description: "State-of-the-art commercial property in the heart of Mumbai's business district. Perfect for corporate offices and retail businesses. Features modern amenities, high-speed connectivity, and excellent accessibility.",
    location: "Bandra, Mumbai",
    totalArea: 50000,
    totalPrice: "50000000",
    pricePerSqft: "1000",
    minShareSize: 1,
    propertyType: "commercial",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop",
  },
  {
    title: "Luxury Residential Complex - Bangalore",
    description: "Upscale residential property in Bangalore's premium locality. Includes modern amenities, 24/7 security, swimming pool, and gym facilities. Ideal for long-term investment with strong appreciation potential.",
    location: "Indiranagar, Bangalore",
    totalArea: 75000,
    totalPrice: "45000000",
    pricePerSqft: "600",
    minShareSize: 1,
    propertyType: "residential",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=500&h=300&fit=crop",
  },
  {
    title: "Mixed-Use Development - Delhi",
    description: "Modern mixed-use property combining residential and commercial spaces. Located in a rapidly developing area with excellent connectivity to metro stations and business hubs.",
    location: "Gurugram, Delhi",
    totalArea: 100000,
    totalPrice: "80000000",
    pricePerSqft: "800",
    minShareSize: 1,
    propertyType: "mixed",
    imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&h=300&fit=crop",
  },
  {
    title: "Tech Park Office Space - Hyderabad",
    description: "State-of-the-art tech park with world-class infrastructure. Designed for IT companies and startups. Features high-speed internet, power backup, and collaborative workspaces.",
    location: "HITEC City, Hyderabad",
    totalArea: 60000,
    totalPrice: "36000000",
    pricePerSqft: "600",
    minShareSize: 1,
    propertyType: "commercial",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=300&fit=crop",
  },
  {
    title: "Beachfront Residential - Goa",
    description: "Stunning beachfront property with panoramic sea views. Premium location perfect for vacation homes or rental income. Includes resort-like amenities and direct beach access.",
    location: "Baga Beach, Goa",
    totalArea: 40000,
    totalPrice: "60000000",
    pricePerSqft: "1500",
    minShareSize: 1,
    propertyType: "residential",
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop",
  },
  {
    title: "Retail Mall - Pune",
    description: "Prime retail mall location in Pune's shopping district. High foot traffic and excellent visibility. Multiple retail units available for lease.",
    location: "Viman Nagar, Pune",
    totalArea: 80000,
    totalPrice: "48000000",
    pricePerSqft: "600",
    minShareSize: 1,
    propertyType: "commercial",
    imageUrl: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=500&h=300&fit=crop",
  },
  {
    title: "Smart City Residential - Kolkata",
    description: "Modern residential complex in Kolkata's emerging smart city. Eco-friendly design with green spaces, solar panels, and rainwater harvesting systems.",
    location: "New Town, Kolkata",
    totalArea: 55000,
    totalPrice: "27500000",
    pricePerSqft: "500",
    minShareSize: 1,
    propertyType: "residential",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop",
  },
  {
    title: "Corporate Headquarters - Noida",
    description: "Premium corporate office building with LEED certification. Modern architecture, advanced security systems, and ample parking. Ideal for multinational corporations.",
    location: "Sector 62, Noida",
    totalArea: 70000,
    totalPrice: "56000000",
    pricePerSqft: "800",
    minShareSize: 1,
    propertyType: "commercial",
    imageUrl: "https://images.unsplash.com/photo-1486718448742-163732cd3d3e?w=500&h=300&fit=crop",
  },
];

async function seedProperties() {
  try {
    console.log("Starting to seed properties...");

    for (const prop of demoProperties) {
      await db.insert(properties).values({
        ...prop,
        totalShares: prop.totalArea,
        soldShares: Math.floor(prop.totalArea * (Math.random() * 0.4 + 0.1)), // 10-50% sold
        status: "available",
      });
      console.log(`✓ Added: ${prop.title}`);
    }

    console.log("\n✅ Successfully seeded all properties!");
  } catch (error) {
    console.error("❌ Error seeding properties:", error);
    process.exit(1);
  }
}

seedProperties();
