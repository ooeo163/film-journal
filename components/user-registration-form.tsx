"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UserRegistrationForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "注册失败");
        return;
      }

      setSuccess(`用户 ${data.username} 注册成功`);
      form.reset();
      router.refresh();
    } catch {
      setError("注册请求失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-[#222222]">用户名 *</span>
          <input
            name="username"
            type="text"
            required
            className="rounded border border-[#d6d0c5] bg-white px-3 py-2 text-sm text-[#111111] outline-none focus:border-[#8a8276]"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-[#222222]">邮箱 *</span>
          <input
            name="email"
            type="email"
            required
            className="rounded border border-[#d6d0c5] bg-white px-3 py-2 text-sm text-[#111111] outline-none focus:border-[#8a8276]"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-[#222222]">显示名</span>
          <input
            name="displayName"
            type="text"
            className="rounded border border-[#d6d0c5] bg-white px-3 py-2 text-sm text-[#111111] outline-none focus:border-[#8a8276]"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-[#222222]">密码 *</span>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="rounded border border-[#d6d0c5] bg-white px-3 py-2 text-sm text-[#111111] outline-none focus:border-[#8a8276]"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-[#111111] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#333333] disabled:opacity-50"
      >
        {isSubmitting ? "注册中..." : "注册用户"}
      </button>
    </form>
  );
}
