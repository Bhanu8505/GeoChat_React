import { useState } from "react";
import userService from "../services/userService";
import UserCard from "../components/UserCard";

const Home = () => {
  // const [location, setLocation] = useState(() => {
  //   const savedLocation = localStorage.getItem("location");
  //   return savedLocation ? JSON.parse(savedLocation) : null;
  // });

  const [location, setLocation] = useState(null);

  // const [nearbyUsers, setNearbyUsers] = useState(() => {
  //   const savedUsers = localStorage.getItem("nearbyUsers");
  //   return savedUsers ? JSON.parse(savedUsers) : [];
  // });

  const [nearbyUsers, setNearbyUsers] = useState([]);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const newLocation = {
          latitude,
          longitude,
        };

        setLocation(newLocation);
        // localStorage.setItem("location", JSON.stringify(newLocation));
        console.log("Latitude: ", latitude);
        console.log("Longitude: ", longitude);

        try {
          const res = await userService.updateLocation({
            latitude,
            longitude,
          });

          console.log("Location update Response: ", res.data);

          const nearbyRes = await userService.getNearbyUsers({
            latitude,
            longitude,
            radius: 1000,
          });

          console.log("Nearby users: ", nearbyRes.data);

          const users = nearbyRes.data.nearbyUsers;
          setNearbyUsers(users);
          // localStorage.setItem("nearbyUsers", JSON.stringify(users));
        } catch (error) {
          console.log(
            "Error updating location: ",
            error?.response?.data || error.message,
          );
        }
      },
      (error) => {
        console.log("Error getting location: ", error);
      },
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-100 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">GeoChat</h1>
          <p className="mt-1 text-gray-500">
            Find and connect with people around you.
          </p>
        </div>

        {/* Location Card */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Discover Nearby Users
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Share your location to find people nearby.
              </p>
            </div>

            <button
              onClick={getLocation}
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 active:scale-95"
            >
              Get My Location
            </button>
          </div>

          {/* Location information */}
          {location && (
            <div className="mt-5 grid gap-4 border-t pt-5 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Latitude</p>
                <p className="mt-1 font-medium text-gray-800">
                  {location.latitude}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Longitude</p>
                <p className="mt-1 font-medium text-gray-800">
                  {location.longitude}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Nearby Users */}
        {location && (
          <div>
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-gray-800">Nearby Users</h2>
              <p className="mt-1 text-sm text-gray-500">
                People within 1 km of your location
              </p>
            </div>

            {nearbyUsers.length === 0 ? (
              <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                <p className="text-gray-500">No nearby users found.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {nearbyUsers.map((user) => (
                  <UserCard key={user.userId} user={user} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
