"use client";

import { useRef, useState } from "react";
import { Button } from "../../../../../components/ui/button";
import { toast } from "sonner";

type Props = {
  formData: {
    avatar: string | File | null;
    cover_photos: (string | File | null)[];
  };
  updateForm: (data: Partial<Props["formData"]>) => void;
  next: () => void;
  back: () => void;
};

export default function Step8Photos({ formData, updateForm, next, back }: Props) {
  const [avatar, setAvatar] = useState<File | null>(
  formData.avatar instanceof File ? formData.avatar : null
);
const [covers, setCovers] = useState<(File | null)[]>([
  formData.cover_photos?.[0] instanceof File ? formData.cover_photos[0] : null,
  formData.cover_photos?.[1] instanceof File ? formData.cover_photos[1] : null,
]);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(file);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 2);
    const updatedCovers = [...covers];

    for (let i = 0; i < files.length; i++) {
      const index = updatedCovers.findIndex((c) => !c);
      if (index !== -1) {
        updatedCovers[index] = files[i];
      }
    }

    setCovers(updatedCovers.slice(0, 2));
  };

  const removeCover = (index: number) => {
    const updated = [...covers];
    updated[index] = null;
    setCovers(updated);
  };

  const handleNext = () => {
    if (!avatar) {
      toast.error("Please upload a profile picture");
      return;
    }
    if (covers.filter(Boolean).length < 2) {
      toast.error("Please upload at least 2 cover photos");
      return;
    }

    updateForm({
      avatar,
      cover_photos: covers,
    });

    next();
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Upload your photos</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Add a profile picture and at least 2 cover photos
      </p>

      {/* Profile Picture */}
      <div className="mb-6">
        <p className="mb-2 font-medium">Profile Picture</p>
        {avatar ? (
          <div className="flex items-center space-x-4">
            <img
              src={URL.createObjectURL(avatar)}
              alt="Profile"
              className="w-20 h-20 object-cover rounded-full border"
            />
            <Button
              variant="outline"
              onClick={() => {
                setAvatar(null);
                profileInputRef.current?.click();
              }}
            >
              Change
            </Button>
          </div>
        ) : (
          <Button onClick={() => profileInputRef.current?.click()}>Upload</Button>
        )}
        <input
          ref={profileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleProfileChange}
          aria-label="Upload profile picture"
        />
      </div>

      {/* Cover Photos */}
      <div className="mb-6">
        <p className="mb-2 font-medium">Cover Photos (Min 2)</p>
        <div className="flex flex-wrap gap-3">
          {covers.map((file, index) =>
            file ? (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Cover ${index + 1}`}
                  className="w-28 h-28 object-cover rounded border"
                />
                <button
                  onClick={() => removeCover(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded"
                >
                  ✕
                </button>
              </div>
            ) : null
          )}
          {covers.filter(Boolean).length < 2 && (
            <Button variant="outline" onClick={() => coverInputRef.current?.click()}>
              + Add
            </Button>
          )}
        </div>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleCoverChange}
          aria-label="Upload cover photos"
        />
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="ghost" onClick={back}>
          Back
        </Button>
        <Button onClick={handleNext}>Continue</Button>
      </div>
    </div>
  );
}
