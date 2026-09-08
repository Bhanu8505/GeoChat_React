import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";

const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    bio: "",
    profilePictureUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await userService.myProfile();

        const profile = response.data.data;

        setFormData({
          username: profile.username || "",
          fullName: profile.fullName || "",
          bio: profile.bio || "",
          profilePictureUrl: profile.profilePictureUrl || "",
        });
      } catch (error) {
        const apiError = error.response?.data?.apiError;

        console.error("Failed to load profile:", apiError?.message);
        setErrors({
          message: apiError?.message,
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setErrors(null);

    try {
      await userService.updateUser(formData);

      navigate("/profile");
    } catch (error) {
      const apiError = error.response?.data?.apiError;

      const fieldError = {};

      apiError?.subErrors?.forEach((errorMessage) => {
        const [field, message] = errorMessage.split(": ");
        fieldError[field] = message;
      });
      console.error("Failed to load profile:", apiError?.message);
      // console.log("SubErrors:", apiError?.subErrors);
      // console.log("FieldErrors:", fieldError);
      setErrors({
        message: apiError?.message,
        ...fieldError,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>

        <p className="text-gray-500 mt-1">Update your profile information</p>
      </div>

      {/* Form Card */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        {errors && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {errors?.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture URL
            </label>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                {formData.profilePictureUrl ? (
                  <img
                    src={formData.profilePictureUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl text-gray-500">
                    {formData.fullName?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <input
                type="text"
                name="profilePictureUrl"
                value={formData.profilePictureUrl}
                onChange={handleChange}
                placeholder="https://example.com/profile.jpg"
                className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            {errors?.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>

            <div className="flex">
              <span className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-lg text-gray-500">
                @
              </span>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="username"
                className="flex-1 border rounded-r-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors?.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Bio
              </label>

              <span className="text-xs text-gray-400">
                {formData.bio.length}/500
              </span>
            </div>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              maxLength={500}
              rows={4}
              placeholder="Tell people a little about yourself..."
              className="w-full border rounded-lg px-3 py-2 resize-none outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors?.bio && (
              <p className="mt-1 text-sm text-red-500">{errors.bio}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-5 py-2 border rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
