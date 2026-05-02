import React from 'react';
import Icon from './Icon';
import Button from './Button';

export default function SideMenu({activeItem, setActiveItem}) {

const menuItems = [
  { name: 'My Vaults', iconName: 'vault'},
  { name: 'Shared Vaults', iconName: 'user'},
  { name: 'Profile', iconName: 'security'},
];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#F8FAFC] border-r border-slate-200 flex flex-col justify-between p-8 z-40 hidden md:flex">
      
      <div className="flex flex-col gap-10">
        {/* Logo Section */}
        <div className="flex flex-col gap-1 px-4 text-[#0B3C5D]">
          <h1 className="text-2xl font-bold">SyncScript</h1>
          <p className="text-[10px] tracking-widest opacity-60 font-bold uppercase">
            The Intellectual Sanctuary
          </p>
        </div>

        {/* Navigation Section */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = activeItem === item.name;
            
            return (
              <button
                key={item.name}
                onClick={() => setActiveItem(item.name)} // Change state on click
                className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-semibold group ${
                  isActive 
                    ? 'bg-slate-200/50 text-[#0B3C5D]' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-[#0B3C5D]'
                }`}
              >
                {/* Icon color changes based on active state */}
                <Icon 
                  name={item.iconName} 
                  size="20px" 
                  className={isActive ? "text-[#0B3C5D]" : "text-slate-400 group-hover:text-[#0B3C5D]"} 
                />
                
                <span className="text-sm">{item.name}</span>
                
                {/* The Blue Border Design - Only shows if active */}
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-1.5 bg-[#0B3C5D] rounded-l-md" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Action Button Section */}
      <div className="px-2">
        <Button 
          variant="blue" 
          className="w-full py-4 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider shadow-md shadow-slate-200"
        >
          <Icon name="add" size="16px" color="white" />
          New Research
        </Button>
      </div>
    </aside>
  );
}