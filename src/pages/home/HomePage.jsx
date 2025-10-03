import { Header } from "@/components/home/Header";

import WelcomeSection from "@/components/home/WelcomeSection";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import Merchandise from "@/components/home/Merchandise";
import NewsUpdates from "@/components/home/NewsUpdates";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:gap-12 sm:px-6">
        <WelcomeSection />
        <UpcomingEvents />
        <Merchandise />
        <NewsUpdates />
      </main>
      <Footer />
    </div>
  );
}
