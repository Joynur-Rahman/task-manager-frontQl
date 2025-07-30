import Api from "../services/Api";

// Add new task
export async function addTask(formData) {
  console.log("Adding task:", formData);

  // Prepare the data for database insertion
  const taskEntry = {
    title: formData.title,
    completed: false
  };

  try {
    const response = await Api.post("/joynur_rahman_users", {
      body: taskEntry,
    });

    // Handle API response format
    if (response && response.err) {
      console.error("API Error:", response.result);
      throw new Error(response.result);
    }

    console.log("Task added successfully:", response);
    return response;
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
}

// Fetch all tasks - FIXED VERSION
export async function fetchTasks() {
  console.log("Fetching tasks...");

  try {
    // FIXED: Use consistent endpoint naming
    const response = await Api.get("/joynur_rahman_users");

    console.log("Tasks fetched successfully:", response);
    
    // Handle the API response format
    if (response && response.err) {
      console.error("API Error:", response.result);
      throw new Error(response.result);
    }
    
    // FIXED: Extract the result array from the response
    // Based on previous conversation, API returns: {err: false, result: [...], count: 2, token: '...'}
    if (response && !response.err && Array.isArray(response.result)) {
      return response.result; // Return the actual tasks array
    }
    
    // Fallback for direct array response
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}

// Mark task as complete
export async function completeTask(taskId) {
  console.log("Completing task:", taskId);

  const updateData = {
    completed: true
  };

  try {
    const response = await Api.put(`/joynur_rahman_users/${taskId}`, {
      body: updateData,
    });

    // Handle API response format
    if (response && response.err) {
      console.error("API Error:", response.result);
      throw new Error(response.result);
    }

    console.log("Task completed successfully:", response);
    return response;
  } catch (error) {
    console.error("Error completing task:", error);
    throw error;
  }
}

// Delete task
export async function deleteTask(taskId) {
  console.log("Deleting task:", taskId);

  try {
    const response = await Api.delete(`/joynur_rahman_users/${taskId}`);

    // Handle API response format
    if (response && response.err) {
      console.error("API Error:", response.result);
      throw new Error(response.result);
    }

    console.log("Task deleted successfully:", response);
    return response;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}

// Update task title
export async function updateTask(taskId, newTitle) {
  console.log("Updating task:", taskId, "with title:", newTitle);

  const updateData = {
    title: newTitle
  };

  try {
    const response = await Api.put(`/joynur_rahman_users/${taskId}`, {
      body: updateData,
    });

    // Handle API response format
    if (response && response.err) {
      console.error("API Error:", response.result);
      throw new Error(response.result);
    }

    console.log("Task updated successfully:", response);
    return response;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}
