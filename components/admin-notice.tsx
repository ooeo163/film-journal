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
      ? "border-[#d9b35f] bg-[#fff8e6] text-[#6b4c00]"
      : "border-[#b8d7c0] bg-[#f1faf3] text-[#1f5d30]";

  return (
    <section className={`border px-5 py-4 text-sm leading-7 ${styles}`}>
      {children}
    </section>
  );
}
