'use client'
import React, { useEffect, useState } from 'react'

import { useUserContext } from '../context/contextProvider'
import { Star, Trash2 } from 'lucide-react'
import { formatMinutes, formatNumber } from '@/utils/formatter'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import { removeFromWatchList } from '../handlers/watchlistHandler'
import Footer from '../components/Footer'

const WatchList = () => {

  const context = useUserContext()
  const [watchlist, setWatchlist] = useState()
  const [loading, setLoading] = useState(true)


  const router = useRouter()


  const handleDeleteWatchList = async (mediaId) => {
    const result = await removeFromWatchList(mediaId, context.user.email)
    if (!result) {
      alert("Unable to REMOVE watchlist")
      return
    }
    const newList = watchlist.filter((list) => list.media_id != mediaId)
    setWatchlist(newList)
  }

  const loadMovieInNewTab = async (mediaType, mediaId) => {
    window.open(`${process.env.NEXT_PUBLIC_URL}/${mediaType}/${mediaId}`, '_blank')
  }

  useEffect(() => {
    document.title = 'Watchlist - Movie Master'
  }, [])

  useEffect(() => {
    if (!context || !context.user) {
      // router.push('/login')
      return
    } else {
      setWatchlist(context.watchlist)
      setLoading(false)
    }
  }, [context, context.watchlist])


  if (loading || !watchlist) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-r from-purple-500 via-purple-900 to-purple-500 dark:from-black dark:via-black/90 dark:to-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
        <p className="text-gray-300">Loading Watchlist...</p>
      </div>

    )
  }



  return (
    <>
      <Navbar />
      <div className='w-full min-h-screen bg-gradient-to-r from-purple-500 via-purple-900 to-purple-500 dark:from-black dark:via-black/90 dark:to-black text-white flex flex-col transition-colors duration-500'>
        <h1 className='mx-auto text-center text-4xl font-semibold py-5'>Your Watchlist</h1>
        <div className='w-full lg:w-4/5 mx-auto flex flex-col gap-2 justify-start items-start pb-10 lg:pb-5'>
          {watchlist.map((list, index) => {
            return (
              <div className='flex flex-col gap-4 p-3 rounded-lg hover:bg-white/10 justify-start lg:h-70 w-full border-1' key={list.media_id}>
                <div className='h-4/5 flex items-start'>

                  <a className='min-w-40' href={`${process.env.NEXT_PUBLIC_URL}/${list.media_type}/${list.media_id}`} target='_blank'>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${list.media_data?.poster_path}`}
                      alt={list.media_data?.title || list.media_data?.name}
                      className='h-50 w-full object-cover cursor-pointer'
                      onClick={() => { loadMovieInNewTab(list.media_type, list.media_id) }}
                    />
                  </a>

                  <div className='h-full w-full flex flex-col gap-2 text-left px-3 py-4'>
                    <a href={`${process.env.NEXT_PUBLIC_URL}/${list.media_type}/${list.media_id}`} target='_blank'>
                      <h2 className='text-2xl font-semibold'>{index + 1}. {list.media_data?.title || list.media_data?.name}</h2>
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
                        {`${list.media_type == 'movie' ? formatMinutes(list.media_data.runtime) : `${list.media_data.number_of_seasons} seasons`}`}
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
          })}
        </div>

      </div>
      <Footer/>
    </>
  )
}

export default WatchList
