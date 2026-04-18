export default function VaultCard({
  title,
  description,
  resources,
  date,
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer">

      {/* Top */}
      <div className="flex justify-between items-center mb-3">
        <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center text-xs">
          📁
        </div>

        <span className="text-[10px] px-2 py-1 rounded-md bg-gray-100 text-gray-500 font-semibold">
          ACTIVE
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-md text-[#0B3C5D]">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 mt-1">
        {description || "No description provided"}
      </p>

      {/* Bottom */}
      <div className="flex justify-between mt-5 text-xs text-gray-400">
        <span>{resources} resources</span>
        <span>{date}</span>
      </div>

    </div>
  );
}