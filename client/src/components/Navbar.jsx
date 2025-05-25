import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
//import { Button } from './ui/button'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);
  
    return (
      <nav className="bg-black text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex-wrap px-3 py-1 border-2 border-red-500 rounded-md items-center">
            <Link to="/home" >
              <span className="text-red-500 text-2xl font-bold">Code</span>
              <span className="font-bold text-2xl">Arena</span>
            </Link>
            </div>
            {/* Mobile menu button */}
            <button className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
  
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
  
              <div className="flex items-center space-x-2">
                <button className="text-white  rounded hover:text-red-500 px-2" onClick={() => navigate('/home')}>
                  Home
                </button>
               
              </div>
              <NavLinks />
            </div>
          </div>
  
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pt-4 pb-3 space-y-3">
              <MobileNavLinks closeMenu={closeMenu} />
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-500">
                <button className="  text-white hover:bg-red-500/80 py-1 rounded-md" onClick={() => navigate('/home')}>
                  Home
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  };
  
  const NavLinks = () => {
    return (
      <>
        <Link to="/problems" className="hover:text-red-500 transition-colors">
          Problems
        </Link>
        <Link to="/contests" className="hover:text-red-500 transition-colors">
          Contests
        </Link>
        <Link to="/leaderboard" className="hover:text-red-500 transition-colors">
          Leaderboard
        </Link>
        <Link to="/profile" className="hover:text-red-500 transition-colors">
          <User size={24} />
        </Link>
      </>
    );
  };
  
  const MobileNavLinks = ({ closeMenu }) => {
    return (
      <>
        <Link 
          to="/problems" 
          className="block hover:text-red-500 transition-colors py-2"
          onClick={closeMenu}
        >
          Problems
        </Link>
        <Link 
          to="/contests" 
          className="block hover:text-red-500 transition-colors py-2"
          onClick={closeMenu}
        >
          Contests
        </Link>
        <Link 
          to="/leaderboard" 
          className="block hover:text-red-500 transition-colors py-2"
          onClick={closeMenu}
        >
          Leaderboard
        </Link>
      </>
    );
  };
  
  export default Navbar;
  