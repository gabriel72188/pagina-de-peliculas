// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';

const Navbar = ({ query, setQuery, onHomeClick }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0f172a]/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="flex items-center justify-between px-6 md:px-12 py-4">

        {/* Logo */}
        <div className="flex items-center gap-8">
          <h1
            className="text-2xl font-bold text-blue-500 cursor-pointer tracking-tighter"
            onClick={onHomeClick}
          >
            AUNSIN<span className="text-white">NOMBRE</span>
          </h1>

          {/* Menú Desktop */}
          <ul className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
            <li className="hover:text-white cursor-pointer transition" onClick={onHomeClick}>Inicio</li>
            <li className="hover:text-white cursor-pointer transition">Películas</li>
            <li className="hover:text-white cursor-pointer transition">Series</li>
            <li className="hover:text-white cursor-pointer transition">Anime</li>
          </ul>
        </div>

        {/* Buscador */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar..."
            className={`bg-black/40 border border-gray-500 text-white text-sm rounded px-4 py-2 pl-10 focus:outline-none focus:border-blue-500 focus:bg-black/60 transition-all w-32 focus:w-64`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

      </div>
    </div>
  );
};

export default Navbar;