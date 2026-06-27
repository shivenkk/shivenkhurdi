"use client";

import Marquee from "@/components/Marquee";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Work from "@/components/sections/Work";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";

// The accessible / scannable alternate to the spiral.
export default function ListView() {
  return (
    <div className="relative pt-24">
      <About />
      <Marquee />
      <Experience />
      <Education />
      <Work />
      <Skills />
      <Contact />
    </div>
  );
}
