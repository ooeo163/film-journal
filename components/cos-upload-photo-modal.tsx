"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

type AlbumOption = {
  id: string;
  title: string;
};

type CosUploadPhotoModalProps = {
  albums: AlbumOption[];
  defaultAlbumId?: string;
  onClose: () => void;
};

export function CosUploadPhotoModal({
  albums,
  defaultAlbumId,
  onClose,
}: CosUploadPhotoModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileCount, setFileCount] = useState(0);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const [progress, setProgress] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessCount(null);
    setProgress(null);

    const form = event.currentTarget;
    const fileInput = form.querySelector(
      'input[name="files"]'
    ) as HTMLInputElement;
    const albumId =
      (form.querySelector('select[name="albumId"]') as HTMLSelectElement)
        ?.value || "";

    const allFiles = fileInput.files;
    if (!allFiles || allFiles.length === 0) {
      setError("请选择照片");
      setIsSubmitting(false);
      return;
    }

    const files = Array.from(allFiles);
    let uploadedCount = 0;

    try {
      const { uploadToCos, registerPhoto } = await import("@/lib/cos-upload");

      for (let i = 0; i < files.length; i++) {
        setProgress(`上传中 ${i + 1}/${files.length}...`);

        const result = await uploadToCos(files[i]);

        await registerPhoto(result.url, result.thumbUrl, albumId || undefined, files[i].name);

        uploadedCount++;
      }

      setSuccessCount(uploadedCount);
      setProgress(null);
      router.refresh();

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (submitError) {
      setProgress(null);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "上传照片失败，请稍后再试。"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-[560px] rounded-[1.5rem] border border-stone-700/80 bg-[rgba(17,16,15,0.96)] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.4)] sm:p-6">
        <div className="border-b border-stone-700/70 pb-4">
          <h2 className="text-xl font-semibold text-stone-50 sm:text-2xl">上传照片</h2>
        </div>

        {error && (
          <div className="mt-4 rounded-[0.9rem] border border-red-700/40 bg-[rgba(77,22,22,0.38)] p-4 text-sm text-red-100">
            {error}
          </div>
        )}

        {successCount !== null && (
          <div className="mt-4 rounded-[0.9rem] border border-emerald-700/40 bg-[rgba(22,77,52,0.38)] p-4 text-sm text-emerald-100">
            成功上传 {successCount} 张照片
          </div>
        )}

        {progress && (
          <div className="mt-4 rounded-[0.9rem] border border-stone-700/40 bg-[rgba(28,22,18,0.76)] p-4 text-sm text-stone-300">
            {progress}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label className="grid gap-2">
            <span className="text-sm text-stone-400">选择照片 *</span>
            <input
              type="file"
              name="files"
              multiple
              required
              accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"
              onChange={(e) => setFileCount(e.target.files?.length ?? 0)}
              className="w-full max-w-full rounded-[1rem] border border-stone-700/80 bg-[rgba(28,22,18,0.76)] px-4 py-3 text-stone-100 outline-none transition-colors file:mr-3 file:rounded-[0.5rem] file:border-0 file:bg-stone-700 file:px-3 file:py-1.5 file:text-sm file:text-stone-200 hover:file:bg-stone-600"
            />
            {fileCount > 0 && (
              <span className="text-xs text-stone-500">
                已选择 {fileCount} 张照片
              </span>
            )}
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-stone-400">选择相册（可选）</span>
            <select
              name="albumId"
              defaultValue={defaultAlbumId || ""}
              className="w-full max-w-full rounded-[1rem] border border-stone-700/80 bg-[rgba(28,22,18,0.76)] px-4 py-3 text-stone-100 outline-none transition-colors focus:border-stone-500"
            >
              <option value="">不添加到相册</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-[1rem] border border-stone-700/80 bg-transparent px-4 py-3 text-sm font-medium text-stone-300 transition-colors hover:bg-stone-800/50 disabled:opacity-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting || fileCount === 0}
              className="flex-1 rounded-[1rem] bg-[rgba(118,95,73,0.88)] px-4 py-3 text-sm font-medium text-stone-100 transition-colors hover:bg-[rgba(145,116,89,0.92)] disabled:opacity-50"
            >
              {isSubmitting ? "上传中..." : "上传照片"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
