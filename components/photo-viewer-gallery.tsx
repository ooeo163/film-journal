"use client";

import { ReactNode, useState } from "react";
import {
  PhotoViewerItem,
  PhotoViewerModal,
} from "@/components/photo-viewer-modal";

type PhotoViewerGalleryProps = {
  items: PhotoViewerItem[];
  children: (controls: {
    openAt: (index: number) => void;
  }) => ReactNode;
};

export function PhotoViewerGallery({
  items,
  children,
}: PhotoViewerGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      {children({
        openAt: (index) => setSelectedIndex(index),
      })}

      {selectedIndex !== null ? (
        <PhotoViewerModal
          items={items}
          currentIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onChange={(nextIndex) => setSelectedIndex(nextIndex)}
        />
      ) : null}
    </>
  );
}
