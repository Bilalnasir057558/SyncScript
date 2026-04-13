
import { useState } from "react";
import CreateVaultModal from "../components/CreateVault";
import Button from "../components/Button";
import Icon from "../components/Icon";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-10">
      <Button className="flex items-center gap-2 bg-[#00263F] text-white px-4 py-2 rounded-lg" onClick={() => setOpen(true)}>
        <Icon name="create-vault" size="20px" />
          Create Vault
      </Button>

      {open && <CreateVaultModal onClose={() => setOpen(false)} />}
    </div>
  );
}