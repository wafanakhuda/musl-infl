// File: app/creators/steps/Step2Location.tsx

"use client";

import { useState } from "react";
import { Button } from "../../../../../components/ui/button";
import { Label } from "../../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";

type Props = {
  formData: { location: string };
  updateForm: (data: { location: string }) => void;
  next: () => void;
  back: () => void;
};

const countries = [
  "Saudi Arabia",
  "United Arab Emirates",
  "United States",
  "United Kingdom",
  "India",
  "Pakistan",
  "Malaysia",
  "Indonesia",
  "Turkey",
  "Canada",
  "Germany",
  "France",
  "Australia",
  "Nigeria",
  "Egypt",
  "Bangladesh",
  "South Africa",
  "Morocco",
  "Qatar",
  "Kuwait",
];

export default function Step2Location({
  formData,
  updateForm,
  next,
  back,
}: Props) {
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!formData.location) {
      setError("Please select your country");
      return;
    }
    setError("");
    next();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Where are you located?</h2>
      <p className="text-muted-foreground text-sm">
        Select your country so brands can find you more easily.
      </p>

      <div className="space-y-2">
        <Label>Country</Label>
        <Select
          value={formData.location}
          onValueChange={(value) => updateForm({ location: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={back}>
          Back
        </Button>
        <Button onClick={handleNext}>Continue</Button>
      </div>
    </div>
  );
}
