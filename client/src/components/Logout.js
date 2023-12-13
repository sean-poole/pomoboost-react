import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Logout() {
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${backendURL}/logout`);
      console.log("Logging out...", response.data);

      logout();
      navigate("/");
    } catch(err) {
      console.error("Error logging out: ", err);
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="button-style"
    >
      Logout
    </button>
  );
}
