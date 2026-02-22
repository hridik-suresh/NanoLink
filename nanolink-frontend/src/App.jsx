import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/layout/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SocialAuth from "./pages/SocialAuth";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar />
        <main>
          <Routes>
            <Route
              path="/"
              element={<div className="p-10">Hero Section Coming Soon!</div>}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* The bridge for Google login */}
            <Route path="/social-auth" element={<SocialAuth />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
