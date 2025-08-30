import Image from "next/image";
import Movie from "./components/Movie";
import Navbar from "./components/Navbar";
import TrendingThisWeek from "./components/TrendingThisWeek";

export default function Home() {
  return (
    <div className=" h-screen">
      <Navbar/>
      <Movie movieCategory={'anime'}/>
      <br />
      <br />
      <br />
      <Movie movieCategory={'popular'}/>
      <br />
      <br />
      <br />
      <Movie movieCategory={'upcoming'}/>
      <br />
      <br />
      <br />
      

    </div>
  );
}
