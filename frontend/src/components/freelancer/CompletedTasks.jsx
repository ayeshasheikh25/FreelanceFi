import React, { useContext, useEffect, useState } from "react";
import { useTaskManager } from "../../hooks/taskService";
import { WalletContext } from "../../context/WalletContext";
import { ethers } from "ethers";
import { NavLink } from "react-router-dom";

function CompletedTasks() {
  const data = JSON.parse(localStorage.getItem("walletState"));
  if (!data) {
    return <Navigate to="/" replace={true} />;
  }

  const { fetchTaskIds, fetchTasks } = useTaskManager();
  const { state } = useContext(WalletContext);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading , setLoading] = useState(false)

  useEffect(() => {
    const contract = state.taskManagerContract;
    if (!contract) return;

    const loadData = async () => {
      try {
        setLoading(true)
        const Ids = await fetchTaskIds()
        const tasks = await Promise.all(Ids.map((id)=> fetchTasks(id)))
        const filterTask = tasks.filter((task)=> task.freelancer.toLowerCase() === state.account && task.approved)
        setCompletedTasks(filterTask)

      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    };
    loadData();

    const TaskHandler = () => {
      loadData();
    };
    contract.on("TaskApproved", TaskHandler);

    return () => {
      contract.off("TaskApproved", TaskHandler);
    };
  }, [state.taskManagerContract]);

  console.log(completedTasks);

  if (loading) {
    return (
      <div className="min-h-screen bg-white rounded-2xl shadow-lg p-8 text-center m-auto">
        <p className="text-gray-500">Loading Task...</p>
      </div>
    );
  }
 return (
  <div className="min-h-screen bg-[#F5F1E8] p-6">
    <div className="max-w-6xl mx-auto">

        <NavLink
          to="/dashboard"
          className="text-green-700 text-md font-semibold"
        >
          Back to Dashboard
        </NavLink>
      <h1 className="text-3xl font-bold text-[#556B2F] mb-8">
        Completed Tasks
      </h1>

      {completedTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {completedTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[#556B2F]">
                  {task.title}
                </h2>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Completed
                </span>
              </div>

              <p className="text-gray-500 text-sm mt-1">
                Task #{task.id}
              </p>

              <div className="mt-5 space-y-3">

                <div>
                  <p className="text-gray-500 text-sm font-bold">
                   
                    Client: <span className="font-sm font-normal text-gray-500 break-all" > {task.client} </span>
                  </p>

                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    Reward
                  </p>

                  <p className="text-green-700 font-bold text-lg">
                     SKT
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    GitHub Repository
                  </p>

                  <a
                    href={task.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline break-all"
                  >
                    View Repository
                  </a>
                </div>

              </div>
            </div>
          ))}

        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">

          <h2 className="text-2xl font-semibold text-gray-700">
            No Completed Tasks
          </h2>

          <p className="text-gray-500 mt-2">
            You haven't completed any approved tasks yet.
          </p>

        </div>
      )}

    </div>
  </div>
);
}

export default CompletedTasks;
