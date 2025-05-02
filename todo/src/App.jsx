import { useEffect, useState } from "react";
import "./App.css";
import uuid4 from "uuid4";

import todoImage from "./assets/todo.png";
import todoIcon from "./assets/list.png";

function App() {
  const [state, setState] = useState(() => {
    const todoList = localStorage.getItem("todoList");
    return todoList ? JSON.parse(todoList) : { text: "", tasks: [] };
  });

  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(state));
  }, [state]);

  function getDate() {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
  }

  function handleText(e) {
    const value = e.target.value;

    setState((prevState) => {
      return {
        ...prevState,
        text: value,
      };
    });
  }

  function handleCheckbox(id) {
    setState((prevState) => {
      return {
        ...prevState,
        tasks: prevState.tasks.map((task) => {
          if (task.id === id) {
            return {
              ...task,
              checkbox: !task.checkbox,
            };
          }
          return task;
        }),
      };
    });
  }

  function handleSelect(e, id) {
    const selectedValue = e.target.value;

    setState((prevState) => {
      if (selectedValue === "pin") {
        const pinnedTask = prevState.tasks
          .filter((task) => task.id === id)
          .map((task) => {
            return {
              ...task,
              pinned: !task.pinned,
            };
          });

        const unPinnedTask = prevState.tasks.filter((task) => task.id !== id);
        return {
          ...prevState,
          tasks: [...pinnedTask, ...unPinnedTask],
        };
      } else if (selectedValue === "delete") {
        return {
          ...prevState,
          tasks: prevState.tasks.filter((task) => task.id !== id),
        };
      }
      return prevState;
    });
  }

  function addTask() {
    if (state.text !== "") {
      const newTask = {
        id: uuid4(),
        checkbox: false,
        text: state.text,
        pinned: false,
      };

      setState((prevState) => {
        return {
          ...prevState,
          text: "",
          tasks: [...prevState.tasks, newTask],
        };
      });
    }
  }

  function addTaskWithEnter(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTask();
    }
  }

  function resetTasks() {
    setState((prevState) => {
      return {
        ...prevState,
        tasks: [],
      };
    });
  }

  return (
    <div className="todoWrapper">
      <img src={todoImage} alt="to-do image" className="todoImg" />
      <div className="todoContainer">
        <div className="todoRow">
          <h1>Your efficient day</h1>
          <img src={todoIcon} alt="to-do icon" />
        </div>
        <h2>{getDate()}</h2>
        <div className="todoAnotherRow">
          <input
            className="inputMain"
            type="text"
            placeholder="🖋 Add a task..."
            value={state.text}
            onChange={handleText}
            onKeyDown={addTaskWithEnter}
          />
          <button onClick={addTask} className="btnAdd">
            +
          </button>
        </div>
        {state.tasks.map((task) => (
          <div
            key={task.id}
            className={task.pinned ? "taskContainer pinned" : "taskContainer"}
          >
            <input
              type="checkbox"
              checked={task.checkbox}
              onChange={() => handleCheckbox(task.id)}
            />
            <input
              type="text"
              value={task.text}
              readOnly
              onClick={() => handleCheckbox(task.id)}
              className={task.pinned ? "task pinned" : "task"}
            />
            <select onChange={(e) => handleSelect(e, task.id)}>
              <option value="">...</option>
              <option value="pin">🔝 Pin on the top</option>
              <option value="delete">🚮 Delete</option>
            </select>
          </div>
        ))}
      </div>
      <button className="btnReset" onClick={resetTasks}>
        Reset all
      </button>
    </div>
  );
}

export default App;
