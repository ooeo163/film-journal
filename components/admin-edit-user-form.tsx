"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: string;
  isActive: boolean;
};

type AdminEditUserFormProps = {
  user: User;
};

export function AdminEditUserForm({ user }: AdminEditUserFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "更新失败");
        return;
      }

      setSuccess("用户信息已更新");
      router.refresh();
    } catch {
      setError("更新请求失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("确定要删除此用户吗？")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "删除失败");
        return;
      }

      router.push("/admin/users?deleted=1");
    } catch {
      setError("删除请求失败，请重试");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-[#222222]">用户名 *</span>
          <input
            name="username"
            type="text"
            required
            defaultValue={user.username}
            className="rounded border border-[#d6d0c5] bg-white px-3 py-2 text-sm text-[#111111] outline-none focus:border-[#8a8276]"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-[#222222]">邮箱 *</span>
          <input
            name="email"
            type="email"
            required
            defaultValue={user.email}
            className="rounded border border-[#d6d0c5] bg-white px-3 py-2 text-sm text-[#111111] outline-none focus:border-[#8a8276]"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-[#222222]">显示名</span>
          <input
            name="displayName"
            type="text"
            defaultValue={user.displayName}
            className="rounded border border-[#d6d0c5] bg-white px-3 py-2 text-sm text-[#111111] outline-none focus:border-[#8a8276]"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-[#222222]">角色</span>
          <select
            name="role"
            defaultValue={user.role}
            className="rounded border border-[#d6d0c5] bg-white px-3 py-2 text-sm text-[#111111] outline-none focus:border-[#8a8276]"
          >
            <option value="user">普通用户</option>
            <option value="system_admin">系统管理员</option>
          </select>
        </label>
      </div>

      <div className="border-t border-[#d6d0c5] pt-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-[#222222]">修改密码</h3>
            <p className="mt-1 text-xs text-[#8a8276]">
              留空则不修改密码
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-sm text-[#8a8276] hover:text-[#222222]"
          >
            {showPassword ? "收起" : "展开"}
          </button>
        </div>

        {showPassword && (
          <label className="mt-3 grid gap-2">
            <span className="text-sm font-medium text-[#222222]">新密码</span>
            <input
              name="password"
              type="password"
              minLength={6}
              placeholder="留空则不修改"
              className="rounded border border-[#d6d0c5] bg-white px-3 py-2 text-sm text-[#111111] outline-none focus:border-[#8a8276]"
            />
          </label>
        )}
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={user.isActive}
          className="h-4 w-4 rounded border-[#d6d0c5]"
        />
        <span className="text-sm text-[#222222]">账号激活</span>
      </label>

      <div className="flex gap-3 border-t border-[#d6d0c5] pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-[#111111] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#333333] disabled:opacity-50"
        >
          {isSubmitting ? "保存中..." : "保存修改"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="rounded border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          删除用户
        </button>
      </div>
    </form>
  );
}
