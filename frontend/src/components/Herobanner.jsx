import { Link } from "react-router-dom";
import powerImage from "../assets/power-banner.jpg";
import {
  FaBolt,
  FaArrowRight,
  FaCalendarDays,
  FaTriangleExclamation,
} from "react-icons/fa6";

const HeroBanner = () => {
  return (
    <section
      className="relative min-h-[75vh] overflow-hidden flex items-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${powerImage})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-black/30" />

      {/* Main Container */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto sm:px-10 lg:px-16 py-20">
          <div className="max-w-2xl">
            {/* Small Heading */}
            <div className="flex items-center gap-2 text-blue-600 font-semibold tracking-widest uppercase text-sm mb-5">
              <FaBolt />
              Reliable Power For A Brighter Tomorrow
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Powering Homes
              <br />
              <span className="text-blue-700">Empowering Lives</span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg text-gray-700 leading-relaxed">
              We ensure reliable, affordable and sustainable electricity
              services by providing smart outage management and customer
              support solutions.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/outage-info"
                className="flex items-center gap-2 bg-blue-700 text-white px-7 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
              >
                <FaCalendarDays />
                View Outage Schedule
                <FaArrowRight />
              </Link>

              <Link
                to="/complaint/create"
                className="flex items-center gap-2 border border-blue-600 text-blue-700 px-7 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                <FaTriangleExclamation />
                Report An Outage
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Text */}
      <div className="hidden lg:block absolute right-24 top-28 z-10">
        <h2 className="text-4xl font-bold italic text-white drop-shadow-lg">
          A Brighter
          <br />
          Tomorrow Together
        </h2>
      </div>
    </section>
  );
};

export default HeroBanner;