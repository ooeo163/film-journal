import { AdminShell } from "@/components/admin-shell";
import { LocalUploadPanel } from "@/components/local-upload-panel";

export default function AdminMediaPage() {
  return (
    <AdminShell
      title="导入与上传"
      description="这一页开始统一站点的本地附件工作流：导入会先复制到项目附件目录，本地上传也直接进入项目自己的 storage。后面上线时，这一层会平滑切到 COS。"
      currentPath="/admin/media"
    >
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="border border-stone-700 bg-[#221d18] shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
          <div className="border-b border-stone-700 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-300">
              本地导入说明
            </h2>
          </div>

          <div className="space-y-4 px-5 py-5 text-sm leading-7 text-stone-300">
            <p>
              现在本地导入已经不是直接引用
              <span className="mx-1 rounded bg-[#181411] px-2 py-1 text-stone-100">
                D:\workspace\film-journal-img
              </span>
              里的原图，而是会先复制到项目自己的附件目录：
            </p>

            <div className="border border-stone-800 bg-[#181411] px-4 py-3 font-mono text-xs text-stone-300">
              D:\work\film-journal\storage\local-media
            </div>

            <p>导入命令仍然不变：</p>

            <div className="border border-stone-800 bg-[#181411] px-4 py-3 font-mono text-xs text-stone-300">
              npm run import:local-albums
            </div>

            <p>
              后面如果你要接腾讯云 COS，我们主要替换的就是这一层存储实现，数据库里的媒体访问思路不会推翻。
            </p>
          </div>
        </section>

        <LocalUploadPanel />
      </div>
    </AdminShell>
  );
}
