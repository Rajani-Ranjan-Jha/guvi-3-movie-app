'use client'
import React, {useEffect, useState, useRef } from 'react'
import { ChevronUp, ChevronDown, X, XIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

import { useUserContext } from '../context/contextProvider'
import ShowSearchResults from './Search'


const Navbar = () => {
  const context = useUserContext()
  const router = useRouter()
  const [user, setUser] = useState()


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [openSearchbar, setOpenSearchbar] = useState(false);
  const currentSite = usePathname()


   // Theme state and logic
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'light';
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.className = theme;
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    if (context.user) {
      // console.warn("have user");
      setUser(context.user);
      setIsLoggedIn(true);
    } else {
      // console.warn("No user");
      setUser(null);
      setIsLoggedIn(false);
    }
  }, [context.user]);







  const toggleMenu = () => {
    setIsOpen(!isOpen);
    isDropDownOpen ? setIsDropDownOpen(false) : null
  };

  // Function to toggle theme
  const toggleTheme = () => {
    // console.log(theme)
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen)
  }

  const handleLogOut = async () => {
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }



  return (
    <nav className={` w-full px-4 py-1 bg-purple-700 dark:bg-black text-white dark:text-white transition-all duration-500 border-b-1`}>
      <div className='flex items-center justify-between '>
        <div className='font-semibold text-3xl lg:text-4xl py-3'>
          <Link href={'/'}>Movie Master</Link>
        </div>


        <div className='block lg:hidden transition-all duration-300 ease-in-out'>
          <button onClick={toggleMenu} aria-label="Toggle menu" className="focus:outline-none transition-all duration-300 ease-in-out">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        <div className='relative lg:w-100 hidden lg:flex flex-col'>
          <input type="text" placeholder='What are you lookng for?' className='w-full px-2 py-3 bg-transparent text-white focus:outline-none border-1 focus:shadow-sm focus:border-2 shadow-white rounded-md transition-all mx-auto cursor-pointer'
            onClick={() => { setOpenSearchbar(true) }} />
        </div>

        <div id='nav-holder' className={`w-full lg:w-auto absolute lg:static lg:flex-row lg:flex lg:items-center lg:gap-0 blur-1 lg:bg-transparent left-0 lg:left-auto top-17 lg:top-auto transition-all duration-200 ease-in-out ${isOpen ? 'flex flex-col items-center z-50 bg-purple-600 dark:bg-black' : 'hidden'} border-b-1 lg:border-0`}>

          <div  className=' relative w-100 lg:hidden flex flex-col'>
            <input type="text" placeholder='What are you lookng for?' className='w-full px-2 py-3 bg-transparent text-white focus:outline-none border-1 focus:shadow-sm focus:border-2 shadow-white rounded-md transition-all mx-auto cursor-pointer'
              onClick={() => { 
                setIsOpen(false)
                setOpenSearchbar(true) }} />
          </div>
          <Link onClick={toggleMenu} href="/" className='block lg:inline-block px-2 mx-auto py-3 rounded-lg font-semibold cursor-pointer hover:bg-white/20 '>Home</Link>
          <Link onClick={toggleMenu} href="/about" className='block lg:inline-block px-2 mx-auto py-3 rounded-lg font-semibold cursor-pointer hover:bg-white/20 '>About</Link>


          {theme === 'dark' ? (
            // Sun SVG for light theme
            <button onClick={toggleTheme} className={`p-3 hover:bg-white/20 rounded-md `}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-sun" viewBox="0 0 16 16">
                <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708" />
              </svg>
            </button>

          ) : (
            // Moon SVG for dark theme
            <button onClick={toggleTheme} className={`p-3 hover:bg-white/20 rounded-md `}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-moon" viewBox="0 0 16 16">
                <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286" />
              </svg>
            </button>

          )}

          {isLoggedIn ? (
            <div className='relative hover:rounded-lg hover:bg-white/20 transition-all duration-200'>
              <button className={`${isDropDownOpen ? "lg:border-1 border-b-0 rounded-lg rounded-b-none" : ""} cursor-pointer min-w-30 px-4 mx-auto py-3 flex justify-around font-semibold capitalize`} onClick={toggleDropDown}>
                <span className=''>{user?.username || user?.name || 'NULL'}</span>
                <span className=''>{isDropDownOpen ? <ChevronUp /> : <ChevronDown />}</span>
              </button>
              <ul id='dropdown-content' className={`w-full lg:absolute lg:border-1 border-t-0 font-semibold lg:bg-purple-600 lg:dark:bg-black z-50 rounded-b-lg py-2 px-1 space-y-1 top-12 ${isDropDownOpen ? "block" : "hidden"}`}>
                {(currentSite !== '/watchlist' &&
                  <li className='flex'>
                    <Link onClick={toggleDropDown} href={'/watchlist'} className='w-full px-4 py-2 rounded-lg lg:hover:bg-white/20 text-white text-center cursor-pointer'>Watchlist</Link>
                  </li>
                )}
                <li className='flex'>
                  <button onClick={handleLogOut} className='w-full px-4 py-2 rounded-lg lg:hover:bg-white/20 text-white cursor-pointer'>Logout</button>
                </li>
              </ul>
            </div>

          ) : (
            <div className={`min-w-36 flex ${isOpen ? 'flex-col gap-2' : 'flex-row'} justify-center items-center gap-0 relative rounded-2xl`}>
              <button className='cursor-pointer flex justify-around'>
                <Link href="/register" className='w-full lg:mr-1 px-4 py-3 rounded-lg font-semibold hover:bg-white/20 text-center cursor-pointer '>Register</Link>
              </button>
              <button className='cursor-pointer flex justify-around'>
                <Link href="/login" className='w-full px-4 py-3 rounded-lg font-semibold bg-white text-purple-600 dark:text-black hover:bg-white/80 text-center cursor-pointer '>Login</Link>
              </button>
            </div>

          )}

        </div>

{/* searchbar component */}
        {openSearchbar && (
          <div className="fixed w-screen h-screen inset-0 bg-black/70 bg-opacity-50 flex justify-center lg:items-center z-20" onClick={() => setOpenSearchbar(false)}>
            <div className='w-full lg:w-200 h-100 mx-auto border-1 blur-1 rounded-lg'
              onClick={(e) => e.stopPropagation()}>
              <div className='w-full flex justify-end'>
                <button className='px-2 py-2 rounded-md cursor-pointer hover:bg-white/20' onClick={() => setOpenSearchbar(false)}>
                <XIcon size={20} />
                </button>
              </div>
              <ShowSearchResults />

            </div>

          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
