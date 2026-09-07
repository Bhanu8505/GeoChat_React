import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";

const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await userService.myProfile();
        setProfile(response.data.data);
      } catch (error) {
        console.error(
          "Failed to load profile:",
          error.response?.data?.apiError?.message,
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <p className="text-red-500">Unable to load profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-linear-to-r from-blue-500 to-indigo-600" />

        {/* Profile Header */}
        <div className="px-6 pb-6">
          <div className="flex justify-between items-end">
            {/* Profile Picture */}
            <div className="-mt-16">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden flex items-center justify-center">
                {profile?.profilePictureUrl ? (
                  <img
                    src={profile.profilePictureUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-semibold text-gray-500">
                    {profile?.fullName?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Edit button */}
            <button
              onClick={() => navigate("/profile/edit")}
              className="px-5 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Edit Profile
            </button>
          </div>

          {/* Name */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {profile?.fullName}
            </h1>

            <p className="text-gray-500">@{profile?.username}</p>
          </div>

          {/* Bio */}
          {profile?.bio && (
            <p className="mt-4 text-gray-700 leading-relaxed">{profile?.bio}</p>
          )}
        </div>

        {/* Divider */}
        <div className="border-t" />

        {/* Profile Information */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                ✉️
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>

                <p className="font-medium text-gray-800">{profile?.email}</p>
              </div>
            </div>

            {/* Username */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                👤
              </div>

              <div>
                <p className="text-sm text-gray-500">Username</p>

                <p className="font-medium text-gray-800">
                  @{profile?.username}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                📍
              </div>

              <div>
                <p className="text-sm text-gray-500">Location</p>

                {profile?.latitude !== 0 && profile?.longitude !== 0 ? (
                  <p className="font-medium text-gray-800">
                    {profile?.latitude.toFixed(5)},{" "}
                    {profile?.longitude.toFixed(5)}
                  </p>
                ) : (
                  <p className="text-gray-400">Location not available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
