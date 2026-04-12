import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#F8FAFC] border-t border-slate-200/50 py-12 px-12 md:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-baseline gap-8">
        
        {/* Left Side: Branding & Motto */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-[#0B3C5D]">SyncScript</h2>
          <p className="text-sm text-slate-500 max-w-xs">
            The Intellectual Sanctuary for Modern Research.
          </p>
          <p className="text-xs text-slate-400 mt-2">
            © 2026 SyncScript. All rights reserved.
          </p>
        </div>

        {/* Right Side: Links (Static for presentation) */}
        <div className="flex flex-wrap gap-6 md:gap-12 md:translate-y-5">
          <span className="text-sm font-medium text-slate-600 cursor-default hover:text-[#0B3C5D] hover:underline transition-colors">
            Privacy Policy
          </span>
          <span className="text-sm font-medium text-slate-600 cursor-default hover:text-[#0B3C5D] hover:underline transition-colors">
            Terms of Service
          </span>
          <span className="text-sm font-medium text-slate-600 cursor-default hover:text-[#0B3C5D] hover:underline transition-colors">
            Academic Integrity
          </span>
          <span className="text-sm font-medium text-slate-600 cursor-default hover:text-[#0B3C5D] hover:underline transition-colors">
            Contact
          </span>
        </div>

      </div>
    </footer>
  );
}