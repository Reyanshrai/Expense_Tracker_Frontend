import { authContext } from "@/src/context/authContext";
import { useContext } from "react";

export const useAuth = () => {
  return useContext(authContext);
};
