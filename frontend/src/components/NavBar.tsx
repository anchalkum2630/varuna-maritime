import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex gap-4">
      <Link to="/routes" className="hover:underline">Routes</Link>
      <Link to="/compare" className="hover:underline">Compare</Link>
      <Link to="/banking" className="hover:underline">Banking</Link>
      <Link to="/pooling" className="hover:underline">Pooling</Link>
    </nav>
  );
}
