
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const menuItems = [
    { label: 'Journal', path: '/' },
    { label: 'Categories', path: '/category/technology' },
    { label: 'About', path: '/about' },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
        <Link to="/" className="text-2xl md:text-3xl font-bold tracking-tighter text-slate-900 serif group shrink-0">
          LUMINA <span className="text-indigo-600 transition group-hover:text-indigo-500">PRESS</span>
        </Link>
        
        {/* Desktop Menu - Admin link removed as requested */}
        <div className="hidden md:flex items-center space-x-10">
          {menuItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`text-xs font-bold uppercase tracking-widest transition hover:text-indigo-600 ${location.pathname === item.path ? 'text-indigo-600' : 'text-slate-500'}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Drawer - Admin link removed */}
      <div 
        className={`fixed inset-x-0 top-20 bg-white border-b border-slate-100 shadow-xl transition-all duration-300 md:hidden overflow-hidden ${isMenuOpen ? 'max-h-screen py-6' : 'max-h-0 py-0'}`}
      >
        <div className="flex flex-col space-y-4 px-4">
          {menuItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              onClick={closeMenu}
              className={`text-sm font-bold uppercase tracking-widest py-2 border-b border-slate-50 ${location.pathname === item.path ? 'text-indigo-600' : 'text-slate-600'}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
