const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

export async function searchMediaByQuery(query) {
  const url = `https://api.themoviedb.org/3/search/multi?query=${query}&language=en-US&page=1`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    const media_outputs_only = data.results.filter(
      (r) => r.media_type == "tv" || r.media_type == "movie"
    );
    const sorted_results = media_outputs_only.sort(
      (a, b) => b.popularity - a.popularity
    );
    return sorted_results;
    // console.log(data)
  } catch (error) {
    console.warn(error);
    return null;
  }
}
export async function getMediaByCategory(mediaCategory, mediaType) {
  let url = `https://api.themoviedb.org/3/${mediaType}/${mediaCategory}?language=en-US&page=1`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  };

  switch (mediaCategory) {
    case "trending_all_day":
      url = `https://api.themoviedb.org/3/trending/all/day?language=en-US`;
      break;
    case "trending_all_week":
      url = `https://api.themoviedb.org/3/trending/all/week?language=en-US`;
      break;
    case "trending_day":
      url = `https://api.themoviedb.org/3/trending/${mediaType}/day?language=en-US`;
      break;
    case "trending_week":
      url = `https://api.themoviedb.org/3/trending/${mediaType}/week?language=en-US`;
      break;
    case "top_grossing":
      url = `https://api.themoviedb.org/3/discover/${mediaType}?sort_by=revenue.desc?language=en-US&page=1`;
      break;
    case "anime":
      url = `https://api.themoviedb.org/3/discover/${mediaType}?with_genres=16?sort_by=release_date.desc&page=1`;
      break;

    default:
      break;
  }
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    // console.log(data.results)
    return data.results;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function getMediaByGenre(genreId, mediaType) {
  const url = `https://api.themoviedb.org/3/discover/${mediaType}?with_genres=${genreId}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    return data;
    // console.log(data)
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function getPersonDetails(personId) {
  const url = `https://api.themoviedb.org/3/person/${personId}?language=en-US`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    // console.log(data)
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function getPersonCredits(personId) {
  const url = `https://api.themoviedb.org/3/person/${personId}/combined_credits`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    // console.log(data)
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function getMediaById(mediaId, mediaType) {
  const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}?language=en-US`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function getMediaVideos(mediaId, mediaType) {
  const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}/videos?language=en-US`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  };
  try {
    const res = await fetch(url, options);
    const data = await res.json();

    // console.log(data)
    // console.log(filtered)
    // console.log(data.results);
    return data.results;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function getMediaPictures(mediaId, mediaType) {
  const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}/images`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  };
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    // console.log(data.backdrops);
    return data.backdrops;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function getMediaCredits(mediaId, mediaType) {
  const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}/credits?language=en-US`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  };
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    const casts = await data.cast;
    const directors = await data.crew.filter((i) => i.job == "Director");
    const writers = await data.crew.filter(
      (i) =>
        i.job.startsWith("Wri") ||
        i.job.startsWith("Screen") ||
        i.job.startsWith("Sto") ||
        i.job.startsWith("Auth")
    );
    const Already = [];
    writers.forEach((item, index) => {
      if (Already.includes(item.name)) {
        writers.pop(index);
      } else {
        Already.push(item.name);
      }
    });

    // console.log({ casts, directors, writers });
    // console.log(data);
    return { casts, directors, writers };
    // return data
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function getMediaWatchProviders(mediaId, mediaType) {
  const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}/watch/providers?language=en-US`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  };
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    // console.log("OTT:", data.results);
    return data.results;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function getMediaReviews(mediaId, mediaType) {
  const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}/reviews?language=en-US&page=1`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    // console.log("Reviews:", data.results);
    return data.results;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function getMediaRecommendations(mediaId, mediaType) {
  const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}/recommendations?language=en-US&page=1`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    // console.log("Recommendations:", data.results);
    return data.results;
  } catch (error) {
    console.error(error);
    return null;
  }
}
