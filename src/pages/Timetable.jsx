
import { useEffect, useState } from "react";
import {
  getTimetable,
  createTimetable,
  updateTimetable,
  deleteTimetable,
} from "../api.js";

const emptyEntry = {
  title: "",
  subject: "",
  day: "Monday",
  startTime: "",
  endTime: "",
  location: "",
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function Timetable() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(emptyEntry);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadTimetable() {
    try {
      setError("");
      const data = await getTimetable();
      setEntries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load the timetable.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTimetable();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.title.trim()) {
      setError("Please enter a class title.");
      return;
    }

    try {
      if (editingId) {
        await updateTimetable(editingId, form);
        setMessage("Timetable entry updated successfully!");
      } else {
        await createTimetable(form);
        setMessage("Timetable entry added successfully!");
      }

      setForm(emptyEntry);
      setEditingId(null);
      await loadTimetable();
    } catch (err) {
      setError(err.message || "Could not save the timetable entry.");
    }
  }

  function handleEdit(entry) {
    setForm({
      title: entry.title || "",
      subject: entry.subject || "",
      day: entry.day || "Monday",
      startTime: entry.startTime || "",
      endTime: entry.endTime || "",
      location: entry.location || "",
    });

    setEditingId(entry._id);
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this timetable entry?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");
      await deleteTimetable(id);
      setEntries((previous) =>
        previous.filter((entry) => entry._id !== id)
      );
      setMessage("Timetable entry deleted successfully!");

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyEntry);
      }
    } catch (err) {
      setError(err.message || "Could not delete the entry.");
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(emptyEntry);
    setError("");
    setMessage("");
  }

  const sortedEntries = [...entries].sort((a, b) => {
    const dayDifference = days.indexOf(a.day) - days.indexOf(b.day);

    if (dayDifference !== 0) return dayDifference;

    return (a.startTime || "").localeCompare(b.startTime || "");
  });

  return (
    <section className="page-content tasks-page">
      <div className="task-page-heading">
        <div>
          <p className="eyebrow">PLAN YOUR CLASSES</p>
          <h1>My Timetable <span>◷</span></h1>
          <p className="page-description">
            Organise your classes and give every subject its own time.
          </p>
        </div>
      </div>

      <div className="task-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">
              {editingId ? "MAKE CHANGES" : "ADD A CLASS"}
            </p>
            <h2>{editingId ? "Edit timetable entry" : "New timetable entry"}</h2>
          </div>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="title">Class title *</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Data Structures"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
            />
          </div>

          <div className="form-field">
            <label htmlFor="day">Day</label>
            <select
              id="day"
              name="day"
              value={form.day}
              onChange={handleChange}
            >
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="startTime">Start time</label>
            <input
              id="startTime"
              name="startTime"
              type="time"
              value={form.startTime}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="endTime">End time</label>
            <input
              id="endTime"
              name="endTime"
              type="time"
              value={form.endTime}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="location">Classroom / location</label>
            <input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Room 204"
            />
          </div>

          <div className="form-actions full-width">
            <button type="submit" className="primary-button">
              {editingId ? "Save changes" : "Add to timetable"}
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
          <p className="eyebrow">YOUR WEEK</p>
          <h2>Class schedule</h2>
        </div>
        <span className="task-total">
          {entries.length} {entries.length === 1 ? "class" : "classes"}
        </span>
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Loading your timetable...</p>
        </div>
      ) : sortedEntries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-flower">◷</div>
          <h3>Your timetable starts here</h3>
          <p>Add your first class using the form above.</p>
        </div>
      ) : (
        <div className="task-list">
          {sortedEntries.map((entry) => (
            <article className="task-card" key={entry._id}>
              <div className="task-card-content">
                <div>
                  <span className="task-date">
                    {entry.day || "Day not set"}
                  </span>
                  <h3>{entry.title}</h3>
                  {entry.subject && (
                    <p className="task-subject">{entry.subject}</p>
                  )}
                  <div className="task-metadata">
                    {entry.startTime && (
                      <span>
                        ◷ {entry.startTime}
                        {entry.endTime ? ` – ${entry.endTime}` : ""}
                      </span>
                    )}
                    {entry.location && <span>⌖ {entry.location}</span>}
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => handleEdit(entry)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => handleDelete(entry._id)}
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

export default Timetable;
