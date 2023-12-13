import { useState, useEffect } from "react";

export default function Timer() {
  const [isPomodoro, setIsPomodoro] = useState(true);
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        setTime(prevTime => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            const current = isPomodoro;
            setIsPomodoro(!isPomodoro);
            setIsActive(false);
            return current ? 5 * 60 : 25 * 60;
          }
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    }
  }, [isPomodoro, isActive]);

  const handleStartStop = () => setIsActive(prevIsActive => !prevIsActive);

  const handleOption = (mode) => {
    setIsPomodoro(mode === "pomodoro");
    setTime(mode === "pomodoro" ? 25 * 60 : 5 * 60);
    setIsActive(false);
  }

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
  }

  return (
    <div className="timer--container">
      <div className="timer--option-container">
        <button 
          className={`timer--option-button ${isPomodoro ? "selected" : ""}`}
          onClick={() => handleOption("pomodoro")}
        >
          Pomodoro
        </button>
        <button
          className={`timer--option-button ${isPomodoro ? "" : "selected"}`}
          onClick={() => handleOption("break")}
        >
          Break
        </button>
      </div>
      <div className="timer--time-container">
        <div className="timer--time-display">
          <p>{formatTime(time)}</p>
        </div>
        <button 
          className={`timer--start-button ${isActive ? "running" : ""}`}
          onClick={handleStartStop}
        >
          {isActive ? "Stop" : "Start"}
        </button>
      </div>
    </div>
  );
}
