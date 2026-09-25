import { Link } from "react-router-dom";

const Legal = ({ terms = false }) => {
  return (
    <main className="pc-legal pc-card">
      <h1>{terms ? "Terms of Service" : "Privacy Information"}</h1>

      {terms ? (
        <>
          <h2>Using PowerCare</h2>
          <p>
            Use your own account and provide accurate information when
            reporting power issues. Do not submit misleading reports or use
            another person's account.
          </p>

          <h2>Schedules and reports</h2>
          <p>
            Published schedules may change. PowerCare is a community reporting
            and schedule management project; it is not an emergency response
            service.
          </p>

          <h2>Your account</h2>
          <p>
            Keep your password private. Staff access is assigned by an
            administrator.
          </p>
        </>
      ) : (
        <>
          <h2>Information you provide</h2>
          <p>
            PowerCare stores your account details, selected service area and
            submitted complaints to provide the features you use.
          </p>

          <h2>Who can see reports?</h2>
          <p>
            Administrators manage complaints and assigned technicians can
            access the reports they work on.
          </p>

          <h2>Browser storage</h2>
          <p>
            Your sign-in token is stored for the browser session, or on this
            device if you choose Remember me. Display preferences are stored in
            your browser. Signing out removes your sign-in token.
          </p>

          <h2>Maps</h2>
          <p>
            Area maps use Google Maps, which receives connection information
            when a map loads.
          </p>
        </>
      )}

      <p>
        For questions about your data or account, contact your system
        administrator.
      </p>

      <Link className="pc-button secondary" to="/signup">
        Back to Sign Up
      </Link>
    </main>
  );
};

export default Legal;
