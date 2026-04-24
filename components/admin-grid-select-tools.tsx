"use client";

type AdminGridSelectToolsProps = {
  gridId: string;
};

export function AdminGridSelectTools({ gridId }: AdminGridSelectToolsProps) {
  function setChecked(checked: boolean) {
    const grid = document.getElementById(gridId);
    const checkboxes = Array.from(
      grid?.querySelectorAll<HTMLInputElement>('input[name="selectedIds"]') ?? [],
    );

    checkboxes.forEach((checkbox) => {
      checkbox.checked = checked;
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-stone-400">
      <span>选择</span>
      <button
        type="button"
        onClick={() => setChecked(true)}
        className="border border-stone-700 bg-[#1d1916] px-3 py-1.5 text-stone-200 transition-colors hover:border-stone-500 hover:text-white"
      >
        当前页全选
      </button>
      <button
        type="button"
        onClick={() => setChecked(false)}
        className="border border-stone-700 bg-[#1d1916] px-3 py-1.5 text-stone-300 transition-colors hover:border-stone-500 hover:text-white"
      >
        清空选择
      </button>
    </div>
  );
}
