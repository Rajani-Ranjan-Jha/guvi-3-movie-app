'use client'
import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function About() {
  useEffect(() => {
    document.title = 'About - Movie Master'
  }, [])

  return (
    <>
      <Navbar />
      <div className='w-full min-h-screen text-white bg-gradient-to-r from-purple-500 via-purple-900 to-purple-500 dark:from-black dark:via-black/90 dark:to-black flex flex-col items-center justify-center gap-5 text-center text-lg'>
        <div className='w-full flex justify-center items-center gap-2'>
          <h2 className="mt-5 lg:mt-0 flex items-center justify-center text-5xl font-semibold text-white"> About </h2>
        </div>
        <div className=' w-full lg:w-4/5 p-5 flex flex-col items-start  justify-start gap-2 text-left'>
          <h2 className='text-2xl font-semibold'>What ?</h2>
          <p className='font-normal'>Movie Master is a comprehensive platform dedicated to movies and TV shows, offering users a curated collection of films and series from around the world. Discovery is made seamless and engaging through detailed information of content, showing casts, writers, rating, reviews, etc. User can add their reviews, store the content in their watchlist.</p>
        </div>
        <div className=' w-full lg:w-4/5 p-5 flex flex-col items-start justify-start gap-2 text-left'>
          <h2 className='text-2xl font-semibold'>Why ?</h2>
          <p className='font-normal'>With thousands of movies and TV shows released annually, finding content that matches your tastes can be overwhelming. Movie Master is developed to streamline this experience, providing organized categories, user reviews, and personalized watchlists to help enthusiasts discover cinematic gems they might otherwise miss.</p>
        </div>
        <div className=' w-full lg:w-4/5 p-5 flex flex-col items-start  justify-start gap-2 text-left'>
          <h2 className='text-2xl font-semibold'>Who ?</h2>
          <p className='font-normal'><a className='underline' href="https://rajani-ranjan-jha.vercel.app/" target='_blank'>Rajani Ranjan Jha</a> (me), an enthusiastic developer from IIT Patna, is the creator and maintainer of Movie Master. His passion for film and knowledge of web-technology shines through in this project, which aims to enrich the entertainment journey for movie lovers and TV enthusiasts alike.</p>
        </div>
      </div>
      <Footer/>
    </>
  )
}
