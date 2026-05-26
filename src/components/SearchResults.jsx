import React, { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const SearchResults = ({ query, onResultClick }) => {
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Volver a la página 1 si el usuario busca una palabra nueva
    useEffect(() => {
        setPage(1);
    }, [query]);

    // Petición a la API del buscador
    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) return;

            try {
                const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=es-ES&query=${query}&include_adult=true&page=${page}`);
                const data = await res.json();

                const filtered = (data.results || []).filter(m => m.poster_path && (m.media_type === 'movie' || m.media_type === 'tv'));
                setResults(filtered);
                setTotalPages(data.total_pages || 1);

                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (e) { console.error(e); }
        };

        const timeout = setTimeout(fetchResults, 500);
        return () => clearTimeout(timeout);
    }, [query, page]);

    return (
        <div className="pt-24 px-6 md:px-12 pb-10 min-h-screen flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold mb-6 border-l-4 border-blue-500 pl-3">
                Resultados para: "{query}"
            </h2>

            {results.length === 0 ? (
                <p className="text-gray-400">No se encontraron resultados.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 flex-grow">
                    {results.map(item => (
                        <div key={item.id} onClick={() => onResultClick(item)} className="cursor-pointer group flex flex-col">
                            <div className="bg-[#141414] rounded-lg overflow-hidden hover:scale-105 transition duration-300 shadow-lg relative aspect-[2/3] mb-3">
                                <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded z-10 uppercase text-white ${item.media_type === 'tv' ? 'bg-purple-600' : 'bg-red-600'}`}>
                                    {item.media_type === 'tv' ? 'TV' : 'PELI'}
                                </div>
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                                    className="w-full h-full object-cover"
                                    alt={item.title || item.name}
                                    loading="lazy"
                                />
                            </div>
                            <h3 className="text-sm md:text-base font-bold text-gray-200 group-hover:text-white transition-colors line-clamp-1">
                                {item.title || item.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || 'N/A'}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-12 pb-6">
                    <button
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="bg-[#1f1f1f] hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-[#1f1f1f] disabled:cursor-not-allowed px-5 py-2 rounded-md font-bold transition flex items-center gap-2"
                    >
                        ❮
                    </button>
                    <span className="text-gray-400 font-semibold text-sm">
                        Página {page} de {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        className="bg-[#1f1f1f] hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-[#1f1f1f] disabled:cursor-not-allowed px-5 py-2 rounded-md font-bold transition flex items-center gap-2"
                    >
                        ❯
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchResults;