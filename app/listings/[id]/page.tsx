import { notFound } from "next/navigation";
import { NextRequest } from "next/server";

type Listing = {
  id: string;
  title: string;
  description: string;
  pricePerHour: number;
  availability?: string;
  images: string[];
  voiceIntroUrl?: string;
  tags: string[];
  user: { name: string; image: string };
  playerDetails?: { age: number; position: string };
};

function getListingId(req: NextRequest): string {
  return req.nextUrl.pathname.split("/").pop() || "";
}

export default async function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(`http://localhost:3000/api/listings/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const listing: Listing = await res.json();
  const images = listing.images.length > 0 ? listing.images : ["https://source.unsplash.com/random/500x300"];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800">{listing.title}</h1>

        <div className="flex items-center gap-4 text-gray-600">
          <img
            src={listing.user.image}
            alt={listing.user.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
          />
          <span className="text-lg font-semibold">{listing.user.name}</span>
        </div>

        <p className="text-lg text-gray-700 mt-4">{listing.description}</p>

        {/* Display Price per Hour */}
        <p className="text-xl font-semibold text-gray-800 mt-4">
          <span className="text-gray-600">Price:</span> ${listing.pricePerHour} per hour
        </p>

        {/* Display Availability */}
        {listing.availability && (
          <p className="text-lg text-gray-700 mt-2">
            <strong>Availability:</strong> {listing.availability}
          </p>
        )}

        {/* Display Voice Intro URL */}
        {listing.voiceIntroUrl && (
          <div className="mt-4">
            <p className="text-lg text-gray-700">
              <strong>Voice Introduction:</strong>
            </p>
            <audio controls className="w-full mt-2">
              <source src={listing.voiceIntroUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Display Tags */}
        {listing.tags.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Tags:</h3>
            <ul className="flex gap-3 flex-wrap">
              {listing.tags.map((tag, index) => (
                <li
                  key={index}
                  className="bg-blue-200 text-blue-800 py-1 px-3 rounded-full text-sm shadow-sm"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Display Player Details */}
        {listing.playerDetails && (
          <div className="bg-gray-100 p-6 rounded-lg shadow-sm mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Player Details</h2>
            <p><strong>Age:</strong> {listing.playerDetails.age}</p>
            <p><strong>Position:</strong> {listing.playerDetails.position}</p>
          </div>
        )}

        {/* Display Images */}
        {images.length > 0 ? (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, index) => (
                <div key={index} className="overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={img}
                    alt="Player"
                    className="object-cover w-full h-64 transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic mt-4">No images uploaded.</p>
        )}
      </div>
    </div>
  );
}
