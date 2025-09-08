"use client"
import { Star } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import { searchMediaByQuery } from '../handlers/mediaHandler'


const ShowSearchResults = () => {

    const [searchResult, setSearchResult] = useState(null)
    const inputRef = useRef(null);

    async function loadMovieDetails(movieId, mediaType) {
        window.open(`${process.env.NEXT_PUBLIC_URL}/${mediaType}/${movieId}`, '_blank')
    }

    const searchMovie = async (input) => {
        const result = await searchMediaByQuery(input)
        if (!result) {
            return
        }
        // console.warn(result)
        setSearchResult(result)

    }

    React.useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, []);

    return (
        <div className='w-full border-0 border-blue-600 rounded-lg rounded-t-none'>
            <div>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder='search something...'
                    className='w-full px-2 py-3 bg-white/10 text-white focus:outline-none transition-all mx-auto text-xl pl-5'
                    onChange={(e) => { searchMovie(e.target.value) }}
                />
            </div>
            {searchResult && searchResult.length == 0 ? (
                <div className='w-full h-30 flex justify-center items-center'>
                    <h2 className='text-center text-lg'>No results found!</h2>
                </div>
            ) : (

                <div className='w-full max-h-75 overflow-y-auto handle-scroll'>
                    {searchResult && searchResult.map((r) => (
                        <div key={r.id} className=' ml-5 py-2 h-30 flex justify-start items-start gap-2 cursor-pointer hover:bg-white/5 transition-all delay-75 duration-150'
                            onClick={() => { loadMovieDetails(r.id, r.media_type) }}>
                            <img className='h-full text-wrap max-w-[500px]' src={`https://image.tmdb.org/t/p/w500${r?.poster_path}`} alt={'poster'} />
                            <div className='flex flex-col px-2'>
                                <h2 className='text-left'>{r.name || r.title}</h2>
                                <small>{new Date(r.
                                    release_date || r.first_air_date).getFullYear()}</small>
                                <span className='flex items-center gap-1'>
                                    <small><Star size={10} className='text-yellow-400 fill-current' /></small>
                                    <small> {r.vote_average.toFixed(1)}</small>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )

}

export default ShowSearchResults
