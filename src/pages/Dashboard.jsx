
function Dashboard({ name, tasks, onOpenTasks }) {
  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <section className="page-content">
      <div className="dashboard-hero">
        <div>
          <p className="eyebrow">A FRESH LITTLE START</p>

          <h1>
            You're growing,
            <br />
            <span>{name}.</span>
          </h1>

          <p className="hero-description">
            Every task you finish is a little promise you keep
            to yourself. Let's make today count.
          </p>

          <button
            className="primary-button dashboard-button"
            onClick={onOpenTasks}
          >
            View my tasks <span>→</span>
          </button>
        </div>

        <div className="hero-flower" aria-hidden="true">
          <span>✿</span>
          <small>
            GROW
            <br />
            GENTLY
          </small>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR PROGRESS</p>
          <h2>A little overview</h2>
        </div>

        <button className="text-button" onClick={onOpenTasks}>
          See tasks →
        </button>
      </div>

      <div className="overview-grid">
        <article className="overview-card">
          <div className="overview-icon lavender">✓</div>
          <p>Total tasks</p>
          <h3>{tasks.length}</h3>
          <small>Things you're working on</small>
        </article>

        <article className="overview-card">
          <div className="overview-icon peach">◷</div>
          <p>To do</p>
          <h3>{pendingCount}</h3>
          <small>One step at a time</small>
        </article>

        <article className="overview-card">
          <div className="overview-icon sage">✿</div>
          <p>Completed</p>
          <h3>{completedCount}</h3>
          <small>Look how far you've come</small>
        </article>
      </div>

      <div className="kindness-banner">
        <div className="kindness-icon">♡</div>
        <div>
          <h3>A gentle reminder</h3>
          <p>
            Productivity isn't about doing everything. It's
            about doing what matters, one thing at a time.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
