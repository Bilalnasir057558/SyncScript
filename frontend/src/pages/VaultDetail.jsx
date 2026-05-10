import { Link, useLocation, useParams, useNavigate } from "react-router";
import Button from "../components/Button";
import Icon from "../components/Icon";
import MobileNav from "../components/MobileNav";
import SideMenu from "../components/SideMenu";
import HeaderNavbar from "../components/HeaderNavbar";
import axiosInstance from "../api/axios";
import { useState } from "react";
import { useEffect } from "react";
import AddResourceForm from "../components/AddResourceForm";
import InviteMemberForm from "../components/InviteMemberForm";

export default function VaultDetail() {
  const { vaultId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize state with the passed data (if exists)
  const [vault, setVault] = useState(location.state?.vault || null);
  const role = location.state?.vault?.role || "Unknown";
  const [loading, setLoading] = useState(!vault);

  const [resources, setResources] = useState([]);
  const [open, setOpen] = useState(false);
  const [shareFormOpen, setShareFormOpen] = useState(false);
  const [invitations, setInvitations] = useState([]);

  const [activeSection, setActiveSection] = useState("My Vaults");
  useEffect(() => {
    if (activeSection !== "My Vaults") {
      navigate("/dashboard");
    }
  }, [activeSection, navigate]);

  useEffect(() => {
    const fetchVaultAndResources = async () => {
      try {
        // fetch resources
        const resourcePromise = axiosInstance.get(
          `/vaults/${vaultId}/resources`,
        );

        // fetch vault if not come from state in dashboard
        const vaultPromise = !vault
          ? axiosInstance.get(`/vaults/${vaultId}`)
          : null;

        // run them
        const [resResponse, vaultResponse] = await Promise.all([
          resourcePromise,
          vaultPromise,
        ]);

        setResources(resResponse.data.data);

        if (vaultResponse) {
          setVault(vaultResponse.data.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVaultAndResources();
  }, [vaultId]);

  if (loading) return <p>Loading...</p>;
  if (!vault) return <p>Vault not found.</p>;

  return (
    <div className="flex min-h-screen bg-white">
      <SideMenu activeItem={activeSection} setActiveItem={setActiveSection} />

      <div className="grow flex flex-col min-w-0">
        <HeaderNavbar />

        <main className="grow mt-16 ml-0 md:ml-64 p-6 md:p-10 pb-24 md:pb-10 transition-all duration-200">
          <div className="flex flex-col justify-center gap-2 mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0B3C5D]">
              {vault.name}
            </h2>

            <div className="flex flex-col lg:flex-row gap-4 md:justify-between">
              <p className="text-gray-700 lg:max-w-[50%]">
                {vault.description}
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShareFormOpen(true)}
                  variant="gray"
                  className="text-black font-semibold flex justify-center items-center gap-2 tracking-wider shadow-md shadow-gray-200"
                >
                  <Icon name="share" size="16px" />
                  Share
                </Button>
                <Button
                  disabled={role === "Viewer"}
                  onClick={() => setOpen(true)}
                  className={`flex justify-center items-center gap-2 tracking-wider shadow-md shadow-slate-200 ${role === "Viewer" ? "bg-gray-300 text-black tracking-wider font-semibold hover:bg-gray-300 hover:cursor-default hover:scale-none" : ""}`}
                >
                  <Icon name="add" size="16px" />
                  Add Resource
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-6 mt-8 w-full lg:w-3/4 xl:w-2/3">
              {resources.length > 0 ? (
                resources.map((resource) => (
                  <div
                    onClick={() =>
                      navigate(`/resource/${resource.id}`, {
                        state: { resource },
                      })
                    }
                    key={resource.id}
                    className="block"
                  >
                    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm shadow-slate-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                      <div className="flex items-start gap-4 ">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF4FF] text-[#0B3C5D] shadow-inner shadow-blue-50">
                          <Icon name="resource" size="24px" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
                            {resource.title}
                          </h3>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                            {resource.url ? (
                              <a
                                className="truncate text-blue-600 transition-colors duration-150 hover:text-blue-800"
                                href={resource.url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {resource.url}
                              </a>
                            ) : (
                              <span className="text-slate-500">
                                No link attached
                              </span>
                            )}
                            {resource.files?.length > 0 && (
                              <a
                                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm hover:border-blue-300"
                                href={resource.files[0].filePath}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {resource.files[0].fileName}
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                          <span>
                            Created by{" "}
                            <strong className="text-slate-900">
                              {resource.createdByFullName ||
                                resource.createdByUsername ||
                                "Unknown"}
                            </strong>
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                            Resource
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No resources available.</p>
              )}

              {open && (
                <AddResourceForm
                  vaultId={vaultId}
                  onResourceAdded={setResources}
                  onClose={() => setOpen(false)}
                />
              )}

              {shareFormOpen && (
                <InviteMemberForm
                  vault={vault}
                  onClose={() => setShareFormOpen(false)}
                  onInviteSent={setInvitations}
                />
              )}
            </div>
          </div>
        </main>
      </div>
      <MobileNav activeItem={activeSection} setActiveItem={setActiveSection} />
    </div>
  );
}
