import React from "react";
import { Tooltip } from "@material-tailwind/react";
import {House,Code,CircleUser,LogOut,Send,Upload,Users} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {logout} from "../services/api.js"
import { toast } from "react-toastify";
const navItems = [
  { to: "/home", icon: House, label: "Home" },
  { to: "/problems", icon: Code, label: "Problems" },
  { to: "/profile", icon: CircleUser, label: "Profile" },
  { to: "/submissions", icon: Send, label: "Submissons" }
];

const Sidebar = ({userData}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = userData.role;
 const handleLogout = async () => {
  try {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  } catch (error) {
    toast.error("Logout failed");
    console.error("Logout failed:", error);
  }
}

  return (
    <div className="flex py-3">
    <div className="h-[95vh] w-20 m-2 bg-black rounded-3xl shadow-xl flex flex-col items-center py-10 border border-red-500">
      {/* Logo */}
      <div className="mb-10 flex items-center justify-center w-12 h-12 rounded-xl bg-black border-2 border-red-500">
        <span className="text-red-500 text-lg font-bold"><img src="/logo.svg" alt="CodeArena" className="w-7 h-7 text-red-500" /></span>
      </div>
      {/* Nav Icons */}
      <div className="flex flex-col gap-5 w-full items-center">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Tooltip key={label} content={label} placement="right" className="bg-black text-white text-xs px-2 py-1 rounded">
              <Link to={to} className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors text-gray-400 hover:bg-white hover:text-red-500`}>
                <Icon className="h-7 w-7" />
              </Link>
            </Tooltip>
          );
        })}
        
        {/* Admin/Moderator Icons */}
        {(role === 'Admin' || role === 'Moderator') && (
          <Tooltip key="Upload Problem" content="Upload Problem" placement="right" className="bg-black text-white text-xs px-2 py-1 rounded">
            <Link to="/uploadProblem" className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors text-gray-400 hover:bg-white hover:text-red-500`}>
              <Upload className="h-7 w-7" />
            </Link>
          </Tooltip>
        )}
        
        {role === 'Admin' && (
          <Tooltip key="Users" content="Users" placement="right" className="bg-black text-white text-xs px-2 py-1 rounded">
            <Link to="/users" className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors text-gray-400 hover:bg-white hover:text-red-500`}>
              <Users className="h-7 w-7" />
            </Link>
          </Tooltip>
        )}
      </div>
      {/* Logout Icon */}
      <div className="mt-auto">
        <Tooltip content="Logout" placement="right" className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
          <button
            className="flex items-center justify-center w-12 h-12 rounded-xl text-gray-400 hover:bg-white hover:text-red-500 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-7 w-7" />
          </button>
        </Tooltip>
      </div>
    </div>
    </div>
  );
};

export default Sidebar;