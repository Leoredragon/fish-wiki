export default function PublicProfileLoading() {
  return (
    <div className="max-w-5xl mx-auto pt-4 pb-12 space-y-4 animate-pulse">
      <div className="h-10 w-28 rounded-2xl bg-slate-200" />
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
        <div className="h-24 w-24 rounded-full bg-slate-200" />
        <div className="h-6 w-56 rounded-lg bg-slate-200" />
        <div className="h-4 w-80 rounded-lg bg-slate-100" />
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3">
        <div className="h-5 w-40 rounded-lg bg-slate-200" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="aspect-[4/3] bg-slate-200" />
              <div className="p-3.5 space-y-2">
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-3 w-full rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
