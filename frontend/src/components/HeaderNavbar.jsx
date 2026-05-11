import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Input from './Input';
import Button from './Button';
import Icon from './Icon';
import AddResourceForm from './AddResourceForm';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/auth.context';

export default function Header() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { vaultId } = useParams(); // Automatically gets the ID from the URL
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 1. Get the current location
  const location = useLocation();

  // 2. Check if we are on the dashboard
  const isDashboard = location.pathname === "/dashboard";
  const { setUser: setAuthUser } = useAuth();


  // Fetch Current User
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/users/me");
        setUser(response.data.data);
      } catch (error) {
        console.error("Profile fetch failed:", error);
      }
    };

    fetchUser();
  }, []);

   // Logout Logic
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/users/logout");
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
    
      // Clear auth context
      setAuthUser(null);

      // Redirect
      navigate("/login");
    }
  };

  // Generate initials
  const getInitials = () => {
    if (user?.fullName) {
      return user.fullName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
    }

    return "??";
  };

  return (
    <>
      <header className="fixed top-0 left-0 md:left-64 right-0 h-16 flex items-center justify-between px-4 md:px-8 bg-white/70 backdrop-blur-md border-b border-slate-200 z-30">

        {/* Left side: Search Bar */}
        <div className="w-1/2 md:w-72">
          <Input
            placeholder="Search archive..."
            className="bg-slate-100 border-none rounded-full py-2 px-4 text-sm focus:outline-none"
            // Ensure your Input component supports an icon prop or prefix
            prefix={<Icon name="search" size="16px" className="text-slate-400" />}
          />
        </div>

        {/* Right side: Actions & Profile */}
        <div className="flex items-center gap-2 md:gap-6">
          {/* Hide text on mobile to save space, show only icon or smaller button */}
          {/* 3. Wrap the button in this condition */}
          {!isDashboard && (
            <Button
              variant="blue"
              className="px-3 md:px-6 py-2 rounded-full font-bold text-[10px] md:text-sm whitespace-nowrap"
              onClick={() => setShowAddModal(true)}>
              <span className="hidden sm:inline">Add Resource</span>
              <span className="sm:hidden">+</span>
            </Button>
          )}
          <div className="flex items-center gap-2 md:gap-4 text-slate-500">
            {/* 3. LOGOUT BUTTON: Added before settings */}
            <button
              onClick={handleLogout}
              className="hover:text-rose-600 transition-colors flex items-center gap-1 text-xs font-bold"
              title="Logout"
            >
              <Icon name="logout" size="18px" />
              <span className="hidden lg:inline">Logout</span>
            </button>
            <button className="hover:text-[#0B3C5D] transition-colors">
              <Icon name="notification" size="20px" />
            </button>
            <button className="hover:text-[#0B3C5D] transition-colors">
              <Icon name="settings" size="18px" className="sm:block cursor-pointer" />
            </button>

            {/* Avatar Area */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div 
                className="w-9 h-9 rounded-full overflow-hidden bg-[#0B3C5D] flex items-center justify-center text-white text-xs font-bold border border-slate-300 shadow-sm"
                title={user?.username || "User"}
              >
                {/* Check for avatar, fallback to initials from Endpoint #5 data */}
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{getInitials()}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conditionally render the Form as a Modal */}
      {showAddModal && (
        <AddResourceForm
          vaultId={vaultId}
          onResourceAdded={(newResource) => {
            console.log("New Resource Sync:", newResource);
            setShowAddModal(false); // Close after success
          }}
          // You might need to pass a close function if you handle onClose inside AddResourceForm
          onClose={() => setShowAddModal(false)}
        />
      )}
    </>
  );
}