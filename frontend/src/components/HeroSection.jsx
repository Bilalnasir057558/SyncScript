import Button from "./Button";
import { Link } from "react-router";

export default function HeroSection({
    sectionRef
}) {
    return (
        <div ref={sectionRef} className="min-h-[90vh] bg-linear-to-br from-[#0B3C5D] to-black flex flex-col justify-center items-center">
            <div className="w-2/3 flex flex-col justify-center items-center max-w-140">
                <h1 className="text-5xl md:text-6xl lg:text-7xl text-white font-bold tracking-tight">SyncScript</h1>
                <p className="text-[#DBEAFE] font-light text-lg my-4 md:text-2xl text-center">Organize Your Research, Collaborate Smarter</p>
                <p className="text-[#BFDBFE] text-md md:text-lg font-light text-center mb-4">A professional platform for students and researchers to save, organize,
and share research resources in collaborative Vaults.</p>
                <div className="flex flex-col md:flex-row gap-4">
                    <Link to={'/register'} className="bg-white text-[#00263F] hover:text-white hover:bg-[#1d5377] px-4 py-2 rounded-lg text-md font-bold hover:scale-105 transition focus:outline-none cursor-pointer" children="Get Started"/>
                    <Button className="bg-transparent outline-1" children="Learn More" />
                </div>
            </div>
        </div>
    )
}