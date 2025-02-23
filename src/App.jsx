import { React, useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { ProductProvider } from "./context/ProductContext";
import { useUser } from "./context/UserContext"; 
import "./App.css";
import { v4 as uuidv4 } from "uuid";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, setUser } = useUser(); 
  const navigate = useNavigate();

  useEffect(() => {
    const adminUser = {
      id: uuidv4(),
      username: "admin",
      email: "admin@admin.com",
      password: "admin@123",
      role: "admin",
      isBlocked: false,
      createdDate: "2/20/2025, 8:42:45 PM",
    };

    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const adminExists = savedUsers.some(
      (user) => user.username === adminUser.username && user.role === "admin"
    );

    if (!adminExists) {
      savedUsers.push(adminUser);
      localStorage.setItem("users", JSON.stringify(savedUsers));
    }

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, [setUser]);

  return (
    <ProductProvider>
      <div className="flex flex-col h-screen">
        {user && (
          <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        )}
        <div className="flex flex-1 lg:flex-row overflow-hidden">
          {/* ✅ Only show sidebar if user is logged in */}
          {user && <Sidebar isOpen={isSidebarOpen} role={user.role} />}

          <div className="flex-1 min-h-screen p-4 mt-10 overflow-auto">
            <Routes>
              {/* ✅ Public Routes */}
              {!user && (
                <>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </>
              )}

              {/* ✅ Protected Routes (Requires login) */}
              {user && (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />{" "}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="*" element={<Navigate to="/login" />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/contact" element={<Contact />} />
                  {/* ✅ Only Admins See These */}
                  {user.role === "admin" && (
                    <>
                      <Route path="/users" element={<Users />} />
                    </>
                  )}
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              )}
            </Routes>
          </div>
        </div>
      </div>
    </ProductProvider>
  );
};

export default App;
