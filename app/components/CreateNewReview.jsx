'use client'
import { StarIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const CreateNewReview = ({ tmdb_id, tmdb_rating, isFirstReview = true, previousReview }) => {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [title, setTitle] = useState('')
    const [review, setReview] = useState('')
    const [loading, setloading] = useState(false)


    const handleReviewSubmit = async (e) => {
        setloading(true)
        e.preventDefault()
        try {
            if (isFirstReview) {
                const req = await fetch('/api/movie/review/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        rating: rating,
                        // title: title, 
                        review: review,
                        tmdb_id: tmdb_id,
                        tmdb_rating: tmdb_rating
                    })
                })
    
                const res = await req.json()
                if (req.status === 201) {
                    console.warn(res.message)
                    // Reset form after successful submission
                    setRating(0)
                    setTitle('')
                    setReview('')
                } else {
                    console.error('Error in review create:', res.error)
                }
            } else {
                // console.log("sending..:",{rating, review, tmdb_id})
                const req = await fetch('/api/movie/review/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        NewRating: rating,
                        NewReview: review,
                        tmdb_id: tmdb_id,
                        // tmdb_rating: tmdb_rating
                    })
                })
                const res = await req.json()
                if (req.status === 200) {
                    console.warn(res.message)
                    alert(res.message)
                    // Reset form after successful submission
                    setRating(0)
                    setTitle('')
                    setReview('')
                } else {
                    console.error('Error in review update:', res.error)
                }
            }
            setloading(false)
        } catch (error) {
            console.error('Fetch error:', error)
        } finally {
            setloading(false)
        }
    }
    useEffect(() => {
        if (!isFirstReview) {
            setRating(previousReview.rating)
            setReview(previousReview.content)
        }
    }, [])


    return (
        <div className='w-full border-1 border-white rounded-2xl blur-1'>
            <form onSubmit={handleReviewSubmit} className='w-full p-5 flex flex-col gap-5 justify-center items-center'>
                <div className='w-full flex flex-col gap-2 justify-center items-start'>
                    <label htmlFor="title">Your rating:</label>
                    <div className='flex justify-center items-center transition-all delay-500 duration-200'>

                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                            <span key={star}
                                onMouseEnter={() => { setHoverRating(star) }}
                                onMouseLeave={() => { setHoverRating(0) }}
                                onClick={() => setRating(star)}>
                                <StarIcon size={25} className={`cursor-pointer transition-all delay-500 duration-200 text-yellow-400 ${star <= (hoverRating || rating) ? 'fill-current' : ''}`} />
                            </span>
                        ))}
                    </div>
                </div>
                <div className='w-full flex flex-col gap-1 justify-center items-start'>
                    <label htmlFor="title">Your review:</label>
                    <textarea
                        placeholder='enter your review'
                        className='w-full px-2 py-1 rounded-lg focus:outline-none focus:border-blue-600 border-1 border-white'
                        rows='5'
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                    />
                </div>

                <button type="submit" disabled={loading} className='bg-blue-700 text-white hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer mx-auto px-4 py-2 rounded-lg border-1 border-white mt-3 text-sm'>
                    {`${loading ? "Please wait.." : "Submit"}`}
                </button>
                
            </form>

        </div>
    )
}

export default CreateNewReview
