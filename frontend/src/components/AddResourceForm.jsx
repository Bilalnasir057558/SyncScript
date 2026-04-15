import { useRef, useState } from "react";
import Input from "./Input";
import Icon from "./Icon";
import Button from "./Button";

export default function AddResourceForm() {
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [fileSelected, setFileSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [error, setError] = useState("");

  const onClose = () => {
    setIsOpen(false);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileSelected(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if(!title.trim()) {
      setError("Title is required")
      return;
    };
    if(!url.trim()) {
      setError("URL is required");
      return;
    }

    const newResource = {
      resourceTitle: title,
      resourceURL: url,
      file: fileSelected?.name
    };

    console.log(newResource);
    alert("Resource is added!");
    clearFields();
    setError("");

  }

  const clearFields = () => {
    setTitle("");
    setUrl("");
    setFileSelected(null);
  }

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex flex-col justify-center items-center z-50">
        <div className="bg-white w-100 rounded-lg relative p-5">
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
                onChange={(e) => setUrl(e.target.value)}
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
                  Upload Files
                </h3>
                <p className="text-gray-500 text-sm">
                  Upload PDFs, monographs, or raw datasets here (Max 50MB)
                </p>

                {fileSelected && (
                  <p className="mt-2 text-sm font-medium text-blue-600 italic">
                    {fileSelected.name}
                  </p>
                )}
              </div>

              
            </div>
            <div className="flex justify-end gap-2 mt-5">
                <Button variant="gray" onClick={onClose}>
                  Cancel
                </Button>

                <Button onClick={handleSubmit}>Add to Vault</Button>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>
          </form>
        </div>
      </div>
    )
  );
}
