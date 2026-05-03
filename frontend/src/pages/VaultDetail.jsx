import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import SideMenu from "../components/Sidemenu";
import Header from "../components/HeaderNavbar";
import setShowAddModal from "../components/AddResourceForm";
import Icon from "../components/Icon";
import Button from "../components/Button";
import axiosInstance from "../api/axios";

export default function VaultDetail() {
  const { vaultId } = useParams();
  const [vault, setVault] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVaultIntelligence = async () => {
      try {
        setLoading(true);
        // Using getVaultById (Endpoint #8)
        const vaultRes = await axiosInstance.get(`/vaults/${vaultId}`);
        setVault(vaultRes.data.data);

        // Using Get All Resources (Endpoint #16)
        const resourceRes = await axiosInstance.get(`/resources/${vaultId}`);
        setResources(resourceRes.data.data);
      } catch (error) {
        console.error("Vault Access Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (vaultId) fetchVaultIntelligence();
  }, [vaultId]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#F7F9FC] text-[#0B3C5D] font-semibold">Consulting the archives...</div>;

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      <SideMenu activeItem="My Vaults" />

      <div className="flex-grow flex flex-col">
        <Header />

        {/* 
           Layout per Figma CSS: 
           padding-left: 256px (Desktop)
           padding-top: 64px
        */}
        <main className="pt-20 pb-16 px-6 md:pl-[256px] md:pr-16 w-full max-w-[1280px]">
          
          {/* Breadcrumbs Section */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6">
            <Link to="/dashboard" className="hover:text-[#0B3C5D]">Vaults</Link>
            <Icon name="chevron-right" size="10px" />
            <span className="text-[#42474E]">{vault?.name}</span>
          </nav>

          {/* Header Section from image_d6b714.jpg */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-[#0B3C5D] tracking-tight mb-4">
                {vault?.name}
              </h1>
              <p className="text-[#42474E] text-lg max-w-2xl leading-relaxed">
                {vault?.description}
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button variant="gray" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm">
                <Icon name="share" size="18px" /> Share
              </Button>
              <Button variant="blue" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm shadow-lg shadow-blue-900/10" onClick={() => setShowAddModal(true)}>
                <Icon name="add" size="18px" /> Add Resource
              </Button>
            </div>
          </div>

          {/* Resource List Section */}
          <div className="grid gap-4">
            {resources.length > 0 ? (
              resources.map((resource) => (
                <Link 
                  key={resource._id}
                  to={`/resource/${resource._id}`}
                  className="group flex items-start gap-6 bg-white p-6 rounded-xl border border-transparent shadow-sm transition-all hover:shadow-md hover:border-slate-200"
                >
                  {/* Resource Icon Wrapper */}
                  <div className="flex-shrink-0 w-14 h-14 bg-[#F0F4F8] rounded-lg flex items-center justify-center text-sky-600 group-hover:bg-sky-50 transition-colors">
                    <Icon name={resource.url ? "link" : "file"} size="24px" />
                  </div>

                  <div className="flex-grow min-w-0">
                    <h3 className="text-xl font-bold text-[#0B3C5D] mb-1 group-hover:text-sky-700 truncate">
                      {resource.title}
                    </h3>
                    <p className="text-sm font-medium text-sky-600 mb-3 truncate">
                      {resource.url || (resource.file?.[0]?.fileName || "Attached Document")}
                    </p>
                    <p className="text-[#42474E] text-sm leading-relaxed line-clamp-2">
                      {/* Note: This assumes Bilal returns a description, 
                          otherwise we use a placeholder or creator info */}
                      A foundational intelligence entry added to the {vault?.name} collection. 
                      Managed by {resource.createdBy?.fullName || "Researcher"}.
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              /* Empty State matching the sanctuary aesthetic */
              <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                  <Icon name="archive" size="32px" />
                </div>
                <h3 className="text-[#0B3C5D] font-bold text-xl mb-2">The Vault is Silent</h3>
                <p className="text-[#42474E] text-center max-w-xs">
                  Begin your intellectual journey by adding resources to this collection.
                </p>
              </div>
            )}
          </div>

          {/* Footer Expand Section from image_d6b714.jpg */}
          <div className="mt-16 flex flex-col items-center text-center">
             <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                <Icon name="book" size="20px" className="text-slate-500" />
             </div>
             <h4 className="text-[#0B3C5D] font-bold">Expand Your Knowledge</h4>
             <p className="text-xs text-slate-400 mt-1">Add more resources to complete your research mapping.</p>
          </div>
        </main>

        {/* Focus Widget - Responsive Positioning */}
        <div className="hidden xl:block fixed bottom-8 right-8 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 z-40">
            <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-sky-500">Current Focus</span>
                <button className="text-slate-300 hover:text-slate-600">✕</button>
            </div>
            <h5 className="text-[#0B3C5D] font-bold mb-2 text-sm">{vault?.name} Progress</h5>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mb-2">
                <div className="bg-sky-500 h-full rounded-full w-[65%]"></div>
            </div>
            <p className="text-[10px] text-slate-400 mb-4">65% of reading material categorized</p>
            <div className="space-y-2">
                <button className="w-full py-2 bg-slate-50 text-[11px] font-bold text-[#0B3C5D] rounded-lg hover:bg-slate-100 transition-all">Annotate recent paper</button>
                <button className="w-full py-2 bg-slate-50 text-[11px] font-bold text-[#0B3C5D] rounded-lg hover:bg-slate-100 transition-all">Export bibliographic data</button>
            </div>
        </div>
      </div>
    </div>
  );
}