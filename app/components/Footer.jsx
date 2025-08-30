import React from 'react'

const Footer = () => {
    return (
        <div className='w-full bg-gray-900 text-white p-6 mt-8'>
            <p className='text-center'>&copy; 2024 My Movie App. All rights reserved.</p>
            <p className='text-center'>Follow us on
                <a href="#" className='text-blue-400 mx-2'>Facebook</a> |
                <a href="#" className='text-blue-400 mx-2'>Twitter</a> |
                <a href="#" className='text-blue-400 mx-2'>Instagram</a>
            </p>
            <p className='text-center mt-4'>Contact us:
                <a href="mailto:rajanijha@gmail.com" className='text-blue-400'>
                    contact@moviemaster.in
                </a>
            </p>

        </div>
    )
}

export default Footer
