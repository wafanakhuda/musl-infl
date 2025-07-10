// app/auth/register/brand/steps/Step2Role.tsx

"use client"

import { Button } from "../../../../../components/ui/button"
import { RadioGroup, RadioGroupItem } from "../../../../../components/ui/radio-group"
import { Label } from "../../../../../components/ui/label"

interface Step2RoleProps {
  data: any
  update: (data: Partial<any>) => void
  next: () => void
  prev: () => void
}

export default function Step2Role({ data, update, next, prev }: Step2RoleProps) {
  const roles = [
    "Founder",
    "Marketing Lead",
    "Agency",
    "Brand Manager",
    "Content Team",
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">What is your role?</h2>

      <RadioGroup
        value={data.role}
        onValueChange={(val) => update({ role: val })}
        className="space-y-3"
      >
        {roles.map((role) => (
          <div key={role} className="flex items-center space-x-2">
            <RadioGroupItem value={role} id={role} />
            <Label htmlFor={role}>{role}</Label>
          </div>
        ))}
      </RadioGroup>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={prev}>
          Back
        </Button>
        <Button disabled={!data.role} onClick={next}>
          Continue
        </Button>
      </div>
    </div>
  )
}
