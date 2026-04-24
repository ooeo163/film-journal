import { ReactNode } from "react";

type AdminNoticeProps = {
  tone?: "success" | "warning";
  children: ReactNode;
};

export function AdminNotice({
  tone = "success",
  children,
}: AdminNoticeProps) {
  const styles =
    tone === "warning"
      ? "border-amber-700/40 bg-amber-950/20 text-amber-100"
      : "border-emerald-700/40 bg-emerald-950/20 text-emerald-100";

  return (
    <section className={`border px-5 py-4 text-sm leading-7 ${styles}`}>
      {children}
    </section>
  );
}
