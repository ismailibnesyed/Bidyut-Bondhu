import { FaBolt } from "react-icons/fa6";
import { Link } from "react-router-dom";
const Footer = () => {
  return <footer className="pc-footer"><div><Brand /><p>Reliable power. Stronger communities.<br />Together for a brighter tomorrow.</p></div><nav aria-label="Footer navigation"><Link to="/services">Services</Link><Link to="/outage-info">Outage Schedule</Link><Link to="/help">Help & Support</Link><Link to="/privacy-policy">Privacy Information</Link><Link to="/terms">Terms of Service</Link></nav><p>© {new Date().getFullYear()} PowerCare</p></footer>;
};
function Brand() {
  return <Link to="/" className="pc-brand"><FaBolt /><span>PowerCare<small>Load Shedding Management System</small></span></Link>;
}

export default Footer;
