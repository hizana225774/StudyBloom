
import { useEffect, useState } from "react";
import {
  getRoutines,
  createRoutine,
  updateRoutine,
  deleteRoutine,
} from "../api.js";

const emptyRoutine = {
  title: "",
  description: "",
  time: "",
  category: "Study",
};

function Routine() {
  const [routines, setRoutines] = useState([]);
  const [form, setForm] = useState(emptyRoutine);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadRoutines() {
    try {
      setError("");
      const data = await getRoutines();
      setRoutines(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load your routine.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRoutines();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.title.trim()) {
      setError("Please enter a routine activity.");
      return;
    }

    try {
      if (editingId) {
        await updateRoutine(editingId, form);
        setMessage("Routine updated successfully!");
      } else {
        await createRoutine(form);
        setMessage("Routine activity added successfully!");
      }

      setForm(emptyRoutine);
      setEditingId(null);
      await loadRoutines();
    } catch (err) {
      setError(err.message || "Could not save this routine.");
    }
  }

  function handleEdit(routine) {
    setForm({
      title: routine.title || "",
      description: routine.description || "",
      time: routine.time || "",
      category: routine.category || "Study",
    });
    setEditingId(routine._id);
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this routine activity?")) return;

    try {
      setError("");
      setMessage("");
      await deleteRoutine(id);
      setRoutines((previous) =>
        previous.filter((routine) => routine._id !== id)
      );
      setMessage("Routine activity deleted successfully!");

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyRoutine);
      }
    } catch (err) {
      setError(err.message || "Could not delete this routine.");
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(emptyRoutine);
    setError("");
    setMessage("");
  }

  const sortedRoutines = [...routines].sort((a, b) =>
    (a.time || "").localeCompare(b.time || "")
  );

  return (
    <section className="page-content tasks-page">
      <div className="task-page-heading">
        <div>
          <p className="eyebrow">BUILD GENTLE HABITS</p>
          <h1>My Routine <span>✿</span></h1>
          <p className="page-description">
            Create a routine that works for you, one small habit at a time.
          </p>
        </div>
      </div>

      <div className="task-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">
              {editingId ? "UPDATE YOUR PLAN" : "PLAN YOUR DAY"}
            </p>
            <h2>{editingId ? "Edit routine" : "Add a routine activity"}</h2>
          </div>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="routine-title">Activity *</label>
            <input
              id="routine-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Revise Data Structures"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="routine-category">Category</label>
            <select
              id="routine-category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="Study">Study</option>
              <option value="College">College</option>
              <option value="Exercise">Exercise</option>
              <option value="Break">Break</option>
              <option value="Personal">Personal</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="routine-time">Time</label>
            <input
              id="routine-time"
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
            />
          </div>

          <div className="form-field full-width">
            <label htmlFor="routine-description">Description</label>
            <textarea
              id="routine-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add a little detail about this activity..."
              rows="3"
            />
          </div>

          <div className="form-actions full-width">
            <button type="submit" className="primary-button">
              {editingId ? "Save changes" : "Add to routine"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {error && <p className="message error-message">{error}</p>}
        {message && <p className="message success-message">{message}</p>}
      </div>

      <div className="task-list-heading">
        <div>
          <p className="eyebrow">YOUR DAILY PLAN</p>
          <h2>Routine activities</h2>
        </div>
        <span className="task-total">
          {routines.length} {routines.length === 1 ? "activity" : "activities"}
        </span>
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Loading your routine...</p>
        </div>
      ) : sortedRoutines.length === 0 ? (
        <div className="empty-state">
          <div className="empty-flower">✿</div>
          <h3>Make space for good habits</h3>
          <p>Add your first routine activity using the form above.</p>
        </div>
      ) : (
        <div className="task-list">
          {sortedRoutines.map((routine) => (
            <article className="task-card" key={routine._id}>
              <div className="task-card-content">
                <div>
                  <span className="task-date">
                    {routine.time || "Time not set"}
                  </span>
                  <h3>{routine.title}</h3>
                  {routine.description && <p>{routine.description}</p>}
                  <div className="task-metadata">
                    <span className="task-subject">
                      {routine.category || "Other"}
                    </span>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => handleEdit(routine)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => handleDelete(routine._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Routine;
