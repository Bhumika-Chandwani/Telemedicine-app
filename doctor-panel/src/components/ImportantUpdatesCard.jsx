import { Bell } from "lucide-react";

export default function ImportantUpdatesCard({ updates = [] }) {
  const limitedUpdates = updates.slice(0, 3);

  return (
    <div
      className="
        karla-font
        w-[360px]
        bg-teal-50/40
        border border-teal-500/30
        rounded-2xl
        p-6
        shadow-sm
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg text-black">
          Important Updates
        </h2>

        <Bell size={18} className="text-black/60" />
      </div>

      {/* Updates List */}
      <div className="space-y-4">
        {limitedUpdates.map((item, index) => (
          <div
            key={index}
            className="
              border border-black/10
              rounded-xl
              p-4
              bg-white/60
              transition-all duration-200
              hover:bg-white
              hover:shadow-sm
            "
          >
            {/* Top Row */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-teal-700 bg-teal-100 px-2 py-[2px] rounded-md">
                {item.category}
              </span>

              <span className="text-[11px] text-black/60">
                {item.date}
              </span>
            </div>

            {/* Headline */}
            <h3 className="text-[14px] text-black mb-1">
              {item.title}
            </h3>

            {/* Preview */}
            <p className="text-[12px] text-black/70 line-clamp-2">
              {item.preview}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
