export function StatusTag({ status }: { status: string }) {
  const isActive = status === "active";
  return (
    <span
      className={`text-[11px] px-2 py-[2px] rounded-sm border whitespace-nowrap ${isActive ? "text-forest border-forest" : "text-clay border-clay"
        }`}
    >
      {status}
    </span>
  );
}