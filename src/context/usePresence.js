import { useContext } from "react";
import { PresenceContext } from "./PresenceProvider";

const usePresence = () => {
  return useContext(PresenceContext);
};

export default usePresence;
