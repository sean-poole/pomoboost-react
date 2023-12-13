import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";

import Login from "./pages/login";
import Signup from "./pages/signup";
import Tasks from "./pages/tasks";
import Missing from "./pages/missing";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={ <Layout /> }>
        { /* Public Routes */ }
        <Route path="/" element={ <Login /> } />
        <Route path="signup" element={ <Signup /> } />

        { /* Private Routes */ }
        <Route element={ <RequireAuth /> } >
          <Route path="tasks" element={ <Tasks /> } />
        </Route>
        
        { /* Catch All */ }
        <Route path="*" element={ <Missing /> } />
      </Route>
    </Routes>
  );
}
