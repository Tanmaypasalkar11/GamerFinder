"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Listing = {
  id: string;
  title: string;
  description: string;
  pricePerHour: number;
  availability: string;
  images: string[];
  voiceIntroUrl: string | null;
  tags: string[];
  game: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  userId: string;
};

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    fetch("/api/listings")
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
      });
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-10 text-gray-900">
        Explore Listings
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {listings.map((listing) => (
          <Link key={listing.id} href={`/listings/${listing.id}`} passHref>
            <div className="cursor-pointer group bg-white rounded-2xl shadow-md p-6 flex flex-col transition-all hover:shadow-xl hover:scale-[1.02]">
              {/* User Info */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    listing.user.image || "https://placedog.net/200/200?id=1"
                  }
                  alt={listing.user.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {listing.user.name}
                  </h2>
                  <p className="text-sm text-gray-500">{listing.user.email}</p>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {listing.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {listing.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {listing.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Game + Pricing Info */}
              <div className="mt-auto pt-4 border-t text-sm text-gray-700">
                <p>
                  <strong>Game:</strong> {listing.game}
                </p>
                <p>
                  <strong>Availability:</strong> {listing.availability}
                </p>
                <p className="text-green-600 font-bold mt-1">
                  ${listing.pricePerHour} / hour
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
