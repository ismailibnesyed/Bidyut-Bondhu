import powerBanner from "../../assets/power-banner.jpg";

const ServicesHero = () => {
  return (
    <section className="relative isolate overflow-hidden bg-[#e7f4ff]">
      <img
        src={powerBanner}
        alt="Power grid background"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_58%]"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#e7f4ff] via-[#e7f4ff]/95 to-[#e7f4ff]/10 max-sm:to-[#e7f4ff]/80" />

      <div className="mx-auto max-w-[1536px] px-6 py-10 sm:px-10 lg:px-[6.5%] lg:py-10">
        <p className="mb-3 text-sm font-bold tracking-[0.15em] text-[#0064f5]">
          OUR SERVICES
        </p>

        <h1 className="max-w-3xl text-4xl leading-[1.08] font-bold tracking-tight text-[#092344] sm:text-5xl lg:text-[50px]">
          Smarter Services
          <br />
          for <span className="text-[#0064f5]">Brighter Communities</span>
        </h1>

        <p className="mt-5 max-w-[610px] text-base leading-relaxed text-[#354f75] sm:text-lg">
          Access all essential services in one place. Get information, report
          issues, track load shedding schedules and stay connected with your
          area.
        </p>
      </div>
    </section>
  );
};

export default ServicesHero;
