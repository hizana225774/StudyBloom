
const API_URL = "https://studybloom-9d70.onrender.com/api";

// Get the saved authentication token
function getToken() {
  return localStorage.getItem("studyBloomToken");
}

// Common function for communicating with the backend
async function request(endpoint, options = {}) {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "Something went wrong."
    );
  }

  return data;
}

// AUTHENTICATION
export async function register(username, password) {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  if (data.token) {
    localStorage.setItem("studyBloomToken", data.token);
  }

  if (data.user?.username) {
    localStorage.setItem("studyBloomName", data.user.username);
  }

  return data;
}

export async function login(username, password) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  if (data.token) {
    localStorage.setItem("studyBloomToken", data.token);
  }

  if (data.user?.username) {
    localStorage.setItem("studyBloomName", data.user.username);
  }

  return data;
}

export function logout() {
  localStorage.removeItem("studyBloomToken");
  localStorage.removeItem("studyBloomName");
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

export function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: "DELETE",
  });
}

// EVENTS
export function getEvents() {
  return request("/events");
}

export function createEvent(event) {
  return request("/events", {
    method: "POST",
    body: JSON.stringify(event),
  });
}

export function updateEvent(id, changes) {
  return request(`/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(changes),
  });
}

export function deleteEvent(id) {
  return request(`/events/${id}`, {
    method: "DELETE",
  });
}

// TIMETABLE
export function getTimetable() {
  return request("/timetable");
}

export function createTimetable(entry) {
  return request("/timetable", {
    method: "POST",
    body: JSON.stringify(entry),
  });
}

export function updateTimetable(id, changes) {
  return request(`/timetable/${id}`, {
    method: "PUT",
    body: JSON.stringify(changes),
  });
}

export function deleteTimetable(id) {
  return request(`/timetable/${id}`, {
    method: "DELETE",
  });
}

// ROUTINES
export function getRoutines() {
  return request("/routines");
}

export function createRoutine(routine) {
  return request("/routines", {
    method: "POST",
    body: JSON.stringify(routine),
  });
}

export function updateRoutine(id, changes) {
  return request(`/routines/${id}`, {
    method: "PUT",
    body: JSON.stringify(changes),
  });
}

export function deleteRoutine(id) {
  return request(`/routines/${id}`, {
    method: "DELETE",
  });
}

// SETTINGS
export function getSettings() {
  return request("/settings");
}

export function updateSettings(settings) {
  return request("/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}
