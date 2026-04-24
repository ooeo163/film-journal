import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { AdminNewJournalForm } from "@/components/admin-new-journal-form";

export default function AdminNewJournalPage() {
  return (
    <AdminShell
      title="新建文章"
      description="这一页先建立后台文章录入的基础工作流，支持标题、摘要、正文、封面和发布时间。后续再继续接富文本、图库复用和发布计划。"
      currentPath="/admin/journals"
      actions={
        <Link
          href="/admin/journals"
          className="border border-stone-700 bg-[#1d1916] px-4 py-2 text-stone-300 transition-colors hover:border-stone-500 hover:text-white"
        >
          返回文章管理
        </Link>
      }
    >
      <section className="border border-stone-700 bg-[#221d18] shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
        <div className="border-b border-stone-700 px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-300">
            文章信息
          </h2>
        </div>

        <AdminNewJournalForm />
      </section>
    </AdminShell>
  );
}
