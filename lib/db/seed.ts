import { config } from "dotenv";

// Load .env.local file
config({ path: ".env.local" });

import { db } from "./connection";
import { customers, products, sales } from "./schema";
import type { NewCustomer, NewProduct, NewSale } from "./schema";

// Sample customer data
const sampleCustomers: NewCustomer[] = [
  {
    companyName: "Acme Corporation",
    contactName: "John Smith",
    email: "john.smith@acme.com",
    phone: "+1-555-0123",
  },
  {
    companyName: "TechStart Solutions",
    contactName: "Sarah Johnson",
    email: "sarah@techstart.com",
    phone: "+1-555-0456",
  },
  {
    companyName: "Global Industries",
    contactName: "Michael Chen",
    email: "mchen@global.com",
    phone: "+1-555-0789",
  },
  {
    companyName: "Innovate Labs",
    contactName: "Emily Rodriguez",
    email: "emily@innovatelabs.com",
    phone: "+1-555-0234",
  },
  {
    companyName: "Digital Dynamics",
    contactName: "David Wilson",
    email: "david@digitaldynamics.com",
    phone: "+1-555-0567",
  },
  {
    companyName: "Future Systems",
    contactName: "Lisa Thompson",
    email: "lisa@futuresystems.com",
    phone: "+1-555-0890",
  },
  {
    companyName: "CloudFirst Inc",
    contactName: "Robert Taylor",
    email: "robert@cloudfirst.com",
    phone: "+1-555-0345",
  },
  {
    companyName: "DataStream Corp",
    contactName: "Jennifer Lee",
    email: "jennifer@datastream.com",
    phone: "+1-555-0678",
  },
  {
    companyName: "NextGen Technologies",
    contactName: "Christopher Brown",
    email: "chris@nextgen.com",
    phone: "+1-555-0901",
  },
  {
    companyName: "Smart Solutions LLC",
    contactName: "Amanda Davis",
    email: "amanda@smartsolutions.com",
    phone: "+1-555-0456",
  },
  {
    companyName: "Enterprise Partners",
    contactName: "Mark Anderson",
    email: "mark@enterprisepartners.com",
    phone: "+1-555-0789",
  },
  {
    companyName: "Tech Innovators",
    contactName: "Rachel Green",
    email: "rachel@techinnovators.com",
    phone: "+1-555-0123",
  },
  {
    companyName: "Digital Solutions",
    contactName: "Kevin Martinez",
    email: "kevin@digitalsolutions.com",
    phone: "+1-555-0456",
  },
  {
    companyName: "Modern Systems",
    contactName: "Nicole White",
    email: "nicole@modernsystems.com",
    phone: "+1-555-0789",
  },
  {
    companyName: "Agile Enterprises",
    contactName: "Brian Johnson",
    email: "brian@agileenterprises.com",
    phone: "+1-555-0234",
  },
  {
    companyName: "Cloud Dynamics",
    contactName: "Stephanie Miller",
    email: "stephanie@clouddynamics.com",
    phone: "+1-555-0567",
  },
  {
    companyName: "Innovation Hub",
    contactName: "Daniel Garcia",
    email: "daniel@innovationhub.com",
    phone: "+1-555-0890",
  },
  {
    companyName: "Tech Pioneers",
    contactName: "Michelle Clark",
    email: "michelle@techpioneers.com",
    phone: "+1-555-0345",
  },
  {
    companyName: "Strategic Systems",
    contactName: "Jason Rodriguez",
    email: "jason@strategicsystems.com",
    phone: "+1-555-0678",
  },
  {
    companyName: "Digital Transformation",
    contactName: "Kimberly Lewis",
    email: "kimberly@digitaltransformation.com",
    phone: "+1-555-0901",
  },
];

