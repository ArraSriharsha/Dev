import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="bg-black text-white py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link to="/" className="flex items-center ">
                <span className="text-red-500 font-bold text-xl">Code</span>
                <span className="font-bold text-xl">Arena</span>
              </Link>
              <p className="mt-4 text-gray-400">
                An online platform for programmers to enhance their skills through
                coding challenges, contests, and peer competition.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/problems" className="text-gray-400 hover:text-red-500 transition-colors">
                    Problems
                  </Link>
                </li>
                <li>
                  <Link to="/contests" className="text-gray-400 hover:text-red-500 transition-colors">
                    Contests
                  </Link>
                </li>
                <li>
                  <Link to="/leaderboard" className="text-gray-400 hover:text-red-500 transition-colors">
                    Leaderboard
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/blog" className="text-gray-400 hover:text-red-500 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-red-500 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-red-500 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
            <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} CodeArena. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
}

export default Footer