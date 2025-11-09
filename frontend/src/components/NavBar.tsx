import { NavLink } from "react-router-dom";

const navClass = (isActive: boolean) =>
  `px-3 py-2 rounded-md ${isActive ? "bg-blue-600 text-white" : "bg-white text-gray-800"}`;

export default function NavBar() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-semibold">Varuna Maritime — FuelEU Dashboard</div>
        <nav className="flex gap-2">
          <NavLink to="/" end className={({ isActive }) => navClass(isActive)}>Routes</NavLink>
          <NavLink to="/compare" className={({ isActive }) => navClass(isActive)}>Compare</NavLink>
          <NavLink to="/banking" className={({ isActive }) => navClass(isActive)}>Banking</NavLink>
          <NavLink to="/pooling" className={({ isActive }) => navClass(isActive)}>Pooling</NavLink>
        </nav>
      </div>
    </header>
  );
}
