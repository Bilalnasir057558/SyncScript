
import { useState } from "react";
import CreateVaultModal from "../components/CreateVault";
import Button from "../components/Button";
import Icon from "../components/Icon";
import SideMenu from "../components/Sidemenu";
import MobileNav from "../components/MobileNav";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('My Vaults');
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar handles Desktop (hidden on mobile via md:flex) */}
      <SideMenu activeItem={activeSection} setActiveItem={setActiveSection} />

      {/* Main Content: 
          - ml-0 on mobile
          - ml-64 on desktop
          - pb-24 on mobile so content isn't hidden by the Bottom Nav
      */}
      <main className="flex-grow ml-0 md:ml-64 p-6 md:p-10 pb-24 md:pb-10">
        <header className="flex justify-between items-center mb-8">
           <h2 className="text-xl md:text-2xl font-bold text-[#0B3C5D]">{activeSection}</h2>
           {/* Hide "Create Vault" text on tiny screens to save space */}
           
           <Button 
              variant="blue" 
              className="bg-[#00263F] text-white p-2 md:px-4 md:py-2 rounded-lg flex items-center gap-2" onClick={() => setOpen(true)}>
              <Icon name="create-vault" size="20px" />
              Create Vault
              </Button>
              
        </header>
        {open && <CreateVaultModal onClose={() => setOpen(false)} />}
      </main>

      {/* Mobile Nav handles small screens (hidden on desktop via md:hidden) */}
      <MobileNav activeItem={activeSection} setActiveItem={setActiveSection} />
      
    </div>
  );
}