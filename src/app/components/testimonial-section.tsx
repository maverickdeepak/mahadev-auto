import { Star } from "lucide-react";
import React from "react";

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600">
            Don&apos;t just take our word for it - hear from our satisfied
            customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <p className="text-gray-600 mb-6">
              &quot;Excellent service! They fixed my mountain bike in just a few
              hours. The mechanic was very knowledgeable and explained
              everything clearly.&quot;
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                AC
              </div>
              <div>
                <div className="font-semibold text-black">Amit Chauhan</div>
                <div className="text-sm text-gray-500">Mountain Biker</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-8">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <p className="text-gray-600 mb-6">
              &quot;I&apos;ve been bringing my bikes here for years. Always
              reliable, fair pricing, and they stand behind their work. Highly
              recommended!&quot;
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                DC
              </div>
              <div>
                <div className="font-semibold text-black">Deepak Chauhan</div>
                <div className="text-sm text-gray-500">Commuter</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-8">
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <p className="text-gray-600 mb-6">
              &quot;Emergency repair on a Sunday! They came through when I
              needed them most. Professional and quick service. Will definitely
              use them again.&quot;
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                AC
              </div>
              <div>
                <div className="font-semibold text-black">Akhil Chaudhary</div>
                <div className="text-sm text-gray-500">Road Cyclist</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
