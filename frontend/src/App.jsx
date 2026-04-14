import { useEffect, useState } from "react";

const API_BASE = "http://localhost:2000/api";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    credentials: "include",
    ...options,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

function App() {
  const [message, setMessage] = useState("Welcome");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddResource, setShowAddResource] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectDescription, setSubjectDescription] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [resourceInput, setResourceInput] = useState({
    title: "",
    description: "",
    file_url: "",
    subject_id: "",
  });
  const [resources, setResources] = useState([]);
  const [bookmarkInput, setBookmarkInput] = useState({ user_id: "", resource_id: "" });
  const [bookmarks, setBookmarks] = useState([]);

  const setError = (error) => setMessage(error.message || "Something went wrong");

  const loadCurrentUser = async () => {
    try {
      const data = await apiRequest("/auth/me");
      setCurrentUser(data.user);
      setIsLoggedIn(true);
    } catch {
      setCurrentUser(null);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadResources();
      loadSubjects();
    }
  }, [isLoggedIn]);

  const handleRegister = async () => {
    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      setMessage(data.message);
    } catch (error) {
      setError(error);
    }
  };

  const handleLogin = async () => {
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      setMessage(data.message);
      setCurrentUser(data.user);
      setIsLoggedIn(true);
    } catch (error) {
      setError(error);
    }
  };

  const handleLogout = async () => {
    try {
      const data = await apiRequest("/auth/logout", { method: "POST" });
      setMessage(data.message);
      setCurrentUser(null);
      setIsLoggedIn(false);
      setActiveTab("dashboard");
    } catch (error) {
      setError(error);
    }
  };

  const loadSubjects = async () => {
    try {
      const data = await apiRequest("/subjects");
      setSubjects(data);
      setMessage("Subjects loaded");
    } catch (error) {
      setError(error);
    }
  };

  const createSubject = async () => {
    try {
      const data = await apiRequest("/subjects", {
        method: "POST",
        body: JSON.stringify({ name: subjectName, description: subjectDescription }),
      });
      setMessage(`Subject created: ${data.name}`);
      setSubjectName("");
      setSubjectDescription("");
      await loadSubjects();
    } catch (error) {
      setError(error);
    }
  };

  const loadResources = async () => {
    try {
      const data = await apiRequest("/resources");
      setResources(data.resources ?? []);
      setMessage("Resources loaded");
    } catch (error) {
      setError(error);
    }
  };

  const createResource = async () => {
    try {
      const data = await apiRequest("/resources", {
        method: "POST",
        body: JSON.stringify({
          ...resourceInput,
          uploaded_by: Number(currentUser?.user_id),
          subject_id: Number(resourceInput.subject_id),
        }),
      });
      setMessage(data.message);
      setResourceInput({ title: "", description: "", file_url: "", subject_id: "" });
      setShowAddResource(false);
      await loadResources();
    } catch (error) {
      setError(error);
    }
  };

  const createBookmark = async () => {
    try {
      const data = await apiRequest("/bookmarks", {
        method: "POST",
        body: JSON.stringify({
          user_id: Number(bookmarkInput.user_id),
          resource_id: Number(bookmarkInput.resource_id),
        }),
      });
      setMessage(data.message);
    } catch (error) {
      setError(error);
    }
  };

  const loadBookmarksByUser = async () => {
    try {
      const targetUserId = bookmarkInput.user_id || currentUser?.user_id;
      const data = await apiRequest(`/bookmarks/${targetUserId}`);
      setBookmarks(data.bookmarks ?? []);
      setMessage("Bookmarks loaded");
    } catch (error) {
      setError(error);
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center p-6">
        <section className="w-full rounded-xl bg-white p-6 shadow">
          <h1 className="mb-2 text-2xl font-bold text-slate-800">Academic Resource Library</h1>
          <p className="mb-4 text-sm text-slate-600">Log in to access dashboard and navigation.</p>
          <p className="mb-4 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-800">{message}</p>
          <div className="space-y-3">
            <input className="w-full rounded border p-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input className="w-full rounded border p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="flex gap-3">
              <button className="rounded bg-slate-800 px-4 py-2 text-white" onClick={handleLogin}>Login</button>
              <button className="rounded bg-blue-600 px-4 py-2 text-white" onClick={handleRegister}>Register</button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-6">
      <header className="mb-6 rounded-xl bg-white p-4 shadow">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Academic Resource Library Dashboard</h1>
            <p className="text-sm text-slate-600">Logged in as {currentUser?.username}</p>
          </div>
          <button className="rounded bg-rose-600 px-4 py-2 text-white" onClick={handleLogout}>Logout</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className={`rounded px-3 py-1.5 text-sm ${activeTab === "dashboard" ? "bg-slate-800 text-white" : "bg-slate-200"}`} onClick={() => setActiveTab("dashboard")}>Dashboard</button>
          <button className={`rounded px-3 py-1.5 text-sm ${activeTab === "subjects" ? "bg-slate-800 text-white" : "bg-slate-200"}`} onClick={() => setActiveTab("subjects")}>Subjects</button>
          <button className={`rounded px-3 py-1.5 text-sm ${activeTab === "bookmarks" ? "bg-slate-800 text-white" : "bg-slate-200"}`} onClick={() => setActiveTab("bookmarks")}>Bookmarks</button>
        </div>
      </header>

      <p className="mb-6 rounded-md bg-blue-50 px-4 py-2 text-sm text-blue-800">{message}</p>

      {activeTab === "dashboard" && (
        <section className="mb-6 rounded-xl bg-white p-4 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Available Resources</h2>
            <div className="flex gap-2">
              <button className="rounded bg-slate-700 px-4 py-2 text-white" onClick={loadResources}>Refresh</button>
              <button className="rounded bg-indigo-600 px-4 py-2 text-white" onClick={() => setShowAddResource((v) => !v)}>
                {showAddResource ? "Hide Add Form" : "Add Resource"}
              </button>
            </div>
          </div>

          {resources.length === 0 && (
            <div className="mb-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
              <p className="mb-2 text-slate-700">No resources available yet.</p>
              <button className="rounded bg-indigo-600 px-4 py-2 text-white" onClick={() => setShowAddResource(true)}>
                Add First Resource
              </button>
            </div>
          )}

          {showAddResource && (
            <div className="mb-4 grid gap-3 rounded-lg border p-3 md:grid-cols-2">
              <input className="rounded border p-2" placeholder="Title" value={resourceInput.title} onChange={(e) => setResourceInput((prev) => ({ ...prev, title: e.target.value }))} />
              <input className="rounded border p-2" placeholder="Description" value={resourceInput.description} onChange={(e) => setResourceInput((prev) => ({ ...prev, description: e.target.value }))} />
              <input className="rounded border p-2 md:col-span-2" placeholder="File URL" value={resourceInput.file_url} onChange={(e) => setResourceInput((prev) => ({ ...prev, file_url: e.target.value }))} />
              <select className="rounded border p-2" value={resourceInput.subject_id} onChange={(e) => setResourceInput((prev) => ({ ...prev, subject_id: e.target.value }))}>
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.subject_id} value={subject.subject_id}>{subject.name}</option>
                ))}
              </select>
              <button className="rounded bg-indigo-600 px-4 py-2 text-white" onClick={createResource}>Save Resource</button>
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-2">
            {resources.map((item) => (
              <article key={item.resource_id} className="rounded-lg border p-3">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.description}</p>
                <a className="text-sm text-blue-600 underline" href={item.file_url} target="_blank" rel="noreferrer">Open resource</a>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === "subjects" && (
        <section className="mb-6 grid gap-4 rounded-lg bg-white p-4 shadow md:grid-cols-2">
          <h2 className="md:col-span-2 text-xl font-semibold">Subjects</h2>
          <input className="rounded border p-2" placeholder="Subject name" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} />
          <input className="rounded border p-2" placeholder="Description" value={subjectDescription} onChange={(e) => setSubjectDescription(e.target.value)} />
          <div className="md:col-span-2 flex gap-3">
            <button className="rounded bg-emerald-600 px-4 py-2 text-white" onClick={createSubject}>Create Subject</button>
            <button className="rounded bg-slate-700 px-4 py-2 text-white" onClick={loadSubjects}>Load Subjects</button>
          </div>
          <ul className="md:col-span-2 space-y-2 text-sm">
            {subjects.map((subject) => (
              <li key={subject.subject_id} className="rounded border p-2">
                <span className="font-semibold">{subject.name}</span> - {subject.description || "No description"}
              </li>
            ))}
          </ul>
        </section>
      )}

      {activeTab === "bookmarks" && (
        <section className="grid gap-4 rounded-lg bg-white p-4 shadow md:grid-cols-2">
          <h2 className="md:col-span-2 text-xl font-semibold">Bookmarks</h2>
          <input className="rounded border p-2" placeholder={`User ID (default ${currentUser?.user_id})`} value={bookmarkInput.user_id} onChange={(e) => setBookmarkInput((prev) => ({ ...prev, user_id: e.target.value }))} />
          <input className="rounded border p-2" placeholder="Resource ID" value={bookmarkInput.resource_id} onChange={(e) => setBookmarkInput((prev) => ({ ...prev, resource_id: e.target.value }))} />
          <div className="md:col-span-2 flex gap-3">
            <button className="rounded bg-pink-600 px-4 py-2 text-white" onClick={createBookmark}>Create Bookmark</button>
            <button className="rounded bg-slate-700 px-4 py-2 text-white" onClick={loadBookmarksByUser}>Load User Bookmarks</button>
          </div>
          <ul className="md:col-span-2 space-y-2 text-sm">
            {bookmarks.map((item) => (
              <li key={item.bookmark_id} className="rounded border p-2">
                Bookmark #{item.bookmark_id} user:{item.user_id} resource:{item.resource_id}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

export default App;
