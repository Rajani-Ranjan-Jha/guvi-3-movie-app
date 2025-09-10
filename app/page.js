import Image from "next/image";
import ContentLoader from "./components/ContentLoader";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: 'Home - Movie Master'
};

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-purple-500 via-purple-900 to-purple-500 dark:from-black dark:via-black/90 dark:to-black space-y-10 pt-10 transition-colors duration-500">
        <ContentLoader mediaCategory={"trending_all_day"} mediaType={"movie"} mediaTitle={'Trending today'} />
        <ContentLoader mediaCategory={"top_grossing"} mediaType={"movie"} mediaTitle={'Top Box office'} />
        <ContentLoader mediaCategory={"top_rated"} mediaType="movie" mediaTitle={'The GOATs'} />
        <ContentLoader mediaCategory={"upcoming"} mediaType="movie" mediaTitle={'Latest Releases'} />
        <ContentLoader mediaCategory={"anime"} mediaType={"movie"} mediaTitle="New in Animations" />
      </div>
      <Footer/>
    </>
  );
}
