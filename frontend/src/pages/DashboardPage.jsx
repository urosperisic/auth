// src/pages/DashboardPage.jsx

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      showSuccess("Logged out.");
      navigate("/login", { replace: true });
    } catch (err) {
      showError(err.message);
    }
  }

  return (
    <main className="page">
      <h1>Dashboard</h1>
      <p>Logged in as {user?.username}.</p>
      <button type="button" onClick={handleLogout}>
        Log out
      </button>
    </main>
  );
}