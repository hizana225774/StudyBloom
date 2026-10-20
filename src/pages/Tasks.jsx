
import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api.js";

const emptyTask = {
  title: "",
  description: "",
  subject: "",
  dueDate: "",
  priority: "Medium",
};

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadTasks() {
    setLoading(true);
    setError("");

    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      setError(err.message || "Could not load tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  function handleInput(event) {
    const { name, value } = event.target;

    setTaskForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleAddTask(event) {
    event.preventDefault();

    if (!taskForm.title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await createTask({
        ...taskForm,
        title: taskForm.title.trim(),
        description: taskForm.description.trim(),
        subject: taskForm.subject.trim(),
        completed: false,
      });

      const savedTask = result.task || result;

      setTasks((current) => [savedTask, ...current]);
      setTaskForm(emptyTask);
      setSuccess("Your task has been saved!");
    } catch (err) {
      setError(err.message || "Could not save your task.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleTask(task) {
    const id = task._id || task.id;
    const previousCompleted = task.completed;
    const updatedCompleted = !previousCompleted;

    setError("");
    setSuccess("");

    setTasks((current) =>
      current.map((item) =>
        (item._id || item.id) === id
          ? { ...item, completed: updatedCompleted }
          : item
      )
    );

    try {
      const result = await updateTask(id, {
        completed: updatedCompleted,
      });

      const savedTask = result.task || result;

      if (savedTask && (savedTask._id || savedTask.id)) {
        setTasks((current) =>
          current.map((item) =>
            (item._id || item.id) === id
              ? { ...item, ...savedTask }
              : item
          )
        );
      }
    } catch (err) {
      setTasks((current) =>
        current.map((item) =>
          (item._id || item.id) === id
            ? { ...item, completed: previousCompleted }
            : item
        )
      );

      setError(err.message || "Could not update the task.");
    }
  }

  async function handleDeleteTask(task) {
    const id = task._id || task.id;
    const previousTasks = tasks;

    setError("");
    setSuccess("");

    setTasks((current) =>
      current.filter((item) => (item._id || item.id) !== id)
    );

    try {
      await deleteTask(id);
      setSuccess("Task deleted successfully.");
    } catch (err) {
      setTasks(previousTasks);
      setError(err.message || "Could not delete the task.");
    }
  }

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <section className="page-content tasks-page">
      <div className="section-heading task-page-heading">
        <div>
          <p className="eyebrow">PLAN YOUR NEXT STEP</p>
          <h1>
            My Tasks <span>✿</span>
          </h1>
          <p className="page-description">
            Write it down, take a breath, and start where you are.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={loadTasks}
          disabled={loading}
        >
          ↻ Refresh
        </button>
      </div>

      <div className="task-stats">
        <div>
          <strong>{tasks.length}</strong>
          <span>All tasks</span>
        </div>
        <div>
          <strong>{pendingCount}</strong>
          <span>To do</span>
        </div>
        <div>
          <strong>{completedCount}</strong>
          <span>Completed</span>
        </div>
      </div>

      <div className="task-panel">
        <div className="panel-heading">
          <div>
            <h2>Add a new task</h2>
            <p>Keep your next step clear and simple.</p>
          </div>
          <span className="panel-flower">✿</span>
        </div>

        <form className="task-form" onSubmit={handleAddTask}>
          <div className="form-field full-width">
            <label htmlFor="taskTitle">Task title *</label>
            <input
              id="taskTitle"
              name="title"
              value={taskForm.title}
              onChange={handleInput}
              placeholder="e.g. Revise data structures"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="taskSubject">Subject</label>
            <input
              id="taskSubject"
              name="subject"
              value={taskForm.subject}
              onChange={handleInput}
              placeholder="e.g. Computer science"
            />
          </div>

          <div className="form-field">
            <label htmlFor="taskDueDate">Due date</label>
            <input
              id="taskDueDate"
              type="date"
              name="dueDate"
              value={taskForm.dueDate}
              onChange={handleInput}
            />
          </div>

          <div className="form-field">
            <label htmlFor="taskPriority">Priority</label>
            <select
              id="taskPriority"
              name="priority"
              value={taskForm.priority}
              onChange={handleInput}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="taskDescription">Description</label>
            <textarea
              id="taskDescription"
              name="description"
              value={taskForm.description}
              onChange={handleInput}
              placeholder="Add a little detail (optional)"
              rows={3}
            />
          </div>

          <div className="full-width form-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "+ Add task"}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="message error-message" role="alert">
          <span>!</span>
          <div>
            <strong>Something needs attention</strong>
            <p>{error}</p>
            {error.toLowerCase().includes("fetch") && (
              <small>Check that your backend is running on port 5000.</small>
            )}
          </div>
        </div>
      )}

      {success && (
        <div className="message success-message" role="status">
          ✓ {success}
        </div>
      )}

      <div className="task-list-heading">
        <div>
          <p className="eyebrow">YOUR TO-DO LIST</p>
          <h2>One thing at a time</h2>
        </div>
        <span className="task-total">{tasks.length} tasks</span>
      </div>

      {loading ? (
        <div className="empty-state">
          <span className="empty-flower">✿</span>
          <h3>Loading your tasks...</h3>
          <p>Just a moment.</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <span className="empty-flower">✿</span>
          <h3>Your list is ready to bloom</h3>
          <p>Add your first task using the form above.</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <article
              className={`task-card ${task.completed ? "task-completed" : ""}`}
              key={task._id || task.id}
            >
              <button
                type="button"
                className={`task-check ${task.completed ? "checked" : ""}`}
                onClick={() => handleToggleTask(task)}
                aria-label={
                  task.completed
                    ? "Mark task as incomplete"
                    : "Mark task as completed"
                }
                title="Toggle completion"
              >
                {task.completed ? "✓" : ""}
              </button>

              <div className="task-card-content">
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}

                <div className="task-metadata">
                  {task.subject && (
                    <span className="task-subject">{task.subject}</span>
                  )}

                  {task.dueDate && (
                    <span className="task-date">Due: {task.dueDate}</span>
                  )}

                  <span
                    className={`priority priority-${(
                      task.priority || "medium"
                    ).toLowerCase()}`}
                  >
                    {task.priority || "Medium"} priority
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="delete-task-button"
                onClick={() => handleDeleteTask(task)}
                aria-label={`Delete ${task.title}`}
                title="Delete task"
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

export default Tasks;
