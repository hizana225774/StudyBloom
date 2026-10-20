
function Header({ name, onLogout }) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <header className="topbar">
      <div>
        <p className="topbar-date">
          {today.toUpperCase()}
        </p>
        <p className="topbar-subtitle">
          Your personal student space
        </p>
      </div>

      <div className="profile-actions">
        <span className="topbar-greeting">
          Hello, {name} 🌿
        </span>

        <button
          type="button"
          className="logout-button"
          onClick={onLogout}
        >
          Log out
        </button>
      </div>
    </header>
  );
}

export default Header;
