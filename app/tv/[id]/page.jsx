'use client'
import { ArrowRight, BookmarkCheck, BookmarkPlus, ChevronRight, ImagesIcon, ListVideo, Plus, Star, StarIcon, User } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

import { formatMinutes, formatCurrency, formatNumber } from '@/utils/formatter'
import CreateNewReview from '@/app/components/CreateNewReview'
import { addToWatchList, removeFromWatchList } from '@/app/handlers/watchlistHandler'
import { useUserContext } from '@/app/context/contextProvider'
import { getMediaById, getMediaCredits, getMediaPictures, getMediaReviews, getMediaVideos, getMediaWatchProviders } from '@/app/handlers/mediaHandler'
import Navbar from '@/app/components/Navbar'
import GetRecommendations from '@/app/components/GetRecommendations'

const TV = () => {


    const { id } = useParams()
    const context = useUserContext()
    const [user, setUser] = useState({})
    const [loading, setloading] = useState(false)
    const [LoadingReviews, setLoadingReviews] = useState(false)
    const [reviewBtn, setreviewBtn] = useState(false)
    const [isFirstReview, setIsFirstReview] = useState(true)
    const [isAlreadyInWatchlist, setIsAlreadyInWatchlist] = useState(false)


    const [tvDetails, setTvDetails] = useState()
    const [tvTrailer, setTvTrailer] = useState([])
    const [tvCasts, setTvCasts] = useState([])
    const [tvDirectors, setTvDirectors] = useState([])
    const [tvWriters, setTvWriters] = useState([])
    const [tvProvidors, setTvProvidors] = useState()

    const [tvVideos, setTvVideos] = useState([])
    const [tvPictures, setTvPictures] = useState([])
    const [tvReviews, setTvReviews] = useState()

    const loadUserfromContext = () => {
        if (!context || !context.user) {
            console.warn("Didnot get user from the context(tv/page.jsx)!")
            setUser(null)
            return
        }
        setUser(context.user)
        // console.warn(context)
        const watchlist = context.watchlist
        watchlist.find((list) => list.media_id == id) ? setIsAlreadyInWatchlist(true) : setIsAlreadyInWatchlist(false)
    }

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

    const loadTvDetails = async (tvId) => {
        setloading(true)
        const output = await getMediaById(tvId, 'tv')
        //console.log(output)
        setTvDetails(output)
        setloading(false)

    }

    const loadTvVideos = async (tvId) => {
        const output = await getMediaVideos(tvId, 'tv')
        //console.log(output)
        const filtered = await output.filter(
            (i) => i.type == "Trailer" && i.site == "YouTube"
        );
        setTvTrailer(filtered)
        setTvVideos(output)

    }

    const loadTvPictures = async (tvId) => {
        const output = await getMediaPictures(tvId, 'tv')
        //console.log(output)
        setTvPictures(output)

    }

    const loadTvCredits = async (tvId) => {
        const output = await getMediaCredits(tvId, 'tv')
        //console.log(output)
        setTvCasts(output.casts)
        setTvDirectors(output.directors)
        setTvWriters(output.writers)

    }


    const addTvInfoToDB = async (tvId) => {
        try {
            const reviews = await getMediaReviews(tvId, 'tv');
            if (!reviews || reviews.length === 0) {
                console.warn("No reviews fetched from TMDB to add to DB");
                // return [];
                return null;
            }
            const req = await fetch('/api/movie/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tmdb_id: tvId,
                    tmdb_rating: tvDetails?.vote_average,
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

    const loadTvReviewsFromDB = async (tvId) => {
        setLoadingReviews(true)
        try {

            const req = await fetch(`/api/movie/reviews?id=${tvId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })

            const res = await req.json()
            if (res.status != 200) {
                console.warn(res.message, ", setting again!")
                const added = await addTvInfoToDB(tvId)
                if (!added) {
                    setLoadingReviews(false)
                    return
                } else {
                    await loadTvReviewsFromDB(tvId)
                    return
                }
                // return;
            }
            console.warn("got the reviews")
            setTvReviews(res.reviews)
            setLoadingReviews(false)
        } catch (error) {
            console.error(error)
            setLoadingReviews(false)
        }

    }

    const handleAddRemoveWatchList = async (tvId) => {
        if (!user || !user.email) {
            alert("Please login to add to watchlist")
            return
        }
        const result = isAlreadyInWatchlist ? await removeFromWatchList(tvId, user.email) : await addToWatchList(tvId, 'tv', user.email)
        if (!result) {
            alert("Failded to add watchlist")
            return
        }
        setIsAlreadyInWatchlist(!isAlreadyInWatchlist)
    }




    useEffect(() => {
        if (id) {
            loadTvDetails(id)
            loadTvVideos(id)
            loadTvPictures(id)
            loadTvCredits(id)
        }
    }, [])

    useEffect(() => {
        if (!tvDetails || tvDetails.length === 0) {
            // console.warn("dont have movie details right now")
            return
        }
        document.title = `${tvDetails.name} - Movie Master`
        setTvProvidors(tvDetails.networks)
        loadTvReviewsFromDB(id)


    }, [tvDetails])

    useEffect(() => {
        if (tvReviews && user?.username) {
            const hasUserReview = tvReviews.some(review => review.author === user?.username);
            setIsFirstReview(!hasUserReview);
        }
    }, [tvReviews, user]);




    const renderReviews = useCallback((review, index) => {
        return (
            <div key={review.id || index} className='w-50 flex-shrink-0 flex-col items-start bg-white/10 border border-white/50 rounded-lg p-4 hover:bg-white/20 transition-colors duration-200 cursor-default'>
                <div className='flex items-center mb-2 space-x-2'>
                    <StarIcon size={15} className="text-yellow-400 fill-current" />
                    <span className='text-sm font-medium '>{review.rating} {`${review.author} ${review.author == user?.username ? '(you)' : ''}`}</span>
                </div>
                <p className='text-xs max-w-full break-words overflow-hidden'>{`${review.content.length > 150 ? review.content.substring(0, 150) + '...' : review.content}`}</p>
            </div>
        );
    }, [user]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-r from-purple-500 via-purple-900 to-purple-500 dark:from-black dark:via-black/90 dark:to-black">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p className="text-gray-300">Loading series...</p>
                </div>
            </>

        )
    }



    return (
        <>
            <Navbar />
            {tvDetails && (
                <div className=' w-full h-full bg-gradient-to-r from-purple-500 via-purple-900 to-purple-500 dark:from-black dark:via-black/90 dark:to-black flex py-10 text-white transition-colors duration-500'>
                    <div className='w-full lg:w-4/5 p-5 gap-5 flex flex-col mx-auto'>
                        <div className='p-5'>
                            <div className='w-full flex justify-between items-center'>
                                <h2 className=' text-5xl'>{tvDetails.name}</h2>
                                <button className='flex items-center gap-1 px-2 py-2 hover:bg-white/20 cursor-pointer text-sm rounded-lg'
                                    onClick={() => { handleAddRemoveWatchList(tvDetails.id) }}>
                                    {isAlreadyInWatchlist ? (
                                        <span><BookmarkCheck /></span>
                                    ) : (
                                        <span><BookmarkPlus /></span>
                                    )}

                                </button>
                            </div>
                            <div className='flex gap-3 mt-2'>
                                <span className='bg-white dark:bg-white/20 text-purple-700 dark:text-white font-semibold cursor-default text-center p-2 py-1 text-xs rounded-md'>
                                    {new Date(tvDetails.first_air_date).getFullYear()}
                                </span>
                                <span className='bg-white dark:bg-white/20 text-purple-700 dark:text-white font-semibold cursor-default text-center p-2 py-1 text-xs rounded-md'>
                                    {`${tvDetails.number_of_seasons} seasons`}
                                </span>
                                <span className='flex items-center gap-1 bg-white dark:bg-white/20 text-purple-700 dark:text-white font-semibold cursor-defaulttext-center p-2 py-1 text-xs rounded-md'>
                                    <Star size={15} className='text-yellow-400 fill-current' />
                                    <span>{tvDetails?.vote_average.toFixed(1)}</span>
                                </span>
                            </div>
                        </div>

                        {/* media div */}
                        <div className='w-full p-5 rounded-2xl flex flex-col gap-5 md:gap-0 md:flex-row justify-center items-center'>

                            {/* image div */}
                            <div className='w-full mx-auto md:w-1/4 md:h-full rounded-md md:rounded-l-2xl'>
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${tvDetails?.poster_path}`}
                                    alt={tvDetails?.name}
                                    className="w-full object-cover rounded-md md:rounded-l-2xl"
                                />
                            </div>

                            {/* trailer div */}
                            <div className='w-full md:w-6/10 h-50 md:h-full mx-0.5'>
                                {tvTrailer.length > 0 && (
                                    <div className='w-full h-full'>
                                        <iframe
                                            className='w-full h-full rounded-md md:rounded-none'

                                            src={`https://www.youtube.com/embed/${tvTrailer[0].key}?autoplay=0&mute=1`}

                                            title={`${tvDetails.name} ${tvTrailer[0].name}`}>

                                        </iframe>


                                    </div>
                                )}
                            </div>

                            {/* more photo-video div */}
                            <div className='w-full md:w-15/100 h-50 md:h-full flex flex-col justify-center items-center bg-white/10 rounded-md md:rounded-r-2xl'>
                                <a href={`https://www.themoviedb.org/tv/${tvDetails.id}/videos`} target='_blank' className='w-full h-1/2 p-5 text-md hover:bg-white/20 cursor-pointer rounded-md md:rounded-tr-2xl  flex flex-col justify-center items-center gap-5'>
                                    <ListVideo />
                                    <span className='text-center'>{`${tvVideos.length > 99 ? "99+" : tvVideos.length}`} Videos</span>

                                </a>
                                <a href={`https://www.themoviedb.org/tv/${tvDetails.id}/images/backdrops`} target='_blank' className='w-full h-1/2 p-5 text-md hover:bg-white/20 cursor-pointer rounded-md md:rounded-tr-2xl  flex flex-col justify-center items-center gap-5'>
                                    <ImagesIcon />
                                    <span className='text-center'>{`${tvPictures.length > 99 ? "99+" : tvPictures.length}`} Images</span>
                                </a>

                            </div>

                        </div>


                        {/* info div */}
                        <div className='w-full flex flex-col gap-5 justify-center items-start'>

                            {/* main info div */}
                            <div className='w-full flex flex-col justify-center items-start'>
                                {/* genres */}
                                <div className='w-full flex flex-wrap gap-2 p-2'>
                                    {tvDetails.genres.map((g, i) => (
                                        <a href={`${process.env.NEXT_PUBLIC_URL}/genre/${g.id}-${g.name.toLowerCase().replaceAll(' ','-')}/tv`} target='_blank' className='px-2 py-1 text-xs hover:bg-white/20 text-center rounded-2xl border-1 border-slate-100  transition-all duration-150' key={g.id}>{g.name}</a>
                                    ))
                                    }
                                </div>

                                {/* description */}
                                <div className='p-2 text-sm'>
                                    {tvDetails.overview}
                                </div>
                            </div>


                            {/* extra info div */}
                            <div className='w-full flex flex-col gap-2 justify-center'>
                                {/* director */}
                                <div className='flex items-center gap-2 border-t-1 border-t-white p-2 py-1 text-sm'>
                                    <span>Director:</span>
                                    {tvDirectors && tvDirectors.length > 0 ? (
                                        tvDirectors.map((director, index) => (
                                            <a className='text-blue-500 hover:underline hover:text-blue-600' href={`${process.env.NEXT_PUBLIC_URL}/person/${director.id}`} target='_blank' key={director.id}>
                                                {director.name}{index < tvDirectors.length - 1 ? ', ' : ''}
                                            </a>
                                        ))
                                    ) : (
                                        <span>No Directors</span>
                                    )}

                                </div>

                                {/* writer */}
                                <div className='flex items-center gap-2 border-t-1 border-t-white p-2 py-1 text-sm'>
                                    <span>Writers:</span>
                                    {tvWriters && tvWriters.length > 0 ? (
                                        tvWriters.map((writer, index) => (
                                            <a className='text-blue-500 hover:underline hover:text-blue-600' href={`${process.env.NEXT_PUBLIC_URL}/person/${writer.id}`} target='_blank' key={writer.id}>
                                                {writer.name}{index < tvWriters.length - 1 ? ', ' : ''}
                                            </a>
                                        ))
                                    ) : (
                                        <span>No Writers</span>
                                    )}
                                </div>

                                {tvDetails.status == 'Released' && (
                                    <div className='border-t-1 border-t-white p-2 py-1 text-sm'>
                                        Release Date: {tvDetails.first_air_date}
                                    </div>
                                )}
                                <div className='border-t-1 border-t-white p-2 py-1 text-sm'>
                                    Rating: {`${tvDetails?.vote_average.toFixed(1)} (${formatNumber(tvDetails.vote_count)})`}
                                </div>
                                <div className='border-t-1 border-t-white p-2 py-1 text-sm'>
                                    Length: {`${tvDetails.number_of_seasons} seasons, ${tvDetails.number_of_episodes} episodes`}
                                </div>


                            </div>




                            {/* OTT providers */}
                            <div className='w-full border-t-1 pt-5'>
                                <h2 className='font-semibold text-2xl mb-2'>OTT Providers:</h2>
                                <div className='w-full h-50 flex flex-row gap-2 justify-start items-center overflow-x-auto handle-scroll border-b-0 border-t-0'>
                                    {tvProvidors && tvProvidors.length != 0 ? (tvProvidors.map((provider, index) =>
                                        <div
                                            className='flex-shrink-0 w-50 flex flex-col justify-center items-center gap-2 border-0 border-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300' key={provider.id}>
                                            {provider.logo_path ? (<img
                                                className='w-full h-25  object-contain' src={`https://image.tmdb.org/t/p/w500${provider?.logo_path}`} alt={provider.name} />) :
                                                (<User className='w-full h-25 font-extralight  border-1 border-white' />)}

                                            <span className='text-center font-bold'>{provider.name}</span>


                                        </div>
                                    )) : (
                                        <div className='py-3'>No providers found</div>
                                    )}

                                </div>
                            </div>


                            {/* casters */}
                            <div className='w-full border-t-1 pt-5'>
                                <div className='w-full flex justify-start items-center gap-2 font-semibold'>
                                    <h2 className=' text-2xl hover:bg-text-700'>Casts:</h2>
                                    {tvCasts?.length != 0 && (<small>{`(${tvCasts.length} total)`}</small>)}
                                </div>

                                <div className='w-full mx-auto flex flex-col md:flex-row md:flex-wrap justify-start items-center space-x-2'>

                                    {tvCasts.slice(0, 20).map((cast, index) =>
                                        <div
                                            className='bg-white/20 md:bg-transparent w-full md:w-2/5 my-2 flex justify-start items-center gap-5  md:hover:bg-white/20 rounded-2xl cursor-default transition-all duration-300'
                                            key={cast.id}
                                        >
                                            {cast.profile_path ? (<a href={`${process.env.NEXT_PUBLIC_URL}/person/${cast?.id}`} target='_blank'>

                                                <img
                                                    className='w-25 h-25 rounded-full border-1 border-white object-cover' src={`https://image.tmdb.org/t/p/w500${cast?.profile_path}`} alt={cast.name} />
                                            </a>) :
                                                (<User className='w-25 h-25 font-extralight  rounded-full border-1 border-white' />

                                                )}

                                            <div className="flex flex-col justify-center items-start">
                                                <a className='text-left font-bold hover:underline' href={`${process.env.NEXT_PUBLIC_URL}/person/${cast?.id}`} target='_blank'>{cast.name}</a>
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
                                        {tvReviews && tvReviews?.length != 0 && (
                                            <small>{`(${tvReviews?.length} total)`}</small>
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
                                        {tvReviews && tvReviews.length > 0 ? (tvReviews.map((review, index) => {
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

                            {/* movie recommendations */}
                            <div className='w-full  flex flex-col gap-2 justify-between border-t-1 pt-5'>
                                <div className='flex items-center border-0 gap-2 font-semibold'>
                                    <h2 className=' text-2xl hover:bg-text-700'>Recommendations</h2>
                                </div>
                                <GetRecommendations mediaId={tvDetails.id} mediaType={'tv'} />
                            </div>
                        </div>
                    </div>

                    {reviewBtn && (
                        <div className="fixed inset-0 bg-black/75 bg-opacity-50 flex justify-center items-center z-20" onClick={() => setreviewBtn(false)}>

                            <div className='w-200 mx-auto'
                                onClick={(e) => e.stopPropagation()}>
                                <CreateNewReview tmdb_id={id} tmdb_rating={tvDetails.vote_average} isFirstReview={isFirstReview} previousReview={tvReviews.find(r => r.author === user.username)} />

                            </div>

                        </div>
                    )}

                </div>
            )}
        </>
    )
}

export default TV
