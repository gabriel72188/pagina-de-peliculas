import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MovieRow from './components/MovieRow';
import WatchMoviePage from './pages/WatchMoviePage';
import TvShowHubPage from './pages/TvShowHubPage';
import WatchSeriePage from './pages/WatchSeriePage';
import SearchResults from './components/SearchResults';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

function App() {
    const [query, setQuery] = useState('');
    const [popularMovies, setPopularMovies] = useState([]);
    const [popularSeries, setPopularSeries] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();

    // Redirigir al inicio si busca desde otra página
    useEffect(() => {
        if (query.trim() !== '' && location.pathname !== '/') {
            navigate('/');
        }
    }, [query, location.pathname, navigate]);

    // Carga de Datos de la Portada
    useEffect(() => {
        const loadHomeData = async () => {
            try {
                const resMov = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES`);
                const dataMov = await resMov.json();
                const cleanMovies = (dataMov.results || []).filter(m => m.backdrop_path);
                setPopularMovies(cleanMovies);

                const resTv = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=es-ES`);
                const dataTv = await resTv.json();
                const cleanSeries = (dataTv.results || []).filter(m => m.poster_path);
                setPopularSeries(cleanSeries);
            } catch (e) { console.error(e); }
        };
        loadHomeData();
    }, []);

    // Función global para ir a la página de ver
    const handleItemClick = (item) => {
        const type = item.media_type === 'tv' || item.first_air_date ? 'tv' : 'movie';
        navigate(`/ver/${type}/${item.id}`);
        setQuery('');
    };

    return (
        <div className="min-h-screen w-full relative overflow-x-hidden bg-black text-white font-sans selection:bg-blue-500 selection:text-white">

            <Navbar query={query} setQuery={setQuery} onHomeClick={() => { setQuery(''); navigate('/'); }} />

            <Routes>
                <Route path="/" element={
                    query ? (
                        // Ahora todo el buscador es solo esta línea de código:
                        <SearchResults query={query} onResultClick={handleItemClick} />
                    ) : (
                        /* --- VISTA PORTADA --- */
                        <div>
                            <Hero movies={popularMovies} />
                            <div className="relative z-10 -mt-16 md:-mt-24 bg-black pb-10 space-y-8">
                                <div className="h-12 w-full bg-gradient-to-b from-transparent to-black -mt-12 absolute top-0"></div>
                                <div className="pt-4">
                                    <MovieRow title="Películas Recomendadas" movies={popularMovies} />
                                    <MovieRow title="Series y Anime Top" movies={popularSeries} />
                                </div>
                            </div>
                        </div>
                    )
                } />

                <Route path="/ver/movie/:id" element={<WatchMoviePage />} />
                <Route path="/ver/tv/:id" element={<TvShowHubPage />} />
                <Route path="/ver/tv/:id/temporada/:season/capitulo/:episode" element={<WatchSeriePage />} />

            </Routes>
        </div>
    )
}

export default App