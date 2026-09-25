import { FaBolt } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaUsers, FaCalendarDays, FaLeaf } from "react-icons/fa6";
const AuthLayout = ({
  children,
  signup = false
}) => {
  return <main className="pc-auth">
      <section className="pc-auth-story">
        <Brand />

        <div className="pc-auth-copy">
          <p className="pc-eyebrow">RELIABLE POWER. STRONGER COMMUNITIES.</p>

          <h1>
            {signup ? "Join Us for" : "Connected Communities,"}
            <br />
            <span>
              {signup ? "a Brighter Tomorrow" : "Brighter Tomorrows"}
            </span>
          </h1>

          <p>
            Report outages, stay informed, and help us build a more reliable
            and sustainable power system together.
          </p>

          <div className="pc-benefit">
            <FaUsers />
            <div>
              <h3>Report issues easily</h3>
              <p>Let us know about power problems in your area.</p>
            </div>
          </div>

          <div className="pc-benefit">
            <FaCalendarDays />
            <div>
              <h3>Check schedules</h3>
              <p>Plan your day with upcoming outage schedules.</p>
            </div>
          </div>

          <div className="pc-benefit">
            <FaLeaf />
            <div>
              <h3>Stronger communities</h3>
              <p>Together we build a brighter tomorrow.</p>
            </div>
          </div>
        </div>

        <div className="pc-auth-strip">
          <span>Stay informed</span>
          <span>Stay connected</span>
          <span>A greener tomorrow</span>
        </div>
      </section>

      <section className="pc-auth-form">{children}</section>
    </main>;
};
function Brand() {
  return <Link to="/" className="pc-brand"><FaBolt /><span>PowerCare<small>Load Shedding Management System</small></span></Link>;
}

export default AuthLayout;
