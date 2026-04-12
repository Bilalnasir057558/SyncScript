import React from 'react';
import Button from './Button';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full h-24 flex items-center justify-between px-12 bg-[#F8FAFC]/70 backdrop-blur-md z-50 border-b border-slate-200">
      
      {/* 1. LOGO: Wrapped in an <a> tag to redirect to home */}
      <div className="flex items-center">
        <a href="/" className="cursor-pointer">
          <h1 className="text-2xl font-bold text-[#0B3C5D] tracking-tight">
            SyncScript
          </h1>
        </a>
      </div>

      {/* 2. LINKS: Added 'hover:underline' and 'underline-offset-4' */}
      <div className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-[#0B3C5D] hover:underline underline-offset-8 decoration-2 transition-all">
          Features
        </a>
        <a href="#methodology" className="text-sm font-semibold text-slate-600 hover:text-[#0B3C5D] hover:underline underline-offset-8 decoration-2 transition-all">
          Methodology
        </a>
        <a href="#benefits" className="text-sm font-semibold text-slate-600 hover:text-[#0B3C5D] hover:underline underline-offset-8 decoration-2 transition-all">
          Benefits
        </a>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-sm font-bold text-slate-600 hover:text-[#0B3C5D] hover:underline underline-offset-8 decoration-2 transition-all">
          Login
        </button>
        <Button variant="blue">
          Get Started
        </Button>
      </div>
    </nav>
  );
}