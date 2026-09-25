import { Link } from "react-router-dom";
const Help = () => {
  return <div className="pc-support-page">
      <PageHeader title="Help & Support" description="Simple answers to help you get started with PowerCare." />

      <section className="pc-card pc-help">
        <h2>Frequently asked questions</h2>

        <details open>
          <summary>How do I report a power problem?</summary>
          <p>
            Open <Link to="/complaint/create">Report Complaint</Link>, select your
            area, describe the issue and submit. Track its progress in My
            Complaints.
          </p>
        </details>

        <details>
          <summary>How do I find my outage schedule?</summary>
          <p>
            Open <Link to="/outage-info">Load Shedding</Link>. Select your district,
            area and month, then choose Search. Reset clears the filters.
          </p>
        </details>

        <details>
          <summary>How do I change my service area?</summary>
          <p>
            Open <Link to="/profile">Profile</Link>, choose your area and save your
            changes.
          </p>
        </details>

        <details>
          <summary>What do complaint statuses mean?</summary>
          <p>
            Pending means received. Assigned means a technician has been selected.
            Processing means work is underway. Solved means the issue has been
            marked resolved.
          </p>
        </details>

        <details>
          <summary>How do staff sign in?</summary>
          <p>
            Use the same login page. An admin creates technician and admin
            accounts. Your assigned role determines which tools appear.
          </p>
        </details>

        <details>
          <summary>I forgot my password. What should I do?</summary>
          <p>
            Contact your system administrator. Self-service password recovery is
            not available yet. If you can still sign in, change your password from
            Profile.
          </p>
        </details>

        <details>
          <summary>Why am I seeing a connection error?</summary>
          <p>
            Check your internet connection and choose Try again. If the issue
            continues, contact your system administrator.
          </p>
        </details>
      </section>
    </div>;
};
function PageHeader({
  title,
  description,
  welcome = false
}) {
  const headerClass = `pc-page-header ${welcome ? "welcome" : ""}`.trim();
  return <header className={headerClass}>
      <div>
        {welcome ? <p className="pc-eyebrow">WELCOME BACK</p> : <p className="pc-breadcrumb">
            <Link to="/dashboard">Dashboard</Link>
            <span>›</span>
            {title}
          </p>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <p className="pc-motto">
        Reliable Power.
        <br />
        Stronger Communities.
      </p>
    </header>;
}

export default Help;
