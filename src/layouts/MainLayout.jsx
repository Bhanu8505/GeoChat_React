import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />

      <main className="min-h-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
