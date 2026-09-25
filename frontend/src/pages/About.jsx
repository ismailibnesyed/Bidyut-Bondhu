import { Link } from "react-router-dom";
const About = () => {
  return <main className="pc-legal pc-card"><p className="pc-eyebrow">RELIABLE POWER. STRONGER COMMUNITIES.</p><h1>About PowerCare</h1><p>PowerCare brings service schedules, area information and complaint tracking into one place.</p><h2>For residents</h2><p>Check planned outages, report power issues and follow the progress of your complaints.</p><h2>For service teams</h2><p>Administrators manage service areas, schedules and assignments. Technicians keep assigned complaints up to date.</p><Link className="pc-button" to="/services">Explore Services →</Link></main>
  ;
};

export default About;
