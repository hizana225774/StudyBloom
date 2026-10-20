
import { useState } from "react";
import "./App.css";

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

  const [nameInput, setNameInput] = useState("");
  const [activePage, setActivePage] = useState("Dashboard");

  function handleNameSubmit(event) {
    event.preventDefault();

    const cleanedName = nameInput.trim();

    if (!cleanedName) return;

    localStorage.setItem("studyBloomName", cleanedName);
    setName(cleanedName);
    setActivePage("Dashboard");
  }

  function handleLogout() {
    localStorage.removeItem("studyBloomName");
    setName("");
    setNameInput("");
    setActivePage("Dashboard");
  }

  function handleNameChange(newName) {
    const cleanedName = newName.trim();

    if (!cleanedName) return;

    localStorage.setItem("studyBloomName", cleanedName);
    setName(cleanedName);
  }

  if (!name) {
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

          <form onSubmit={handleNameSubmit} className="welcome-form">
            <label htmlFor="studentName">
              What should we call you?
            </label>

            <input
              id="studentName"
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
              placeholder="Enter your name"
              maxLength={50}
              required
            />

            <button type="submit" className="primary-button">
              Let's get started <span>→</span>
            </button>
          </form>

          <p className="welcome-note">
            Small steps count. You've got this!
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
