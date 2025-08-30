'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Play, Star } from 'lucide-react';
import imdb from '@/public/imdb/imdb250.json'

const MovieCarousel = () => {
  const api_key = process.env.NEXT_PUBLIC_TMDB_API_KEY
  const access_token = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN


  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [Movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true);

  // Sample movie data
  const movies = [
    {
      id: 1,
      primaryTitle: "Weapons",
      rating: 7.8,
      primaryImage: "https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=300&h=400&fit=crop",
      rank: 1
    },
    {
      id: 2,
      primaryTitle: "Alien: Earth",
      rating: 7.6,
      primaryImage: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=400&fit=crop",
      rank: 2
    },
    {
      id: 3,
      primaryTitle: "Dexter: Resurrection",
      rating: 9.2,
      primaryImage: "https://images.unsplash.com/photo-1489599446925-97bcf9d9ba4b?w=300&h=400&fit=crop",
      rank: 3
    },
    {
      id: 4,
      primaryTitle: "Hostage",
      rating: 6.5,
      primaryImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop",
      rank: 4
    },
    {
      id: 5,
      primaryTitle: "Wednesday",
      rating: 8.0,
      primaryImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
      rank: 5
    },
    {
      id: 6,
      primaryTitle: "Superman",
      rating: 7.3,
      primaryImage: "https://images.unsplash.com/photo-1635863138275-d9864d3be47f?w=300&h=400&fit=crop",
      rank: 6
    },
    {
      id: 7,
      primaryTitle: "The Batman",
      rating: 8.5,
      primaryImage: "https://images.unsplash.com/photo-1509347528160-9329041ac8b5?w=300&h=400&fit=crop",
      rank: 7
    },
    {
      id: 8,
      primaryTitle: "Spider-Man",
      rating: 8.7,
      primaryImage: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=400&fit=crop",
      rank: 8
    }
  ];

  const fetchTMDB = async () => {
    const url = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZmZhZjVmODE5NGQwNDgxMTUyMGMzYmQxNTcyM2M4NyIsIm5iZiI6MTc1NjM0NzM2Ny4yNTcsInN1YiI6IjY4YWZiYmU3ZjRmOTBjY2Y0ZDYyNGViZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GsKLnV0dmDEJQhcU_u6Vu8KS-ZnOGgIcAxAPvLAYA18'
      }
    };

    fetch(url, options)
      .then(res => res.json())
      .then(json => console.log(json))
      .catch(err => console.error(err));

  }


  const fetchMovies = async () => {

    // console.log('running,.llkoo')
    const data = imdb
    // console.log();
    setMovies(movies)
    setLoading(false)

  };
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    console.log("container",container)
    const { scrollLeft, scrollWidth, clientWidth } = container;

    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollPosition();
    fetchMovies()
    fetchTMDB()
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);


  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (loading || Movies.length === 0) {
    return (
      <div className="w-full border-2 border-blue-600 bg-red-900 text-white p-6">
        <div className="text-center text-white">Loading movies...</div>
      </div>
    );
  }

  return (
    <div className="w-full border-2 border-blue-600 bg-red-900 text-white p-6">
      <div className="w-full">
        {/* Category Title */}
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-yellow-400 mr-3"></div>
          <h2 className="text-2xl font-bold">Top 10 on IMDb this week</h2>
        </div>

        {/* Movie Carousel Container */}
        <div className="relative w-full border-2 border-red-600">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 text-white p-3 rounded-full transition-all duration-200"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 text-white p-3 rounded-full transition-all duration-200"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Movies Container */}
          <div
            ref={scrollContainerRef}
            className=" w-full flex gap-4 overflow-hidden handle-scroll border-2 border-green-600"
          // style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {Movies.map((movie) => (
              <div
                key={movie.id}
                className="flex-shrink-0 w-64 bg-red-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer group"
              >
                {/* Movie Poster */}
                <div className="relative">
                  <img
                    src={movie.primaryImage}
                    alt={movie.primaryTitle}
                    className="w-full h-96 object-cover"
                  />

                  {/* Watchlist Button */}
                  <button className="absolute top-3 left-3 bg-black bg-opacity-60 hover:bg-opacity-80 p-2 rounded-full transition-all duration-200">
                    <Plus size={20} className="text-white" />
                  </button>

                  {/* Rank Badge */}
                  <div className="absolute top-3 right-3 bg-yellow-400 text-black px-2 py-1 rounded text-sm font-bold">
                    #{movie.id || 'N/A'}
                  </div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 flex items-center justify-center transition-opacity duration-200">
                    <Play size={40} className="text-white" />
                  </div>
                </div>

                {/* Movie Info */}
                <div className="p-4">
                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    <Star size={16} className="text-yellow-400 fill-current mr-1" />
                    <span className="text-white font-semibold">{movie.rating || 'N/A'}</span>
                  </div>

                  {/* Title with Rank */}
                  <div className="mb-3">
                    <h3 className="text-white font-medium text-lg leading-tight">
                      {movie.rank || 'N/A'}. {movie.primaryTitle}
                    </h3>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors duration-200">
                      + Watchlist
                    </button>
                    <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                      <Play size={14} />
                      Trailer
                    </button>
                    <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded text-sm font-medium transition-colors duration-200">
                      Watch options
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
};

export default MovieCarousel;