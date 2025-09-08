import React from 'react'

const Footer = () => {
    return (
        <div className='w-full bg-purple-600 dark:bg-black text-white p-6 space-y-2'>
            <p className='text-center'>Made with 🩷 on earth</p>
            <p className='text-center'>Follow us on
                <a href="https://www.facebook.com/" target='_blank' className='text-gray-200 mx-2'>Facebook</a> |
                <a href="https://www.x.com/" target='_blank' className='text-gray-200 mx-2'>Twitter</a> |
                <a href="https://www.instagram.com/" target='_blank' className='text-gray-200 mx-2'>Instagram</a>
            </p>
            <p className='text-center flex items-center gap-2 justify-center'>
                <span>Contact us:</span>
                <a href="mailto:contact@moviemaster.in" className='text-gray-200'>
                    contact@moviemaster.in
                </a>
            </p>

        </div>
    )
}

export default Footer
