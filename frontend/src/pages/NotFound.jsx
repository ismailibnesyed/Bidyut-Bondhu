import { Link } from "react-router-dom";

const NotFound = () => (
  <main className="mx-auto max-w-3xl px-6 py-20 text-center">
    <h1 className="text-3xl font-bold">Page unavailable</h1>
    <p className="mt-4">This page does not exist or is not available yet.</p>
    <Link to="/" className="btn btn-primary mt-6">
      Back to home
    </Link>
  </main>
);

export default NotFound;