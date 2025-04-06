"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Header } from "../components/header";

// Hero section component for the landing page
export default function Home() {
  // Initialize the router for navigation
  const router = useRouter();

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
        {/* Main hero container with responsive padding */}
        <motion.main
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
          // Animate the main content fading in from bottom
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Hero title with animation */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Prompt Manager
          </motion.h1>

          {/* Hero subtitle/description */}
          <motion.p
            className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Store, organize, and manage all your AI prompts in one place. Boost your productivity with easy access to your favorite prompts.
          </motion.p>

          {/* CTA button with hover effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <button
              onClick={() => router.push("/prompts")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105"
            >
              Get Started
            </button>
          </motion.div>
        </motion.main>
      </div>
    </>
  );
}
