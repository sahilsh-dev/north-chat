import { ThemeProvider } from "./components/ThemeProvider";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";

function RegisterPage() {
  localStorage.clear();
  return <Register />;
}

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
