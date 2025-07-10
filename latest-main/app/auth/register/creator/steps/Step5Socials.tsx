"use client";

import { useState } from "react";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { Label } from "../../../../../components/ui/label";

type Props = {
  formData: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    facebook?: string;
  };
  updateForm: (data: Partial<Props["formData"]>) => void;
  next: () => void;
  back: () => void;
};

export default function Step5SocialLinks({ formData, updateForm, next, back }: Props) {
  const [error, setError] = useState("");

  const handleChange = (platform: keyof Props["formData"], value: string) => {
    updateForm({ [platform]: value });
  };

  const handleNext = () => {
    const filled = Object.values(formData).some((v) => v && v.trim() !== "");
    if (!filled) {
      setError("Please add at least one social link.");
      return;
    }
    setError("");
    next();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Add Your Social Channels</h2>
      <p className="text-muted-foreground text-sm">
        Include links to your active platforms. You can add more later.
      </p>

      <div className="space-y-4">
        <div>
          <Label>Instagram</Label>
          <Input
            placeholder="https://instagram.com/yourprofile"
            value={formData.instagram || ""}
            onChange={(e) => handleChange("instagram", e.target.value)}
          />
        </div>

        <div>
          <Label>TikTok</Label>
          <Input
            placeholder="https://tiktok.com/@yourprofile"
            value={formData.tiktok || ""}
            onChange={(e) => handleChange("tiktok", e.target.value)}
          />
        </div>

        <div>
          <Label>YouTube</Label>
          <Input
            placeholder="https://youtube.com/channel/yourchannel"
            value={formData.youtube || ""}
            onChange={(e) => handleChange("youtube", e.target.value)}
          />
        </div>

        <div>
          <Label>Facebook</Label>
          <Input
            placeholder="https://facebook.com/yourprofile"
            value={formData.facebook || ""}
            onChange={(e) => handleChange("facebook", e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
