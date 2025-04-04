"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Layout() {
  const { data: session, status } = useSession();
  const [isWelcomeComplete, setIsWelcomeComplete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (session) {
      localStorage.setItem("hasSeenWelcome", "true");
      setIsWelcomeComplete(true);
    } else {
      const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
      if (hasSeenWelcome) {
        setIsWelcomeComplete(true);
      }
    }
  }, [session]);

  // Fancy full-screen loader while session is loading
  if (status === "loading") {
    return (
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="text-4xl font-bold text-blue-600"
          animate={{ y: [0, -10, 0], transition: { repeat: Infinity, duration: 1.5 } }}
        >
          Loading...
        </motion.div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Welcome Screen (Only if user is not signed in and hasn't seen it before) */}
      <AnimatePresence>
        {!isWelcomeComplete && !session && (
          <motion.div
            className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50 text-center"
            initial={{ y: "-100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold text-blue-600 mb-4"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 1.2 } }}
            >
              Welcome to Bullaburg
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-700 max-w-2xl px-6"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 1.5 } }}
            >
              Where connections flourish, conversations inspire,  
              and every interaction becomes an unforgettable experience.
            </motion.p>
            <motion.button
              onClick={() => {
                localStorage.setItem("hasSeenWelcome", "true");
                setIsWelcomeComplete(true);
              }}
              className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar with smooth fade-in */}
      <motion.nav
        className="bg-[#F9F6EE] border-b border-gray-300 sticky top-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1 } }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="text-3xl font-serif font-bold text-blue-600 tracking-tight hover:text-black transition"
            >
              Bullaburg
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/membership"
                className="text-gray-950 hover:text-gray-600 text-base font-medium transition duration-200"
              >
                Membership
              </Link>

              <Link
                href="/about"
                className="text-gray-950 hover:text-gray-600 text-base font-medium transition duration-200"
              >
                About Us
              </Link>

              {session ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-medium">
                    Hi, {session.user?.name?.split(" ")}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-red-600 transition duration-200 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn("google", { prompt: "select_account" })}
                  className="text-gray-700 hover:text-gray-900 text-base font-medium transition duration-200 cursor-pointer"
                >
                  Sign in
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-900"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden flex flex-col gap-4 py-4 border-t border-gray-300">
              <Link
                href="/membership"
                className="text-gray-950 hover:text-gray-600 text-base font-medium transition duration-200"
                onClick={() => setMenuOpen(false)}
              >
                Membership
              </Link>

              <Link
                href="/about"
                className="text-gray-950 hover:text-gray-600 text-base font-medium transition duration-200"
                onClick={() => setMenuOpen(false)}
              >
                About Us
              </Link>

              {session ? (
                <>
                  <span className="text-gray-950 font-medium">
                    Hi, {session.user?.name?.split(" ")[0]}
                  </span>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                    }}
                    className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-red-600 transition duration-200 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signIn("google", { prompt: "select_account" });
                  }}
                  className="text-gray-700 hover:text-gray-900 text-base font-medium transition duration-200 cursor-pointer"
                >
                  Sign in
                </button>
              )}
            </div>
          )}
        </div>
      </motion.nav>
    </>
  );
}
