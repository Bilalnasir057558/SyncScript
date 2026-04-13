import { useState } from "react";
import Input from "./Input";
import Button from "./Button";

export default function CreateVaultModal({ onClose }) {

  const [vaultName, setVaultName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  
   const handleSubmit = () => {
    if (!vaultName.trim()) {
      setError("Vault name is required");
      return;
    }

     const vaultData = {
      name: vaultName,
      description: description,
    };

    console.log("Vault Data:", vaultData);

    setVaultName("");
    setDescription("");
    setError("");

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      
      {/* Modal Box */}
      <div className="bg-white w-[400px] rounded-xl shadow-lg p-5 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-lg font-bold text-[#0B3C5D]">
          Create New Vault
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Define a new isolated sanctuary for your research materials.
        </p>

        {/* Form */}
        <div className="flex flex-col gap-3">
          <label className="text-xs text-gray-600">Vault Name</label>
          <Input   
            value={vaultName}
            onChange={(e) => {
              setVaultName(e.target.value);  
              if (error) setError("");
            }}
            onBlur={() => {
              if (!vaultName.trim()) {
                setError("Vault name is required");
                }
              }} 
            placeholder="e.g. Comparative Literature 2024" />

          <label className="text-xs text-gray-600">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Define the scope and philosophical intent of this research cluster..."
            className="rounded-lg px-4 py-2 text-sm bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-5">
          <Button variant="gray" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} >
            Create Vault →
          </Button>

          {error && (
          <p className="text-red-500 text-xs mt-2">
          {error}
          </p>
          )}
        </div>
      </div>
    </div>
  );
}