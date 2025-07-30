import React from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { addTask, fetchTasks, completeTask, deleteTask, updateTask } from "../api"; // Mock or implement your own API logic

type Task = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
};

type FormData = {
  title: string;
};

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
  console.log("Fetching tasks...");
  try {
    const response = await fetchTasks();
    console.log("API Response:", response);
    console.log("Response type:", typeof response);
    console.log("Is array:", Array.isArray(response));
    
    // Ensure response is an array
    if (Array.isArray(response)) {
      setTasks(response);
    } else {
      console.warn("API did not return an array:", response);
      setTasks([]); // Set empty array as fallback
    }
    setLoading(false);
  } catch (error) {
    console.error("Fetch Error:", error);
    setTasks([]); // Set empty array on error
    alert("Something went wrong while fetching tasks. Please try again later.");
    setLoading(false);
  }
};


  const onSubmit = async (data: FormData) => {
    console.log("Task Submitted:", data);
    try {
      const response = await addTask(data);
      console.log("API Response:", response);
      reset();
      fetchAllTasks();
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const handleCompleteTask = async (id: number) => {
    try {
      await completeTask(id);
      fetchAllTasks();
    } catch (error) {
      console.error("Complete Error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      fetchAllTasks();
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const handleUpdateTask = async (id: number, currentTitle: string) => {
    const newTitle = prompt("New title:", currentTitle);
    if (newTitle && newTitle.trim() !== "") {
      try {
        await updateTask(id, newTitle.trim());
        fetchAllTasks();
      } catch (error) {
        console.error("Update Error:", error);
        alert("Something went wrong. Please try again later.");
      }
    }
  };

  // Styles
  const wrapperStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "20px",
  };

  const containerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "600px",
    padding: "30px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 600,
    marginBottom: "6px",
    display: "block",
    fontSize: "15px",
  };

  const fieldStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
  };

  const errorStyle: React.CSSProperties = {
    color: "red",
    fontSize: "13px",
    marginTop: "-15px",
    marginBottom: "10px",
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
  };

  const sectionStyle: React.CSSProperties = {
    marginTop: "30px",
    marginBottom: "20px",
  };

  const taskItemStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "8px",
    backgroundColor: "#f8f9fa",
    border: "1px solid #e9ecef",
  };

  const taskButtonStyle: React.CSSProperties = {
    padding: "8px 12px",
    margin: "0 5px",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const completeButtonStyle: React.CSSProperties = {
    ...taskButtonStyle,
    backgroundColor: "#28a745",
    color: "#fff",
  };

  const updateButtonStyle: React.CSSProperties = {
    ...taskButtonStyle,
    backgroundColor: "#ffc107",
    color: "#000",
  };

  const deleteButtonStyle: React.CSSProperties = {
    ...taskButtonStyle,
    backgroundColor: "#dc3545",
    color: "#fff",
  };

  if (loading) {
    return (
      <div style={wrapperStyle}>
        <div style={containerStyle}>
          <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
            Task Manager App
          </h2>
          <p style={{ textAlign: "center" }}>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
          Task Manager App
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label style={labelStyle}>Task Title</label>
          <input
            style={fieldStyle}
            {...register("title", { required: "Task title is required" })}
            placeholder="Add new task"
          />
          {errors.title && <p style={errorStyle}>{errors.title.message}</p>}

          <button type="submit" style={buttonStyle} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Task"}
          </button>
        </form>

        <div style={sectionStyle}>
          <h3>Incomplete Tasks</h3>
          <div>
            {tasks.filter(task => !task.completed).length === 0 ? (
              <p style={{ color: "#6c757d", fontStyle: "italic" }}>No incomplete tasks</p>
            ) : (
              tasks.filter(task => !task.completed).map(task => (
                <div key={task.id} style={taskItemStyle}>
                  <span>{task.title}</span>
                  <div>
                    <button
                      style={completeButtonStyle}
                      onClick={() => handleCompleteTask(task.id)}
                    >
                      Complete
                    </button>
                    <button
                      style={updateButtonStyle}
                      onClick={() => handleUpdateTask(task.id, task.title)}
                    >
                      Update
                    </button>
                    <button
                      style={deleteButtonStyle}
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={sectionStyle}>
          <h3>Completed Tasks</h3>
          <div>
            {tasks.filter(task => task.completed).length === 0 ? (
              <p style={{ color: "#6c757d", fontStyle: "italic" }}>No completed tasks</p>
            ) : (
              tasks.filter(task => task.completed).map(task => (
                <div key={task.id} style={taskItemStyle}>
                  <span style={{ textDecoration: "line-through", color: "#6c757d" }}>
                    {task.title}
                  </span>
                  <div>
                    <button
                      style={deleteButtonStyle}
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
