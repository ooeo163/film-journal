"use client";

import { useState } from "react";
import { UploadPhotoModal } from "./upload-photo-modal";
import { CosUploadPhotoModal } from "./cos-upload-photo-modal";

type AlbumOption = {
  id: string;
  title: string;
};

type UploadPhotoButtonProps = {
  albums: AlbumOption[];
  defaultAlbumId?: string;
};

export function UploadPhotoButton({
  albums,
  defaultAlbumId,
}: UploadPhotoButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<"local" | "cos">("local");

  return (
    <>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setUploadMode("local");
            setIsModalOpen(true);
          }}
          className="rounded-[0.9rem] border border-stone-600/80 bg-[rgba(118,95,73,0.88)] px-4 py-2 text-sm font-medium text-stone-100 transition-colors hover:bg-[rgba(145,116,89,0.92)]"
        >
          本地上传
        </button>
        <button
          type="button"
          onClick={() => {
            setUploadMode("cos");
            setIsModalOpen(true);
          }}
          className="rounded-[0.9rem] border border-stone-600/80 bg-[rgba(59,130,246,0.88)] px-4 py-2 text-sm font-medium text-stone-100 transition-colors hover:bg-[rgba(37,99,235,0.92)]"
        >
          云存储上传
        </button>
      </div>
      {isModalOpen && uploadMode === "local" && (
        <UploadPhotoModal
          albums={albums}
          defaultAlbumId={defaultAlbumId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {isModalOpen && uploadMode === "cos" && (
        <CosUploadPhotoModal
          albums={albums}
          defaultAlbumId={defaultAlbumId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
