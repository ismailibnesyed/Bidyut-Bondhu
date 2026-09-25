import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
const Settings = () => {
  const [compact, setCompact] = useState(localStorage.getItem("pc_compact") === "true");
  function save(event) {
    event.preventDefault();
    localStorage.setItem("pc_compact", String(compact));
    document.documentElement.classList.toggle("pc-compact", compact);
    toast.success("Display preference saved on this device.");
  }
  return <>
      <PageHeader title="Settings" description="Make PowerCare comfortable to use." />

      <form className="pc-card" onSubmit={save}>
        <h2>Display preferences</h2>
        
        <label className="pc-check">
          <input type="checkbox" checked={compact} onChange={event => setCompact(event.target.checked)} />
          Use compact tables
        </label>
        
        <p className="pc-muted">This preference is saved in this browser.</p>

        <div className="pc-actions">
          <button className="pc-button">Save Settings</button>
        </div>
      </form>

      <section className="pc-card pc-section-gap">
        <h2>Account security</h2>
        <p className="pc-muted">
          Update your personal information, service area or password from your profile.
        </p>
        <Link className="pc-button secondary" to="/profile">
          Manage Profile →
        </Link>
      </section>
    </>;
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

export default Settings;
