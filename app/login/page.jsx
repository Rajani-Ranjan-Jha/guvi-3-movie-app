'use client';
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";

import React, { useState, useEffect } from 'react';
import { EyeClosedIcon, EyeIcon } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [EyeBtn, setEyeBtn] = useState(true);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        document.title = 'Login - Movie Master'
        const checkAuth = async () => {
            const response = await fetch('/api/auth/session');
            const data = await response.json();
            if (data?.user) {
                router.push('/');
            }
        };
        checkAuth();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setErrorMessage(result.error);
            setLoading(false);
        } else {
            console.warn('Logged in successfully');
            router.push("/");

        }
    };

    return (
        <div className='bg-black h-screen flex justify-center items-center'>
            <div className='p-10 my-auto w-100 min-h-130 text-sm border-1 border-white rounded-md flex flex-col justify-around items-center'>
                <h2 className='text-5xl text-white mb-4'>Login</h2>
                <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-4 mt-4  w-full'>
                    <input onChange={(e) => { setEmail(e.target.value) }} type="email" placeholder='Email' className='w-4/5  mx-atuo focus:outline-none focus:ring-red-500 p-2 rounded-md bg-white/10 text-white' />
                    <div className='w-4/5 relative flex justify-center items-center'>
                        <input onChange={(e) => { setPassword(e.target.value) }} type={`${EyeBtn ? "password" : "text"}`} placeholder='Password' className='w-full  mx-atuo focus:outline-none focus:ring-red-500 p-2 rounded-md bg-white/10 text-white'

                        />
                        <button type="button" className='absolute right-5 top-2 text-white w-3 h-3'
                        onClick={(e) => {
                            e.preventDefault();
                            setEyeBtn(!EyeBtn);
                        }}
                        >
                            {EyeBtn ? (<EyeClosedIcon size={20}/>) : (<EyeIcon size={20} />)}
                        </button>
                    </div>
                    {errorMessage && (
                        <p className="text-red-500 mt-2">{errorMessage}</p>
                    )}
                    <button type="submit" disabled={loading || email.length == 0 || password.length == 0} className='mt-4 bg-purple-600 px-4 py-2 rounded-md text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-400 transition-colors'>{loading ? 'Loading...' : "Login"}</button>
                </form>
                <p className='text-white mt-4 flex gap-3 items-center'>
                    <span>Don't have an account? </span>
                      <a href="/register" className='text-purple-500 hover:underline'>  Create a new account</a>
                </p>
            </div>
        </div>
    );
};
export default Login;
