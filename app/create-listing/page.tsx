'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type FormFields = {
  title: string
  description: string
  pricePerHour: string
  game: string
  availability: string
  tags: string
}

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = true,
}: {
  label: string
  name: keyof FormFields
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder: string
  type?: string
  required?: boolean
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
      required={required}
    />
  </div>
)

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = true,
}: {
  label: string
  name: keyof FormFields
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  placeholder: string
  required?: boolean
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-xl p-3 h-24 resize-none focus:ring-2 focus:ring-indigo-400 outline-none"
      required={required}
    />
  </div>
)

export default function CreateListingPage() {
  const [form, setForm] = useState<FormFields>({
    title: '',
    description: '',
    pricePerHour: '',
    game: '',
    availability: '',
    tags: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const price = parseFloat(form.pricePerHour)
    if (isNaN(price)) {
      setMessage('❌ Invalid price per hour')
      setLoading(false)
      return
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      pricePerHour: price,
      game: form.game.trim(),
      availability: form.availability.trim(),
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Something went wrong')
      }

      setMessage('🎉 Listing created successfully!')
      setTimeout(() => router.push('/listings'), 1500)
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create a Listing</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Gaming Session"
          />
          <TextAreaField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe what makes this session awesome!"
          />
          <InputField
            label="Game"
            name="game"
            value={form.game}
            onChange={handleChange}
            placeholder="e.g. Fortnite"
          />
          <InputField
            label="Availability"
            name="availability"
            value={form.availability}
            onChange={handleChange}
            placeholder="e.g. 3 PM - 6 PM"
          />
          <InputField
            label="Price per Hour ($)"
            name="pricePerHour"
            type="number"
            value={form.pricePerHour}
            onChange={handleChange}
            placeholder="e.g. 15"
          />
          <InputField
            label="Tags (comma separated)"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="e.g. FPS, Co-op, Friendly"
            required={false}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Listing'}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              message.startsWith('🎉') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  )
}
