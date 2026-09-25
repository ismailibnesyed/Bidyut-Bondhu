import { Link } from "react-router-dom";
import {
  FaCalendarDays,
  FaTriangleExclamation,
  FaGear,
  FaHeadset,
  FaArrowRight,
} from "react-icons/fa6";

const services = [
  {
    title: "Outage Schedule",
    description: "Check published load shedding schedules for your area.",
    button: "View Schedule",
    path: "/outage-info",
    icon: FaCalendarDays,
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
  },
  {
    title: "Report an Outage",
    description: "Let us know about power interruptions in your area.",
    button: "Report Now",
    path: "/complaint/create",
    icon: FaTriangleExclamation,
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-700",
  },
  {
    title: "Service Requests",
    description: "Manage your profile, area and power service reports.",
    button: "Get Started",
    path: "/services",
    icon: FaGear,
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-700",
  },
  {
    title: "Customer Support",
    description: "Find answers to common questions about PowerCare.",
    button: "Contact Us",
    path: "/contact",
    icon: FaHeadset,
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-700",
  },
];

const ServiceCards = () => {
  return (
    <section className="bg-blue-100 lg:py-16 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.path}
                className={`${service.bg} rounded-xl p-6 hover:-translate-y-1 hover:shadow-lg transition`}
              >
                {/* Icon */}
                <div
                  className={`${service.iconBg} w-12 h-12 rounded-full flex items-center justify-center mb-5`}
                >
                  <Icon className={`text-xl ${service.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {service.description}
                </p>

                {/* Link */}
                <Link
                  to={service.path}
                  className="flex items-center gap-2 mt-5 text-blue-700 font-semibold text-sm hover:gap-3 transition-all"
                >
                  {service.button}
                  <FaArrowRight />
                </Link>
              </div>
            );
          })}
        </div>
    </section>
  );
};

export default ServiceCards;
