import { CheckCircle } from "lucide-react";
import React from "react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About Mahadev Automobiles
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Founded in 2017, Mahadev Automobiles has been serving the
              community with exceptional bike repair and maintenance services.
              Our certified mechanics have over 7 years of combined experience.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              We believe in quality workmanship, honest pricing, and building
              lasting relationships with our customers. Every bike that leaves
              our shop is guaranteed to be in perfect working condition.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">7+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  1000+
                </div>
                <div className="text-gray-600">Bikes Repaired</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  100%
                </div>
                <div className="text-gray-600">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">24h</div>
                <div className="text-gray-600">Emergency Service</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-center text-blue-600">
              Why Choose Us?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-black">
                    Certified Mechanics
                  </h4>
                  <p className="text-gray-600 text-sm">
                    All our technicians are certified and experienced
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-black">
                    Quality Parts
                  </h4>
                  <p className="text-gray-600 text-sm">
                    We use only premium components and parts
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-black">Warranty</h4>
                  <p className="text-gray-600 text-sm">
                    All repairs come with a limited warranty
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-black">
                    Fair Pricing
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Transparent pricing with no hidden fees
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

export default AboutSection;
