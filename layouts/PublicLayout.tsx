
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-white text-slate-500 py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-slate-900 text-2xl font-bold mb-6 serif">Lumina Press</h3>
            <p className="text-sm leading-relaxed max-w-md mx-auto md:mx-0 text-slate-500">
              A contemporary platform dedicated to high-quality journalism, technology insights, and lifestyle perspectives. 
              We believe in stories that illuminate the world around us.
            </p>
          </div>
          <div>
            <h4 className="text-slate-900 font-semibold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="hover:text-indigo-600 transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-indigo-600 transition">Our Story</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 font-semibold mb-6">Stay Connected</h4>
            <div className="flex flex-col gap-4">
              <input type="email" placeholder="Your email address" className="bg-slate-50 border border-slate-200 px-4 py-3 rounded text-sm w-full focus:ring-1 focus:ring-indigo-500 outline-none" />
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded transition text-sm">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-100 text-center text-xs tracking-widest uppercase text-slate-400 font-medium">
          © {new Date().getFullYear()} Lumina Press. Handcrafted for the curious mind.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
