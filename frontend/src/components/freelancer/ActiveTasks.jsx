import React, { useContext, useEffect, useState } from "react";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { WalletContext } from "../../context/WalletContext";
import { useTaskManager } from "../../hooks/taskService";

function ActiveTasks() {
  const [activeTasks, setActiveTasks] = useState([]);
  const { state } = useContext(WalletContext);
  const [githubLink, setGitHubLink] = useState({});
  const { fetchTaskIds, fetchTasks, submitTasks } = useTaskManager();
  const data = JSON.parse(localStorage.getItem("walletState"));
  if (!data) {
    return <Navigate to="/" replace={true} />;
  }

  useEffect(() => {
    const contract = state.taskManagerContract;
    if (!contract) return;
    const loadData = async () => {
      const Ids = await fetchTaskIds();
      const task = await Promise.all(Ids.map((id) => fetchTasks(id)));
      const newTask = task.filter(
        (t) => t.freelancer === state.account && !t.approved,
      );
      setActiveTasks(newTask);
    };
    loadData();

    const handler = (...args) => {
      console.log("EVENT RECEIVED");
      console.log(args);
      loadData();
    };

    contract.on("TaskSubmitted", handler);

    return () => {
      console.log("REMOVING LISTENER");
      contract.off("TaskSubmitted", handler);
    };
  }, [state.taskManagerContract]);

  const gitHubLinkBtn = async (id) => {
    try {
      console.log("Btn clicked");
      const link = githubLink[id];
      if (!link || !link.includes("https://github.com/")) {
        alert("Invalid github link");
        return;
      }
      await submitTasks(id, link);
      setGitHubLink({});
      console.log("Task submitted");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] p-6">
      <div className="max-w-6xl mx-auto">
        <NavLink
          to="/dashboard"
          className="inline-flex items-center mb-6 text-green-800 font-medium hover:text-green-900 transition"
        >
          Back to Dashboard
        </NavLink>

        <h1 className="text-3xl font-bold text-[#556B2F] mb-6">Active Tasks</h1>

        {activeTasks.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-5 bg-[#556B2F] text-white font-semibold p-4">
              <p>Task</p>
              <p>Client</p>
              <p>Status</p>
              <p>GitHub Link</p>
              <p>Action</p>
            </div>

            {activeTasks.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-5 items-center p-5 border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <p className="font-medium text-gray-700">{task.title}</p>

                <p className="font-mono text-sm text-gray-600 w-fit">
                  {`${task.client.slice(0, 8)}...${task.client.slice(-6)}`}
                </p>

                <span
                  className={`w-fit px-3 py-1 rounded-full text-sm font-medium  ${task.rejected ? "text-red-700 bg-red-100" : "text-green-700 bg-green-100"}`}
                >
                  {task.rejected ? "Rejected" : "Active"}
                </span>

                <div className="px-2">
                  {!task.completed && (
                    <input
                      type="text"
                      value={githubLink[task.id] || ""}
                      onChange={(e) =>
                        setGitHubLink((prev) => ({
                          ...prev,
                          [task.id]: e.target.value,
                        }))
                      }
                      placeholder="GitHub Repository URL"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  )}

                  <button
                    onClick={() => gitHubLinkBtn(task.id)}
                    disabled={task.completed}
                    className={`w-full mt-2  text-white py-2 rounded-lg ${
                      !task.completed
                        ? "bg-[#556B2F] hover:bg-[#445624] cursor-pointer "
                        : "bg-gray-400 cursor-not-allowed mt-12"
                    }`}
                  >
                    {!task.completed ? "Submitted" : "Submit"}
                  </button>
                </div>

                <div className="px-2">
                  <NavLink
                    to={`/view-task/${btoa(task.id.toString())}`}
                    className="block mt-12 w-full text-center bg-[#556B2F] text-white py-2 rounded-lg hover:bg-[#445624]"
                  >
                    View Task
                  </NavLink>
                </div>

                {task.rejected && (
                  <div className="col-span-4 mt-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2">
                    <span className="font-semibold text-red-600">
                      Rejection Reason:
                    </span>{" "}
                    <span className="text-gray-700">{task.rejectMsg}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Active Tasks
            </h2>

            <p className="text-gray-500 mt-2">
              You haven't accepted any tasks yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActiveTasks;
