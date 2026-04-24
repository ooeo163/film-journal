import { cookies } from "next/headers";
import { AccountShell } from "@/components/account-shell";

export default async function MySettingsPage() {
  const cookieStore = await cookies();
  const userName = cookieStore.get("fj_user_name")?.value || null;

  return (
    <AccountShell
      title="账号设置"
      description="这里会承接昵称、头像、密码更新、联系方式和权限相关设置。"
      userName={userName}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-[1.6rem] border border-stone-700/70 bg-[rgba(28,22,18,0.72)] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
            Profile
          </p>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            后续这里会支持昵称、头像、简介等个人资料管理。
          </p>
        </section>

        <section className="rounded-[1.6rem] border border-stone-700/70 bg-[rgba(28,22,18,0.72)] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
            Security
          </p>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            后续这里会支持密码更新、登录设备、权限和安全审计相关能力。
          </p>
        </section>
      </div>
    </AccountShell>
  );
}
