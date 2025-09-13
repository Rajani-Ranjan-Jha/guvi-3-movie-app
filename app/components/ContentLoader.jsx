'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Play, Star, BookmarkPlus, BookmarkCheck, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useUserContext } from '../context/contextProvider';
import { getMediaByCategory, getMediaVideos } from '../handlers/mediaHandler';
import Link from 'next/link';
import { addToWatchList, removeFromWatchList } from '../handlers/watchlistHandler';



const ContentLoader = ({
    mediaCategory = 'popular',
    mediaType = 'tv',
    mediaTitle = `${mediaCategory} in ${mediaType}`,
}) => {

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date)) return 'N/A';
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const context = useUserContext()
    const [user, setUser] = useState()
    const [userWatchlist, setUserWatchlist] = useState(null)
    const [Movies, setMovies] = useState()

    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [loading, setLoading] = useState(true);
    const router = useRouter()


    const loadUserfromContext = () => {
        if (!context || !context.user) {
            console.warn("Didnot get user from the context!")
            // return
        } else {

            setUser(context.user)
            let IdList = []
            context.watchlist.forEach((list) => IdList.push(Number(list.media_id)))

            // console.warn(IdList)
            setUserWatchlist(IdList)
        }
    }

    // to update user and watchlist when context changes
    useEffect(() => {
        if (context.user) {
            // console.warn("have user");
            setUser(context.user);
            if (context.watchlist) {
                let IdList = [];
                context.watchlist.forEach((list) => IdList.push(Number(list.media_id)));
                setUserWatchlist(IdList);
            } else {
                setUserWatchlist([]);
            }
        } else {
            // console.warn("No user");
            setUser(null);
            setUserWatchlist([]);
        }
    }, [context.user, context.watchlist]);


    const loadByCategory = async () => {
        setLoading(true)
        const output = await getMediaByCategory(mediaCategory, mediaType)
        if (!output) return
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

    const handleMediaClick = (mediaType,mediaId) => {
        router.push(`/${mediaType}/${mediaId}`)
    }

    const handleWatchList = async (contentType, contentId) => {
        if (!user) {
            alert("Please login to add to watchlist")
            // router.push('/login')
            return
        }
        const alreadyExists = userWatchlist.includes(contentId);
        if (alreadyExists) {
            const result = await removeFromWatchList(contentId, user.email);
            if (result) {
                setUserWatchlist(userWatchlist.filter(id => id !== contentId));
            } else {
                alert("failed to remove from watchlist");
            }
        } else {
            const result = await addToWatchList(contentId, contentType, user.email);
            if (result) {
                setUserWatchlist([...userWatchlist, contentId]);
            } else {
                alert("failed to add to watchlist");
            }
        }
    }

    const handleTrailerClick = async (contentType, contentId) => {
        const output = await getMediaVideos(contentId, contentType)
        const filtered = await output.filter(
            (i) => i.type == "Trailer" && i.site == "YouTube"
        );
        window.open(`https://www.youtube.com/watch?v=${filtered[0].key}`, '_blank')
    }

    useEffect(() => {
        // loadUserfromContext()
        loadByCategory()
        checkScrollPosition();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollPosition);
            return () => container.removeEventListener('scroll', checkScrollPosition);
        }
    }, []);


    if (loading) {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center ">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-gray-300">Loading...</p>
            </div>
        )
    }

    if (Movies && Movies.length != 0) {
        return (
            <>
                <div className="p-6 px-10 text-white">
                    <div className="w-full mx-auto">
                        {/* Category Title */}
                        <div className="flex items-center mb-6">
                            <div className="w-1 h-8 bg-white dark:bg-purple-600 mr-3"></div>
                            <h2 className="text-2xl font-bold">{mediaTitle || 'No title'}</h2>
                        </div>

                        {/* Movie Carousel Container */}
                        <div className="relative">
                            {/* Left Arrow */}
                            {showLeftArrow && (
                                <button
                                    onClick={() => scroll('left')}
                                    className={`hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 z-10  bg-white/20 dark:bg-purple-600/80 px-3 py-5 rounded-none border-1 transition-opacity duration-300 cursor-pointer ${showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                >
                                    <ChevronLeft size={24} />
                                </button>
                            )}

                            {/* Right Arrow */}
                            {showRightArrow && (
                                <button
                                    onClick={() => scroll('right')}
                                    className={`hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10   bg-white/20 dark:bg-purple-600/80 px-3 py-5 rounded-none border-1 transition-opacity duration-300 cursor-pointer ${showRightArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                >
                                    <ChevronRight size={24} />
                                </button>
                            )}

                            {/* Movies Container */}
                            <div
                                ref={scrollContainerRef}
                                className="flex overflow-x-auto scrollbar-hide scroll-smooth"
                            >
                                {Movies.map((movie, index) => (
                                    <div
                                        key={movie.id}
                                        className="w-64 ml-4 flex-shrink-0 flex-col justify-between items-center bg-white/15 dark:bg-white/5 rounded-lg overflow-hidden  transition-transform duration-200 border-0"
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
                                                onClick={() => handleWatchList(movie.media_type || mediaType, movie.id)}>
                                                {userWatchlist && userWatchlist.includes(movie.id) ? (
                                                    <BookmarkCheck size={20} className="" />
                                                ) : (
                                                    <BookmarkPlus size={20} className="" />
                                                )}

                                            </button>

                                            {/* Play Overlay */}
                                            <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-40 flex items-center justify-center transition-opacity duration-200"
                                                onClick={() => {
                                                    handleMediaClick(movie.media_type || mediaType, movie.id)
                                                }}>
                                                <Play size={40} className="" />
                                            </div>
                                        </div>

                                        {/* Movie Info */}
                                        <div className="h-50 px-4 py-2 flex flex-col">
                                            <div className="flex flex-col flex-1">
                                                <div className="flex items-center mb-2">
                                                    <Star size={16} className="text-yellow-400 fill-current mr-1" />
                                                    <span className=" font-semibold">{movie?.vote_average?.toFixed(1)}</span>
                                                </div>

                                                {/* Title */}
                                                <div className="mb-1">
                                                    <h3 className=" font-semibold text-lg leading-tight">
                                                        <Link href={`/${movie.media_type || mediaType}/${movie.id}`}>{index + 1}. {movie.title || movie.name}</Link>
                                                    </h3>
                                                    <h2 className='text-sm font-semibold text-white/80'>{formatDate(movie?.release_date || movie?.first_air_date)}</h2>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="space-y-2 mt-auto">
                                                <button className="w-full hover:bg-purple-400/40  py-2 px-4 rounded-full font-semibold transition-colors duration-200 cursor-pointer"
                                                    onClick={() => handleWatchList(movie.media_type || mediaType, movie.id)}>
                                                    {userWatchlist && userWatchlist.includes(movie.id) ? (
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

                                                <button className="w-full text-white dark:text-purple-600 font-semibold hover:bg-white/20 dark:hover:bg-purple-600/20 py-2 px-4 rounded-full transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
                                                    onClick={() => handleTrailerClick(movie.media_type || mediaType, movie.id)}
                                                >
                                                    <Play size={14} className='fill-current' />
                                                    Trailer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                </div>
            </>
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
