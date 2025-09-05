'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { getWatchList } from "../components/action";

const UserContext = createContext()

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within ContextProvider');
    }
    return context;
};

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [watchlist, setWatchlist] = useState()

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadUserfromSession = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/auth/session");
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            const user = data?.user;
            if (user) {
                const req = await fetch(`/api/movie/watchlist/get?email=${user.email}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                const res = await req.json()
                if (res.status != 201) {
                    console.warn("context:",res.message)
                }
                setWatchlist(res.watchList)

            } else{
                console.warn("NO user in loadUserfromSession")
            }
            setUser(user);
            setError(null);
            setLoading(false);
            return user;
        } catch (error) {
            console.error("Error loading current user:", error);
            setError(error);
            setUser(null);
            setLoading(false);
            return null;
        }
    };

    const addWatchListInUser = async () => {
        setLoading(true)
        const result = await getWatchList(user.email, watchlist, setWatchlist)
        if (!result) {
            console.warn("Unable to get watchlist(context)")
            setLoading(false)
            return false
        }
        setLoading(false)
        return true
    }

    useEffect(() => {
        loadUserfromSession();
    }, []);

    useEffect(() => {
        const fetchWatchlist = async () => {
            if (user && user.email && !user.watchlist) {
                const result = await addWatchListInUser();
                if (result) {
                    setUser({ ...user, watchlist });
                } else {
                    console.warn("Unable to get watchlist fetchWatchlist");
                }
            } else if (!user) {
                console.warn("no user fetchWatchlist");
            }
        };
        // fetchWatchlist();
    }, [user]);

    if (loading) {
        // Optionally, you can return a loading indicator here or null to prevent rendering children until user is loaded
        return null;
    }

    return (
        <UserContext.Provider value={{ user, watchlist, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};


