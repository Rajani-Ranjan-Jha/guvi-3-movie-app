'use client'
import { ArrowRight, BookmarkCheck, BookmarkPlus, ChevronRight, ImagesIcon, ListVideo, LucideDivide, Plus, Star, StarIcon, User } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

import { formatMinutes, formatCurrency, formatNumber } from '@/utils/formatter'
import CreateNewReview from '@/app/components/CreateNewReview'
import { addToWatchList, removeFromWatchList } from '@/app/handlers/watchlistHandler'
import { useUserContext } from '@/app/context/contextProvider'
import { getMediaById, getMediaCredits, getMediaPictures, getMediaReviews, getMediaVideos, getMediaWatchProviders } from '@/app/handlers/mediaHandler'
import Navbar from '@/app/components/Navbar'


const MOVIE = () => {

    const { id } = useParams()
    const context = useUserContext()
    const [user, setUser] = useState({})
    const [loading, setloading] = useState(false)
    const [LoadingReviews, setLoadingReviews] = useState(false)
    const [reviewBtn, setreviewBtn] = useState(false)
    const [isFirstReview, setIsFirstReview] = useState(true)
    const [isAlreadyInWatchlist, setIsAlreadyInWatchlist] = useState(false)

    const [movieDetails, setMovieDetails] = useState()
    const [movieTrailer, setMovieTrailer] = useState([])
    const [movieCasts, setMovieCasts] = useState([])
    const [movieDirectors, setMovieDirectors] = useState([])
    const [movieWriters, setMovieWriters] = useState([])
    const [movieProvidors, setMovieProvidors] = useState({})

    const [movieVideos, setMovieVideos] = useState([])
    const [moviePictures, setMoviePictures] = useState([])
    const [movieReviews, setMovieReviews] = useState()

    useEffect(() => {
        if (context.user) {
            // console.warn("have user");
            setUser(context.user);
            if (context.watchlist) {
                const watchlist = context.watchlist
                watchlist.find((list) => list.media_id == id) ? setIsAlreadyInWatchlist(true) : setIsAlreadyInWatchlist(false)
            }
        } else {
            console.warn("No user");
            setUser(null);
            setIsAlreadyInWatchlist(false);
        }
    }, [context.user, context.watchlist]);

    const loadMovieDetails = async (movieId) => {
        setloading(true)
        const output = await getMediaById(movieId, 'movie')
        //console.log(output)
        setMovieDetails(output)
        setloading(false)

    }

    const loadMovieVideos = async (movieId) => {
        const output = await getMediaVideos(movieId, 'movie')
        //console.log(output)
        const filtered = await output.filter(
            (i) => i.type == "Trailer" && i.site == "YouTube"
        );
        setMovieTrailer(filtered)
        setMovieVideos(output)

    }

    const loadMoviePictures = async (movieId) => {
        const output = await getMediaPictures(movieId, 'movie')
        //console.log(output)
        setMoviePictures(output)

    }

    const loadMovieCredits = async (movieId) => {
        const output = await getMediaCredits(movieId, 'movie')
        //console.log(output)
        setMovieCasts(output.casts)
        setMovieDirectors(output.directors)
        setMovieWriters(output.writers)

    }

    const loadMovieWatchProviders = async (movieId) => {
        const output = await getMediaWatchProviders(movieId, 'movie')
        //console.log(output)
        setMovieProvidors(output)

    }


    //
    const addMovieInfoToDB = async (movieId) => {
        try {
            const reviews = await getMediaReviews(movieId, 'movie');
            if (!reviews || reviews.length === 0) {
                console.warn("No reviews fetched from TMDB to add to DB");
                return null;
            }
            const req = await fetch('/api/movie/load', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tmdb_id: movieId,
                    tmdb_rating: movieDetails?.vote_average,
                    reviews: reviews,
                })
            })

            const res = await req.json()
            if (res.status != 200) {
                console.warn(`${res.message}, status: ${res.status}`)

                return false;
            }
            console.warn("Added to the local db:")
            return true
        } catch (error) {
            console.error(error)
            return null;
        }
    }

    const loadMovieReviewsFromDB = async (movieId) => {
        setLoadingReviews(true)
        try {
            const req = await fetch(`/api/movie/reviews?id=${movieId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const res = await req.json()
            if (res.status != 200) {
                console.warn(res.message, ", setting again!")
                const added = await addMovieInfoToDB(movieId)
                if (!added) {
                    setLoadingReviews(false)
                    return
                } else {
                    // if added successfully, load from db again
                    await loadMovieReviewsFromDB(movieId)
                    return
                }
                // return;
            }
            console.warn("got the reviews")
            setMovieReviews(res.reviews)
            setLoadingReviews(false)
        } catch (error) {
            console.error(error)
            setLoadingReviews(false)
        }
    }

    const handleAddRemoveWatchList = async (movieId) => {
        if (!user || !user.email) {
            alert("Please login to add to watchlist")
            return
        }
        if (isAlreadyInWatchlist) {
            console.log("removing from watchlist")
        } else {
            console.log("adding to watchlist")
        }
        const result = isAlreadyInWatchlist ? await removeFromWatchList(movieId, user.email) : await addToWatchList(movieId, 'movie', user.email)
        if (!result) {
            alert("Failded to add watchlist")
            return
        }
        // alert('ADDED TO WATCHLIST!')
        setIsAlreadyInWatchlist(!isAlreadyInWatchlist)
    }

    useEffect(() => {
        if (id) {

            loadMovieDetails(id)
            loadMovieVideos(id)
            loadMoviePictures(id)
            loadMovieCredits(id)
            loadMovieWatchProviders(id)


        }
    }, [])


    useEffect(() => {
        if (!movieDetails || movieDetails.length === 0) {
            // console.warn("dont have movie details right now")
            return
        }
        document.title = `${movieDetails.title} - Movie Master`
        loadMovieReviewsFromDB(id)
    }, [movieDetails])

    useEffect(() => {
        if (movieReviews && user?.username) {
            const hasUserReview = movieReviews.some(review => review.author === user?.username);
            setIsFirstReview(!hasUserReview);
        }
    }, [movieReviews, user]);

    const renderReviews = useCallback((review, index) => {
        return (
            <div key={review.id || index} className='w-50 flex-shrink-0 flex-col items-start bg-white/10 border border-white/50 rounded-lg p-4 hover:bg-white/20 transition-colors duration-200 cursor-default'>
                <div className='flex items-center mb-2 space-x-2'>
                    <StarIcon size={15} className="text-yellow-400 fill-current" />
                    <span className='text-sm font-medium '>{review.rating} {`${review.author} ${review.author == user?.username ? '(you)' : ''}`}</span>
                </div>
                <p className='clamp-3 text-xs  max-w-full'>{`${review.content.length > 150 ? review.content.substring(0, 150) + '...' : review.content}`}</p>
            </div>
        );
    }, [user]);



    if (loading) {
        return (
            <>
                <Navbar />
                <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-r from-purple-500 via-purple-900 to-purple-500 dark:from-black dark:via-black/90 dark:to-black">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p className="text-gray-300">Loading movie...</p>
                </div>
            </>
        )
    }

    return (
        <>
            <Navbar />
            {movieDetails && (
                <div className='relative w-full h-full bg-gradient-to-r from-purple-500 via-purple-900 to-purple-500 dark:from-black dark:via-black/90 dark:to-black flex py-10 text-white transition-colors duration-500'>
                    <div className='w-full lg:w-4/5 p-5 gap-5 flex flex-col  mx-auto'>
                        <div className='p-5'>
                            <div className='w-full flex justify-between items-center'>
                                <h2 className=' text-5xl'>{movieDetails.title}</h2>
                                <button className='flex items-center gap-1 px-2 py-2 hover:bg-white/20 cursor-pointer text-sm rounded-lg'
                                    onClick={() => { handleAddRemoveWatchList(movieDetails.id) }}>
                                    {isAlreadyInWatchlist ? (
                                        <span><BookmarkCheck /></span>
                                    ) : (
                                        <span><BookmarkPlus /></span>
                                    )}

                                </button>
                            </div>
                            <div className='flex gap-3 mt-2'>
                                <span className='bg-white dark:bg-white/20 text-purple-700 dark:text-white font-semibold cursor-default text-center p-2 py-1 text-xs rounded-md'>
                                    {new Date(movieDetails.release_date).getFullYear()}
                                </span>
                                <span className='bg-white dark:bg-white/20 text-purple-700 dark:text-white font-semibold cursor-default text-center p-2 py-1 text-xs rounded-md'>
                                    {formatMinutes(movieDetails.runtime)}
                                </span>
                                <span className='flex items-center gap-1 bg-white dark:bg-white/20 text-purple-700 dark:text-white font-semibold cursor-default text-center p-2 py-1 text-xs rounded-md'>
                                    <Star size={15} className='text-yellow-400 fill-current' />
                                    <span>{movieDetails.vote_average.toFixed(1)}</span>
                                </span>
                            </div>
                        </div>

                        {/* media div */}
                        <div className='w-full p-5 rounded-2xl flex flex-col gap-5 md:gap-0 md:flex-row justify-center items-center'>
                            {/* image div */}
                            <div className='w-full mx-auto md:w-1/4 md:h-full rounded-md md:rounded-l-2xl'>
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movieDetails?.poster_path}`}
                                    alt={movieDetails?.title}
                                    className="w-full object-cover rounded-md md:rounded-l-2xl"
                                />
                            </div>

                            {/* trailer div */}
                            <div className='w-full md:w-6/10 h-50 md:h-full mx-0.5'>
                                {movieTrailer.length > 0 && (
                                    <div className='w-full h-full'>
                                        <iframe
                                            className='w-full h-full rounded-md md:rounded-none'
                                            src={`https://www.youtube-nocookie.com/embed/${movieTrailer[0].key}?autoplay=0&mute=1&modestbranding=1&iv_load_policy=3&cc_load_policy=0`}

                                            title={`${movieDetails.original_title} ${movieTrailer[0].name}`}>

                                        </iframe>


                                    </div>
                                )}
                            </div>

                            {/* more photo-video div */}
                            <div className='w-full md:w-15/100 h-50 md:h-full flex flex-col justify-center items-center bg-white/10 rounded-md md:rounded-r-2xl'>
                                <a href={`https://www.themoviedb.org/movie/${movieDetails.id}/videos`} target='_blank' className='w-full h-1/2 p-5 text-md hover:bg-white/20 cursor-pointer rounded-md md:rounded-tr-2xl flex flex-col justify-center items-center gap-5'>
                                    <ListVideo />
                                    <span className='text-center' >{`${movieVideos.length > 99 ? "99+" : movieVideos.length}`} Videos</span>

                                </a>
                                <a href={`https://www.themoviedb.org/movie/${movieDetails.id}/images/backdrops`} target='_blank' className='w-full h-1/2 p-5 text-md hover:bg-white/20 cursor-pointer rounded-md md:rounded-br-2xl  flex flex-col justify-center items-center gap-5'>
                                    <ImagesIcon />
                                    <span className='text-center' >{`${moviePictures.length > 99 ? "99+" : moviePictures.length}`} Images</span>
                                </a>

                            </div>

                        </div>


                        {/* info div */}
                        <div className='w-full flex flex-col gap-5 justify-center items-start'>

                            {/* main info div */}
                            <div className='w-full flex flex-col justify-center items-start'>
                                {/* genres */}
                                <div className='w-full flex flex-wrap gap-2 p-2'>
                                    {movieDetails.genres.map((g, i) => (
                                        <div className='px-2 py-1 text-xs hover:bg-white/20 text-center rounded-2xl border-1 border-slate-100 cursor-default transition-all duration-150' key={g.id}>{g.name}</div>
                                    ))
                                    }
                                </div>

                                {/* description */}
                                <div className='p-2 text-sm'>
                                    {movieDetails.overview}
                                </div>
                            </div>


                            {/* extra info div */}
                            <div className='w-full flex flex-col gap-2 justify-center'>
                                {/* director */}
                                <div className='border-t-1 border-t-white p-2 py-1 text-sm'>
                                    Director: {movieDirectors[0]?.name || 'No Directors'}
                                </div>

                                {/* writer */}
                                <div className='border-t-1 border-t-white p-2 py-1 text-sm'>
                                    Writer: {movieWriters.length > 0 ? movieWriters.map(w => w.name).join(', ') : 'Not Found'}
                                </div>

                                {movieDetails.status == 'Released' && (
                                    <div className='border-t-1 border-t-white p-2 py-1 text-sm'>
                                        Release Date: {movieDetails.release_date}
                                    </div>
                                )}
                                <div className='border-t-1 border-t-white p-2 py-1 text-sm'>
                                    Rating: {`${movieDetails.vote_average} (${formatNumber(movieDetails.vote_count)})`}
                                </div>
                                <div className='border-t-1 border-t-white p-2 py-1 text-sm'>
                                    Runtime: {formatMinutes(movieDetails.runtime)}
                                </div>
                                <div className='border-t-1 border-t-white p-2 py-1 text-sm'>
                                    Budget: {formatCurrency(movieDetails.budget)} USD
                                </div>
                                <div className='border-t-1 border-t-white p-2 py-1 text-sm'>
                                    Revenue: {formatCurrency(movieDetails.revenue)} USD
                                </div>

                            </div>




                            {/* OTT providers */}
                            <div className='w-full border-t-1 pt-5'>
                                <h2 className='font-semibold text-2xl mb-2'>OTT Providers:</h2>
                                <div className='w-full max-h-50 flex flex-row gap-2 justify-start items-center overflow-x-auto handle-scroll border-b-0 border-t-0'>
                                    {movieProvidors.IN && movieProvidors.IN.rent ? (movieProvidors?.IN?.rent.map((provider, index) =>
                                        <div
                                            className='flex-shrink-0 w-50 flex flex-col justify-center items-center gap-2 border-0 border-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300' key={provider.provider_id}>
                                            {provider.logo_path ? (<img
                                                className='w-25 h-25  object-cover rounded-full border-1' src={`https://image.tmdb.org/t/p/w500${provider?.logo_path}`} alt={provider.provider_name} />) :
                                                (<User className='w-25 h-25 font-extralight  rounded-full border-1 border-white' />)}

                                            <span className='text-center font-bold'>{provider.provider_name}</span>


                                        </div>
                                    )) : (
                                        <div className='py-3'>No providers found</div>
                                    )}

                                </div>
                            </div>


                            {/* casters */}
                            <div className='w-full border-t-1 pt-5'>
                                <div className='w-full flex justify-start items-center gap-2 font-semibold'>
                                    <h2 className='text-2xl hover:bg-text-700'>Casts:</h2>
                                    {movieCasts?.length != 0 && (<small>{`(${movieCasts.length} total)`}</small>)}
                                </div>

                                <div className='w-full mx-auto flex flex-col md:flex-row md:flex-wrap justify-start items-center space-x-2'>
                                    {movieCasts.slice(0, 20).map((cast, index) =>
                                        <div
                                            className='bg-white/20 md:bg-transparent w-full md:w-2/5 my-2 flex justify-start items-center gap-5  md:hover:bg-white/20 rounded-2xl cursor-default transition-all duration-300'
                                            key={cast.id}
                                        >
                                            {cast.profile_path ? (<img
                                                className='w-25 h-25 rounded-full border-1 border-white object-cover' src={`https://image.tmdb.org/t/p/w500${cast?.profile_path}`} alt={cast.name} />) :
                                                (<User className='w-25 h-25 font-extralight  rounded-full border-1 border-white' />

                                                )}

                                            <div className="flex flex-col justify-center items-start">
                                                <span className='text-left font-bold'>{cast.name}</span>
                                                <span className='text-left text-xs'>{cast.character.split('(')[0]}</span>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            </div>


                            {/* user reviews */}
                            <div className='w-full flex flex-col gap-2 justify-between border-t-1 pt-5'>
                                <div className='flex justify-between items-center'>
                                    <div className='flex items-center border-0 gap-2 font-semibold'>
                                        <h2 className=' text-2xl hover:bg-text-700'>User reviews</h2>
                                        {movieReviews && movieReviews?.length != 0 && (
                                            <small>{`(${movieReviews?.length} total)`}</small>
                                        )}

                                    </div>
                                    <button className='flex items-center text-sm bg-white/10 px-2 py-1 rounded-md hover:bg-white/20 cursor-pointer'
                                        onClick={() => {
                                            if (!user) {
                                                alert("Please login to add review")
                                                return
                                            }
                                            setreviewBtn(true)
                                        }}>
                                        <Plus className='text-sm mr-1' size={15} /> {`${isFirstReview ? 'review' : 'update'}`}
                                    </button>
                                </div>
                                <div className='flex flex-col items-start'>
                                    <div className='w-full h-52 flex flex-row space-x-4 overflow-x-auto handle-scroll px-2 py-2'>
                                        {movieReviews && movieReviews.length > 0 ? (movieReviews.map((review, index) => {
                                            return renderReviews(review, index)
                                        }))
                                            : ((LoadingReviews ? (
                                                <p className='mx-auto text-xl'>
                                                    Loading reviews...
                                                </p>)
                                                : (<p className='mx-auto text-xl'>
                                                    No review available!
                                                </p>

                                                ))

                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {reviewBtn && (
                        <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex justify-center items-center z-20" onClick={() => setreviewBtn(false)}>

                            <div className='w-200 mx-auto'
                                onClick={(e) => e.stopPropagation()}>
                                <CreateNewReview tmdb_id={id} tmdb_rating={movieDetails.vote_average} isFirstReview={isFirstReview} previousReview={movieReviews.find(r => r.author === user.username)} />

                            </div>

                        </div>
                    )}

                </div>
            )}
        </>
    )
}

export default MOVIE
