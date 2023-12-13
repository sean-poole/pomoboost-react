import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Header() {
  const { auth } = useAuth();
  
  return (
    <header className="d-flex justify-content-center p-2">
      {auth ? (
        <Link to="/tasks" className="header-title"><h1>Pomoboost</h1></Link>
      ) : (
        <Link to="/" className="header-title"><h1>Pomoboost</h1></Link>
      )}
    </header>
  );
}
