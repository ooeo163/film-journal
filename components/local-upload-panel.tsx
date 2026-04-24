"use client";

import { FormEvent, useState } from "react";

type UploadState = {
  ok: boolean;
  url: string;
  relativePath: string;
  fileName: string;
  size: number;
} | null;

export function LocalUploadPanel() {
  const [targetFolder, setTargetFolder] = useState("manual-uploads");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<UploadState>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("请先选择一张图片。");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetFolder", targetFolder);

      const response = await fetch("/api/admin/local-upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "上传失败");
      }

      setResult(data);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "上传失败，请稍后再试。",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="border border-stone-700 bg-[#221d18] shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
      <div className="border-b border-stone-700 px-5 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-300">
          本地上传
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 px-5 py-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-stone-300">
            <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
              目标目录
            </span>
            <input
              value={targetFolder}
              onChange={(event) => setTargetFolder(event.target.value)}
              className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
              placeholder="manual-uploads"
            />
          </label>

          <label className="space-y-2 text-sm text-stone-300">
            <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
              选择图片
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="w-full border border-stone-700 bg-[#181411] px-3 py-[7px] text-stone-300 file:mr-3 file:border-0 file:bg-stone-800 file:px-3 file:py-1.5 file:text-stone-100"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="border border-stone-600 bg-[#2a241f] px-4 py-2 text-sm text-stone-100 transition-colors hover:border-stone-400 hover:bg-[#342c26] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "上传中..." : "上传到项目附件目录"}
          </button>
          <p className="text-sm text-stone-500">
            文件会写入项目自己的 `storage/local-media`，不再指向原始源目录。
          </p>
        </div>

        {error ? (
          <div className="border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {result ? (
          <div className="space-y-2 border border-emerald-900/40 bg-emerald-950/20 px-4 py-4 text-sm text-emerald-100">
            <p>上传成功：{result.fileName}</p>
            <p>相对路径：{result.relativePath}</p>
            <p>访问地址：{result.url}</p>
            <p>文件大小：{result.size} bytes</p>
          </div>
        ) : null}
      </form>
    </section>
  );
}
