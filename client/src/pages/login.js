import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const backendURL = process.env.REACT_APP_BACKEND_URL;

export default function Login() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendURL}/login`,
        { email, password },
        { withCredentials: true }
      );
      // console.log("Log in response: ", response.data);

      const accessToken = response?.data?.accessToken;
      // console.log("Access token: ", accessToken);

      setSuccess(true);
      setAuth({ email, password, accessToken });
      // Clear input fields upon successful login.
      setEmail("");
      setPassword("");
      // Redirect to Tasks page
      navigate("/tasks");

    } catch(err) {
      if (!err?.response) {
        setErrMsg("No server response.");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing email or password.");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized.");
      } else {
        setErrMsg("Login failed.");
      }

      // For screen readers.
      errRef.current.focus();
    }
  }

  return (
    <section className="auth--container">
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        { errMsg }
      </p>
      <h2 className="form-title">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="form-label">
            <label htmlFor="email">Email: </label>
          </div>
          <div className="form-control">
            <input 
              type="text"
              id="email"
              ref={emailRef}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <div className="form-label">
            <label htmlFor="password">Password: </label>
          </div>
          <div className="form-control">
            <input 
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>
        </div>
        <button type="submit" className="button-style">Submit</button>
      </form>
      <p>
        Need an account? <br />
        <span>
          <Link to="/signup" className="form-link">Sign Up</Link>
        </span>
      </p>
    </section>
  );
}
