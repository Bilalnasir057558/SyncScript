import React from "react";
import Icon from "./Icon";
import parse from "html-react-parser";

export default function AnnotationCard({
  user,
  date,
  time,
  text
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
          <p className="tracking-wide text-xs text-gray-500">{date} • {time}</p>
        </div>
      </div>
      <div className="text-slate-600 leading-relaxed mb-4">
        {parse(text)}
      </div>
    </div>
  );
}
