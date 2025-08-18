import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import tmdbApi from '../../api/tmdbApi';
import apiConfig from '../../api/apiConfig';

import './detail.scss';
import CastList from './CastList';
import VideoList from './VideoList';
import Button from '../../components/button/Button';

import MovieList from '../../components/movie-list/MovieList';

const Detail = () => {

    const { category, id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);

    const handlePlayClick = () => {
        if (item) {
            const movieTitle = item.title || item.name;
            const releaseYear = item.release_date ? new Date(item.release_date).getFullYear() : 
                               item.first_air_date ? new Date(item.first_air_date).getFullYear() : '';
            
            // Create vidsrc URL
            const vidsrcUrl = category === 'movie' 
                ? `https://vidsrc.xyz/embed/movie/${id}`
                : `https://vidsrc.xyz/embed/tv/${id}`;
            
            // Navigate to watch page with encoded URL
            const encodedUrl = encodeURIComponent(vidsrcUrl);
            navigate(`/watch?url=${encodedUrl}&title=${encodeURIComponent(movieTitle)}&year=${releaseYear}`);
        }
    };

    useEffect(() => {
        const getDetail = async () => {
            const response = await tmdbApi.detail(category, id, {params:{}});
            setItem(response);
            window.scrollTo(0,0);
        }
        getDetail();
    }, [category, id]);

    return (
        <>
            {
                item && (
                    <>
                        <div className="banner" style={{backgroundImage: `url(${apiConfig.originalImage(item.backdrop_path || item.poster_path)})`}}></div>
                        <div className="mb-3 movie-content container">
                            <div className="movie-content__poster">
                                <div className="movie-content__poster__img" style={{backgroundImage: `url(${apiConfig.originalImage(item.poster_path || item.backdrop_path)})`}}></div>
                            </div>
                            <div className="movie-content__info">
                                <h1 className="title">
                                    {item.title || item.name}
                                </h1>
                                <div className="genres">
                                    {
                                        item.genres && item.genres.slice(0, 5).map((genre, i) => (
                                            <span key={i} className="genres__item">{genre.name}</span>
                                        ))
                                    }
                                    <Button 
                                        className="play-button" 
                                        onClick={handlePlayClick}
                                        aria-label={`Play ${item.title || item.name}`}
                                    >
                                        <i className="bx bx-play"></i>
                                        Play
                                    </Button>
                                </div>
                                <p className="overview">{item.overview}</p>
                                <div className="cast">
                                    <div className="section__header">
                                        <h2>Casts</h2>
                                    </div>
                                    <CastList id={item.id}/>
                                </div>
                            </div>
                        </div>
                        <div className="container">
                            <div className="section mb-3">
                                <VideoList id={item.id}/>
                            </div>
                            <div className="section mb-3">
                                <div className="section__header mb-2">
                                    <h2>Similar</h2>
                                </div>
                                <MovieList category={category} type="similar" id={item.id}/>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    );
}

export default Detail;
