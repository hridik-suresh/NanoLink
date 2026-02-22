import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

// TEMP
const Home = () => <div className="p-10 text-2xl">Home Page</div>;
const Login = () => <div className="p-10 text-2xl">Login Page</div>;
const Register = () => <div className="p-10 text-2xl">Register Page</div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* Navbar will go here later */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* We'll add /dashboard and /social-auth routes soon */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
