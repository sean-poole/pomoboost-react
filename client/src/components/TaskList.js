import { useEffect, useState } from "react";
import axios from "axios";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";

const backendURL = process.env.REACT_APP_BACKEND_URL;

export default function TaskList() {
  const [todo, setTodo] = useState("");
  const [tasks, setTasks] = useState([]);

  const { auth } = useAuth();
  const { accessToken } = auth;
  const refresh = useRefreshToken();

  // Run on page load.
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    // Get all tasks of the current user.
    const getTasks = async () => {
      try {
        const response = await axios.get(`${backendURL}/tasks`, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        const tasksData = response.data.map(task => ({
          ...task,
          completed: false
        }));

        isMounted && setTasks(tasksData);
      } catch(err) {
        if (err.name === "CanceledError") {
          console.log("Request aborted");
        } else {
          console.error(err);
        }
      }
    }

    getTasks();

    // Clean up function.
    return () => {
      isMounted = false;
      controller.abort();
    }
  }, [accessToken]);

  // Create new task.
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendURL}/tasks/createTask`,
        { todo },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      // console.log(response.data);

      // Update tasks after creating a new one.
      setTasks([...tasks, { ...response.data }]);

      // Reset input field after successful task creation.
      setTodo("");
    } catch(err) {
      console.error("Error creating task: ", err);
    }
  }

  // Mark task as complete / incomplete.
  const markTask = async(id) => {
    try {
      // Toggle `completed` property for task in frontend state.
      const updatedTasks = tasks.map(task => 
        task._id === id ? { ...task, completed: !task.completed } : task
      );
      setTasks(updatedTasks);

      // Update `completed` property for task in the backend.
      await axios.patch(`${backendURL}/tasks/markTask/${id}`,
        { completed: updatedTasks.find(task => task._id === id).completed },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
    } catch(err) {
      console.error("Error marking task: ", err);
    }
  }

  // Delete task.
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${backendURL}/tasks/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      // Filter out deleted tasks from tasks state.
      const updatedTasks = tasks.filter(task => task._id !== id);
      // Update tasks after deleting one.
      setTasks(updatedTasks);
    } catch(err) {
      console.error("Error deleting task: ", err);
    }
  }

  return (
    <div className="list--container">
      <form
        className="tasks--task-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="tasks--task-input"
          onChange={(e) => setTodo(e.target.value)}
          value={todo}
          placeholder="What are you working on?"
          maxLength={40}
        />
        <input 
          type="submit"
          className="tasks--submit"
        />
      </form>

      {tasks?.length
        ? (
          <ol className="tasks--task-list">
            {tasks.map(task => {
              return <li
                      key={task._id}
                      className={ task.completed ? "tasks--task-list-item complete-task" : "tasks--task-list-item"} >
                {task.todo}
                <span
                  className={task.completed ? "complete" : "incomplete"}
                  onClick={() => markTask(task._id)}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span
                  onClick={() => deleteTask(task._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </span>
              </li>
            })}
          </ol>
        ) : (
          <p>No current tasks</p>
        )
      }

      <h4 className="tasks--counter">
        Completed tasks: {tasks.filter(task => task.completed).length} / {tasks.length}
      </h4>
    </div>
  );
}
