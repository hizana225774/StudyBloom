
const menuItems = [
  { label: "Dashboard", icon: "⌂" },
  { label: "My Tasks", icon: "✓" },
  { label: "Calendar & Events", icon: "▦" },
  { label: "Timetable", icon: "◷" },
  { label: "My Routine", icon: "☼" },
  { label: "Settings", icon: "⚙" },
];

function Sidebar({ name, activePage, onNavigate, onLogout, taskCount }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark small">✿</div>

        <div>
          <h2>StudyBloom</h2>
          <p>GROW AT YOUR OWN PACE</p>
        </div>
      </div>

      <p className="menu-heading">YOUR WORKSPACE</p>

      <nav className="side-navigation">
        {menuItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`nav-item ${
              activePage === item.label ? "active" : ""
            }`}
            onClick={() => onNavigate(item.label)}
          >
            <span className="nav-icon">{item.icon}</span>

            {item.label}

            {item.label === "My Tasks" && taskCount > 0 && (
              <span className="nav-count">{taskCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-quote">
        <span>“</span>
        <p>You don't have to bloom all at once.</p>
        <small>ONE DAY AT A TIME</small>
      </div>

      <div className="sidebar-bottom">
        <div className="profile-avatar">
          {name.charAt(0).toUpperCase()}
        </div>

        <div className="profile-info">
          <strong>{name}</strong>
          <small>Student</small>
        </div>

        <button
          type="button"
          className="logout-icon"
          onClick={onLogout}
          title="Log out"
          aria-label="Log out"
        >
          ↪
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
