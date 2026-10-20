
import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../api.js";

function Settings({ name, onNameChange }) {
  const [form, setForm] = useState({
    name: name || "",
    theme: "sage",
    reminders: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();

        if (data && typeof data === "object") {
          setForm({
            name: data.name || name || "",
            theme: data.theme || "sage",
            reminders:
              typeof data.reminders === "boolean" ? data.reminders : true,
          });
        }
      } catch (err) {
        setError(err.message || "Could not load settings.");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, [name]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setSaving(true);

    try {
      const updated = await updateSettings({
        name: form.name.trim(),
        theme: form.theme,
        reminders: form.reminders,
      });

      const savedName = updated?.name || form.name.trim();

      setForm((previous) => ({
        ...previous,
        name: savedName,
      }));

      onNameChange?.(savedName);
      localStorage.setItem("studyBloomName", savedName);

      setMessage("Your settings have been saved!");
    } catch (err) {
      setError(err.message || "Could not save your settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="page-content tasks-page">
        <p>Loading your settings...</p>
      </section>
    );
  }

  return (
    <section className="page-content tasks-page">
      <div className="task-page-heading">
        <div>
          <p className="eyebrow">MAKE IT YOUR OWN</p>
          <h1>Settings <span>⚙</span></h1>
          <p className="page-description">
            Personalise your StudyBloom space to suit you.
          </p>
        </div>
      </div>

      <div className="task-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">YOUR PROFILE</p>
            <h2>Personal preferences</h2>
          </div>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-field full-width">
            <label htmlFor="settings-name">Display name</label>
            <input
              id="settings-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
            <small>This name will appear in your dashboard.</small>
          </div>

          <div className="form-field full-width">
            <label htmlFor="settings-theme">Theme preference</label>
            <select
              id="settings-theme"
              name="theme"
              value={form.theme}
              onChange={handleChange}
            >
              <option value="sage">Sage green</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <small>
              This saves your preference. Applying different colours throughout
              the app requires connecting it to your theme styles.
            </small>
          </div>

          <div className="form-field full-width">
            <label className="settings-checkbox-label">
              <input
                type="checkbox"
                name="reminders"
                checked={form.reminders}
                onChange={handleChange}
              />
              Enable reminders preference
            </label>
            <small>
              This saves your preference; it does not send notifications yet.
            </small>
          </div>

          <div className="form-actions full-width">
            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save settings"}
            </button>
          </div>
        </form>

        {error && <p className="message error-message">{error}</p>}
        {message && <p className="message success-message">{message}</p>}
      </div>
    </section>
  );
}

export default Settings;
