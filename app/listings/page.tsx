'use client'
import { useEffect, useState } from 'react'

type Listing = {
  id: string
  title: string
  description: string
  pricePerHour: number
  availability: string
  images: string[]
  voiceIntroUrl: string | null
  tags: string[]
  game: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    image: string | null
  }
  userId: string
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])

  useEffect(() => {
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setListings(data)
      })
  }, [])

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="group bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center transition-transform hover:shadow-lg hover:-translate-y-1"
          >
            {/* User Info */}
            <img
              src={listing.user.image || 'https://placedog.net/200/200?id=1'}
              alt={listing.user.name}
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-900">
              {listing.user.name}
            </h2>
            <p className="text-sm text-gray-500 mb-4">{listing.user.email}</p>

            {/* Title */}
            <h3 className="text-md font-bold text-gray-800 mb-2">
              {listing.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 text-center mb-4">
              {listing.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {listing.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Hidden on base, visible on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity w-full border-t pt-4 mt-auto text-center text-sm text-gray-700">
              <p><strong>Game:</strong> {listing.game}</p>
              <p><strong>Availability:</strong> {listing.availability}</p>
              <p className="text-green-600 font-bold mt-1">
                ${listing.pricePerHour} / hour
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
