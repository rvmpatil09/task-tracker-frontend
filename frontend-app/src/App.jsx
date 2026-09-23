import { useState, useEffect } from 'react';
import axios from 'axios';

// Backend URL
//const API_BASE_URL = 'http://localhost:8080/api/tasks';

const API_BASE_URL = 'https://task-backend-api-2l66.onrender.com/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // १. GET: सर्व टास्क आणणे
  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("डेटा लोड करताना एरर आला:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // २. POST: नवीन टास्क ॲड करणे
  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await axios.post(API_BASE_URL, {
        title: title,
        description: description || "No Description",
        status: "Pending"
      });
      setTitle('');
      setDescription('');
      loadTasks();
    } catch (err) {
      console.error("टास्क सेव्ह करताना एरर आला:", err);
    }
  };

  // ३. PUT: टास्क अपडेट करणे (तुमच्या Controller च्या updateTask नुसार संपूर्ण body पाठवणे)
  const markAsCompleted = async (task) => {
    try {
      await axios.put(`${API_BASE_URL}/${task.id}`, {
        title: task.title,
        description: task.description,
        status: "Completed"
      });
      loadTasks();
    } catch (err) {
      console.error("स्टेटस अपडेट करताना एरर आला:", err);
    }
  };

  // ४. DELETE: टास्क काढून टाकणे
  const deleteTask = async (id) => {
    if (!window.confirm("हा टास्क खरंच काढून टाकायचा आहे का?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      loadTasks();
    } catch (err) {
      console.error("टास्क डिलीट करताना एरर आला:", err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Employee Task Tracker</h2>

        {/* Input Form */}
        <form onSubmit={addTask} style={styles.form}>
          <input
            type="text"
            placeholder="टास्कचे नाव (Title)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="वर्णन (Description)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.addBtn}>+ Add Task</button>
        </form>

        {/* Task List */}
        <h3 style={styles.subHeading}>
          टास्क लिस्ट ({tasks.length})
        </h3>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#888' }}>लोड होत आहे...</p>
        ) : tasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#777' }}>कोणताही टास्क उपलब्ध नाही. नवीन टास्क ॲड करा!</p>
        ) : (
          <div style={styles.list}>
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  ...styles.taskCard,
                  borderLeft: task.status === 'Completed' ? '5px solid #22c55e' : '5px solid #eab308'
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    margin: '0 0 5px 0',
                    textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                    color: task.status === 'Completed' ? '#94a3b8' : '#f8fafc'
                  }}>
                    {task.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                    {task.description}
                  </p>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: task.status === 'Completed' ? '#14532d' : '#713f12',
                    color: task.status === 'Completed' ? '#86efac' : '#fde047'
                  }}>
                    {task.status}
                  </span>
                </div>

                <div style={styles.actions}>
                  {task.status !== 'Completed' && (
                    <button
                      onClick={() => markAsCompleted(task)}
                      style={styles.doneBtn}
                    >
                      ✓ Done
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={styles.deleteBtn}
                  >
                    ✕ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Inline CSS Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 15px',
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    boxSizing: 'border-box'
  },
  card: {
    width: '100%',
    maxWidth: '650px',
    backgroundColor: '#1e293b',
    borderRadius: '14px',
    padding: '28px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
    height: 'fit-content'
  },
  heading: {
    margin: '0 0 20px 0',
    color: '#f8fafc',
    textAlign: 'center',
    fontWeight: '700'
  },
  subHeading: {
    color: '#cbd5e1',
    borderBottom: '1px solid #334155',
    paddingBottom: '10px',
    margin: '25px 0 15px 0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  input: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontSize: '14px',
    outline: 'none'
  },
  addBtn: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '15px'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  taskCard: {
    backgroundColor: '#334155',
    padding: '14px 16px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px'
  },
  badge: {
    display: 'inline-block',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    marginTop: '6px'
  },
  actions: {
    display: 'flex',
    gap: '8px'
  },
  doneBtn: {
    backgroundColor: '#22c55e',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600'
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600'
  }
};

export default App;