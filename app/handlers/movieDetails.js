const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

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
    return data.results
  } catch (error) {
    console.error(error);
    return null
  }
}
export async function getMediaPictures(mediaId, mediaType) {
  const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}/images`;
  // `tv/series_id/images`
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
    return data.backdrops
  } catch (error) {
    console.error(error);
    return null
  }
}
export async function getMediaCredits(mediaId, mediaType) {
  const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}/credits?language=en-US`;
  // `tv/series_id/credits?language=en-US`
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
    console.log(data)
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
        console.log("OTT (action.js):",data.results);

    return data.results
  } catch (error) {
    console.error(error);
    return null
  }
}
export async function getMediaReviews(mediaId, mediaType) {
  const url = `https://api.themoviedb.org/3/${mediaType}/${mediaId}/reviews?language=en-US&page=1`;
  // `3/tv/series_id/reviews?language=en-US&page=1`
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        `Bearer ${TMDB_TOKEN}`,
    },
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    console.log("Reviews (action.js):",data.results);
    return data.results;
  } catch (error) {
    console.error(error);
    return null;
  }
}
