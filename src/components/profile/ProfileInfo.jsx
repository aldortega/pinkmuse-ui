export default function ProfileInfo({ infoItems }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {infoItems.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-red-100 bg-red-50/60 px-4 py-3 text-sm text-slate-700"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {item.label}
          </p>
          <p className="mt-1 text-sm text-slate-800">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
