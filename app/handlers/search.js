export async function handleMovieSearch(query) {
  const url =
    `https://api.themoviedb.org/3/search/multi?query=${query}&language=en-US&page=1`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZmZhZjVmODE5NGQwNDgxMTUyMGMzYmQxNTcyM2M4NyIsIm5iZiI6MTc1NjM0NzM2Ny4yNTcsInN1YiI6IjY4YWZiYmU3ZjRmOTBjY2Y0ZDYyNGViZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GsKLnV0dmDEJQhcU_u6Vu8KS-ZnOGgIcAxAPvLAYA18",
    },
  };

  try {
    const res = await fetch(url, options)
    const data = await res.json()
    const media_outputs_only = data.results.filter((r) => r.media_type == 'tv' || r.media_type == 'movie')
    const sorted_results = media_outputs_only.sort((a, b) => b.popularity - a.popularity)
    return sorted_results
    // console.log(data)
  } catch (error) {
    console.warn(error)
    return null

  }
}

