"use client";

import { Award, Clock, Users, Wrench } from "lucide-react";
import React from "react";

const HeroSection = () => {
  const scrollToServices = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="bg-gradient-to-r from-blue-600 to-blue-800 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Expert Bike Repair & Maintenance in Sataun, Sirmour
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Professional bike repair services in Sataun, District Sirmour,
              Himachal Pradesh with over 7 years of experience. Owned by Sunil
              Tomar (Chottu), we fix all types of bicycles with quality parts
              and expert craftsmanship. Same-day repairs available for emergency
              bike service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:+918350902050"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 text-center"
                aria-label="Call Mahadev Automobiles for bike repair appointment"
              >
                Book Appointment
              </a>
              <button
                onClick={scrollToServices}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
                aria-label="View our bike repair services"
              >
                View Services
              </button>
            </div>
            <div className="mt-6 text-sm text-blue-100">
              <p>
                📍 Located at Main Bus Stand, Sataun, District Sirmour, Himachal
                Pradesh 173029
              </p>
              <p>👨‍🔧 Owner: Sunil Tomar (Chottu)</p>
              <p>📞 Call us: +91 83509-02050</p>
              <p>⏰ Open: Monday-Saturday 9AM-8PM, Sunday 9AM-6PM</p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Wrench className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold mb-2">Expert Repairs</h3>
                  <p className="text-sm text-blue-100">
                    Professional bike mechanics in Sataun
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold mb-2">Quick Service</h3>
                  <p className="text-sm text-blue-100">
                    Same day bike repairs available
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold mb-2">Quality Parts</h3>
                  <p className="text-sm text-blue-100">
                    Premium bike components only
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold mb-2">Customer First</h3>
                  <p className="text-sm text-blue-100">
                    Satisfaction guaranteed in Sirmour
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
