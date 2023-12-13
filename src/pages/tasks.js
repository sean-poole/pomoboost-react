import Timer from "../components/Timer";
import TaskList from "../components/TaskList";
import Logout from "../components/Logout";

export default function Tasks() {
  return (
    <div className="tasks--container">
      <Timer />
      <TaskList />
      <Logout />
    </div>
  );
}
