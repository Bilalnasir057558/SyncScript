import React from 'react';
import Input from './Input';
import Button from './Button';
import Icon from './Icon';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-16 flex items-center justify-between px-8 bg-white/70 backdrop-blur-md border-b border-slate-200 z-30">
      
      {/* Left side: Search Bar */}
      <div className="w-72">
        <Input 
          placeholder="Search archive..." 
          className="bg-slate-100 border-none rounded-full py-2 px-4 text-sm"
          // Ensure your Input component supports an icon prop or prefix
          prefix={<Icon name="search" size="16px" className="text-slate-400" />}
        />
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-6">
        <Button variant="blue" className="px-6 py-2 rounded-full font-bold text-sm">
          Add Resource
        </Button>

        <div className="flex items-center gap-4 text-slate-500">
          <button className="hover:text-[#0B3C5D] transition-colors">
            <Icon name="notification" size="20px" />
          </button>
          <button className="hover:text-[#0B3C5D] transition-colors">
            <Icon name="settings" size="20px" />
          </button>
          
          {/* Avatar Area */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border border-slate-300">
              <img 
                src="/src/assets/avatar.png" 
                alt="User Profile" 
                className="w-full h-full object-cover"
                onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=Adil+Shaikh&background=0B3C5D&color=fff"}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}