import Header from "@/components/home/Header";
import Footer from "@/components/landing/Footer";
import WelcomeSection from "@/components/home/WelcomeSection";
import { DynamicWall } from "@/components/home/DynamicWall";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-col gap-8 p-4 sm:p-6">
        <WelcomeSection />
        <div className="mt-8">
          <DynamicWall />
        </div>
      </main>
      <Footer />
    </div>
  );
}
