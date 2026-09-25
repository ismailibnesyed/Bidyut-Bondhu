import { Link } from "react-router-dom";
import aboutImage from "../assets/about-power.jpg";
import {
  FaUsers,
  FaLeaf,
  FaShieldHalved,
  FaArrowRight,
} from "react-icons/fa6";

const AboutSection = () => {
  const features = [
    {
      title: "People First",
      description: "Our customers are at the heart of everything we do.",
      icon: FaUsers,
    },
    {
      title: "Sustainable Growth",
      description: "We invest in a cleaner, greener future.",
      icon: FaLeaf,
    },
    {
      title: "Reliable Service",
      description: "Committed to safe and uninterrupted power supply.",
      icon: FaShieldHalved,
    },
  ];

  return (
    <section className="bg-white">
      {/* Main About */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-14 grid lg:grid-cols-2 gap-10 items-center">
        {/* Image */}
        <div>
          <img
            src={aboutImage}
            alt="PowerCare"
            className="rounded-xl shadow-lg w-full h-[320px] object-cover"
          />
        </div>

        {/* Content */}
        <div>
          <p className="text-blue-600 text-xs font-bold uppercase mb-3">
            About Us
          </p>

          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            Committed to a Brighter,
            <br />
            Sustainable Future
          </h2>

          <p className="mt-4 text-gray-600 leading-relaxed">
            We are dedicated to delivering reliable and sustainable electricity
            services, improving lives and supporting communities. Our mission is
            to build a cleaner, greener and brighter tomorrow for everyone.
          </p>

          <Link
            to="/about"
            className="inline-flex items-center gap-2 mt-6 border border-blue-600 text-blue-700 px-5 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Learn More
            <FaArrowRight />
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20 pb-12 grid md:grid-cols-3 gap-6">
        {features.map((item, index) => {
          const Icon = item.icon;

          return (
            <div key={index} className="flex gap-4 items-start">
              <div className="bg-blue-100 p-3 rounded-full">
                <Icon className="text-blue-700" />
              </div>

              <div>
                <h3 className="font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div
        className="relative bg-cover bg-center py-8"
        style={{
          backgroundImage: `url(${aboutImage})`,
        }}
      >
        <div className="absolute inset-0 bg-blue-900/70" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-5 text-white">
          <div>
            <h3 className="text-2xl font-bold">
              Together for a Brighter Tomorrow
            </h3>
            <p className="mt-2 text-blue-100">
              Join us in building a cleaner, greener and more connected community.
            </p>
          </div>

          <Link
            to="/signup"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
          >
            Get Started
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;