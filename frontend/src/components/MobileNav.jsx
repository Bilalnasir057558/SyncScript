import React from 'react';
import Icon from './Icon';
import { useNavigate } from 'react-router';

export default function MobileNav({ activeItem, setActiveItem }) {
  const menuItems = [
    { name: 'Vaults', id: 'vault' }, // Shortened for mobile space
    { name: 'Shared', id: 'user' },
    { name: 'Profile', id: 'security' },
  ];

  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 md:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      {menuItems.map((item) => {
        const isActive = activeItem === item.name || (item.name === 'Vaults' && activeItem === 'My Vaults');
        
        return (
          <button
            key={item.name}
            onClick={() => setActiveItem(item.name === 'Vaults' ? 'My Vaults' : item.name)}
            className="flex flex-col items-center gap-1 transition-all"
          >
            <div className={`p-2 rounded-lg ${isActive ? 'bg-slate-100 text-[#0B3C5D]' : 'text-slate-400'}`}>
              <Icon name={item.id} size="24px" />
            </div>
            <span className={`text-[10px] font-bold ${isActive ? 'text-[#0B3C5D]' : 'text-slate-400'}`}>
              {item.name}
            </span>
          </button>
        );
      })}
      
      {/* Floating Action Button for Mobile */}
      <button onClick={() => navigate('/add-resource')} className="bg-[#0B3C5D] text-white p-4 rounded-full -mt-12 shadow-lg border-4 border-white active:scale-95 transition-transform">
        <Icon name="add" size="20px" color="white" />
      </button>
    </nav>
  );
}