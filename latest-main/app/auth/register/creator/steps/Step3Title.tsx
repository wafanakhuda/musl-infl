"use client";

import { useState } from "react";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { Label } from "../../../../../components/ui/label";

type Props = {
  formData: { title: string };
  updateForm: (data: { title: string }) => void;
  next: () => void;
  back: () => void;
};

export default function Step3Title({ formData, updateForm, next, back }: Props) {
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!formData.title.trim()) {
      setError("Please enter a profile title");
      return;
    }

    setError("");
    next();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Summarize yourself</h2>
      <p className="text-muted-foreground text-sm">
        This title appears on your profile. E.g., “Fashion Creator from Dubai”
      </p>

      <div className="space-y-2">
        <Label>Profile Title</Label>
        <Input
          placeholder="e.g. Beauty Creator based in Jakarta"
          value={formData.title}
          maxLength={80}
          onChange={(e) => updateForm({ title: e.target.value })}
        />
        <p className="text-xs text-gray-400">
          {formData.title.length}/80 characters
        </p>
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
