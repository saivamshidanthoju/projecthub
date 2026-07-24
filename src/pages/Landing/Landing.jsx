import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import Features from "../../components/Features";
import Pricing from "../../components/Pricing";
import Testimonials from "../../components/Testimonials";
import Footer from "../../components/Footer";

export default function Landing() {
  return (
    <div className="text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed bg-background min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Pricing />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}