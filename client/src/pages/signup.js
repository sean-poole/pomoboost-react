import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const backendURL = process.env.REACT_APP_BACKEND_URL;

// Input validation
const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function Signup() {
  const navigate = useNavigate();

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validUser, setValidUser] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // Set focus to user input upon render.
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Check for valid username
  useEffect(() => {
    const result = USER_REGEX.test(user);
    setValidUser(result);
  }, [user]);

  // Check for valid email address
  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  // Check for valid password & match
  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPassword(result);
    const match = password === matchPassword;
    setValidMatch(match);
  }, [password, matchPassword]);

  // Clear error messages when input fields change
  useEffect(() => {
    setErrMsg("");
  }, [user, email, password, matchPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prevents button loophole
    const v1 = USER_REGEX.test(user);
    const v2 = EMAIL_REGEX.test(email);
    const v3 = PWD_REGEX.test(password);
    if (!v1 || !v2 || !v3) {
      setErrMsg("Unauthorized Entry");
      return;
    }

    try {
      const response = await axios.post(`${backendURL}/signup`,
        { username: user, email, password, confirmPassword: matchPassword }
      );
      console.log(response.data);

      setSuccess(true);
      // Clear input fields upon successful signup
      setUser("");
      setEmail("");
      setPassword("");
      setMatchPassword("");
      // Redirect to Tasks page
      navigate("/tasks");
    } catch(err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username or Email Address Already In Use");
      } else {
        setErrMsg("Registration Failed");
      }

      // For screen readers
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
      <h2 className="form-title">Account Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="form-label">
            <label htmlFor="user">Username: </label>
            <span className={validUser ? "valid" : "hide"}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validUser || !user ? "hide" : "invalid"}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </div>
          <div className="form-control">
            <input 
              type="text"
              id="user"
              ref={userRef}
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
              aria-invalid={validUser ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <p
              id="uidnote"
              className={userFocus && user && !validUser ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.<br />
              Must begin with a letter.<br />
              Letters, numbers, underscores and hyphens allowed.
            </p>
          </div>
        </div>
        <div className="form-group">
          <div className="form-label">
            <label htmlFor="email">Email: </label>
            <span className={validEmail ? "valid" : "hide"}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validEmail || !email ? "hide" : "invalid"}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </div>
          <div className="form-control">
            <input
              type="text"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="emailnote"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
            <p
              id="emailnote"
              className={emailFocus && !validEmail ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Enter a valid email address.
            </p>
          </div>
        </div>
        <div className="form-group">
          <div className="form-label">
            <label htmlFor="password">Password: </label>
            <span className={validPassword ? "valid" : "hide"}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validPassword || !password ? "hide" : "invalid"}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </div>
          <div className="form-control">
            <input 
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              aria-invalid={validPassword ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
            />
            <p
              id="pwdnote"
              className={passwordFocus && !validPassword ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.<br />
              Must include uppercase and lowercase letters, a number and a special character.<br />
              Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="percent">%</span>
            </p>
          </div>
        </div>
        <div className="form-group">
          <div className="form-label">
            <label htmlFor="match-password">Confirm Password: </label>
            <span className={validMatch && matchPassword ? "valid" : "hide"}>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span className={validMatch || !matchPassword ? "hide" : "invalid"}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </div>
          <div className="form-control">
            <input 
              type="password"
              id="match-password"
              onChange={(e) => setMatchPassword(e.target.value)}
              value={matchPassword}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="matchnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="matchnote"
              className={matchFocus && !matchPassword ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Passwords must match.
            </p>
          </div>
        </div>
        <button
          type="submit"
          className="button-style"
          disabled={!validUser || !validEmail || !validPassword || !validMatch ? true : false}
        >
          Submit
        </button>
      </form>
      <p>
        <Link to="/" className="form-link">Go back</Link>
      </p>
    </section>
  );
}
