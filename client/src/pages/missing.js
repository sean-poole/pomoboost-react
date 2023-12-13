import { Link } from "react-router-dom";

export default function Missing() {
  return (
    <article>
      <h1>Page not found</h1>
      <div>
        <Link to="/" className="missing-link">Return Home</Link>
      </div>
    </article>
  );
}
