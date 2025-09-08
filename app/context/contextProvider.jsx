'use client'
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";


const UserContext = createContext()

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within ContextProvider');
    }
    return context;
};

export const ContextProvider = ({ children }) => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const [watchlist, setWatchlist] = useState()

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Update user state when session changes
    useEffect(() => {
        if (status === 'loading') {
            setLoading(true);
            return;
        }

        if (session?.user) {
            setUser(session.user);
            // console.warn("user:", session.user)
            setError(null);
            setLoading(true);

            // Load watchlist for the user
            const loadWatchlist = async () => {
                try {
                    const req = await fetch(`/api/movie/watchlist/get?email=${session.user.email}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    });
                    const res = await req.json()
                    if (res.status != 201) {
                        // console.warn("context:", res.message)
                    }
                    setWatchlist(res.watchList)
                    setLoading(false);
                } catch (error) {
                    console.error("Error loading watchlist:", error);
                    setError(error.message);
                    setLoading(false);
                }
            };
            loadWatchlist();
        } else {
            setUser(null);
            setWatchlist(null);
            setLoading(false);
        }
    }, [session, status]);

    // Memoize the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({ user, watchlist, loading, error }), [user, watchlist, loading, error]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};


