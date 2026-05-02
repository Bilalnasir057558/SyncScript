import { useEffect, useState } from "react";
import CreateVaultModal from "../components/CreateVault";
import Button from "../components/Button";
import Icon from "../components/Icon";
import SideMenu from "../components/Sidemenu";
import MobileNav from "../components/MobileNav";
import VaultCard from "../components/VaultCard";
import { createVault } from "../api/vault.api";
import axiosInstance from "../api/axios";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("My Vaults");
  const [open, setOpen] = useState(false);
  const [vaults, setVaults] = useState([]);
  const [sharedVaults, setSharedVaults] = useState([]);

  // Add new vault
  const handleCreateVault = async (data) => {
    // create temporary vault (optimistic UI)
    const tempId = `temp-${Date.now()}`;

    const tempVault = {
      id: tempId,
      name: data.name,
      description: data.description,
      resources: 0,
      createdAt: new Date().toISOString().split("T")[0],
      status: "saving",
    };

    // update UI immediately using optimistic vault
    setVaults((prev) => [tempVault, ...prev]);

    try {
      const res = await createVault({
        name: data.name,
        description: data.description,
      });

      const savedVault = res.data;
      console.log(res.data);

      // replace temp vault with real vault
      setVaults((prev) =>
        prev.map((vault) =>
          vault.id === tempId ? { ...savedVault, status: "saved" } : vault,
        ),
      );
    } catch (error) {
      console.log(error);

      // Rollback if api fails
      setVaults((prev) => prev.filter((vault) => vault.id !== tempId));
      alert("Failed to save vault");
    }
  };

  // Fetch vaults (created + members)
  const fetchVaults = async () => {
    try {
      const response = await axiosInstance.get("/vaults");
      const allVaults = response.data.data;

      const created = allVaults.filter((v) => v.role === "Owner");
      const shared = allVaults.filter((v) => v.role !== "Owner");

      setVaults(created);
      setSharedVaults(shared);
    } catch (error) {
      console.log(error);
    }
  };

  // get vaults when app loads
  useEffect(() => {
    fetchVaults();
  }, [activeSection]);

  // show appropriate vault based on active section
  const displayVaults = activeSection === "My Vaults" ? vaults : sharedVaults;
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar handles Desktop (hidden on mobile via md:flex) */}
      <SideMenu activeItem={activeSection} setActiveItem={setActiveSection} />

      {/* Main Content: 
          - ml-0 on mobile
          - ml-64 on desktop
          - pb-24 on mobile so content isn't hidden by the Bottom Nav
      */}
      <main className="grow ml-0 md:ml-64 p-6 md:p-10 pb-24 md:pb-10">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-[#0B3C5D]">
            {activeSection}
          </h2>
          {/* Hide "Create Vault" text on tiny screens to save space */}

          <Button
            variant="blue"
            className="bg-[#00263F] text-white p-2 md:px-4 md:py-2 rounded-lg flex items-center gap-2"
            onClick={() => setOpen(true)}
          >
            <Icon name="create-vault" size="20px" />
            Create Vault
          </Button>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dynamic Vaults */}
          {displayVaults.length > 0 ? (
            displayVaults.map((vault) => (
              <VaultCard key={vault._id} {...vault} />
            ))
          ) : (
            <p className="text-gray-400 col-span-3 text-center">
              {activeSection === "My Vaults"
                ? "No vaults yet. Create one to get started!"
                : "No shared vaults yet."}
            </p>
          )}

          {/* Start New Vault Card */}

          {activeSection === "My Vaults" && (
            <div
              onClick={() => setOpen(true)}
              className="border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center min-h-37 cursor-pointer hover:bg-gray-100 transition"
            >
              <div className="text-center text-gray-400">
                <p className="text-2xl">+</p>
                <p className="text-sm">Start New Vault</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        {open && (
          <CreateVaultModal
            onClose={() => setOpen(false)}
            onCreate={handleCreateVault}
          />
        )}
      </main>

      {/* Mobile Nav handles small screens (hidden on desktop via md:hidden) */}
      <MobileNav activeItem={activeSection} setActiveItem={setActiveSection} />
    </div>
  );
}
