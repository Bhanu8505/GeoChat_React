import { createContext, useEffect, useState } from "react";
import userService from "../services/userService";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import websocketService from "../services/webSocketService";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken"),
  );

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setAuthLoading(false);
      return;
    }

    checkAuth();
  }, []);

  useEffect(() => {
    const handleTokenUpdate = (event) => {
      setAccessToken(event.detail);
    };

    window.addEventListener("accessTokenUpdated", handleTokenUpdate);

    return () => {
      window.removeEventListener("accessTokenUpdated", handleTokenUpdate);
    };
  }, []);

  const register = async (data) => {
    try {
      const res = await authService.register(data);
      return {
        success: true,
      };
    } catch (error) {
      console.log("Error Signing up", error.data?.message || error.message);
      return {
        success: false,
        message: error?.data?.message || "Error Signing up",
      };
    }
  };

  const login = async (data) => {
    try {
      const res = await authService.login(data);
      console.log("Login Request Sent ");
      console.log("Login Request Response : ", res.data);
      const accessToken = res.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      setAccessToken(accessToken);

      await checkAuth();

      return {
        success: true,
      };
    } catch (error) {
      console.log(
        "error while logging in : ",
        error.data?.message || error.message,
      );
      return {
        success: false,
        message: error?.data?.message || "Something went wrong",
      };
    }
  };

  const checkAuth = async () => {
    try {
      const res = await userService.myProfile();
      setAuthUser(res.data);
      console.log("Check Auth res : ", res);
    } catch (error) {
      console.log("error checking Auth user : ", error?.data || error.message);

      setAuthUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const res = await authService.refreshToken();
      console.log("Refresh Token Request Sent");
      console.log("Res in Refresh Token Request : ", res.data);
      const newAccessToken = res.data.accessToken;

      localStorage.setItem("accessToken", newAccessToken);
      setAccessToken(newAccessToken);
      return {
        success: true,
        data: res.data,
      };
    } catch (error) {
      console.log("Error updating refresh token");
      console.log("");
      return {
        success: false,
        message:
          error.data?.message ||
          error.message ||
          "Error updating refresh token",
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.log("Error on logout : ", error);
    } finally {
      await websocketService.disconnect();
      localStorage.removeItem("accessToken");
      setAccessToken(null);
      setAuthUser(null);
    }
  };

  // const updateUser = async () => {
  //   try {
  //     const res = await userService.updateUser(data);
  //     console.log("Update User Request Sent");
  //     console.log("Response for User Update Request : ", res.data);
  //     setAuthUser(res.data);
  //     return {
  //       success: true,
  //       data: res.data,
  //     };
  //   } catch (error) {
  //     console.log("Error Updating User");
  //     console.log("Error : ", error.data?.message);
  //     return {
  //       success: false,
  //       message: error.data?.message || "Something Went Wrong",
  //     };
  //   }
  // };

  // const userProfile = async () => {
  //   try {
  //     const res = await userService.userProfile(data);
  //     console.log("User Profile Request Sent");
  //     console.log("Response for User Profile Request : ", res.data);
  //     return {
  //       success: true,
  //       data: res.data,
  //     };
  //   } catch (error) {
  //     console.log("Error getting User Profile");
  //     console.log("Error : ", error.data?.message);
  //     return {
  //       success: false,
  //       message: error.data?.message || "Something Went Wrong",
  //     };
  //   }
  // };

  // const updateLocation = async () => {
  //   try {
  //     const res = await userService.updateLocation(data);
  //     console.log("Update User Location Request Sent");
  //     console.log("Response for User Location Update Request : ", res.data);
  //     return {
  //       success: true,
  //       data: res.data,
  //     };
  //   } catch (error) {
  //     console.log("Error Updating User Location");
  //     console.log("Error : ", error.data?.message);
  //     return {
  //       success: false,
  //       message: error.data?.message || "Something Went Wrong",
  //     };
  //   }
  // };

  // const getNearbyUsers = async () => {
  //   try {
  //     const res = await userService.getNearbyUsers(data);
  //     console.log("Getting Nearby Users Request Sent");
  //     console.log("Response for Getting Nearby Users Request : ", res.data);
  //     return {
  //       success: true,
  //       data: res.data,
  //     };
  //   } catch (error) {
  //     console.log("Error Getting Nearby Users");
  //     console.log("Error : ", error.data?.message);
  //     return {
  //       success: false,
  //       message: error.data?.message || "Something Went Wrong",
  //     };
  //   }
  // };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        authLoading,
        accessToken,
        register,
        login,
        checkAuth,
        refreshToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
