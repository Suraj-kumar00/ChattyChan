import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config();

const seedUsers = [
  // Indian Users
  {
    email: "priya.sharma@example.in",
    fullName: "Priya Sharma",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/11.jpg", // Indian woman
  },
  {
    email: "rahul.gupta@example.in",
    fullName: "Rahul Gupta",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/12.jpg", // Indian man
  },

  // American Users
  {
    email: "emma.johnson@example.com",
    fullName: "Emma Johnson",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/21.jpg", // American woman
  },
  {
    email: "tyler.williams@example.com",
    fullName: "Tyler Williams",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/22.jpg", // American man
  },

  // South Korean Users
  {
    email: "minji.park@example.kr",
    fullName: "Min-ji Park",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/31.jpg", // South Korean woman
  },
  {
    email: "joonho.kim@example.kr",
    fullName: "Joon-ho Kim",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/32.jpg", // South Korean man
  },

  // Australian Users
  {
    email: "charlotte.smith@example.au",
    fullName: "Charlotte Smith",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/41.jpg", // Australian woman
  },
  {
    email: "liam.jones@example.au",
    fullName: "Liam Jones",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/42.jpg", // Australian man
  },

  // Japanese Users
  {
    email: "sakura.yamamoto@example.jp",
    fullName: "Sakura Yamamoto",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/51.jpg", // Japanese woman
  },
  {
    email: "hiroshi.tanaka@example.jp",
    fullName: "Hiroshi Tanaka",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/52.jpg", // Japanese man
  },

  // Brazilian Users
  {
    email: "sofia.silva@example.br",
    fullName: "Sofia Silva",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/61.jpg", // Brazilian woman
  },
  {
    email: "gabriel.santos@example.br",
    fullName: "Gabriel Santos",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/62.jpg", // Brazilian man
  },

  // Nigerian Users
  {
    email: "chinwe.adebayo@example.ng",
    fullName: "Chinwe Adebayo",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/71.jpg", // Nigerian woman
  },
  {
    email: "kola.obi@example.ng",
    fullName: "Kola Obi",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/72.jpg", // Nigerian man
  },
];

const seedDatabase = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to database");

    // Hash passwords before insertion
    const usersWithHashedPasswords = await Promise.all(
      seedUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    // Clear existing data
    await prisma.user.deleteMany();
    console.log("Cleared existing users");

    // Seed new users
    await prisma.user.createMany({
      data: usersWithHashedPasswords,
      skipDuplicates: true,
    });

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

// Execute the seed function
seedDatabase();
