import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Ya no recibe 'onMovieClick'
const MovieRow = ({ title, movies }) => {
  const rowRef = useRef(null);
  const navigate = useNavigate(); // Inicializar hook

  // Función de navegación
  const handleClick = (item) => {
    const type = item.media_type === 'tv' || item.first_air_date ? 'tv' : 'movie';
    navigate(`/ver/${type}/${item.id}`);
  };

  const scroll = (offset) => {
    if (rowRef.current) rowRef.current.scrollLeft += offset;
  };

  return (
    <div className="px-6 md:px-12 my-8 relative group/row overflow-hidden">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
        {title}
      </h2>

      <div className="relative">
        <button onClick={() => scroll(-500)} className="absolute left-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/80 text-white w-12 hidden group-hover/row:flex items-center justify-center transition">‹</button>

        <div ref={rowRef} className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {movies.map((item) => (
            <div
              key={item.id}
              // CAMBIO: Usamos la nueva función handleClick
              onClick={() => handleClick(item)}
              className="min-w-[160px] md:min-w-[200px] bg-[#141414] rounded-lg overflow-hidden cursor-pointer transition transform hover:scale-105 hover:z-20 shadow-lg group/card relative"
            >
              <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded z-10 uppercase ${item.media_type === 'tv' || item.first_air_date ? 'bg-purple-600 text-white' : 'bg-transparent text-transparent'}`}>
                {item.media_type === 'tv' || item.first_air_date ? 'TV' : ''}
              </div>
              <div className="aspect-[2/3] relative">
                <img src={item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/200x300'} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition flex items-center justify-center">
                  <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => scroll(500)} className="absolute right-0 top-0 bottom-0 z-40 bg-black/50 hover:bg-black/80 text-white w-12 hidden group-hover/row:flex items-center justify-center transition">›</button>
      </div>
    </div>
  );
};
export default MovieRow;