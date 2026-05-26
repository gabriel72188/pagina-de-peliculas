// src/pages/WatchMoviePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEmbedUrl, getServerList } from '../utils/serverUtils';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const SMALL_IMAGE_URL = "https://image.tmdb.org/t/p/w300";

const WatchMoviePage = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [server, setServer] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchDetails = async () => {
            try {
                const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES&append_to_response=external_ids`);
                const data = await res.json();

                data.media_type = 'movie';

                setMovie(data);

                const serverList = getServerList(data);
                if (serverList.length > 0) {
                    setServer(serverList[0]);
                }
            } catch (e) { console.error(e); }
            setLoading(false);
        };

        fetchDetails();
    }, [id]);

    if (loading) return <div className="text-white pt-24 text-center">Cargando...</div>;
    if (!movie) return <div className="text-white pt-24 text-center">Película no encontrada.</div>;

    const servers = getServerList(movie);

    return (
        <div className="min-h-screen bg-[#141414] text-white pt-[70px] pb-20">
            <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
                {/* DETALLES Y TITULO */}
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{movie.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
                    <span className="text-green-500 font-bold">{(movie.vote_average * 10).toFixed(0)}% Nota</span>
                    <span>{movie.release_date?.split('-')[0]}</span>
                    {movie.runtime && <span>{movie.runtime} min</span>}
                </div>

                {/* SINOPSIS Y POSTER */}
                <div className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start text-center md:text-left">
                    <img src={movie.poster_path ? `${SMALL_IMAGE_URL}${movie.poster_path}` : ''} alt="poster" className="w-40 md:w-48 rounded-lg shadow-lg flex-shrink-0" />
                    <div>
                        <h3 className="text-xl font-bold mb-2">Sinopsis</h3>
                        <p className="text-gray-300 leading-relaxed mb-4">{movie.overview || "Sin descripción disponible."}</p>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            {movie.genres?.map(g => (<span key={g.id} className="text-xs bg-gray-800 px-2 py-1 rounded-full text-gray-400">{g.name}</span>))}
                        </div>
                    </div>
                </div>

                {/* CONTROLES */}
                <div className="bg-[#1f1f1f] p-4 rounded-xl mb-8 border border-gray-800 text-left">
                    <div className="mb-0">
                        <h3 className="text-gray-400 text-sm mb-2 font-bold uppercase">Servidor:</h3>
                        <div className="flex flex-wrap gap-2">
                            {servers.map((srvName) => (
                                <button
                                    key={srvName}
                                    onClick={() => setServer(srvName)}
                                    className={`px-4 py-2 rounded-md text-xs font-bold transition ${server === srvName
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333]'
                                        }`}
                                >
                                    {srvName}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* REPRODUCTOR */}
                <div className="w-full aspect-video bg-black relative shadow-2xl rounded-xl overflow-hidden mb-8 border border-gray-800">
                    <iframe
                        key={`${server}`}
                        src={getEmbedUrl(server, movie)}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay; encrypted-media"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default WatchMoviePage;