const sampleProducts: NewProduct[] = [
  {
    name: "Professional Software License",
    description: "Annual enterprise software license with full feature access",
    price: "2999.99",
    category: "Software",
  },
  {
    name: "Strategic Consulting Services",
    description:
      "Comprehensive business consulting and strategic planning package",
    price: "5000.00",
    category: "Services",
  },
  {
    name: "Enterprise Hardware Package",
    description:
      "Complete hardware setup and installation for enterprise environments",
    price: "1299.99",
    category: "Hardware",
  },
  {
    name: "Cloud Infrastructure Setup",
    description: "Full cloud migration and infrastructure configuration",
    price: "3500.00",
    category: "Services",
  },
  {
    name: "Security Software Suite",
    description: "Comprehensive cybersecurity solution with threat monitoring",
    price: "4200.00",
    category: "Software",
  },
  {
    name: "Data Analytics Platform",
    description: "Advanced analytics and business intelligence platform",
    price: "6800.00",
    category: "Software",
  },
  {
    name: "Mobile App Development",
    description: "Custom mobile application development and deployment",
    price: "8500.00",
    category: "Services",
  },
  {
    name: "Network Infrastructure",
    description: "Enterprise-grade networking equipment and configuration",
    price: "2200.00",
    category: "Hardware",
  },
  {
    name: "Training and Support",
    description: "Comprehensive staff training and ongoing technical support",
    price: "1800.00",
    category: "Services",
  },
  {
    name: "Backup and Recovery System",
    description:
      "Automated backup solution with disaster recovery capabilities",
    price: "3200.00",
    category: "Software",
  },
  {
    name: "Video Conferencing Solution",
    description: "Enterprise video conferencing and collaboration platform",
    price: "1500.00",
    category: "Software",
  },
  {
    name: "Custom Integration Services",
    description: "API integration and custom software development services",
    price: "4500.00",
    category: "Services",
  },
  {
    name: "Server Hardware Package",
    description: "High-performance server hardware with installation",
    price: "5500.00",
    category: "Hardware",
  },
  {
    name: "Digital Marketing Suite",
    description: "Complete digital marketing automation and analytics platform",
    price: "2800.00",
    category: "Software",
  },
  {
    name: "IT Maintenance Contract",
    description: "Annual IT maintenance and support contract",
    price: "2000.00",
    category: "Services",
  },
];

// Utility functions
function getRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Seed function
async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await db.delete(sales);
    await db.delete(products);
    await db.delete(customers);

    // Insert customers
    console.log("👥 Seeding customers...");
    const insertedCustomers = await db
      .insert(customers)
      .values(sampleCustomers)
      .returning();
    console.log(`✅ Inserted ${insertedCustomers.length} customers`);

    // Insert products
    console.log("📦 Seeding products...");
    const insertedProducts = await db
      .insert(products)
      .values(sampleProducts)
      .returning();
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    // Generate sales data
    console.log("💰 Generating sales data...");
    const salesData: NewSale[] = [];
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // Create 250 realistic sales records
    for (let i = 0; i < 250; i++) {
      const customer = getRandomElement(insertedCustomers);
      const product = getRandomElement(insertedProducts);
      const quantity = Math.floor(Math.random() * 5) + 1;
      const baseAmount = parseFloat(product.price);
      const amount = (baseAmount * quantity).toFixed(2);

      salesData.push({
        customerId: customer.id,
        productId: product.id,
        amount,
        quantity,
        saleDate: getRandomDate(oneYearAgo, new Date()),
        status: getRandomElement([
          "pending",
          "completed",
          "cancelled",
        ] as const),
      });
    }

    const insertedSales = await db.insert(sales).values(salesData).returning();
    console.log(`✅ Inserted ${insertedSales.length} sales records`);

    console.log("🎉 Database seeding completed successfully!");

    // Print summary
    console.log("\n📊 Seed Summary:");
    console.log(`   Customers: ${insertedCustomers.length}`);
    console.log(`   Products: ${insertedProducts.length}`);
    console.log(`   Sales: ${insertedSales.length}`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log("🏁 Seed script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seed script failed:", error);
      process.exit(1);
    });
}

export { seed };
