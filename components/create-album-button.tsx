"use client";

import { useState } from "react";
import { CreateAlbumModal } from "./create-album-modal";

export function CreateAlbumButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="rounded-[0.9rem] border border-stone-600/80 bg-[rgba(118,95,73,0.88)] px-4 py-2 text-sm font-medium text-stone-100 transition-colors hover:bg-[rgba(145,116,89,0.92)]"
      >
        创建相册
      </button>
      {isModalOpen && (
        <CreateAlbumModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
