import React from "react";
import { Tooltip } from "@material-tailwind/react";
import {House,Code,CircleUser,SquarePen} from "lucide-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { to: "/home", icon: House, label: "Home" },
  { to: "/problems", icon: Code, label: "Problems" },
  { to: "/profile", icon: CircleUser, label: "Profile" },
  { to: "#", icon: SquarePen, label: "Edit Details" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex py-3">
    <div className="h-[95vh] w-20 m-2 bg-black rounded-3xl shadow-xl flex flex-col items-center py-10 border border-red-500">
      {/* Logo */}
      <div className="mb-10 flex items-center justify-center w-12 h-12 rounded-xl bg-black border-2 border-red-500">
        <span className="text-red-500 text-lg font-bold"><img src="/logo.svg" alt="CodeArena" className="w-7 h-7 text-red-500" /></span>
      </div>
      {/* Nav Icons */}
      <div className="flex flex-col gap-8 flex-1 w-full items-center">
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
      </div>
      {/* Logout Icon */}
      <div className="mt-auto">
        <Tooltip content="Logout" placement="right" className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
          <button
            className="flex items-center justify-center w-12 h-12 rounded-xl text-gray-400 hover:bg-white hover:text-red-500 transition-colors"
            onClick={handleLogout}
          >
            <ArrowLeftOnRectangleIcon className="h-7 w-7" />
          </button>
        </Tooltip>
      </div>
    </div>
    </div>
  );
};

export default Sidebar;