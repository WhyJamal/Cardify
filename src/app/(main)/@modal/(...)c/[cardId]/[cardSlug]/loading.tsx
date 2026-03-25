export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4">
      <div className="bg-[#1d2125] top-10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl relative animate-pulse">

        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-white/10">
          <div className="h-6 w-32 bg-[#2c333a] rounded" />
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-[#2c333a] rounded" />
            <div className="w-8 h-8 bg-[#2c333a] rounded" />
            <div className="w-8 h-8 bg-[#2c333a] rounded" />
            <div className="w-8 h-8 bg-[#2c333a] rounded" />
          </div>
        </div>

        <div className="flex overflow-hidden h-full">

          <div className="flex-1 px-6 pb-6 pt-4 space-y-6">

            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#2c333a] rounded" />
              <div className="h-7 w-2/3 bg-[#2c333a] rounded" />
            </div>

            <div className="flex gap-2 flex-wrap">
              <div className="h-8 w-28 bg-[#2c333a] rounded" />
              <div className="h-8 w-28 bg-[#2c333a] rounded" />
            </div>

            <div className="flex gap-6">
              <div>
                <div className="h-3 w-20 bg-[#2c333a] rounded mb-2" />
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#2c333a]" />
                  <div className="w-8 h-8 rounded-full bg-[#2c333a]" />
                </div>
              </div>

              <div>
                <div className="h-3 w-16 bg-[#2c333a] rounded mb-2" />
                <div className="flex gap-2">
                  <div className="w-10 h-8 rounded bg-[#2c333a]" />
                  <div className="w-10 h-8 rounded bg-[#2c333a]" />
                </div>
              </div>
            </div>

            <div>
              <div className="h-4 w-32 bg-[#2c333a] rounded mb-3" />
              <div className="space-y-2 ml-6">
                <div className="h-4 w-full bg-[#2c333a] rounded" />
                <div className="h-4 w-5/6 bg-[#2c333a] rounded" />
                <div className="h-4 w-4/6 bg-[#2c333a] rounded" />
              </div>
            </div>
          </div>

            <div className="w-112.5 shrink-0 border-l border-[#2c333a] px-5 pt-4 bg-[#0f1313] space-y-5">

            <div className="h-5 w-48 bg-[#2c333a] rounded" />

            <div className="h-10 w-full bg-[#2c333a] rounded-lg" />

            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#2c333a]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-[#2c333a] rounded" />
                    <div className="h-10 w-full bg-[#2c333a] rounded-lg" />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}