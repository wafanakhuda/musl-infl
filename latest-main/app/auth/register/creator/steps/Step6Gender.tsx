"use client";

import { useState } from "react";
import { Button } from "../../../../../components/ui/button";

type Props = {
  formData: { gender?: string };
  updateForm: (data: Partial<{ gender: string }>) => void;
  next: () => void;
  back: () => void;
};

export default function Step6Gender({ formData, updateForm, next, back }: Props) {
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!formData.gender) {
      setError("Please select your gender.");
      return;
    }

    setError("");
    next();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">What’s your gender?</h2>
      <p className="text-muted-foreground text-sm">
        This helps us personalize your profile.
      </p>

      <div className="flex gap-6">
        {["Male", "Female"].map((option) => {
          const value = option.toLowerCase();
          const selected = formData.gender === value;

          return (
            <label
              key={value}
              className={`cursor-pointer px-6 py-3 border rounded-xl text-white ${
                selected
                  ? "border-blue-500 bg-blue-600"
                  : "border-slate-600 bg-slate-800 hover:border-blue-500"
              }`}
            >
              <input
                type="radio"
                name="gender"
                value={value}
                checked={selected}
                onChange={() => updateForm({ gender: value })}
                className="hidden"
              />
              {option}
            </label>
          );
        })}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-between mt-6">
        <Button variant="ghost" onClick={back}>
          Back
        </Button>
        <Button onClick={handleNext}>Continue</Button>
      </div>
    </div>
  );
}
