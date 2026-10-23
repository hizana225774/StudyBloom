
const API_URL = "https://studybloom-9d70.onrender.com/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

// TASKS
export function getTasks() {
  return request("/tasks");
}

export function createTask(task) {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export function updateTask(id, changes) {
  return request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(changes),
  });
}
