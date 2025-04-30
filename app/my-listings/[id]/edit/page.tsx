// app/my-listings/[id]/edit/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type Listing = {
  id: string;
  title: string;
  description: string;
  pricePerHour: number;
  game: string;
  tags: string[];
};

export default function EditListingPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/my-listings/${id}`);
        if (!res.ok) throw new Error("Failed to fetch listing");
        const data = await res.json();
        setListing(data);
      } catch (error) {
        toast.error("Error loading listing");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // Update listing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/my-listings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listing),
      });

      if (!res.ok) throw new Error("Failed to update listing");

      toast.success("Listing updated!");
      router.push("/my-listings");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (!listing) return <p>Listing not found</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Title"
          value={listing.title}
          onChange={(e) => setListing({ ...listing, title: e.target.value })}
        />
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Description"
          value={listing.description}
          onChange={(e) =>
            setListing({ ...listing, description: e.target.value })
          }
        />
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Game"
          value={listing.game}
          onChange={(e) => setListing({ ...listing, game: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded"
          type="number"
          placeholder="Price per hour"
          value={listing.pricePerHour}
          onChange={(e) =>
            setListing({ ...listing, pricePerHour: Number(e.target.value) })
          }
        />
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Tags (comma separated)"
          value={listing.tags.join(", ")}
          onChange={(e) =>
            setListing({
              ...listing,
              tags: e.target.value.split(",").map((tag) => tag.trim()),
            })
          }
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
