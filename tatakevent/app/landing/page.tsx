"use client";
import HeroSection from "@/components/landing/hero-section";
import HowItWorks from "@/components/landing/how-it-works";
import FeaturedEvents from "@/components/landing/featured-events";
import HashtagWall from "@/components/landing/hashtag-wall";
import CallToAction from "@/components/landing/call-to-action";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-16">
        {" "}
        {/* Add padding to account for fixed navbar */}
        <Navbar />
        <HeroSection />
        <HowItWorks />
        <FeaturedEvents />
        <HashtagWall />
        <CallToAction />
        <Footer />
      </div>
    </div>
  );
}
