import { useState } from "react";
import Input from "./Input";

export default function AddResourceForm() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [fileSelected, setFileSelected] = useState(null);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex flex-col justify-center items-center z-50">
      <div className="bg-white w-100 rounded-lg relative p-5">
        <button
          className="top-3 right-3 text-gray-500 absolute"
          onClick={"onClose"}
        >
          ✕
        </button>

        <h2 className="text-[#00263F] text-2xl font-semibold">Add Resource</h2>
        <p className="text-[#42474E] text-sm mb-8">
          Append new intelligence to your research vault.
        </p>

        <form className="">
          <div className="flex flex-col gap-1 mb-5">
            <label className="text-[#72777E] mb-1 text-sm font-semibold">
              RESOURCE TITLE
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Critical Analysis of Modernist Archives"
            />
          </div>

          <div className="flex flex-col gap-1 mb-5">
            <label className="text-[#72777E] mb-1 text-sm font-semibold">
              URL
            </label>
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://doi.org/10.1016/..."
            />
          </div>

          <div className="flex flex-col gap-1 mb-5 border-dashed">
            
            
          </div>
        </form>
      </div>
    </div>
  );
}
