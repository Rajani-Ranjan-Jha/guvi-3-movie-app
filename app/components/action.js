import { searchMovieById } from "../handlers/movieDetails";

export async function addToWatchList(movieId, userEmail) {
  try {
    const movieData = await searchMovieById(movieId)
    if(!movieData){
      console.warn("Unable to fetch movie data[addToWatchList]")
      return false
    }
    const req = await fetch("api/movie/watchlist/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          movie_id: movieId,
          user_email: userEmail,
          movie_data: movieData
      })
    });
  
    const res = await req.json()
    if(res.status != 201){
      console.warn(res.message)
    }
    return true
  } catch (error) {
    console.error(error)
    return false
    
  }
}
export async function getWatchList(userEmail, watchlist, setWatchlist) {
  try {
    const req = await fetch(`api/movie/watchlist/get?email=${userEmail}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
  
    const res = await req.json()
    if(res.status != 201){
      console.warn(res.message)
    }
    setWatchlist(res.watchList)
    return true
  } catch (error) {
    console.error(error)
    return false
    
  }
}
export async function removeFromWatchList(userEmail, movieId) {
  try {
    const req = await fetch("api/movie/watchlist/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_email: userEmail,
        movie_id: movieId
      })
    });
  
    const res = await req.json()
    if(res.status != 201){
      console.warn(res.message)
    }
    return true
  } catch (error) {
    console.error(error)
    return false
    
  }
}

export async function getTrailerLink (movieId) {
        const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZmZhZjVmODE5NGQwNDgxMTUyMGMzYmQxNTcyM2M4NyIsIm5iZiI6MTc1NjM0NzM2Ny4yNTcsInN1YiI6IjY4YWZiYmU3ZjRmOTBjY2Y0ZDYyNGViZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GsKLnV0dmDEJQhcU_u6Vu8KS-ZnOGgIcAxAPvLAYA18'
            }
        };
        try {
            const res = await fetch(url, options);
            const data = await res.json()
            const filtered = data.results.filter((i) => i.type == 'Trailer' && i.site == 'YouTube')
            if(filtered){
              return filtered[0]
            }
        } catch (error) {
            console.error(error)
        }
    }
