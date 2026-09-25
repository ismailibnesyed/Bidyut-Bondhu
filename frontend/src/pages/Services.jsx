import ServicesHero from "../components/services/ServicesHero";
import ServicesGrid from "../components/services/ServicesGrid";

const Services = () => {
  return (
    <main className="min-h-screen bg-[#f5faff] pb-2">
      <ServicesHero />
      <ServicesGrid />
    </main>
  );
};

export default Services;