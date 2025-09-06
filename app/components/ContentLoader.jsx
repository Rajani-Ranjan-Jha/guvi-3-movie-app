'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Play, Star, BookmarkPlus, BookmarkCheck, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { addToWatchList, getTrailerLink, removeFromWatchList } from './action';
import { useUserContext } from '../context/contextProvider';
import { getMediaByCategory } from '../handlers/movieDetails';
import Link from 'next/link';


const ContentLoader = ({
    listLength = 10,
    mediaCategory = 'popular',
    mediaType = 'tv',
    title = `${mediaCategory} in ${mediaType}`,
}) => {


    const context = useUserContext()
    const [user, setUser] = useState()
    const [userWatchlist, setUserWatchlist] = useState()
    const [Movies, setMovies] = useState()

    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [loading, setLoading] = useState(true);
    const router = useRouter()


    const loadUserfromContext = () => {
        if (!context || !context.user) {
            console.error("Didnot get user from the context!")
            return
        }
        setUser(context.user)
        let IdList = []
        context.watchlist.forEach((list) => IdList.push(Number(list.media_id)))

        // console.warn(IdList)
        setUserWatchlist(IdList)
    }


    const loadByCategory = async () => {
        setLoading(true)
        const output = await getMediaByCategory(mediaCategory, mediaType)
        if(!output) return
        setMovies(output)
        setLoading(false)
    }



    const checkScrollPosition = () => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const { scrollLeft, scrollWidth, clientWidth } = container;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const scrollAmount = 600;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
        setTimeout(() => {
            checkScrollPosition();
        }, 300);
    };

    const handleMediaClick = (id) => {
        router.push(`/${mediaType}/${id}`)
    }

    const handleWatchList = async (contentId) => {
        const alreadyExists = userWatchlist.includes(contentId);
        if (alreadyExists) {
            const result = await removeFromWatchList(contentId, user.email);
            if (result) {
                setUserWatchlist(userWatchlist.filter(id => id !== contentId));
            } else {
                alert("failed to remove from watchlist");
            }
        } else {
            const result = await addToWatchList(contentId, mediaType, user.email);
            if (result) {
                setUserWatchlist([...userWatchlist, contentId]);
            } else {
                alert("failed to add to watchlist");
            }
        }
    }

    const handleTrailerClick = async (contentId) => {
        const TrailerObj = await getTrailerLink(contentId)
        window.open(`https://www.youtube.com/watch?v=${TrailerObj.key}`, '_blank')
    }

    useEffect(() => {
        loadUserfromContext()
        loadByCategory()
        checkScrollPosition();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollPosition);
            return () => container.removeEventListener('scroll', checkScrollPosition);
        }
    }, []);


    if (loading || !userWatchlist) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center ">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-gray-300">Loading...</p>
            </div>
        )
    }

    if (Movies && Movies.length != 0) {
        return (
            <div className="bg-black text-white p-6 px-10">
                <div className="w-full mx-auto">
                    {/* Category Title */}
                    <div className="flex items-center mb-6">
                        <div className="w-1 h-8 bg-yellow-400 mr-3"></div>
                        <h2 className="text-2xl font-bold">{title || 'No title'}</h2>
                    </div>

                    {/* Movie Carousel Container */}
                    <div className="relative">
                        {/* Left Arrow */}
                        {showLeftArrow && (
                            <button
                                onClick={() => scroll('left')}
                                className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 blur-1 text-white p-3 rounded-full transition-opacity duration-300 cursor-pointer ${showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                            >
                                <ChevronLeft size={24} />
                            </button>
                        )}

                        {/* Right Arrow */}
                        {showRightArrow && (
                            <button
                                onClick={() => scroll('right')}
                                className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 blur-1 text-white p-3 rounded-full transition-opacity duration-300 cursor-pointer ${showRightArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                            >
                                <ChevronRight size={24} />
                            </button>
                        )}

                        {/* Movies Container */}
                        <div
                            ref={scrollContainerRef}
                            className="flex overflow-x-auto scrollbar-hide scroll-smooth"
                        // style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {Movies.map((movie, index) => (
                                <div
                                    key={movie.id}
                                    className="w-64 ml-4 flex-shrink-0 flex-col justify-between items-center  bg-white/5 rounded-lg overflow-hidden  transition-transform duration-200 border-0"
                                >
                                    {/* Movie Poster */}
                                    <div className="relative"
                                    >
                                        <img
                                            src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
                                            alt={movie?.original_title || movie.name}
                                            className="w-full h-80 object-cover hover:scale-102"

                                        />

                                        {/* Watchlist Button */}
                                        <button className="absolute z-10 top-3 left-3 bg-black/50 hover:bg-black/80 bg-opacity-60 hover:bg-opacity-80 p-2 rounded-sm transition-all duration-200 cursor-pointer"
                                            onClick={() => handleWatchList(movie.id)}>
                                            {userWatchlist.includes(movie.id) ? (
                                                <BookmarkCheck size={20} className="text-white" />
                                            ) : (
                                                <BookmarkPlus size={20} className="text-white" />
                                            )}

                                        </button>

                                        {/* Play Overlay */}
                                        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-40 flex items-center justify-center transition-opacity duration-200"
                                            onClick={() => {
                                                handleMediaClick(movie.id)
                                            }}>
                                            <Play size={40} className="text-white" />
                                        </div>
                                    </div>

                                    {/* Movie Info */}
                                    <div className="h-50 px-4 py-2 flex flex-col">
                                        {/* Rating and Title - takes available space */}
                                        <div className="flex flex-col flex-1">
                                            <div className="flex items-center mb-2">
                                                <Star size={16} className="text-yellow-400 fill-current mr-1" />
                                                <span className="text-white font-semibold">{movie.vote_average.toFixed(1)}</span>
                                            </div>

                                            {/* Title with Rank */}
                                            <div className="mb-1">
                                                <h3 className="text-white font-semibold text-lg leading-tight">
                                                    <Link href={`/${mediaType}/${movie.id}`}>{index + 1}. {movie.title || movie.name}</Link>

                                                </h3>
                                            </div>
                                        </div>

                                        {/* Action Buttons - always at bottom */}
                                        <div className="space-y-2 mt-auto">
                                            <button className="w-full hover:bg-blue-400/40 text-white py-2 px-4 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer"
                                                onClick={() => handleWatchList(movie.id)}>
                                                {userWatchlist.includes(movie.id) ? (
                                                    <div className='flex justify-center items-center gap-2'>
                                                        <span><Check size={20} className="text-white" /></span>
                                                        <span>Watchlist</span>
                                                    </div>

                                                ) : (
                                                    <div className='flex justify-center items-center gap-2'>
                                                        <span><Plus size={20} className="text-white" /></span>
                                                        <span>Watchlist</span>
                                                    </div>

                                                )}
                                            </button>

                                            <button className="w-full text-blue-600 font-semibold hover:bg-blue-600/20 py-2 px-4 rounded-full text-sm transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
                                                onClick={() => handleTrailerClick(movie.id)}
                                            >
                                                <Play size={14} className='fill-current' />
                                                Trailer
                                            </button>

                                            {/* <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded text-sm font-medium transition-colors duration-200">
                                                Watch options
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                
            </div>
        );
    } else {

        return (
            <div className="w-full h-screen flex flex-col justify-center items-center ">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-gray-300">Loading...</p>
            </div>

        )

    }
};

export default ContentLoader;
