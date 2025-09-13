'use client'
import Navbar from '@/app/components/Navbar';
import {getPersonCredits, getPersonDetails } from '@/app/handlers/mediaHandler';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Person = () => {

    const { id } = useParams();

    const [loading, setloading] = useState(true);
    const [personDetails, setPersonDetails] = useState(null);
    const [personCasts, setPersonCasts] = useState(null);
    const [personCrews, setPersonCrews] = useState([]);

    const loadPersonDetails = async () => {

        const output = await getPersonDetails(id)
        // console.log(output)
        setPersonDetails(output)

    }
    const loadPersonCredits = async () => {

        const output = await getPersonCredits(id)
        console.log(output)
        const withDate = await output.cast.filter((item) => item.release_date || item.first_air_date);
        const withNoDate = await output.cast.filter((item) => !item.release_date && !item.first_air_date);
        const sorted = await withDate.sort((a, b) => {
            const dateA = new Date(a.release_date || a.first_air_date);
            const dateB = new Date(b.release_date || b.first_air_date);
            return dateB - dateA;
        })
        setPersonCasts([...withNoDate, ...sorted]);

        setPersonCrews(output.crew)

    }

    const handleSortByDepartment = (e) => {
        const department = e.target.value;
        if (department === 'all') {
            loadPersonCredits();
        } else {
            const filteredMedia = personCrews.filter((item) => item.department === department);
            setPersonCasts(filteredMedia);
        }

    }

    const handleSortByMediaType = (e) => {
        const mediaType = e.target.value;
        if (mediaType === 'all') {
            loadPersonCredits();
        } else {
            const filteredMedia = personCasts.filter((item) => item.media_type === mediaType);
            setPersonCasts(filteredMedia);
        }
    }

    const renderDepartmentOptions = () => {
        const departments = [...new Set(personCrews.map((item) => item.department))];
        return (
            <>
                {departments.map((dept, index) => (
                    <option key={index} className='text-purple-600 dark:text-black hover:bg-red-500' value={dept}>{dept}</option>
                ))}
            </>)
    }


    useEffect(() => {
        setloading(true);
        loadPersonDetails();
        loadPersonCredits();
        setloading(false);
    }, [id])

    useEffect(() => {
        document.title = `${personDetails?.name || 'Person'} - Movie Master`
    }, [personDetails])
    

    if (loading || !personDetails || !personCrews) {
        return (
            <>
                <Navbar />
                <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-r from-purple-500 via-purple-900 to-purple-500 dark:from-black dark:via-black/90 dark:to-black">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p className="text-gray-300">Loading details...</p>
                </div>
            </>
        )
    }

    if (personDetails.length === 0) {
        return (
            <div className='w-full h-screen bg-gradient-to-r from-purple-500 via-purple-900 to-purple-500 dark:from-black dark:via-black/90 dark:to-black flex flex-col justify-center items-center text-white'>
                <h1 className='text-3xl font-bold p-4'>No Details Found !</h1>
            </div>
        )
    }


    return (
        <>
            <Navbar />
            <div className='w-full h-full bg-gradient-to-r from-purple-500 via-purple-900 to-purple-500 dark:from-black dark:via-black/90 dark:to-black flex flex-col py-4 md:py-10 text-white transition-colors duration-500'>
                <div className='w-full flex flex-col md:flex-row justify-center items-center gap-4 px-4 md:px-10 p-4 border-b-1 border-white/50'>
                    <div className='w-full md:max-w-80 mx-auto md:mx-0'>
                        <img src={`https://image.tmdb.org/t/p/w500${personDetails?.profile_path}`} alt={personDetails?.name} className='w-40 md:w-full object-contain rounded-lg shadow-lg mx-auto' />
                        <h1 className='md:hidden text-center text-2xl font-bold my-2 mx-auto'>{personDetails?.name}</h1>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h1 className='hidden md:block text-4xl font-bold my-2'>{personDetails?.name}</h1>
                        <div>
                            <h1 className='text-xl md:text-2xl font-semibold mb-2'>Biography</h1>
                            <p className='text-md hidden lg:block break-words'>{`${personDetails?.biography.length > 800 ? personDetails?.biography.slice(0, 800) + '.....' : personDetails?.biography}`}</p>
                            <p className='text-sm lg:hidden break-words'>{`${personDetails?.biography.length > 430 ? personDetails?.biography.slice(0, 430) + '.....' : personDetails?.biography}`}</p>
                        </div>
                        <div>
                            <h1 className='text-xl md:text-2xl font-semibold mb-2'>Personal Info:</h1>
                            <div className='border-t-1 border-white py-2'>
                                <p><span className='font-semibold'>Known For:</span> {personDetails?.known_for_department}</p>
                                <p><span className='font-semibold'>Gender: </span>{personDetails?.gender == 1 ? 'Female' : 'Male'}</p>
                                <p><span className='font-semibold'>Birthday:</span> {personDetails?.birthday} {`(${new Date().getFullYear() - new Date(personDetails?.birthday).getFullYear()} years old)`} {personDetails?.deathday ? `(Died: ${personDetails?.deathday})` : ''}</p>
                                <p><span className='font-semibold'>Place of Birth:</span> {personDetails?.place_of_birth}</p>
                                <p className='hidden md:block'><span className='font-semibold'>Also Known As:</span> {personDetails?.also_known_as?.join(' | ')}</p>

                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full md:w-4/5 mx-auto flex flex-col sm:flex-row justify-center sm:justify-end items-center gap-2 sm:gap-0 my-5'>
                    <select name="type" id="type" className='blur-1 text-white p-2 rounded-lg border-1 border-slate-300/10 hover:bg-white/20 transition-all duration-150 cursor-pointer w-full sm:w-auto' defaultValue='all' onChange={(e) => { handleSortByMediaType(e) }}>
                        <option className='text-purple-600 dark:text-black hover:bg-red-500' value='all'>All</option>
                        <option className='text-purple-600 dark:text-black hover:bg-red-500' value='movie'>Movie</option>
                        <option className='text-purple-600 dark:text-black hover:bg-red-500' value='tv'>TV Shows</option>
                    </select>

                    <select name="sort-by" id="sort-by" className='blur-1 text-white p-2 rounded-lg border-1 border-slate-300/10 hover:bg-white/20 transition-all duration-150 cursor-pointer w-full sm:w-auto sm:ml-5' defaultValue="popularity.desc" onChange={(e) => { handleSortByDepartment(e) }}>
                        <option className='text-purple-600 dark:text-black hover:bg-red-500' value='all'>All Departments</option>

                        {renderDepartmentOptions()}
                    </select>
                </div>

                <div className='w-full md:w-4/5 mx-auto md:border-1 border-white h-full flex flex-col gap-4 px-4 md:px-10 p-4'>
                    {personCasts && personCasts.length != 0 && personCasts?.map((m, i) => (
                        <div key={i} className='w-full min-h-20 flex flex-col justify-center items-start gap-0 px-2 md:px-5 py-1 hover:bg-white/10 rounded-lg transition-all duration-150 bg-white/10 dark:bg-white/5'>

                            <a href={`${process.env.NEXT_PUBLIC_URL}/${m.media_type}/${m.id}`} target='_blank' className='hover:underline'>
                                <h2 className='text-base md:text-lg font-bold'>{i + 1}. {m.title || m.name}</h2>
                            </a>
                            <p className='text-xs md:text-sm'>{m.character ? `as ${m.character}` : ''}</p>
                            <p className='text-xs md:text-sm text-gray-300'>{m.release_date || m.first_air_date}</p>

                        </div>
                    ))}
                </div>

            </div>

        </>
    )
}

export default Person
