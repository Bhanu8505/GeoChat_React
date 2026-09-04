import { Link, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import NotificationBell from "./notifications/NotificationBell";

const Navbar = () => {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <h2 className="cursor-pointer text-xl font-bold text-blue-600">
        GeoChat
      </h2>

      <div className="flex items-center gap-4">
        <Link
          to="/home"
          className="font-medium text-gray-600 transition hover:text-blue-600"
        >
          Home
        </Link>
        <span className="text-sm font-medium text-gray-700">
          <Link
            to="/profile"
            className="font-medium text-gray-600 transition hover:text-blue-600"
          >
            My Profile
          </Link>
          {/* {authUser?.fullName || authUser?.email} */}
        </span>
        <Link className="transition hover:text-blue-600" to="/chat">
          Chats
        </Link>
        <NotificationBell />
        <button
          onClick={handleLogout}
          className="rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
