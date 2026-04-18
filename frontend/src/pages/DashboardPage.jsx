import { useState } from "react";
import CreateVaultModal from "../components/CreateVault";
import Button from "../components/Button";
import Icon from "../components/Icon";
import VaultCard from "../components/VaultCard";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [vaults, setVaults] = useState([]);

  // Add new vault (frontend only)
  const handleCreateVault = (data) => {
    const newVault = {
      title: data.name,
      description: data.description,
      resources: 0,
      date: "Just now",
    };

    setVaults((prev) => [newVault, ...prev]);
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#0B3C5D]">
          My Vaults
        </h2>

        <Button
          className="flex items-center gap-2 bg-[#00263F] text-white px-4 py-2 rounded-lg"
          onClick={() => setOpen(true)}
        >
          <Icon name="create-vault" size="20px" />
          Create Vault
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-6">

        {/* Dynamic Vaults */}
        {vaults.length > 0 ? (
          vaults.map((vault, index) => (
            <VaultCard key={index} {...vault} />
          ))
        ) : (
          <p className="text-gray-400 col-span-3 text-center">
            No vaults yet. Create one to get started 🚀
          </p>
        )}

        {/* Start New Vault Card */}
        <div
          onClick={() => setOpen(true)}
          className="border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
        >
          <div className="text-center text-gray-400">
            <p className="text-2xl">+</p>
            <p className="text-sm">Start New Vault</p>
          </div>
        </div>

      </div>

      {/* Modal */}
      {open && (
        <CreateVaultModal
          onClose={() => setOpen(false)}
          onCreate={handleCreateVault}
        />
      )}
    </div>
  );
}