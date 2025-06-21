import { Clock, MapPin, Phone } from "lucide-react";
import React from "react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-xl text-blue-100">
            Ready to get your bike back in top condition? Contact us today!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 mr-4 text-blue-200" />
                <div>
                  <div className="font-semibold">Address</div>
                  <div className="text-blue-100">
                    Main Bus Stand, Sataun, Sirmour, Himachal Pradesh, India
                    173029
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-6 w-6 mr-4 text-blue-200" />
                <div>
                  <div className="font-semibold">Phone</div>
                  <div className="text-blue-100">
                    <a href="tel:+918350902050" className="hover:text-blue-200">
                      +91 83509-02050
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-6 w-6 mr-4 text-blue-200" />
                <div>
                  <div className="font-semibold">Hours</div>
                  <div className="text-blue-100">
                    Mon-Sat: 9AM-8PM
                    <br />
                    Sun: 9AM-6PM
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-6">Book an Appointment</h3>
            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Your Phone"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <div>
                <textarea
                  placeholder="Describe your bike issue"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
