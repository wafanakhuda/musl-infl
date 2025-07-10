"use client";

import { useState } from "react";
import { Button } from "../../../../../components/ui/button";
import { Badge } from "../../../../../components/ui/badge";

type Props = {
  formData: { content_type: string[] };
  updateForm: (data: Partial<{ content_type: string[] }>) => void;
  next: () => void;
  back: () => void;
};

const ALL_CONTENT_TYPES = [
  "Fashion",
  "Beauty",
  "Food",
  "Travel",
  "Fitness",
  "Lifestyle",
  "Tech",
  "Education",
  "Comedy",
  "Finance",
  "Health",
];

export default function Step7ContentType({ formData, updateForm, next, back }: Props) {
  const [selected, setSelected] = useState<string[]>(formData.content_type || []);
  const [error, setError] = useState("");

  const toggleType = (type: string) => {
    setSelected((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleNext = () => {
    if (selected.length === 0) {
      setError("Please select at least one content type.");
      return;
    }

    setError("");
    updateForm({ content_type: selected });
    next();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">What kind of content do you post?</h2>
        <p className="text-sm text-muted-foreground">Select one or more categories</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {ALL_CONTENT_TYPES.map((type) => (
          <Badge
            key={type}
            variant={selected.includes(type) ? "default" : "outline"}
            className={`cursor-pointer px-4 py-2 ${
              selected.includes(type)
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300"
            }`}
            onClick={() => toggleType(type)}
          >
            {type}
          </Badge>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={back}>
          Back
        </Button>
        <Button onClick={handleNext}>Continue</Button>
      </div>
    </div>
  );
}
