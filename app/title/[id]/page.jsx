'use client'
import { ArrowRight, ImagesIcon, ListVideo, StarIcon, User } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { formatMinutes, formatNumber } from '@/utils/formatter'

const MovieInfo = () => {

    const { id } = useParams()
    const [Details, setDetails] = useState()
    const [loading, setloading] = useState(false)

    const [movieTrailer, setMovieTrailer] = useState([])
    const [movieCasts, setMovieCasts] = useState([])
    const [movieDirectors, setMovieDirectors] = useState([])
    const [movieWriters, setMovieWriters] = useState([])
    const [movieProvidors, setMovieProvidors] = useState({})

    const [movieVideos, setmovieVideos] = useState([])
    const [moviePictures, setmoviePictures] = useState([])




    const FetchMovieDetails = async () => {
        setloading(true)
        const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZmZhZjVmODE5NGQwNDgxMTUyMGMzYmQxNTcyM2M4NyIsIm5iZiI6MTc1NjM0NzM2Ny4yNTcsInN1YiI6IjY4YWZiYmU3ZjRmOTBjY2Y0ZDYyNGViZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GsKLnV0dmDEJQhcU_u6Vu8KS-ZnOGgIcAxAPvLAYA18'
            }
        };

        fetch(url, options)
            .then(res => res.json())
            .then(json => setDetails(json))
            .catch(err => console.error(err));

        setloading(false)

    }

    const getTrailerLink = async (movieId) => {
        const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZmZhZjVmODE5NGQwNDgxMTUyMGMzYmQxNTcyM2M4NyIsIm5iZiI6MTc1NjM0NzM2Ny4yNTcsInN1YiI6IjY4YWZiYmU3ZjRmOTBjY2Y0ZDYyNGViZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GsKLnV0dmDEJQhcU_u6Vu8KS-ZnOGgIcAxAPvLAYA18'
            }
        };
        try {
            const res = await fetch(url, options);
            const data = await res.json()
            setmovieVideos(data.results)
            const filtered = data.results.filter((i) => i.type == 'Trailer' && i.site == 'YouTube')
            // console.log(data)
            // console.log(filtered)
            setMovieTrailer(filtered)
        } catch (error) {
            console.error(error)
        }
    }
    const getMoviePictures = async (movieId) => {
        const url = `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;
        try {
            const res = await fetch(url);
            const data = await res.json()
            // console.log(data.backdrops)
            setmoviePictures(data.backdrops)
        } catch (error) {
            console.error(error)
        }
    }
    const getDirectors = async (movieId) => {
        const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;
        try {
            const res = await fetch(url);
            const data = await res.json()
            const directors = data.crew.filter((i) => i.job == 'Director')
            const writers = data.crew.filter((i) => i.job == 'Writer')
            // console.log("Directors:",directors)
            // console.log("writers:",writers)
            // console.log("Casters:", data.cast)
            setMovieCasts(data.cast)
            setMovieDirectors(directors)
            setMovieWriters(writers)

        } catch (error) {
            console.error(error)
        }
    }

    const getWatchProviders = async (movieId) => {
        const url = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;
        try {
            const res = await fetch(url);
            const data = await res.json()
            console.log(data.results)
            setMovieProvidors(data.results)

        } catch (error) {
            console.error(error)

        }
    }

    useEffect(() => {
        if (id) {
            FetchMovieDetails()
            getTrailerLink(id)
            getMoviePictures(id)
            getDirectors(id)
            getWatchProviders(id)
        }
    }, [])
    useEffect(() => {
        console.log(Details)
    }, [Details])

    if (loading) {
        return (
            <div className='h-15 bg-slate-900 text-white text-2xl text-center'>
                Loading...
            </div>
        )
    }



    return (
        <>
            {Details && (

                <div className='w-full h-full bg-slate-900 flex p-10'>
                    <div className='w-4/5 p-5 gap-5 flex flex-col border-2 border-blue-500 mx-auto'>
                        <div className='p-5'>
                            <h2 className='text-white text-5xl'>{Details.title}</h2>
                            <div className='flex gap-3 mt-2'>
                                <span className='bg-gray-700 text-center p-2 py-1 text-xs rounded-md'>
                                    {new Date(Details.release_date).getFullYear()}
                                </span>
                                <span className='bg-gray-700 text-center p-2 py-1 text-xs rounded-md'>
                                    {formatMinutes(Details.runtime)}
                                </span>
                            </div>
                        </div>

                        {/* media div */}
                        <div className='w-full flex justify-center items-center'>
                            {/* image div */}
                            <div className='w-1/4'>
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${Details?.poster_path}`}
                                    alt={Details?.title}
                                    className="w-full object-cover"
                                />
                            </div>

                            {/* trailer div */}
                            <div className='w-6/10 h-full'>
                                {movieTrailer.length > 0 && (
                                    <div className='w-full h-full'>
                                        <iframe
                                            className='w-full h-full'

                                            src={`https://www.youtube.com/embed/${movieTrailer[0].key}?autoplay=0&mute=1`}

                                            title={`${Details.original_title} ${movieTrailer[0].name}`}>

                                        </iframe>


                                    </div>
                                )}
                            </div>

                            {/* more photo-video div */}
                            <div className='w-15/100 h-full flex flex-col justify-center items-center'>
                                <button className='w-full h-1/2 p-5 text-md hover:bg-white/20 cursor-pointer rounded-2xl text-white flex flex-col justify-center items-center gap-5'>
                                    <ListVideo />
                                    <span>{`${movieVideos.length > 99 ? "99+" : movieVideos.length}`} Videos</span>
                                </button>
                                <button className='w-full h-1/2 p-5 text-md hover:bg-white/20 cursor-pointer rounded-2xl text-white flex flex-col justify-center items-center gap-5'>
                                    <ImagesIcon />
                                    <span>{`${moviePictures.length > 99 ? "99+" : moviePictures.length}`} Images</span>
                                </button>

                            </div>

                        </div>


                        {/* info div */}
                        <div className='w-full flex flex-col gap-5 justify-center items-start border border-red-600'>

                            {/* genres */}
                            <div className='w-full flex flex-wrap gap-2 p-2'>
                                {Details.genres.map((g, i) => (
                                    <div className='px-2 py-1 text-xs hover:bg-white/20 text-center rounded-2xl border-1 border-slate-100' key={g.id}>{g.name}</div>
                                ))
                                }
                            </div>

                            {/* description */}
                            <div className='p-2 text-sm'>
                                {Details.overview}
                            </div>


                            {/* extra info div */}
                            <div className='w-full flex flex-col gap-2 justify-center'>
                                {/* director */}
                                <div className='border-t-1 border-t-gray-500 p-2 py-1 text-sm'>
                                    Director: {movieDirectors[0]?.name || 'No Directors'}
                                </div>

                                {/* writer */}
                                <div className='space-x-3 border-t-1 border-t-gray-500 p-2 py-1 text-sm'>
                                    Writer: {movieWriters.length > 0 && (
                                        movieWriters.map((w, i) =>
                                        (<a src='youtube.com' key={w.id}>
                                            {w.name}
                                        </a>))
                                    )}
                                </div>

                                {Details.status == 'Released' && (
                                    <div className='border-t-1 border-t-gray-500 p-2 py-1 text-sm'>
                                        Release Date: {Details.release_date}
                                    </div>
                                )}
                                <div className='border-t-1 border-t-gray-500 p-2 py-1 text-sm'>
                                    {`Rating: ${Details.vote_average} (${Details.vote_count})`}
                                </div>
                                <div className='border-t-1 border-t-gray-500 p-2 py-1 text-sm'>
                                    Runtime: {formatMinutes(Details.runtime)}
                                </div>
                                <div className='border-t-1 border-t-gray-500 p-2 py-1 text-sm'>
                                    Budget: {formatNumber(Details.budget)} USD
                                </div>
                                <div className='border-t-1 border-t-gray-500 p-2 py-1 text-sm'>
                                    Revenue: {formatNumber(Details.revenue)} USD
                                </div>

                            </div>




                            {/* OTT providers */}
                            <div className='w-full'>
                                <h2 className='font-semibold text-2xl mb-4'>OTT Providers:</h2>
                                <div className='w-full flex flex-wrap gap-2 justify-start items-center'>
                                    {movieProvidors.IN ? (movieProvidors?.IN?.rent.map((provider, index) =>
                                        <div
                                            className='w-1/4 flex flex-col justify-center items-center gap-2' key={provider.provider_id}>
                                            {provider.logo_path ? (<img
                                                className='w-25 h-25 rounded-full border-2 border-white object-cover' src={`https://image.tmdb.org/t/p/w500${provider?.logo_path}`} alt={provider.provider_name} />) :
                                                (<User className='w-25 h-25 font-extralight  rounded-full border-2 border-white' />)}

                                            <span className='text-center font-bold'>{provider.provider_name}</span>


                                        </div>
                                    )) : (
                                        <span>No Providers found for your location</span>
                                    )}

                                </div>
                            </div>


                            {/* casters */}
                            <div className='w-full'>
                                <h2 className='flex justify-start items-center font-semibold text-2xl mb-4 hover:bg-text-700'>Casts: {movieCasts.length} total <ArrowRight /></h2>
                                <div className='w-full flex flex-wrap justify-start items-center'>

                                    {movieCasts.slice(0, 20).map((cast, index) =>
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
                            <div className='w-full'>
                                <h2 className='flex justify-start items-center font-semibold text-2xl mb-4 hover:bg-text-700'>User Reviews</h2>
                                <div className='text-3xl'>
                                    <StarIcon className='text-yellow-400' /> {`${Details.vote_average} (${Details.vote_count})`}
                                </div>

                            </div>



                        </div>

                    </div>

                </div>
            )}
        </>
    )
}

export default MovieInfo
