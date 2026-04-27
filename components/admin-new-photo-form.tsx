"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type AlbumOption = {
  id: string;
  title: string;
  imageCount: number;
};

type AdminNewPhotoFormProps = {
  albums: AlbumOption[];
  initialError?: string | null;
};

const errorMessages: Record<string, string> = {
  "missing-file": "请先选择要上传的图片文件。",
  "missing-title": "请先填写照片标题。",
  "Unsupported file type": "当前只支持 jpg、png、webp、gif 图片。",
  "create-failed": "创建照片失败，请稍后再试。",
};

export function AdminNewPhotoForm({
  albums,
  initialError,
}: AdminNewPhotoFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(
    initialError ? errorMessages[initialError] ?? initialError : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/admin/photos", {
        method: "POST",
        body: formData,
        headers: {
          "x-admin-form": "1",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "create-failed");
      }

      router.push(data.redirectTo || "/admin/photos");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? errorMessages[submitError.message] ?? submitError.message
          : "创建照片失败，请稍后再试。",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="space-y-5 px-5 py-5"
    >
      {error ? (
        <div className="border border-[#e8b4aa] bg-[#fff5f2] px-5 py-4 text-sm text-[#9a2f22]">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-[#33312e]">
          <span className="block text-xs uppercase tracking-[0.2em] text-[#8a8276]">
            标题
          </span>
          <input
            name="title"
            required
            className="w-full border border-[#d6d0c5] bg-[#fbfaf7] px-3 py-2 text-[#111111] outline-none transition-all placeholder:text-[#a29a8f] hover:border-[#b8afa2] focus:border-[#c44b37] focus:bg-white focus:shadow-[0_0_0_3px_rgba(196,75,55,0.10)]"
            placeholder="输入照片标题"
          />
        </label>

        <label className="space-y-2 text-sm text-[#33312e]">
          <span className="block text-xs uppercase tracking-[0.2em] text-[#8a8276]">
            挂入相册
          </span>
          <select
            name="albumId"
            defaultValue=""
            className="w-full border border-[#d6d0c5] bg-[#fbfaf7] px-3 py-2 text-[#111111] outline-none transition-all hover:border-[#b8afa2] focus:border-[#c44b37] focus:bg-white focus:shadow-[0_0_0_3px_rgba(196,75,55,0.10)]"
          >
            <option value="">先不挂入相册</option>
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.title} ({album.imageCount})
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm text-[#33312e]">
          <span className="block text-xs uppercase tracking-[0.2em] text-[#8a8276]">
            自定义 slug
          </span>
          <input
            name="slug"
            className="w-full border border-[#d6d0c5] bg-[#fbfaf7] px-3 py-2 text-[#111111] outline-none transition-all placeholder:text-[#a29a8f] hover:border-[#b8afa2] focus:border-[#c44b37] focus:bg-white focus:shadow-[0_0_0_3px_rgba(196,75,55,0.10)]"
            placeholder="留空则按标题生成"
          />
        </label>

        <label className="space-y-2 text-sm text-[#33312e] md:col-span-2">
          <span className="block text-xs uppercase tracking-[0.2em] text-[#8a8276]">
            描述
          </span>
          <textarea
            name="description"
            rows={4}
            className="w-full border border-[#d6d0c5] bg-[#fbfaf7] px-3 py-2 text-[#111111] outline-none transition-all placeholder:text-[#a29a8f] hover:border-[#b8afa2] focus:border-[#c44b37] focus:bg-white focus:shadow-[0_0_0_3px_rgba(196,75,55,0.10)]"
            placeholder="输入照片描述"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2 text-sm text-[#33312e]">
          <span className="block text-xs uppercase tracking-[0.2em] text-[#8a8276]">
            地点
          </span>
          <input
            name="location"
            className="w-full border border-[#d6d0c5] bg-[#fbfaf7] px-3 py-2 text-[#111111] outline-none transition-all hover:border-[#b8afa2] focus:border-[#c44b37] focus:bg-white focus:shadow-[0_0_0_3px_rgba(196,75,55,0.10)]"
          />
        </label>

        <label className="space-y-2 text-sm text-[#33312e]">
          <span className="block text-xs uppercase tracking-[0.2em] text-[#8a8276]">
            相机
          </span>
          <input
            name="camera"
            className="w-full border border-[#d6d0c5] bg-[#fbfaf7] px-3 py-2 text-[#111111] outline-none transition-all hover:border-[#b8afa2] focus:border-[#c44b37] focus:bg-white focus:shadow-[0_0_0_3px_rgba(196,75,55,0.10)]"
          />
        </label>

        <label className="space-y-2 text-sm text-[#33312e]">
          <span className="block text-xs uppercase tracking-[0.2em] text-[#8a8276]">
            镜头
          </span>
          <input
            name="lens"
            className="w-full border border-[#d6d0c5] bg-[#fbfaf7] px-3 py-2 text-[#111111] outline-none transition-all hover:border-[#b8afa2] focus:border-[#c44b37] focus:bg-white focus:shadow-[0_0_0_3px_rgba(196,75,55,0.10)]"
          />
        </label>

        <label className="space-y-2 text-sm text-[#33312e]">
          <span className="block text-xs uppercase tracking-[0.2em] text-[#8a8276]">
            胶卷
          </span>
          <input
            name="filmStock"
            className="w-full border border-[#d6d0c5] bg-[#fbfaf7] px-3 py-2 text-[#111111] outline-none transition-all hover:border-[#b8afa2] focus:border-[#c44b37] focus:bg-white focus:shadow-[0_0_0_3px_rgba(196,75,55,0.10)]"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_220px]">
        <label className="space-y-2 text-sm text-[#33312e]">
          <span className="block text-xs uppercase tracking-[0.2em] text-[#8a8276]">
            图片文件
          </span>
          <input
            type="file"
            name="file"
            required
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="w-full border border-[#d6d0c5] bg-[#fbfaf7] px-3 py-[7px] text-[#33312e] file:mr-3 file:border file:border-[#d6d0c5] file:bg-white file:px-3 file:py-1.5 file:text-[#33312e]"
          />
        </label>

        <label className="space-y-2 text-sm text-[#33312e]">
          <span className="block text-xs uppercase tracking-[0.2em] text-[#8a8276]">
            拍摄日期
          </span>
          <input
            type="date"
            name="shotAt"
            className="w-full border border-[#d6d0c5] bg-[#fbfaf7] px-3 py-2 text-[#111111] outline-none transition-all hover:border-[#b8afa2] focus:border-[#c44b37] focus:bg-white focus:shadow-[0_0_0_3px_rgba(196,75,55,0.10)]"
          />
        </label>
      </div>

      <label className="flex items-center gap-3 text-sm text-[#33312e]">
        <input type="checkbox" name="isPublished" className="h-4 w-4" />
        <span>创建后立即发布</span>
      </label>

      <div className="flex flex-wrap items-center gap-3 border-t border-[#e3ded6] pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="border border-[#1f1f1d] bg-[#1f1f1d] px-4 py-2 text-sm text-white shadow-[0_10px_22px_rgba(31,31,29,0.14)] transition-all hover:border-[#c44b37] hover:bg-[#2c2925] hover:shadow-[0_14px_30px_rgba(31,31,29,0.18)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "上传中..." : "上传并创建照片"}
        </button>
        <p className="text-sm text-[#8a8276]">
          当前会把图片保存到 `storage/local-media/photos-manual/...`
        </p>
      </div>
    </form>
  );
}
