// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';

const Navbar = ({ query, setQuery, onHomeClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/75 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>

        {/* ===== Desktop Layout ===== */}
        <div className="hidden md:flex items-center justify-between px-12 py-4">
          <div className="flex items-center gap-8">
            <h1
              className="text-2xl font-bold text-blue-500 cursor-pointer tracking-tighter"
              onClick={onHomeClick}
            >
              G<span className="text-white">MOVIES</span>
            </h1>
            <ul className="flex gap-6 text-sm font-medium text-gray-300">
              <li className="hover:text-white cursor-pointer transition" onClick={onHomeClick}>Inicio</li>
              <li className="hover:text-white cursor-pointer transition">Películas</li>
              <li className="hover:text-white cursor-pointer transition">Series</li>
              <li className="hover:text-white cursor-pointer transition">Anime</li>
            </ul>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-black/40 border border-gray-500 text-white text-sm rounded-full px-4 py-2 pl-10 focus:outline-none focus:border-blue-500 focus:bg-black/60 transition-all w-32 focus:w-64"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* ===== Mobile Layout ===== */}
        <div className="flex md:hidden items-center justify-between px-4 py-3">

          {/* Hamburger Button — Left */}
          <button
            className="text-white p-2 hover:bg-white/10 rounded-lg transition"
            onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Logo — Center */}
          <h1
            className="text-xl font-bold text-blue-500 cursor-pointer tracking-tighter absolute left-1/2 -translate-x-1/2"
            onClick={onHomeClick}
          >
            G<span className="text-white">MOVIES</span>
          </h1>

          {/* Search Button — Right */}
          <button
            className="text-white p-2 hover:bg-white/10 rounded-lg transition"
            onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {searchOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              )}
            </svg>
          </button>
        </div>

        {/* ===== Mobile Search Bar (expandable) ===== */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${searchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar películas, series..."
                className="w-full bg-black/40 border border-gray-500 text-white text-sm rounded-full px-4 py-2.5 pl-10 focus:outline-none focus:border-blue-500 focus:bg-black/60 transition-all"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus={searchOpen}
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* ===== Mobile Menu Drawer ===== */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
          <ul className="flex flex-col gap-1 px-4 pb-4 text-sm font-medium text-gray-300">
            <li
              className="hover:text-white hover:bg-white/5 cursor-pointer transition px-4 py-3 rounded-lg"
              onClick={() => { onHomeClick(); setMenuOpen(false); }}
            >
              Inicio
            </li>
            <li className="hover:text-white hover:bg-white/5 cursor-pointer transition px-4 py-3 rounded-lg">
              Películas
            </li>
            <li className="hover:text-white hover:bg-white/5 cursor-pointer transition px-4 py-3 rounded-lg">
              Series
            </li>
            <li className="hover:text-white hover:bg-white/5 cursor-pointer transition px-4 py-3 rounded-lg">
              Anime
            </li>
          </ul>
        </div>

      </div>

      {/* Overlay when mobile menu or search is open */}
      {(menuOpen || searchOpen) && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => { setMenuOpen(false); setSearchOpen(false); }}
        />
      )}
    </>
  );
};

export default Navbar;