import React, { useState, useEffect } from 'react';
// IMPORTANTE: Importamos useNavigate para cambiar de página
import { useNavigate } from 'react-router-dom';

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

// Ya no recibimos 'onPlay' como prop
const Hero = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Inicializamos el hook de navegación
  const navigate = useNavigate();

  const topMovies = movies.slice(0, 5);

  // --- FUNCIÓN PARA NAVEGAR A LA PÁGINA DE VER ---
  const handlePlay = (movie) => {
    // Determinamos si es 'tv' o 'movie'
    const type = movie.media_type === 'tv' || movie.first_air_date ? 'tv' : 'movie';
    // Navegamos a la URL: /ver/movie/12345
    navigate(`/ver/${type}/${movie.id}`);
  };

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? topMovies.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === topMovies.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => { nextSlide(); }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, topMovies.length]);

  if (topMovies.length === 0) return null;
  const movie = topMovies[currentIndex];

  return (
    <div className="relative w-full max-w-[100vw] h-[60vh] md:h-[85vh] bg-black group overflow-hidden">
      {/* ... (La parte de la imagen sigue igual) ... */}
      <div className="w-full h-full relative">
         <img 
            key={movie.id} src={`${IMAGE_BASE_URL}${movie.backdrop_path}`} alt={movie.title} 
            className="w-full h-full object-cover object-top block opacity-90 transition-opacity duration-500" 
         />
         <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      <div className="absolute top-0 left-0 w-full md:w-[33%] lg:w-[30%] h-full flex flex-col justify-center px-8 md:px-0 md:left-24 lg:left-32 z-20">
         <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-lg max-w-2xl leading-tight">{movie.title || movie.name}</h1>
         {/* ... metadata ... */}
         <div className="flex items-center gap-4 mt-3 text-xs md:text-sm font-semibold text-gray-200">
             <span className="text-green-500 font-bold">{(movie.vote_average * 10).toFixed(0)}% de coincidencia</span>
             <span>{movie.release_date?.split('-')[0] || '2024'}</span>
             <span className="bg-[#333] text-white border border-gray-500 px-2 py-0.5 rounded text-xs tracking-wider">HD</span>
         </div>
         <p className="text-xs md:text-sm text-gray-300 mt-3 max-w-xl line-clamp-2 md:line-clamp-3 drop-shadow leading-relaxed">{movie.overview}</p>

         <div className="flex gap-4 mt-6">
             {/* CAMBIO EN EL ONCLICK DEL BOTÓN */}
             <button 
                onClick={() => handlePlay(movie)} // Usamos la nueva función de navegar
                className="bg-white text-black text-sm md:text-base font-bold py-2 px-6 rounded-md hover:bg-gray-200 transition flex items-center gap-2"
             >
                Reproducir
             </button>
         </div>
      </div>

      {/* ... (Flechas y puntitos siguen igual) ... */}
      <button onClick={prevSlide} className="hidden md:group-hover:block absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-transparent border-none outline-none text-white hover:text-gray-200 transition-transform hover:scale-110 z-30 p-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 md:w-16 md:h-16 drop-shadow-md"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
      </button>
      <button onClick={nextSlide} className="hidden md:group-hover:block absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-transparent border-none outline-none text-white hover:text-gray-200 transition-transform hover:scale-110 z-30 p-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12 md:w-16 md:h-16 drop-shadow-md"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
      </button>
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-30">
        {topMovies.map((_, idx) => (<div key={idx} onClick={() => setCurrentIndex(idx)} className={`h-2 rounded-full transition-all cursor-pointer ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-gray-500/50 hover:bg-gray-300'}`}/>))}
      </div>
    </div>
  );
};
export default Hero;