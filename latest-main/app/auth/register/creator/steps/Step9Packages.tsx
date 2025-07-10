"use client"

import { useState } from "react"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Textarea } from "../../../../../components/ui/textarea"
import { toast } from "sonner"

interface Package {
  title: string
  description: string
  price: string
}

type Props = {
  formData: {
    email: string
    packages: Package[]
  }
  updateForm: (data: Partial<{ packages: Package[] }>) => void
  next: () => void
  back: () => void
}

export default function Step9Packages({ formData, updateForm, next, back }: Props) {
  const [packages, setPackages] = useState<Package[]>(
    formData.packages.length > 0
      ? formData.packages
      : [{ title: "", description: "", price: "" }]
  )
  const [error, setError] = useState("")

  const handleChange = (index: number, field: keyof Package, value: string) => {
    const updated = [...packages]
    updated[index][field] = value
    setPackages(updated)
  }

  const addPackage = () => {
    if (packages.length >= 3) return
    setPackages([...packages, { title: "", description: "", price: "" }])
  }

  const removePackage = (index: number) => {
    const updated = [...packages]
    updated.splice(index, 1)
    setPackages(updated)
  }

  const handleNext = async () => {
    for (const pkg of packages) {
      if (!pkg.title.trim() || !pkg.description.trim() || !pkg.price.trim()) {
        setError("All fields are required for each package.")
        return
      }
    }

    setError("")
    updateForm({ packages })

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send OTP")
      toast.success("OTP sent to your email.")
    } catch (err: any) {
      toast.error(err.message || "OTP sending failed")
    }

    next()
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Your Content Packages</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Add 1–3 packages that brands can purchase from you
      </p>

      {packages.map((pkg, index) => (
        <div key={index} className="border border-slate-700 p-4 rounded-xl mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-white">Package {index + 1}</h4>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removePackage(index)}
                className="text-red-400 text-sm hover:underline"
              >
                Remove
              </button>
            )}
          </div>
          <Input
            placeholder="Title (e.g., Instagram Story Shoutout)"
            value={pkg.title}
            onChange={(e) => handleChange(index, "title", e.target.value)}
            className="mb-3"
          />
          <Textarea
            placeholder="Description"
            value={pkg.description}
            onChange={(e) => handleChange(index, "description", e.target.value)}
            className="mb-3"
          />
         <Input
            type="number"
            placeholder="Enter price in USD (e.g., 100)"
            value={pkg.price}
            onChange={(e) => handleChange(index, "price", e.target.value)}
          />
        </div>
      ))}

      {packages.length < 3 && (
        <Button variant="outline" onClick={addPackage} className="mb-4">
          + Add Another Package
        </Button>
      )}

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="flex justify-between mt-6">
        <Button variant="secondary" onClick={back}>
          Back
        </Button>
        <Button onClick={handleNext}>Continue</Button>
      </div>
    </div>
  )
}
