import React, { useState } from "react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const handleSave = () => {
    if (!editedText.trim()) return;

    onEdit(editedText);
    setIsEditing(false);
  };

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

      {/* EDIT MODE */}
      {isEditing ? (
        <div className="flex flex-col gap-3">
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-sky-200"
            rows={4}
          />

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition"
            >
              Save
            </button>

            <button
              onClick={() => {
                setEditedText(text);
                setIsEditing(false);
              }}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* DISPLAY MODE */}
          <div className="text-slate-600 leading-relaxed mb-4">
            {parse(text)}
          </div>

          {canEdit && (
            <div className="flex gap-3 mt-4">
              <button
                className="px-4 py-2 rounded-lg bg-sky-100 text-sky-700 font-medium hover:bg-sky-200 transition"
                onClick={() => setIsEditing(true)}
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
        </>
      )}
    </div>
  );
}