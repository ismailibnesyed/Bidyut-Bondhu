import {
  FaFileCirclePlus,
  FaUser,
  FaCircleCheck,
  FaBolt,
  FaArrowRight,
  FaUsers,
  FaLeaf,
  FaClock,
} from "react-icons/fa6";

const HowItWorks = () => {
  const steps = [
    {
      title: "Choose a Service",
      description: "Select the service you need from our platform.",
      icon: FaFileCirclePlus,
    },
    {
      title: "Provide Details",
      description: "Enter the required information.",
      icon: FaUser,
    },
    {
      title: "Submit Request",
      description: "Send your request securely.",
      icon: FaCircleCheck,
    },
    {
      title: "Get It Done",
      description: "We'll process it and keep you updated.",
      icon: FaBolt,
    },
  ];

  const stats = [
    {
      value: "1M+",
      title: "Happy Customers",
      icon: FaUsers,
    },
    {
      value: "99.8%",
      title: "Service Reliability",
      icon: FaBolt,
    },
    {
      value: "A Greener Tomorrow",
      title: "Sustainable Energy",
      icon: FaLeaf,
    },
    {
      value: "24/7",
      title: "Customer Support",
      icon: FaClock,
    },
  ];

  return (
    <>
    <section className="bg-white py-12 px-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
        <p className="text-sm text-gray-500 mt-2">
          Get things done in just a few simple steps
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={index} className="relative text-center">
                {/* Arrow */}
                {index !== steps.length - 1 && (
                  <FaArrowRight className="hidden md:block absolute right-[-30px] top-10 text-blue-300" />
                )}

                {/* Icon */}
                <div className="w-14 h-14 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                  <Icon className="text-blue-700 text-xl" />
                </div>

                <h3 className="mt-4 font-bold text-gray-900">{step.title}</h3>
                <p className="text-xs text-gray-500 mt-2">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>

      {/* Stats */}
      <div className="mt-12 bg-blue-50 border-y border-blue-100">
        <div className="max-w-6xl mx-auto lg:px-16 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={index} className="flex items-center gap-4">
                <Icon className="text-blue-600 text-2xl" />
                <div>
                  <h4 className="font-bold text-gray-900">{item.value}</h4>
                  <p className="text-xs text-gray-600">{item.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HowItWorks;