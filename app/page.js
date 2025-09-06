import Image from "next/image";
import Movie from "./components/Movie";
import TrendingThisWeek from "./components/TrendingThisWeek";
import CreateNewReview from "./components/CreateNewReview";

export default function Home() {
  return (
    <div className="min-h-screen bg-black space-y-10 pt-10">
      <Movie mediaCategory={'anime'} mediaType={'movie'}/>
      <Movie mediaCategory={'popular'} mediaType="tv" />
      <Movie mediaCategory={'top_rated'} mediaType="movie"/>

    </div>
  );
}
