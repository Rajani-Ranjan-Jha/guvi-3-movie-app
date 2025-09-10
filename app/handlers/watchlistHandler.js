import { getMediaById } from "../handlers/mediaHandler";

export async function addToWatchList(mediaId, mediaType = "movie", userEmail) {
  try {
    const mediaData = await getMediaById(mediaId, mediaType);
    if (!mediaData) {
      console.warn("Unable to fetch movie data[addToWatchList]");
      return false;
    }
    const req = await fetch("/api/movie/watchlist/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        media_id: mediaId,
        media_type: mediaType,
        user_email: userEmail,
        media_data: mediaData,
      }),
    });

    const res = await req.json();
    if (res.status != 201) {
      window.alert(res.message);
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
export async function getWatchList(userEmail, watchlist, setWatchlist) {
  try {
    const req = await fetch(`/api/movie/watchlist/get?email=${userEmail}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await req.json();
    if (res.status != 201) {
      console.warn(res.message);
    }
    setWatchlist(res.watchList);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
export async function removeFromWatchList(mediaId, userEmail) {
  try {
    const req = await fetch("/api/movie/watchlist/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_email: userEmail,
        media_id: mediaId,
      }),
    });

    const res = await req.json();
    if (res.status != 201) {
      window.alert(res.message);
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

