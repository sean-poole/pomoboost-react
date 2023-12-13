import axios from "axios";
import useAuth from "./useAuth";

const backendURL = process.env.REACT_APP_BACKEND_URL;

export default function useRefreshToken() {
  const { auth, setAuth } = useAuth();
  const { accessToken } = auth;

  const refresh = async () => {
    const response = await axios.get(`${backendURL}/refresh`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    setAuth(prev => {
      console.log("Previous User Object: ", JSON.stringify(prev));
      console.log("New Access Token: ", response.data.accessToken);
      return { ...prev, accessToken: response.data.accessToken }
    });
  
    return response.data.accessToken;
  }

  return refresh;
}