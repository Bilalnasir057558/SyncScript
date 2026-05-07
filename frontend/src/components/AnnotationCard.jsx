import React from "react";
import Icon from "./Icon";
import parse from "html-react-parser";

export default function AnnotationCard({
  user,
  date,
  time,
  text,
  onDelete,
  onEdit,
  canEdit,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 border-l-4 border-l-sky-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-sky-50 rounded-lg text-sky-600">
          <Icon name="search" size="16px" />
        </div>

        <div>
          <h4 className="text-md font-bold text-gray-600 uppercase tracking-wider">
            {user}
          </h4>

          <p className="tracking-wide text-xs text-gray-500">
            {date} • {time}
          </p>
        </div>
      </div>

      <div className="text-slate-600 leading-relaxed mb-4">
        {parse(text)}
      </div>

      {canEdit && (
        <div className="flex gap-3 mt-4">
          <button
            className="px-4 py-2 rounded-lg bg-sky-100 text-sky-700 font-medium hover:bg-sky-200 transition"
            onClick={() => {
              const updatedText = prompt("Edit annotation", text);

              if (updatedText && updatedText.trim()) {
                onEdit(updatedText);
              }
            }}
          >
            Edit
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-red-100 text-red-600 font-medium hover:bg-red-200 transition"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}