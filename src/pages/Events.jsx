
import { useEffect, useState } from "react";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../api.js";

const emptyEvent = {
  title: "",
  description: "",
  date: "",
  time: "",
  category: "Study",
};

function Events() {
  const [events, setEvents] = useState([]);
  const [eventForm, setEventForm] = useState(emptyEvent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadEvents() {
    setLoading(true);
    setError("");

    try {
      const data = await getEvents();
      setEvents(Array.isArray(data) ? data : data.events || []);
    } catch (err) {
      setError(err.message || "Could not load events.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function handleInput(event) {
    const { name, value } = event.target;

    setEventForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleAddEvent(event) {
    event.preventDefault();

    if (!eventForm.title.trim() || !eventForm.date) {
      setError("Please enter an event title and date.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await createEvent({
        ...eventForm,
        title: eventForm.title.trim(),
        description: eventForm.description.trim(),
      });

      const savedEvent = result.event || result;
      setEvents((current) => [...current, savedEvent]);
      setEventForm(emptyEvent);
      setSuccess("Your event has been saved!");
    } catch (err) {
      setError(err.message || "Could not save the event.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleEvent(eventItem) {
    const id = eventItem._id || eventItem.id;
    const updatedCompleted = !eventItem.completed;

    setError("");
    setSuccess("");

    setEvents((current) =>
      current.map((item) =>
        (item._id || item.id) === id
          ? { ...item, completed: updatedCompleted }
          : item
      )
    );

    try {
      const result = await updateEvent(id, {
        completed: updatedCompleted,
      });

      const savedEvent = result.event || result;

      if (savedEvent && (savedEvent._id || savedEvent.id)) {
        setEvents((current) =>
          current.map((item) =>
            (item._id || item.id) === id
              ? { ...item, ...savedEvent }
              : item
          )
        );
      }
    } catch (err) {
      setEvents((current) =>
        current.map((item) =>
          (item._id || item.id) === id
            ? { ...item, completed: eventItem.completed }
            : item
        )
      );

      setError(err.message || "Could not update the event.");
    }
  }

  async function handleDeleteEvent(eventItem) {
    const id = eventItem._id || eventItem.id;
    const previousEvents = events;

    setEvents((current) =>
      current.filter((item) => (item._id || item.id) !== id)
    );

    setError("");
    setSuccess("");

    try {
      await deleteEvent(id);
      setSuccess("Event deleted successfully.");
    } catch (err) {
      setEvents(previousEvents);
      setError(err.message || "Could not delete the event.");
    }
  }

  return (
    <section className="page-content tasks-page">
      <div className="section-heading task-page-heading">
        <div>
          <p className="eyebrow">SAVE WHAT MATTERS</p>
          <h1>Calendar & Events <span>✿</span></h1>
          <p className="page-description">
            Keep track of exams, assignments, and special days.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={loadEvents}
          disabled={loading}
        >
          ↻ Refresh
        </button>
      </div>

      <div className="task-panel">
        <div className="panel-heading">
          <div>
            <h2>Add an event</h2>
            <p>Give an important date a place in your plan.</p>
          </div>
          <span className="panel-flower">✿</span>
        </div>

        <form className="task-form" onSubmit={handleAddEvent}>
          <div className="form-field full-width">
            <label htmlFor="eventTitle">Event title *</label>
            <input
              id="eventTitle"
              name="title"
              value={eventForm.title}
              onChange={handleInput}
              placeholder="e.g. Data structures exam"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="eventDate">Date *</label>
            <input
              id="eventDate"
              type="date"
              name="date"
              value={eventForm.date}
              onChange={handleInput}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="eventTime">Time</label>
            <input
              id="eventTime"
              type="time"
              name="time"
              value={eventForm.time}
              onChange={handleInput}
            />
          </div>

          <div className="form-field">
            <label htmlFor="eventCategory">Category</label>
            <select
              id="eventCategory"
              name="category"
              value={eventForm.category}
              onChange={handleInput}
            >
              <option value="Study">Study</option>
              <option value="Exam">Exam</option>
              <option value="Assignment">Assignment</option>
              <option value="Personal">Personal</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="eventDescription">Description</label>
            <textarea
              id="eventDescription"
              name="description"
              value={eventForm.description}
              onChange={handleInput}
              placeholder="Optional details"
              rows={3}
            />
          </div>

          <div className="full-width form-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "+ Add event"}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="message error-message" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="message success-message" role="status">
          ✓ {success}
        </div>
      )}

      <div className="task-list-heading">
        <div>
          <p className="eyebrow">YOUR IMPORTANT DATES</p>
          <h2>Upcoming events</h2>
        </div>
        <span className="task-total">{events.length} events</span>
      </div>

      {loading ? (
        <div className="empty-state">
          <span className="empty-flower">✿</span>
          <h3>Loading events...</h3>
        </div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <span className="empty-flower">✿</span>
          <h3>Your calendar is ready</h3>
          <p>Add an event to get started.</p>
        </div>
      ) : (
        <div className="task-list">
          {events.map((item) => (
            <article
              className={`task-card ${item.completed ? "task-completed" : ""}`}
              key={item._id || item.id}
            >
              <button
                type="button"
                className={`task-check ${item.completed ? "checked" : ""}`}
                onClick={() => handleToggleEvent(item)}
                aria-label="Toggle event completion"
              >
                {item.completed ? "✓" : ""}
              </button>

              <div className="task-card-content">
                <h3>{item.title}</h3>

                {item.description && <p>{item.description}</p>}

                <div className="task-metadata">
                  {item.date && <span className="task-date">{item.date}</span>}
                  {item.time && <span>{item.time}</span>}
                  {item.category && (
                    <span className="task-subject">{item.category}</span>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="delete-task-button"
                onClick={() => handleDeleteEvent(item)}
                aria-label={`Delete ${item.title}`}
                title="Delete event"
              >
                ×
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Events;
