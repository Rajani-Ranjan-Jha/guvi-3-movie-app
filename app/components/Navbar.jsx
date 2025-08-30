import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className='w-full flex justify-between items-center bg-gray-800 text-white p-4'>
      <h1 className='text-2xl font-bold'>My Application</h1>
      <nav>

        <ul className='flex space-x-4 mt-2'>
          <li>
            <Link href='/' className='hover:underline'>Home</Link>
          </li>
          <li>
            <Link href='/about' className='hover:underline'>About</Link>
          </li>
          <li>
            <Link href='/contact' className='hover:underline'>Contact</Link>
          </li>
        </ul>
      </nav>

      <div>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>
          <a href="/register">
            Sign Up
          </a>
        </button>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>
          <a href="/login">
            Login
          </a>
        </button>

      </div>


    </div>
  )
}

export default Navbar
