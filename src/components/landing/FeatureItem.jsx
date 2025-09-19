export default function FeatureItem({ items }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-2xl p-5 shadow-2xs hover:shadow-2xl cursor-pointer text-center"
        >
          <img src={item.img} alt={item.title} className="h-70 mx-auto mb-4" />
          <h3 className="font-semibold text-lg text-slate-800">{item.title}</h3>
          <p className="text-sm text-slate-800 mt-1">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

// bg-gradient-to-b from-rose-300 via-red-200 to-red-300
