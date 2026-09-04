import Loader from "@/components/loader/Loader";
import SceneLoader from "@/components/three/SceneLoader";
import HomeHud from "@/components/sections/HomeHud";
import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import Vision from "@/components/sections/Vision";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Outro from "@/components/sections/Outro";

export default function Home() {
  return (
    <>
      <Loader />
      <SceneLoader />
      <HomeHud />
      <main className="relative z-10">
        <Hero />
        <Work />
        <Vision />
        <Experience />
        <Education />
        <Outro />
      </main>
    </>
  );
}
