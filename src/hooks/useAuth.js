import { useContext } from "react";
import AuthContext from "../context/AuthProvider.js";

export default function useAuth() {
  return useContext(AuthContext);
}
