import { useRef, useState } from "react";
import Input from "./Input";
import Icon from "./Icon";
import Button from "./Button";
import axiosInstance from "../api/axios";

export default function AddResourceForm({ vaultId, onResourceAdded, onClose }) {
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [fileSelected, setFileSelected] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileSelected(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!title.trim()) {
      setError("Title is required")
      return;
    }
    if(!url.trim()) {
      setError("URL is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Prepare FormData (Matches backend requirements)
      const formData = new FormData();
      formData.append("title", title);
      formData.append("url", url);
      
      if (fileSelected) {
        formData.append("file", fileSelected); // Key must be 'file' as per the backend route
      }

      // 2. API Call to your tested endpoint
      const response = await axiosInstance.post(`/resources/${vaultId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert("Resource successfully appended to the sanctuary!");
        clearFields();
        if (onResourceAdded) onResourceAdded(response.data.data); // Update UI in parent
        onClose();
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Failed to sync with the vault.");
    } finally {
      setLoading(false);
    }
  };

  const clearFields = () => {
    setTitle("");
    setUrl("");
    setFileSelected(null);
  };

  return (
      <div className="fixed inset-0 z-50 min-h-screen bg-black/30 backdrop-blur-sm flex flex-col justify-center items-center p-10">
        <div className="w-sm md:w-lg max-w-lg bg-white rounded-xl relative p-5">
          <button
            className="top-3 right-3 text-gray-500 absolute"
            onClick={onClose}
          >
            ✕
          </button>

          <h2 className="text-[#00263F] text-2xl font-semibold">
            Add Resource
          </h2>
          <p className="text-[#42474E] text-sm mb-8">
            Append new intelligence to your research vault.
          </p>

          <form className="" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1 mb-5">
              <label className="text-[#72777E] mb-1 text-sm font-semibold">
                RESOURCE TITLE
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if(error) setError("");
                }}
                placeholder="e.g. Critical Analysis of Modernist Archives"
                required
              />
            </div>

            <div className="flex flex-col gap-1 mb-7">
              <label className="text-[#72777E] mb-1 text-sm font-semibold">
                URL
              </label>
              <Input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if(error) setError("");
                }}
                placeholder="https://doi.org/10.1016/..."
                required
              />
            </div>

            <div
              onClick={handleClick}
              className="border-2 border-dashed border-gray-300 rounded-xl cursor-pointer text-center p-10"
            >
              <Input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />

              <div className="flex flex-col gap-2 items-center">
                <div className="w-12 h-12 bg-gray-200 p-2 rounded-full flex items-center justify-center">
                  <Icon name="fileupload" size="24px" />
                </div>

                <h3 className="text-[#00263F] text-lg font-semibold">
                  Upload File
                </h3>
                <p className="text-gray-500 text-sm">
                  Upload PDF, monograph, or raw datasets here (Max 50MB) 
                </p>
                <p className="text-gray-500 text-sm">
                  Only one file supported
                </p>

                {fileSelected && (
                  <p className="mt-2 text-sm font-medium text-blue-600 italic">
                    {fileSelected.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              {error && <p className="text-red-500 text-xs mr-auto">{error}</p>}
                <Button variant="gray" onClick={onClose}>
                  Cancel
                </Button>

                <Button type="submit" disabled={loading}>
                {loading ? "Syncing..." : "Add to Vault"}
                </Button>
              </div>
          </form>
        </div>
      </div>
  );
}
