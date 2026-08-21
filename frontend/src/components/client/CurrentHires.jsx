import React, { useContext, useEffect, useState } from "react";
import { WalletContext } from "../../context/WalletContext";
import { useTaskManager } from "../../hooks/taskService";
import { NavLink } from "react-router-dom";

function CurrentHires() {
  const data = JSON.parse(localStorage.getItem("walletState"));
  if (!data) {
    return <Navigate to="/" replace={true} />;
  }

  const { state } = useContext(WalletContext);
  const { fetchTaskIds, fetchTasks } = useTaskManager();
  const [hireFreelancers, setHireFreelancers] = useState([]);
  useEffect(() => {
    const contract = state.taskManagerContract;
    if (!contract) return;

    const loadData = async () => {
      const Ids = await fetchTaskIds();
      const tasks = await Promise.all(Ids.map((id) => fetchTasks(id)));
      console.log(tasks);

      const newTasks = tasks.filter(
        (task) =>
          task.client.toLowerCase() === state.account.toLowerCase() &&
          task.freelancer !== "0x0000000000000000000000000000000000000000" &&
          !task.approved &&
          task.accepted,
      );
      console.log(newTasks);
      setHireFreelancers(newTasks);
    };
    loadData();
  }, [state.taskManagerContract]);
  console.log(hireFreelancers);
  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        <NavLink
          to="/dashboard"
          className="flex items-center mb-6 text-green-800 font-medium hover:text-green-900 transition"
        >
          Back to Dashboard
        </NavLink>

        <h1 className="text-3xl font-bold text-[#556B2F] mb-8">
          Current Hires
        </h1>

        {hireFreelancers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {hireFreelancers.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl shadow border border-gray-200 p-5 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-[#556B2F] ">
                      {task.title}
                    </h2>

                    <p className="text-xs text-gray-500">Task #{task.id}</p>
                  </div>

                  <div className="flex gap-4">
                    <NavLink
                      to={`/view-profile/${btoa(task.freelancer.toString())}`}
                      className="px-4 py-2 rounded-full overflow-hidden bg-[#769540] hover:bg-[#637d34] text-white font-semibold text-sm  whitespace-nowrap"
                    >
                      View Profile
                    </NavLink>
                    <span className="bg-green-100 text-green-700  text-xs px-3 py-1 rounded-full whitespace-nowrap">
                      In Progress
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-gray-500">Freelancer</p>

                  <p className="text-sm break-all font-medium">
                    {task.freelancer}
                  </p>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-gray-500">Reward</p>

                  <p className="font-semibold text-green-700">
                    {task.reward} STK
                  </p>
                </div>

                <div className="mb-5">
                  <p className="text-xs text-gray-500 mb-1">
                    GitHub Submission
                  </p>

                  {task.githubLink ? (
                    <a
                      href={task.githubLink}
                      target="_blank"
                      className="text-blue-600 underline break-all text-sm"
                    >
                      View Repository
                    </a>
                  ) : (
                    <span className="text-sm text-orange-600">
                      Not Submitted Yet
                    </span>
                  )}
                </div>

                <button
                  disabled={!task.githubLink}
                  className={`w-full py-2 rounded-lg font-medium transition ${
                    task.githubLink
                      ? "bg-[#556B2F] hover:bg-[#445624] text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Review Submission
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Active Hires
            </h2>

            <p className="text-gray-500 mt-2">
              You haven't hired any freelancers yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CurrentHires;
