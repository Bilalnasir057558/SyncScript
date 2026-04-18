import React from 'react';
import Button from './Button';
import { Link, useNavigate } from 'react-router';

export default function Navbar({
  onScrollHero,
  onScrollFeatures,
  onScrollMethodology
}) {

  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full h-18 flex items-center justify-between px-12 bg-[#F8FAFC]/70 backdrop-blur-md z-50 border-b border-slate-200">
      
      <div className="flex items-center">
        <Link to={'/'} className="cursor-pointer">
          <h1 className="text-2xl font-bold text-[#0B3C5D] tracking-tight">
            SyncScript
          </h1>
        </Link>
      </div>

      {/*  Added 'hover:underline' and 'underline-offset-4' */}
      <div className="hidden md:flex items-center gap-8">
        <button onClick={onScrollHero} className="text-sm font-semibold text-slate-600 hover:text-[#0B3C5D] hover:underline underline-offset-8 decoration-2 transition-all">
          About Us
        </button>
        <button onClick={onScrollFeatures} className="text-sm font-semibold text-slate-600 hover:text-[#0B3C5D] hover:underline underline-offset-8 decoration-2 transition-all">
          Features
        </button>
        <button onClick={onScrollMethodology} className="text-sm font-semibold text-slate-600 hover:text-[#0B3C5D] hover:underline underline-offset-8 decoration-2 transition-all">
          Methodology
        </button>
      </div>

      <div className="flex items-center gap-6">
        <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-600 hover:text-[#0B3C5D] hover:underline underline-offset-8 decoration-2 transition-all cursor-pointer">
          Login
        </button>
        <Button onClick={() => navigate('/register')} variant="blue">
          Get Started
        </Button>
      </div>
    </nav>
  );
}