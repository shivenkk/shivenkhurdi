import Hero from "@/components/sections/Hero";
import Marquee from "@/components/Marquee";
import Work from "@/components/sections/Work";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Experience />
      <Work />
      <Skills />
      <Contact />
    </>
  );
}
