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
    <div className="flex flex-wrap items-center gap-2 text-sm text-[#6d665d]">
      <span>选择</span>
      <button
        type="button"
        onClick={() => setChecked(true)}
        className="border border-[#d6d0c5] bg-white px-3 py-1.5 text-[#33312e] transition-all hover:border-[#c44b37] hover:bg-[#fff8f5] hover:text-[#8a2f22]"
      >
        当前页全选
      </button>
      <button
        type="button"
        onClick={() => setChecked(false)}
        className="border border-[#d6d0c5] bg-white px-3 py-1.5 text-[#6d665d] transition-all hover:border-[#c44b37] hover:bg-[#fff8f5] hover:text-[#8a2f22]"
      >
        清空选择
      </button>
    </div>
  );
}
