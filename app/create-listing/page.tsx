"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Added session hook

export default function CreateListingPage() {
  const { data: session, status } = useSession(); // Added session tracking
  const [form, setForm] = useState({
    title: "",
    description: "",
    pricePerHour: "",
    game: "",
    availability: "",
    tags: "",
    image: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Debug session status
  console.log("Session status:", status);
  console.log("Session data:", session);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is authenticated
    if (status !== "authenticated" || !session) {
      setMessage("You must be logged in to create a listing");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Convert form data to JSON format
      const listingData = {
        title: form.title,
        description: form.description,
        pricePerHour: parseFloat(form.pricePerHour),
        game: form.game,
        availability: form.availability,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        // image: form.image, // needss seperate handling prisma me nahi leta img
        userId: session.user.id,
      };

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listingData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create listing");
      }

      const data = await res.json();
      setMessage("Listing created successfully!");
      router.push(`/listings`);
    } catch (error) {
      console.error("Error creating listing:", error);
      setMessage(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Create a Listing
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Gaming Session"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what makes this session awesome!"
              className="w-full border border-gray-300 rounded-xl p-3 h-24 resize-none focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Game
            </label>
            <input
              name="game"
              value={form.game}
              onChange={handleChange}
              placeholder="e.g. Fortnite"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <input
              name="availability"
              value={form.availability}
              onChange={handleChange}
              placeholder="e.g. 3 PM - 6 PM"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price per Hour ($)
            </label>
            <input
              name="pricePerHour"
              type="number"
              value={form.pricePerHour}
              onChange={handleChange}
              placeholder="e.g. 15"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g. FPS, Co-op, Friendly"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
            />
            {form.image && (
              <p className="text-green-600 mt-1 text-sm">
                Selected: {form.image.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Listing"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm font-medium text-gray-700">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
