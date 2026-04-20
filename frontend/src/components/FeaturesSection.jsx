import Icon from "./Icon";
import backgroundImg from "../assets/Background.png";
import { useRef } from "react";

export default function FeaturesSection({
  sectionRef
}) {

  return (
    <div ref={sectionRef} className=" py-12 px-5 flex flex-col gap-10">
      <div className="w-2/3 md:w-1/2">
        <p className="font-bold text-[12px] text-[#006492]">
          CORE INFRASTRUCTURE
        </p>
        <h1 className="font-semibold text-[#00263F] text-3xl md:text-4xl">
          Precision tools for high-stakes academic synthesis.
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] md:grid-rows-[300px_230px] lg:grid-rows-[250px_200px] gap-7">
        <div className="md:col-span-2 p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-3 md:w-2/3">
            <Icon name="vault" color="blue" size="24px" />
            <h2 className="font-semibold text-2xl text-[#00263F]">
              Create Vaults
            </h2>
            <p className="text-[#42474E] text-sm">
              Encapsulate your research themes into isolated, high- security
              environments. Perfect for multi-disciplinary projects that require
              distinct taxonomies.
            </p>

          </div>

          <img
              src={backgroundImg}
              alt="Background Image"
              aria-hidden
              loading="lazy"
              className="max-h-20"
            />
        </div>

        <div className="flex flex-col gap-3 bg-[#00263F] p-6 rounded-2xl">
          <Icon name="add" size="24px" />
          <h2 className="text-2xl font-semibold text-white">Add Resources</h2>
          <p className="text-[#BFDBFE] text-sm">
            Instantly ingest PDFs, web citations, and raw data directly into
            your active workspace with one-click metadata extraction.
          </p>
        </div>
        <div className="flex flex-col gap-3 bg-[#F2F4F7] p-6 rounded-2xl">
          <Icon name="user" size="24px" />
          <h2 className="text-2xl font-semibold text-[#00263F]">Collaborate</h2>
          <p className="text-sm text-[#42474E]">
            The library is no longer a silent space. Invite peers to annotate,
            debate, and verify sources in real-time within your Vault.
          </p>
        </div>
        <div className="md:col-span-2 bg-[#E0E3E6] p-6 rounded-2xl">
          <div className="flex flex-col gap-3 w-2/3">
            <Icon name="security" color="blue" size="24px" />
            <h2 className="font-semibold text-2xl text-[#00263F]">
              Role-based Access
            </h2>
            <p className="text-[#42474E] text-sm">
              Granular permissions management for lead investigators, research
              assistants, and guest reviewers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
