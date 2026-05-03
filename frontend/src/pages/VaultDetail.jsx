import { Link, useParams } from "react-router";
import Button from "../components/Button";
import Icon from "../components/Icon";
import MobileNav from "../components/MobileNav";
import SideMenu from "../components/Sidemenu";

export default function VaultDetail() {
    const {vaultId} = useParams();
    console.log(vaultId);
    
    
  return (
    <div className="min-h-screen bg-white">
      <SideMenu />

      <main className="grow ml-0 md:ml-64 p-6 md:p-10 pb-24 md:pb-10">
        <div className="flex flex-col justify-center gap-2 mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0B3C5D]">
            Quantum Physics
          </h2>

          <div className="flex flex-col lg:flex-row gap-4 md:justify-between">
            <p className="text-gray-700 lg:max-w-[50%]">
                A curated sanctuary for exploring non-locality, wave-particle duality, and
the foundations of quantum field theory.
            </p>
            <div className="flex gap-2">
                <Button 
                    variant="gray"
                    className="text-black font-semibold flex justify-center items-center gap-2 tracking-wider shadow-md shadow-gray-200"
                >
                    <Icon name="share" size="16px" />
                    Share
                </Button>
                <Button className="flex justify-center items-center gap-2 tracking-wider shadow-md shadow-slate-200">
                    <Icon name="add" size="16px" />
                    Add Resource
                </Button>
            </div>
          </div>

        </div>

        <div className="flex flex-col gap-8 my-15 w-full lg:w-2/3">
            <div className="flex gap-4 items-start">
                <div className="w-10 h-10 shrink-0 rounded-lg flex justify-center items-center bg-blue-100">
                    <Icon name="resource" size="22px"/>
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-[#00263F] text-xl lg:text-2xl">
                        EPR Paradox and Quantum Entanglement
                    </h3>
                    <a className="text-sm text-gray-500 block mb-2" href="https://youtube.com" target="_blank" rel="noreferrer">
                    arxiv.org/abs/quant-ph/010203 </a>
                    <p className="text-md text-gray-700">
                        A foundational review of the Einstein-Podolsky-Rosen paradox and its modern implications for
quantum communication and cryptography protocols in high-density networks.
                    </p>
                </div>
            </div>

            <div className="flex gap-4 items-start">
                <div className="w-10 h-10 shrink-0 rounded-lg flex justify-center items-center bg-blue-100">
                    <Icon name="resource" size="22px"/>
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-[#00263F] text-xl lg:text-2xl">
                        EPR Paradox and Quantum Entanglement
                    </h3>
                    <a className="text-sm text-gray-500 block mb-2" href="https://youtube.com" target="_blank" rel="noreferrer">
                    arxiv.org/abs/quant-ph/010203 </a>
                    <p className="text-md text-gray-700">
                        A foundational review of the Einstein-Podolsky-Rosen paradox and its modern implications for
quantum communication and cryptography protocols in high-density networks.
                    </p>
                </div>
            </div>

            <div className="flex gap-4 items-start">
                <div className="w-10 h-10 shrink-0 rounded-lg flex justify-center items-center bg-blue-100">
                    <Icon name="resource" size="22px"/>
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-[#00263F] text-xl lg:text-2xl">
                        EPR Paradox and Quantum Entanglement
                    </h3>
                    <a className="text-sm text-gray-500 block mb-2" href="https://youtube.com" target="_blank" rel="noreferrer">
                    arxiv.org/abs/quant-ph/010203 </a>
                    <p className="text-md text-gray-700">
                        A foundational review of the Einstein-Podolsky-Rosen paradox and its modern implications for
quantum communication and cryptography protocols in high-density networks.
                    </p>
                </div>
            </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
