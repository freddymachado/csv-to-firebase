
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemSolution from "@/components/ProblemSolution";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}
