'use client'
import Navbar from '@/app/components/Navbar';
import { getMediaByGenre } from '@/app/handlers/mediaHandler';
import { Star } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Genre = () => {

    const { id, type } = useParams();

    const [loading, setloading] = useState(true);
    const [media, setMedia] = useState([]);
    const [totalResults, setTotalResults] = useState(0);

    const loadMediaByGenre = async () => {
        setloading(true);
        const output = await getMediaByGenre(id, type)
        // console.log(output)
        setMedia(output.results);
        setTotalResults(output.total_results);
        setloading(false);
    }

    const handleSortBy = (e) => {
        const sortBy = e.target.value;
        const sortedMedia = [...media];
        switch (sortBy) {
            case "popularity.desc":
                sortedMedia.sort((a, b) => b.popularity - a.popularity);
                break;
            case "popularity.asc":
                sortedMedia.sort((a, b) => a.popularity - b.popularity);
                break;
            case "release_date.desc":
                sortedMedia.sort((a, b) => new Date(b.release_date || b.first_air_date) - new Date(a.release_date || a.first_air_date));
                break;
            case "release_date.asc":
                sortedMedia.sort((a, b) => new Date(a.release_date || a.first_air_date) - new Date(b.release_date || b.first_air_date));
                break;
            case "vote_average.desc":
                sortedMedia.sort((a, b) => b.vote_average - a.vote_average);
                break;
            case "vote_average.asc":
                sortedMedia.sort((a, b) => a.vote_average - b.vote_average);
                break;
            default:
                break;
        }
        setMedia(sortedMedia);
    }

    useEffect(() => {
        loadMediaByGenre();
        document.title = `${id.split('-')[1][0].toUpperCase() + id.split('-')[1].slice(1,)} - Movie Master`

    }, [id, type])

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-r from-purple-500 via-purple-900 to-purple-500 dark:from-black dark:via-black/90 dark:to-black">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p className="text-gray-300">Loading media...</p>
                </div>
            </>
        )
    }

    if (!media || media.length === 0) {
        return (
            <div className='w-full h-screen bg-gradient-to-r from-purple-500 via-purple-900 to-purple-500 dark:from-black dark:via-black/90 dark:to-black flex flex-col justify-center items-center text-white'>
                <h1 className='text-3xl font-bold p-4'>No media found for this genre.</h1>
            </div>
        )
    }


    return (
        <>
            <Navbar />
            <div className='w-full h-full bg-gradient-to-r from-purple-500 via-purple-900 to-purple-500 dark:from-black dark:via-black/90 dark:to-black flex flex-col py-10 text-white transition-colors duration-500 space-y-3'>
                <div className='w-full flex justify-between items-center px-5 pb-2 md:pb-0 border-b-1 border-white/50'>
                    <h1 className='text-3xl font-bold p-2'>{`${id.split('-')[1][0].toUpperCase() + id.split('-')[1].slice(1,)}`}</h1>
                    <span className='text-sm font-semibold'>{totalResults} results</span>
                </div>
                <div className='w-full flex justify-center items-center'>
                    <select name="type" id="type" className='blur-1 text-white p-2 rounded-lg border-1 border-slate-300/10 hover:bg-white/20 transition-all duration-150 cursor-pointer' defaultValue={type} onChange={(e) => {
                        window.location.href = `${process.env.NEXT_PUBLIC_URL}/genre/${id}/${e.target.value}`
                    }}>
                        <option className='text-purple-600 dark:text-black hover:bg-red-500' value={type}>{type}</option>
                        <option className='text-purple-600 dark:text-black hover:bg-red-500' value={type == 'movie' ? 'tv' : 'movie'}>{type == 'movie' ? 'tv' : 'movie'}</option>
                    </select>

                    <select name="sort-by" id="sort-by" className='blur-1 text-white p-2 rounded-lg border-1 border-slate-300/10 hover:bg-white/20 transition-all duration-150 cursor-pointer ml-5' defaultValue="popularity.desc" onChange={(e) => { handleSortBy(e) }}>
                        <option className='text-purple-600 dark:text-black hover:bg-red-500' value="popularity.desc">Sort by: Popularity(Decs)</option>
                        <option className='text-purple-600 dark:text-black hover:bg-red-500' value="popularity.asc">Sort by: Popularity(Asc)</option>
                        <option className='text-purple-600 dark:text-black hover:bg-red-500' value="release_date.desc">Sort by: Release Date(Desc)</option>
                        <option className='text-purple-600 dark:text-black hover:bg-red-500' value="release_date.asc">Sort by: Release Date(Asc)</option>
                        <option className='text-purple-600 dark:text-black hover:bg-red-500' value="vote_average.desc">Sort by: Ratings(Desc)</option>
                        <option className='text-purple-600 dark:text-black hover:bg-red-500' value="vote_average.asc">Sort by: Ratings(Asc)</option>

                    </select>
                </div>
                <div className='w-full h-full flex flex-col gap-4 px-10 p-4 border-t-1 border-slate-300/10'>
                    {media.map((m, i) => (
                        <div key={m.id} className='w-full flex flex-col md:flex-row justify-center md:justify-start items-center gap-3 px-5 md:px-1 py-1 hover:bg-white/10 rounded-lg transition-all duration-150 bg-white/10 dark:bg-white/5'>
                            <a href={`${process.env.NEXT_PUBLIC_URL}/${type}/${m.id}`} target='_blank' className='hover:underline w-30 h-full min-w-30'>
                                <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} alt={m.title || m.name} className='w-full rounded-lg object-cover' />
                            </a>
                            <div className='flex flex-col justify-center items-center md:items-start gap-2 pb-2 md:py-5'>
                                <a href={`${process.env.NEXT_PUBLIC_URL}/${type}/${m.id}`} target='_blank' className='hover:underline'>
                                    <h2 className='text-lg font-bold'>{m.title || m.name}</h2>
                                </a>
                                <p className='text-sm flex items-center gap-1'>
                                    <span><Star size={15} className='text-yellow-400 fill-current' /></span>
                                    <span>{m?.vote_average.toFixed(1)}</span>
                                </p>
                                <p className='text-sm text-gray-300'>{m.release_date || m.first_air_date}</p>
                                <p className='text-sm md:hidden'>{`${m?.overview.length > 130 ? m?.overview.slice(0, 130) + '.....' : m?.overview}`}</p>
                                <p className='text-sm hidden md:block'>{m.overview}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Genre
