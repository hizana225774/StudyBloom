
import { useState } from "react";
import "./App.css";

import { login, register, logout } from "./api.js";

import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Tasks from "./pages/Tasks.jsx";
import Events from "./pages/Events.jsx";
import Timetable from "./pages/Timetable.jsx";
import Routine from "./pages/Routine.jsx";
import Settings from "./pages/Settings.jsx";

function App() {
  const [name, setName] = useState(
    () => localStorage.getItem("studyBloomName") || ""
  );

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem("studyBloomToken"))
  );

  const [authMode, setAuthMode] = useState("login");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [activePage, setActivePage] = useState("Dashboard");

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthError("");

    const username = usernameInput.trim().toLowerCase();

    if (username.length < 3 || username.length > 30) {
      setAuthError("Username must be between 3 and 30 characters.");
      return;
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      setAuthError(
        "Use only lowercase letters, numbers, and underscores in your username."
      );
      return;
    }

    if (passwordInput.length < 8 || passwordInput.length > 72) {
      setAuthError("Password must be between 8 and 72 characters.");
      return;
    }

    if (
      authMode === "register" &&
      passwordInput !== confirmPassword
    ) {
      setAuthError("The passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const result =
        authMode === "register"
          ? await register(username, passwordInput)
          : await login(username, passwordInput);

      const accountName = result.user?.username || username;

      localStorage.setItem("studyBloomName", accountName);
      setName(accountName);
      setIsAuthenticated(true);
      setUsernameInput("");
      setPasswordInput("");
      setConfirmPassword("");
      setActivePage("Dashboard");
    } catch (error) {
      setAuthError(error.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    logout();
    setName("");
    setIsAuthenticated(false);
    setUsernameInput("");
    setPasswordInput("");
    setConfirmPassword("");
    setAuthError("");
    setAuthMode("login");
    setActivePage("Dashboard");
  }

  function handleNameChange(newName) {
    const cleanedName = newName.trim();

    if (!cleanedName) return;

    localStorage.setItem("studyBloomName", cleanedName);
    setName(cleanedName);
  }

  if (!isAuthenticated || !name) {
    return (
      <main className="welcome-page">
        <section className="welcome-card">
          <div className="brand-mark">✿</div>

          <p className="eyebrow">YOUR LITTLE SPACE TO GROW</p>

          <h1>Welcome to StudyBloom</h1>

          <p className="welcome-description">
            A calmer way to organise your studies, build good habits,
            and make room for yourself.
          </p>

          <div
            className="auth-switch"
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "22px"
            }}
          >
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                setAuthMode("login");
                setAuthError("");
              }}
              disabled={isLoading}
              style={{
                flex: 1,
                opacity: authMode === "login" ? 1 : 0.65
              }}
            >
              Log in
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={() => {
                setAuthMode("register");
                setAuthError("");
              }}
              disabled={isLoading}
              style={{
                flex: 1,
                opacity: authMode === "register" ? 1 : 0.65
              }}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="welcome-form">
            <label htmlFor="studentUsername">Username</label>

            <input
              id="studentUsername"
              value={usernameInput}
              onChange={(event) =>
                setUsernameInput(event.target.value)
              }
              placeholder="Choose a username"
              minLength={3}
              maxLength={30}
              autoComplete="username"
              required
              disabled={isLoading}
            />

            <label htmlFor="studentPassword">Password</label>

            <input
              id="studentPassword"
              type="password"
              value={passwordInput}
              onChange={(event) =>
                setPasswordInput(event.target.value)
              }
              placeholder="Enter your password"
              minLength={8}
              maxLength={72}
              autoComplete={
                authMode === "login"
                  ? "current-password"
                  : "new-password"
              }
              required
              disabled={isLoading}
            />

            {authMode === "register" && (
              <>
                <label htmlFor="confirmPassword">
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Enter your password again"
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  required
                  disabled={isLoading}
                />
              </>
            )}

            {authError && (
              <p
                role="alert"
                style={{
                  color: "#b42318",
                  fontSize: "0.9rem",
                  marginTop: "12px"
                }}
              >
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="primary-button"
              disabled={isLoading}
            >
              {isLoading
                ? "Please wait..."
                : authMode === "login"
                  ? "Log in"
                  : "Create account"}
              {!isLoading && <span> →</span>}
            </button>
          </form>

          <p className="welcome-note">
            {authMode === "login"
              ? "Welcome back! Keep growing, one step at a time."
              : "Your own little study space starts here."}
          </p>
        </section>
      </main>
    );
  }

  function renderPage() {
    switch (activePage) {
      case "Dashboard":
        return (
          <Dashboard
            name={name}
            tasks={[]}
            onOpenTasks={() => setActivePage("My Tasks")}
          />
        );

      case "My Tasks":
        return <Tasks />;

      case "Calendar & Events":
        return <Events />;

      case "Timetable":
        return <Timetable />;

      case "My Routine":
        return <Routine />;

      case "Settings":
        return (
          <Settings
            name={name}
            onNameChange={handleNameChange}
          />
        );

      default:
        return (
          <Dashboard
            name={name}
            tasks={[]}
            onOpenTasks={() => setActivePage("My Tasks")}
          />
        );
    }
  }

  return (
    <div className="app-layout">
      <Sidebar
        name={name}
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={handleLogout}
        taskCount={0}
      />

      <main className="main-content">
        <Header name={name} onLogout={handleLogout} />

        {renderPage()}
      </main>
    </div>
  );
}

export default App;
