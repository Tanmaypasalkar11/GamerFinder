"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition"
          >
            Bullaberg
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              About
            </Link>

            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">
                  Welcome, {session.user?.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="flex items-center gap-3 px-5 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-200 transition"
              >
                <FcGoogle className="h-6 w-6" />
                <span className="text-gray-700 font-medium hover:cursor-pointer">
                  Sign in with Google
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
