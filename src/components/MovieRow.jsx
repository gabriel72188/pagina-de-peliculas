import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieRow = ({ title, movies }) => {
  const rowRef = useRef(null);
  const navigate = useNavigate();

  const handleClick = (item) => {
    const type = item.media_type === 'tv' || item.first_air_date ? 'tv' : 'movie';
    navigate(`/ver/${type}/${item.id}`);
  };

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = rowRef.current;

      const isAtEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 1;
      const isAtStart = scrollLeft <= 0;

      if (direction === 'right') {
        if (isAtEnd) {
          rowRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          rowRef.current.scrollTo({ left: scrollLeft + clientWidth, behavior: 'smooth' });
        }
      } else if (direction === 'left') {
        if (isAtStart) {
          rowRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        } else {
          rowRef.current.scrollTo({ left: scrollLeft - clientWidth, behavior: 'smooth' });
        }
      }
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="px-4 md:px-12 my-8 relative group/row w-full max-w-full overflow-hidden box-border">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
        {title}
      </h2>

      <div className="relative w-full">
        {/* Flecha Izquierda */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-2 md:-left-8 top-[40%] -translate-y-1/2 z-40 text-white hover:scale-125 hidden md:group-hover/row:flex items-center justify-center transition-all opacity-0 group-hover/row:opacity-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div
          ref={rowRef}
          className="flex w-full gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((item) => {
            // Extraemos solo el año de la fecha (Ej: "2024-05-12" se convierte en "2024")
            const year = (item.release_date || item.first_air_date || '').split('-')[0];

            return (
              <div
                key={item.id}
                onClick={() => handleClick(item)}
                // Añadimos flex y flex-col para separar la imagen del texto de forma ordenada
                className="snap-start shrink-0 w-[130px] sm:w-[160px] md:w-[200px] lg:w-[220px] bg-[#141414] rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-20 shadow-lg group/card relative flex flex-col"
              >
                {/* Etiqueta TV */}
                <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded z-10 uppercase ${item.media_type === 'tv' || item.first_air_date ? 'bg-purple-600 text-white' : 'bg-transparent text-transparent'}`}>
                  {item.media_type === 'tv' || item.first_air_date ? 'TV' : ''}
                </div>

                {/* Contenedor de la imagen */}
                <div className="aspect-[2/3] relative w-full shrink-0">
                  <img
                    src={item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/200x300'}
                    alt={item.title || item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Botón Play al hacer hover (solo cubre la imagen) */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                </div>

                {/* Contenedor de Textos (Título y Año) */}
                <div className="p-3 flex flex-col justify-center flex-1">
                  <h3
                    className="text-white text-sm md:text-base font-semibold truncate"
                    title={item.title || item.name} /* Muestra el título completo si dejas el ratón quieto encima */
                  >
                    {item.title || item.name}
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm mt-1">
                    {year || 'Desconocido'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Flecha Derecha */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-2 md:-right-8 top-[40%] -translate-y-1/2 z-40 text-white hover:scale-125 hidden md:group-hover/row:flex items-center justify-center transition-all opacity-0 group-hover/row:opacity-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};

export default MovieRow;