'use client'
import React, { useEffect, useState } from 'react'
import { getWatchList, removeFromWatchList } from '../components/action'
import { useUserContext } from '../context/contextProvider'
import { Star, Trash2 } from 'lucide-react'
import { formatMinutes, formatNumber } from '@/utils/formatter'

const WatchList = () => {

  const context = useUserContext()
  const [watchlist, setWatchlist] = useState()
  const [movieCasts, setMovieCasts] = useState()
  const [movieDirectors, setMovieDirectors] = useState()
  const [movieWriters, setMovieWriters] = useState()

  


  const loadWatchListMovies = async (email) => {
    const result = await getWatchList(email, watchlist, setWatchlist)
    if (!result) {
      alert("Unable to get watchlist")
      return
    }
  }

  // const loadMovieCasts = async (movieId) => {
  //   const result = await getMovieCasts(movieId)
  //   if (!result) {
  //     alert("Unable to get movie casts")
  //     return
  //   }
  //   setMovieCasts(result.casts)
  //   setMovieDirectors(result.directors)
  //   setMovieWriters(result.writers)
  // }

  const handleDeleteWatchList = async (mediaId) => {
    const result = await removeFromWatchList(mediaId, context.user.email)
    if (!result) {
      alert("Unable to REMOVE watchlist")
      return
    }
    const newList = watchlist.filter((list) => list.media_id != mediaId)
    setWatchlist(newList)
  }

  const loadMovieInNewTab = async (movieId) => {
    window.open(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/movie/${movieId}`, '_blank')
  }

  useEffect(() => {
    if (context && context.user) {
      // console.log(context.user)
      loadWatchListMovies(context.user.email)
    }
  }, [])

  useEffect(() => {
    if (watchlist && watchlist.length != 0) {

    }
  }, [watchlist])


  return (
    <div className='w-full h-full bg-indigo-900 text-white flex flex-col'>
      <h1 className='mx-auto text-center text-4xl py-5'>Your Watchlist</h1>
      <div className='w-4/5 h-auto mx-auto border-2 border-red-600 flex flex-col gap-2 justify-start items-start'>
        {watchlist && watchlist.length !== 0 ? (
          watchlist.map((list, index) => {
            // We cannot call async function directly inside map, so we use useEffect or handle it differently
            // Here, we will just render the UI and assume media_data is already populated
            return (
              <div className='flex flex-col p-3 rounded-2xl hover:bg-white/10 justify-start h-70 w-full border-1' key={list.media_id}>
                <div className='h-4/5 flex items-start'>

                  <img
                    src={`https://image.tmdb.org/t/p/w500${list.media_data?.poster_path}`}
                    alt={list.media_data?.title || list.media_data?.name}
                    className='h-50 object-cover cursor-pointer'
                    onClick={() => {loadMovieInNewTab(list.media_id)}}
                  />

                  <div className='h-full w-full flex flex-col gap-2 text-left px-3 py-4'>
                    <a href={`http://localhost:${process.env.NEXT_PUBLIC_PORT}/${list.media_type}/${list.media_id}`} target='_blank'>
                      <h2 className=''>{index + 1}. {list.media_data?.title || list.media_data?.name}</h2>
                    </a>
                    <div className='w-full flex flex-wrap gap-2'>
                      {list.media_data.genres?.map((g) => (
                        <div
                          className='px-2 py-1 text-xs hover:bg-white/20 text-center rounded-2xl border-1 border-slate-100 cursor-default'
                          key={g.id}
                        >
                          {g.name}
                        </div>
                      ))}
                    </div>
                    <div className='w-full flex gap-3 mt-2'>
                      <span className='cursor-defualt border-1 text-center p-2 py-1 text-xs rounded-md'>
                        {new Date(list.media_data?.release_date || list.media_data.first_air_date).getFullYear()}
                      </span>
                      <span className='cursor-defualt border-1 text-center p-2 py-1 text-xs rounded-md'>
                        {/* {formatMinutes(list.media_data.runtime)} */} RUNTIME
                      </span>
                    </div>
                    <div className='flex items-center w-full text-sm'>
                      <Star size={12} className='text-yellow-400 fill-current' />
                      <span>
                        {`${list.media_data.vote_average.toFixed(2)}(${formatNumber(list.media_data.vote_count)})`}
                      </span>
                    </div>
                  </div>
                  <button
                    className='text-white mx-5 p-2 hover:bg-white/20 cursor-pointer rounded-lg'
                    onClick={() => {
                      handleDeleteWatchList(list.media_id);
                    }}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className=''>
                  <p className='text-sm cursor-default'>{list.media_data.overview}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div>No watchlist found!</div>
        )

        }

      </div>

    </div>
  )
}

export default WatchList
