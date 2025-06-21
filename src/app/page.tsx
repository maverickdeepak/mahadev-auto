import Header from "./components/header";
import HeroSection from "./components/hero-section";
import ServiceSection from "./components/service-section";
import AboutSection from "./components/about-section";
import TestimonialsSection from "./components/testimonial-section";
import ContactSection from "./components/contact-section";
import Footer from "./components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Services Section */}
      <ServiceSection />

      {/* About Section */}
      <AboutSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
