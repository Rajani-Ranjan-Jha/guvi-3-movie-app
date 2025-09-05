"use client"
import { Star } from 'lucide-react'
import React from 'react'


const ShowSearchResults = ({ result}) => {


    async function loadMovieDetails(movieId,mediaType) {
        window.open(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/${mediaType}/${movieId}`, '_blank')
    }

    if ( result && result.length != 0) {
        return (
            <div className='w-full pl-5 blur-1 absolute top-10 z-20 h-50 overflow-y-auto handle-scroll border-1 border-t-0 rounded-lg rounded-t-none'>
                {result.map((r) => (
                    
                    <div key={r.id} className='w-full py-2 h-30 flex justify-start items-start cursor-pointer hover:bg-white/10 rounded-md transition-all delay-75 duration-150'
                        onClick={() => { loadMovieDetails(r.id,r.media_type) }}>
                        <img className='h-full' src={`https://image.tmdb.org/t/p/w500${r?.poster_path}`} alt={r.name || r.title} />
                        <div className='flex flex-col px-2'>
                            <h2 className='text-center'>{r.name || r.title}</h2>
                            <small>{new Date(r.
                                release_date || r.first_air_date).getFullYear()}</small>
                            <span className='flex items-center gap-1'>
                                <small><Star size={10} className='text-yellow-400 fill-current' /></small>
                                <small> {r.vote_average}</small>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}

export default ShowSearchResults
