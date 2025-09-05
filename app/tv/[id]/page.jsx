'use client'
import { ArrowRight, BookmarkCheck, BookmarkPlus, ChevronRight, ImagesIcon, ListVideo, Plus, StarIcon, User } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

import { formatMinutes, formatCurrency } from '@/utils/formatter'
import CreateNewReview from '@/app/components/CreateNewReview'
import { addToWatchList, removeFromWatchList } from '@/app/components/action'
import { useUserContext } from '@/app/context/contextProvider'
import { getMediaById, getMediaCredits, getMediaPictures, getMediaReviews, getMediaVideos, getMediaWatchProviders } from '@/app/handlers/movieDetails'

const TV = () => {

    // lorem
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
            return
        }
        setUser(context.user)
        // console.warn(context)
        const watchlist = context.watchlist
        // console.log(watchlist, id)
        watchlist.find((list) => list.media_id == id) ? setIsAlreadyInWatchlist(true) : setIsAlreadyInWatchlist(false)
    }

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

    const loadTvWatchProviders = async (tvId) => {
        const output = await getMediaWatchProviders(tvId, 'tv')
        //console.log(output)
        // setTvProvidors(output)


    }

    const loadTvReviews = async (tvId) => {
        const output = await getMediaReviews(tvId, 'tv')
        //console.log(output)
        setTvReviews(output)

    }

    //lorem
    const addMovieInfoToDB = async (tvId) => {
        try {
            const reviews = await getMediaReviews(tvId, 'tv');
            if (!reviews || reviews.length === 0) {
                console.warn("No reviews fetched from TMDB to add to DB");
                // return [];
                return null;
            }
            const req = await fetch('/api/movie/load', {
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
            console.warn("Added to the local db:", reviews)
            return await loadMovieReviewsFromDB(tvId)
        } catch (error) {
            console.error(error)
            return [];
        }
    }

    const loadMovieReviewsFromDB = async (tvId) => {
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
                const added = await addMovieInfoToDB(tvId)
                if (!added) {
                    setLoadingReviews(false)
                    return
                }
                // return;
            }
            console.warn("got the reviews", res.reviews)
            setTvReviews(res.reviews)
            setLoadingReviews(false)
        } catch (error) {
            console.error(error)
            setLoadingReviews(false)
        }
    }

    const handleAddRemoveWatchList = async (tvId) => {
        const result = isAlreadyInWatchlist ? await removeFromWatchList(tvId, user.email) : await addToWatchList(tvId, 'tv', user.email)
        if (!result) {
            alert("Failded to add watchlist")
            return
        }
        // alert('ADDED TO WATCHLIST!')
        setIsAlreadyInWatchlist(!isAlreadyInWatchlist)
    }




    useEffect(() => {
        if (id) {
            loadUserfromContext()
            loadTvDetails(id)
            loadTvVideos(id)
            loadTvPictures(id)
            loadTvCredits(id)
            loadTvWatchProviders(id)
            // loadTvReviews(id)
        }
    }, [])

    useEffect(() => {//lorem
        console.log(tvDetails)
        if (!tvDetails || tvDetails.length === 0) {
            // console.warn("dont have movie details right now")
            return
        }
        setTvProvidors(tvDetails.networks)

        loadMovieReviewsFromDB(id)


    }, [tvDetails])

    useEffect(() => {//lorem
        if (tvReviews && user.username) {
            const hasUserReview = tvReviews.some(review => review.author === user.username);
            setIsFirstReview(!hasUserReview);
        }
    }, [tvReviews, user.username]);




    const renderReviews = useCallback((review, index) => {
        return (
            <div key={review.id || index} className='w-50 flex-shrink-0 flex-col items-start bg-gray-800 border border-gray-600 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-200'>
                <div className='flex items-center mb-2 space-x-2'>
                    <StarIcon size={15} className="text-yellow-400 fill-current" />
                    <span className='text-sm font-medium text-white'>{review.rating} {`${review.author} ${review.author == user.username ? '(you)' : ''}`}</span>
                </div>
                <p className='clamp-3 text-xs text-white max-w-full'>{`${review.content.length > 150 ? review.content.substring(0, 150) + '...' : review.content}`}</p>
            </div>
        );
    }, [user.username]);

    if (loading) {
        return (
            <div className='h-15 bg-slate-900 text-white text-2xl text-center'>
                Loading...
            </div>
        )
    }



    return (
        <>
            {tvDetails && (
                <div className='relative w-full h-full bg-slate-900 flex p-10'>
                    <div className='w-4/5 p-5 gap-5 flex flex-col border-2 border-blue-500 mx-auto'>
                        <div className='p-5'>
                            <div className='w-full flex justify-between items-center'>
                                <h2 className='text-white text-5xl'>{tvDetails.name}</h2>
                                <button id='watchlist-btn' className='flex items-center gap-1 px-2 py-2 hover:bg-white/20 cursor-pointer text-sm rounded-lg'
                                    onClick={() => { handleAddRemoveWatchList(tvDetails.id) }}>
                                    {isAlreadyInWatchlist ? (
                                        <>
                                            <span><BookmarkCheck /></span>
                                            <span>Remove from Watchlist</span>
                                        </>
                                    ) : (
                                        <>
                                            <span><BookmarkPlus /></span>
                                            <span>Add to Watchlist</span>
                                        </>
                                    )}

                                </button>
                            </div>
                            <div className='flex gap-3 mt-2'>
                                <span className='bg-gray-700 text-center p-2 py-1 text-xs rounded-md'>
                                    {new Date(tvDetails.first_air_date).getFullYear()}
                                </span>
                                <span className='bg-gray-700 text-center p-2 py-1 text-xs rounded-md'>
                                    {`${tvDetails.number_of_seasons} seasons`}
                                </span>
                            </div>
                        </div>

                        {/* media div */}
                        <div className='w-full flex justify-center items-center'>
                            {/* image div */}
                            <div className='w-1/4'>
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${tvDetails?.poster_path}`}
                                    alt={tvDetails?.name}
                                    className="w-full object-cover"
                                />
                            </div>

                            {/* trailer div */}
                            <div className='w-6/10 h-full'>
                                {tvTrailer.length > 0 && (
                                    <div className='w-full h-full'>
                                        <iframe
                                            className='w-full h-full'

                                            src={`https://www.youtube.com/embed/${tvTrailer[0].key}?autoplay=0&mute=1`}

                                            title={`${tvDetails.name} ${tvTrailer[0].name}`}>

                                        </iframe>


                                    </div>
                                )}
                            </div>

                            {/* more photo-video div */}
                            <div className='w-15/100 h-full flex flex-col justify-center items-center'>
                                <button className='w-full h-1/2 p-5 text-md hover:bg-white/20 cursor-pointer rounded-2xl text-white flex flex-col justify-center items-center gap-5'>
                                    <ListVideo />
                                    <span>{`${tvVideos.length > 99 ? "99+" : tvVideos.length}`} Videos</span>
                                </button>
                                <button className='w-full h-1/2 p-5 text-md hover:bg-white/20 cursor-pointer rounded-2xl text-white flex flex-col justify-center items-center gap-5'>
                                    <ImagesIcon />
                                    <span>{`${tvPictures.length > 99 ? "99+" : tvPictures.length}`} Images</span>
                                </button>

                            </div>

                        </div>


                        {/* info div */}
                        <div className='w-full flex flex-col gap-5 justify-center items-start border border-red-600'>

                            {/* genres */}
                            <div className='w-full flex flex-wrap gap-2 p-2'>
                                {tvDetails.genres.map((g, i) => (
                                    <div className='px-2 py-1 text-xs hover:bg-white/20 text-center rounded-2xl border-1 border-slate-100' key={g.id}>{g.name}</div>
                                ))
                                }
                            </div>

                            {/* description */}
                            <div className='p-2 text-sm'>
                                {tvDetails.overview}
                            </div>


                            {/* extra info div */}
                            <div className='w-full flex flex-col gap-2 justify-center'>
                                {/* director */}
                                <div className='border-t-1 border-t-gray-500 p-2 py-1 text-sm'>
                                    Director: {tvDirectors[0]?.name || 'Not Found'}
                                </div>

                                {/* writer */}
                                <div className='space-x-3 border-t-1 border-t-gray-500 p-2 py-1 text-sm'>
                                    Writer: {tvWriters.length > 0 ? (
                                        tvWriters.map((w, i) =>
                                        (<span key={w.id}>
                                            {w.name}
                                        </span>))
                                    ) : (
                                        <span> Not Found</span>
                                    )}
                                </div>

                                {tvDetails.status == 'Released' && (
                                    <div className='border-t-1 border-t-gray-500 p-2 py-1 text-sm'>
                                        Release Date: {tvDetails.first_air_date}
                                    </div>
                                )}
                                <div className='border-t-1 border-t-gray-500 p-2 py-1 text-sm'>
                                    {`Rating: ${tvDetails.vote_average} (${tvDetails.vote_count})`}
                                </div>
                                <div className='border-t-1 border-t-gray-500 p-2 py-1 text-sm'>
                                    Length: {`${tvDetails.number_of_seasons} seasons, ${tvDetails.number_of_episodes} episodes`}
                                </div>


                            </div>




                            {/* OTT providers */}
                            <div className='w-full'>
                                <h2 className='font-semibold text-2xl mb-2'>OTT Providers:</h2>
                                <div className='w-full h-50 flex flex-row gap-2 justify-start items-center overflow-x-auto handle-scroll border-b-1 border-t-1'>
                                    {tvProvidors && tvProvidors.length != 0 ? (tvProvidors.map((provider, index) =>
                                        <div
                                            className='flex-shrink-0 w-50 flex flex-col justify-center items-center gap-0 border-1 border-white px-4 py-2 rounded-lg hover:bg-white/20' key={provider.id}>
                                            {provider.logo_path ? (<img
                                                className='w-full h-25  object-contain' src={`https://image.tmdb.org/t/p/w500${provider?.logo_path}`} alt={provider.name} />) :
                                                (<User className='w-25 h-25 font-extralight  rounded-full border-1 border-white' />)}

                                            <span className='text-center font-bold'>{provider.name}</span>


                                        </div>
                                    )) : (
                                        <span>No Providers found!</span>
                                    )}

                                </div>
                            </div>


                            {/* casters */}
                            <div className='w-full'>
                                <h2 className='flex justify-start items-center font-semibold text-2xl mb-4 hover:bg-text-700'>Casts: {tvCasts.length} total <ArrowRight /></h2>
                                <div className='w-full flex flex-wrap justify-start items-center'>

                                    {tvCasts.slice(0, 20).map((cast, index) =>
                                        <div
                                            className='w-1/2 my-2 flex justify-start items-center gap-5  hover:bg-white/20 rounded-2xl cursor-default transition-all delay-100 duration-100'
                                            key={cast.id}
                                        >
                                            {cast.profile_path ? (<img
                                                className='w-25 h-25 rounded-full border-1 border-white object-cover' src={`https://image.tmdb.org/t/p/w500${cast?.profile_path}`} alt={cast.name} />) :
                                                (<User className='w-25 h-25 font-extralight  rounded-full border-1 border-white' />

                                                )}

                                            <div className="flex flex-col justify-center items-start">
                                                <span className='text-center font-bold'>{cast.name}</span>
                                                <span className='text-center text-xs'>{cast.character.split('(')[0]}</span>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            </div>


                            {/* user reviews */}
                            <div className='w-full flex flex-col gap-2 justify-between'>
                                <div className='flex justify-between items-center'>
                                    <div className='flex items-center'>
                                        <h2 className='font-semibold text-2xl hover:bg-text-700'>User reviews</h2>
                                        <small className='ml-3'>{tvReviews?.length || '0'}</small>
                                        <span>
                                            <ChevronRight size={35} />
                                        </span>
                                    </div>
                                    <button className='flex items-center text-sm text-blue-500 px-2 py-1 rounded-md hover:bg-blue-500/20 cursor-pointer'
                                        onClick={() => setreviewBtn(true)}>
                                        <Plus className='text-sm mr-1' size={15} /> {`${isFirstReview ? 'review' : 'update'}`}
                                    </button>
                                </div>
                                <div className='flex flex-col justify-center items-start gap-2 text-3xl py-2'>
                                    <div className='flex items-center gap-2'>
                                        <StarIcon size={35} className="text-yellow-400 fill-current" />
                                        <span>
                                            {`${tvDetails.vote_average.toFixed(2)}`}
                                        </span>
                                        <small className='text-xs'>
                                            {tvDetails.vote_count}
                                        </small>
                                    </div>
                                </div>
                                <div className='flex flex-col items-start'>
                                    <h1 className="text-xl font-semibold mb-2">Featured reviews</h1>
                                    <div className='w-full h-52 flex flex-row space-x-4 overflow-x-auto handle-scroll px-2 py-2'>
                                        {tvReviews && tvReviews.length > 0 ? (tvReviews.map((review, index) => {
                                            return renderReviews(review, index)
                                        }))
                                            : ((LoadingReviews ? (
                                                <p className='mx-auto text-white'>
                                                    Loading reviews...
                                                </p>)
                                                : (<p className='mx-auto text-white'>
                                                    No review available
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
