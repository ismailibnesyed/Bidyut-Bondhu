import { Link } from "react-router-dom";
import { FaArrowRight, FaCheck } from "react-icons/fa6";

const themes = {
  blue: {
    icon: "bg-blue-100 text-blue-600",
    list: "bg-blue-50",
    check: "bg-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  red: {
    icon: "bg-rose-100 text-red-500",
    list: "bg-rose-50",
    check: "bg-red-500",
    button: "bg-red-500 hover:bg-red-600",
  },
  green: {
    icon: "bg-emerald-100 text-emerald-600",
    list: "bg-emerald-50",
    check: "bg-emerald-600",
    button: "bg-emerald-600 hover:bg-emerald-700",
  },
  orange: {
    icon: "bg-orange-100 text-orange-600",
    list: "bg-orange-50",
    check: "bg-orange-600",
    button: "bg-orange-600 hover:bg-orange-700",
  },
  purple: {
    icon: "bg-violet-100 text-violet-700",
    list: "bg-violet-50",
    check: "bg-violet-700",
    button: "bg-violet-700 hover:bg-violet-800",
  },
  cyan: {
    icon: "bg-cyan-100 text-cyan-600",
    list: "bg-cyan-50",
    check: "bg-cyan-600",
    button: "bg-cyan-600 hover:bg-cyan-700",
  },
};

const ServiceCard = ({ service }) => {
  const { title, description, features, action, path, icon: Icon, color } = service;
  const theme = themes[color] || themes.blue;

  return (
    <article className="flex h-full flex-col rounded-xl border border-white bg-white/95 p-5 shadow-[0_4px_24px_rgba(33,96,156,0.035)] transition-shadow hover:shadow-lg sm:p-[22px]">
      <div className="mb-5 flex items-start gap-4 sm:gap-5">
        <div className={`flex size-16 shrink-0 items-center justify-center rounded-full sm:size-20 ${theme.icon}`}>
          <Icon className="size-9 sm:size-10" aria-hidden="true" />
        </div>
        <div className="pt-1.5">
          <h2 className="text-xl font-bold leading-tight tracking-tight text-[#092344] xl:text-[23px]">
            {title}
          </h2>
          <p className="mt-2 text-[16px] leading-[1.4] text-[#4b6188]">
            {description}
          </p>
        </div>
      </div>

      <ul className={`mt-auto space-y-2 rounded-xl px-5 py-3.5 text-[15px] text-[#213e68] ${theme.list}`}>
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span className={`mt-0.5 flex size-[19px] shrink-0 items-center justify-center rounded-full text-white ${theme.check}`}>
              <FaCheck className="size-2.5" aria-hidden="true" />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        to={path}
        className={`group mt-3 flex min-h-12 items-center justify-center gap-3 rounded-lg px-4 py-3 text-center text-base font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 ${theme.button}`}
      >
        {action}
        <FaArrowRight className="size-3.5 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
      </Link>
    </article>
  );
};

export default ServiceCard;
