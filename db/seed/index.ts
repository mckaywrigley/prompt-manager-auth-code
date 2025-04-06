import { db } from "@/db";
import { createClerkClient } from "@clerk/backend";
import { prompts } from "../schema/prompts-schema";

// Initialize Clerk client
if (!process.env.CLERK_SECRET_KEY) {
  throw new Error("CLERK_SECRET_KEY is required");
}
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

/**
 * Test users to create
 */
const testUsers = [
  {
    emailAddress: ["user1+clerk_test@example.com"],
    password: "testPassword123!",
    firstName: "Test",
    lastName: "User1"
  },
  {
    emailAddress: ["user2+clerk_test@example.com"],
    password: "testPassword123!",
    firstName: "Test",
    lastName: "User2"
  },
  {
    emailAddress: ["user3+clerk_test@example.com"],
    password: "testPassword123!",
    firstName: "Test",
    lastName: "User3"
  }
];

/**
 * Base prompts data
 */
const basePrompts = [
  {
    name: "Code Explainer",
    description: "Explains code in simple terms",
    content: "Please explain this code in simple terms, as if you're teaching a beginner programmer:"
  },
  {
    name: "Bug Finder",
    description: "Helps identify bugs in code",
    content: "Review this code and identify potential bugs, performance issues, or security vulnerabilities:"
  },
  {
    name: "Feature Planner",
    description: "Helps plan new features",
    content: "Help me plan the implementation of this feature. Consider edge cases, potential challenges, and best practices:"
  },
  {
    name: "SQL Query Helper",
    description: "Assists with SQL queries",
    content: "Help me write an efficient SQL query to accomplish the following task:"
  },
  {
    name: "API Documentation",
    description: "Generates API documentation",
    content: "Generate clear and comprehensive documentation for this API endpoint, including parameters, responses, and examples:"
  },
  {
    name: "Code Refactorer",
    description: "Suggests code improvements",
    content: "Review this code and suggest improvements for better readability, maintainability, and performance:"
  },
  {
    name: "Test Case Generator",
    description: "Creates test cases",
    content: "Generate comprehensive test cases for this function, including edge cases and error scenarios:"
  },
  {
    name: "UI/UX Reviewer",
    description: "Reviews UI/UX design",
    content: "Review this UI design and provide feedback on usability, accessibility, and user experience:"
  },
  {
    name: "Git Command Helper",
    description: "Helps with Git commands",
    content: "What Git commands should I use to accomplish the following task:"
  }
];

/**
 * Main seed function
 */
async function seed() {
  try {
    console.log("🌱 Starting seeding...");

    // Create test users
    console.log("Creating test users...");
    const createdUsers = await Promise.all(testUsers.map((userData) => clerk.users.createUser(userData)));
    console.log(
      "Created test users:",
      createdUsers.map((u) => u.id)
    );

    // Clear existing data
    await db.delete(prompts);
    console.log("Cleared existing prompts");

    // Distribute prompts among users (3 prompts each)
    const promptsWithUsers = basePrompts.map((prompt, index) => ({
      ...prompt,
      userId: createdUsers[Math.floor(index / 3)].id // Assign every 3 prompts to each user
    }));

    // Insert seed data
    await db.insert(prompts).values(promptsWithUsers);
    console.log("Inserted seed prompts");

    console.log("✅ Seeding completed successfully");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await db.$client.end();
  }
}

// Run the seed function
seed();
