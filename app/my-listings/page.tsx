"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Listing {
  id: string;
  title: string;
  description: string;
  image: string;
  // Add any fields your listing contains
}

export default function MyListingsPage() {
  const { data: session, status } = useSession();
  const [listings, setListings] = useState<Listing[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/listings?userEmail=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => setListings(data));
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/my-listings/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setListings((prev) => prev.filter((listing) => listing.id !== id));
      setConfirmDeleteId(null);
    } else {
      alert("Error deleting listing.");
    }
  };

  if (status === "loading") return <div>Loading...</div>;

  if (!session) return <div>Please sign in to view your listings.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Listings</h1>

      {listings.length === 0 && <p>No listings found.</p>}

      <div className="space-y-4">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="border p-4 rounded-md shadow-sm bg-white flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{listing.title}</h2>
              <p className="text-gray-600">{listing.description}</p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/edit-listing/${listing.id}`}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </Link>
              <button
                onClick={() => setConfirmDeleteId(listing.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>

            {/* Delete Confirmation Modal */}
            {confirmDeleteId === listing.id && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                  <p className="mb-4 text-gray-800 font-medium">
                    Are you sure you want to delete this listing?
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
