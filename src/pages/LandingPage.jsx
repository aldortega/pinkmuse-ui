import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import NavBar from "@/components/landing/Navbar";
import Testimonials from "@/components/landing/Testimonials";

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-rose-300 via-red-200 to-red-400 text-slate-800">
      <NavBar />
      <Hero />
      <Features />
      <Testimonials />
    </div>
  );
}
