import { useContext } from "react";
import { NotificationContext } from "./NotificationProvider";

const useNotification = () => {
  return useContext(NotificationContext);
};

export default useNotification;
