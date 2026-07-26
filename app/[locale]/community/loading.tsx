export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-pulse">
      <div className="h-28 bg-slate-800 rounded-3xl w-full" />
      <div className="h-12 bg-slate-200 rounded-2xl w-full max-w-sm" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-slate-100 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
