import {
  FaCalendarDays,
  FaFileCircleExclamation,
  FaClipboardList,
  FaLocationDot,
  FaHeadset,
  FaUserGear,
} from "react-icons/fa6";
import ServiceCard from "./ServiceCard";

const services = [
  {
    title: "Load Shedding Schedule",
    description: "Check upcoming load shedding schedules for your area.",
    features: [
      "View daily and weekly schedules",
      "Filter by area or date",
      "Stay informed and plan ahead",
    ],
    action: "View Schedule",
    path: "/outage-info",
    icon: FaCalendarDays,
    color: "blue",
  },
  {
    title: "Report a Complaint",
    description: "Let us know about power problems in your area.",
    features: [
      "Report power outage or other issues",
      "Track your complaint status",
      "Get updates from our team",
    ],
    action: "Report Issue",
    path: "/complaint/create",
    icon: FaFileCircleExclamation,
    color: "red",
  },
  {
    title: "My Complaints",
    description: "View and track the complaints you have submitted.",
    features: [
      "Check current status",
      "View complaint history",
      "Follow status updates",
    ],
    action: "View My Complaints",
    path: "/complaint",
    icon: FaClipboardList,
    color: "green",
  },
  {
    title: "Area Information",
    description: "Find your service area and its published schedules.",
    features: [
      "View area details and postal code",
      "Check published area schedules",
      "Explore other service areas",
    ],
    action: "View Area Info",
    path: "/area-info",
    icon: FaLocationDot,
    color: "orange",
  },
  {
    title: "Help & Support",
    description: "Need assistance? We are here to help you.",
    features: [
      "Frequently asked questions",
      "Find account help",
      "Get guidance on using the system",
    ],
    action: "Get Support",
    path: "/help",
    icon: FaHeadset,
    color: "purple",
  },
  {
    title: "Account Management",
    description: "Update your profile and keep your account secure.",
    features: [
      "Edit your personal information",
      "Change your password",
      "Keep your account up to date",
    ],
    action: "Manage Account",
    path: "/profile",
    icon: FaUserGear,
    color: "cyan",
  },
];

const ServicesGrid = () => {
  return (
    <section
      aria-label="Available services"
      className="mx-auto grid max-w-[1536px] grid-cols-1 gap-5 px-4 py-5 sm:px-8 md:grid-cols-2 lg:px-11 xl:grid-cols-3 xl:gap-x-7"
    >
      {services.map((service) => (
        <ServiceCard key={service.path} service={service} />
      ))}
    </section>
  );
}
export default ServicesGrid;
