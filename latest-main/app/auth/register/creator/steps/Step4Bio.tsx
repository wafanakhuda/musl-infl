"use client";

import { useState } from "react";
import { Textarea } from "../../../../../components/ui/textarea";
import { Button } from "../../../../../components/ui/button";
import { Label } from "../../../../../components/ui/label";

type Props = {
  formData: { bio: string };
  updateForm: (data: { bio: string }) => void;
  next: () => void;
  back: () => void;
};

export default function Step4Bio({ formData, updateForm, next, back }: Props) {
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!formData.bio.trim()) {
      setError("Please enter a short bio or description");
      return;
    }

    setError("");
    next();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Describe yourself and your content</h2>
      <p className="text-muted-foreground text-sm">
        Share a brief bio that will appear on your public profile. Talk about your niche, content style, and audience.
      </p>

      <div className="space-y-2">
        <Label>Bio / About You</Label>
        <Textarea
          placeholder="I’m a lifestyle creator focusing on beauty, travel, and wellness..."
          value={formData.bio}
          maxLength={500}
          onChange={(e) => updateForm({ bio: e.target.value })}
          rows={6}
        />
        <p className="text-xs text-gray-400">{formData.bio.length}/500 characters</p>
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
