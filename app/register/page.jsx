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
    const [loading, setLoading] = useState(false);
    

    const router = useRouter()

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

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
            setLoading(false);
            return
        }
        console.log('User data submitted:', userData);
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        
    }

    return (
        <div className='bg-black w-screen h-screen flex justify-center items-center'>
            <div className='p-10 my-auto w-100 min-h-130 text-sm border-1 border-white rounded-md flex flex-col justify-around items-center'>
                <h2 className='text-5xl text-white mb-4'>Register</h2>
                <br />
                <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-4 mt-4  w-full'>
                    <input onChange={(e) => { setUsername(e.target.value) }} value={username} type="text" placeholder='Username' className='w-4/5  mx-atuo focus:outline-none focus:ring-red-500 p-2 rounded-md bg-white/10 text-white' />
                    <input onChange={(e) => { setEmail(e.target.value) }} value={email} type="email" placeholder='Email' className='w-4/5  mx-atuo focus:outline-none focus:ring-red-500 p-2 rounded-md bg-white/10 text-white' />
                    <div className='w-4/5 relative flex justify-center items-center'>
                        <input onChange={(e) => { setPassword(e.target.value) }} value={password} type={`${EyeBtn ? "password" : "text"}`} placeholder='Password' className='w-full  mx-atuo focus:outline-none focus:ring-red-500 p-2 rounded-md bg-white/10 text-white' />

                        <button type="button" className='absolute right-5 top-2 text-white'
                            onClick={(e) => {
                                e.preventDefault();
                                setEyeBtn(!EyeBtn);
                            }}
                        >
                            {EyeBtn ? (<EyeClosedIcon size={20} />) : (<EyeIcon size={20} />)}
                        </button>
                    </div>
                    <div className='w-4/5 relative flex justify-center items-center'>
                        <input onChange={(e) => { setConfirmPassword(e.target.value) }} value={confirmPassword} type={`${EyeBtn ? "password" : "text"}`} placeholder='Confirm Password' className='w-full  mx-atuo focus:outline-none focus:ring-red-500 p-2 rounded-md bg-white/10 text-white' />
                    </div>
                    <button type="submit" disabled={loading || username.length == 0 || email.length == 0 || password.length == 0 || confirmPassword.length ==0}  className='bg-purple-600 p-2 rounded-md text-white hover:bg-purple-700  disabled:cursor-not-allowed disabled:bg-purple-400 transition-colors'>{loading ? 'Loading...' : "Register"}</button>
                </form>
                <p className='text-white mt-4 flex gap-3 items-center'>
                    <span>Already have an account? </span>
                    <a href="/login" className='text-purple-500 hover:underline'>Login</a></p>
            </div>
        </div>
    )
}

export default Register