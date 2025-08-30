'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { EyeClosedIcon, EyeIcon } from 'lucide-react';


const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [EyeBtn, setEyeBtn] = useState(true);

    const router = useRouter()

    async function handleSubmit(e) {
        e.preventDefault();

        if (!username || !email || !password || !confirmPassword) {
            alert("All fields are required");
            return;
        }
        if (password !== confirmPassword) {
            alert("Password and confirm password should be same");
            return;
        }

        const userData = { username, email, password };
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (res.ok) {
            alert("Registration successful! Please log in.");
            router.push('/login');
        }
        else {
            const errorData = await res.json();
            alert(`Registration failed: ${errorData.message}`);
        }
        console.log('User data submitted:', userData);
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        
    }

    return (
        <div className='bg-black w-screen h-screen flex justify-center items-center'>
            <div className='p-10 bg-black/80 w-100 h-4/5 text-sm border rounded-md flex flex-col justify-center items-center'>
                <h2 className='text-4xl text-white mb-4'>Register</h2>
                <br />
                <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-4 mt-4  w-full'>
                    <input onChange={(e) => { setUsername(e.target.value) }} value={username} type="text" placeholder='Username' className='w-4/5  mx-atuo focus:outline-none focus:ring-red-500 p-2 rounded-md bg-gray-800 text-white' />
                    <input onChange={(e) => { setEmail(e.target.value) }} value={email} type="email" placeholder='Email' className='w-4/5  mx-atuo focus:outline-none focus:ring-red-500 p-2 rounded-md bg-gray-800 text-white' />
                    <div className='w-4/5 relative flex justify-center items-center'>
                        <input onChange={(e) => { setPassword(e.target.value) }} value={password} type={`${EyeBtn ? "password" : "text"}`} placeholder='Password' className='w-full  mx-atuo focus:outline-none focus:ring-red-500 p-2 rounded-md bg-gray-800 text-white' />

                        <button type="button" className='absolute right-5 top-1.5 text-white'
                            onClick={(e) => {
                                e.preventDefault();
                                setEyeBtn(!EyeBtn);
                            }}
                        >
                            {EyeBtn ? (<EyeClosedIcon />) : (<EyeIcon />)}
                        </button>
                    </div>
                    <div className='w-4/5 relative flex justify-center items-center'>
                        <input onChange={(e) => { setConfirmPassword(e.target.value) }} value={confirmPassword} type={`${EyeBtn ? "password" : "text"}`} placeholder='Confirm Password' className='w-full  mx-atuo focus:outline-none focus:ring-red-500 p-2 rounded-md bg-gray-800 text-white' />
                    </div>
                    <button type="submit" className='bg-blue-600 p-2 rounded-md text-white hover:bg-blue-700 transition-colors'>Register</button>
                </form>
                <p className='text-white mt-4'>Already have an account? <a href="/login" className='text-blue-500 hover:underline'>Login</a></p>
            </div>
        </div>
    )
}

export default Register