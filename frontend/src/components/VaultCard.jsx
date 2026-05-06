export default function VaultCard({
  name,
  description,
  createdAt,
  role,
  resourceCount,
}) {
  const getRelativeTime = (dateString) => {
    const createdDate = new Date(dateString);
    if (Number.isNaN(createdDate.getTime())) return "Unknown";

    const now = new Date();
    const diffMs = now - createdDate;
    const dayMs = 24 * 60 * 60 * 1000;
    const days = Math.floor(diffMs / dayMs);

    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    if (days < 7) return `${days} days ago`;

    const weeks = Math.floor(days / 7);
    if (weeks === 1) return "1 week ago";
    if (weeks < 4) return `${weeks} weeks ago`;

    const months = Math.floor(days / 30);
    if (months === 1) return "1 month ago";
    return `${months} months ago`;
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col h-full">
      <div>
        {/* Top */}
        <div className="flex justify-between items-center mb-3">
          <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center text-xs">
            📁
          </div>

          <span className="text-[10px] px-2 py-1 rounded-md bg-gray-100 text-gray-500 font-semibold">
            {role}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-xl text-[#0B3C5D]">{name}</h3>

        {/* Description */}
        <p className="text-sm text-gray-700 mt-1 break-words">
          {description || "No description provided"}
        </p>
      </div>

      {/* Bottom */}
      <div className="mt-5 flex items-end justify-between text-xs text-gray-500">
        <span>{resourceCount} resources</span>
        <span>{getRelativeTime(createdAt)}</span>
      </div>
    </div>
  );
}
