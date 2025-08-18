import 'swiper/swiper.min.css';
import './assets/boxicons-2.0.7/css/boxicons.min.css';
import './App.scss';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import MovieLandingPage from './components/MovieLandingPage';

import AppRoutes from './config/Routes';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route 
                    path="/landing" 
                    element={
                        <MovieLandingPage 
                            tmdbApiKey="8265bd1679663a7ea12ac168da84d2e8"
                            tmdbId={385687}
                            proxyUrl={window.location.origin}
                        />
                    } 
                />
                <Route 
                    path="/*" 
                    element={
                        <>
                            <Header />
                            <AppRoutes />
                            <Footer />
                        </>
                    } 
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
