import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/layout/Navbar";
import Login from "./pages/Login";

// TEMP
const Home = () => <div className="p-10 text-2xl">Welcome to NanoLink!</div>;
const Register = () => <div className="p-10 text-2xl">Create your account</div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
