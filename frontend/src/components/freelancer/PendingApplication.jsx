import React, { useContext, useEffect, useState } from "react";
import { Navigate, NavLink } from "react-router-dom";
import { WalletContext } from "../../context/WalletContext";
import { useTaskManager } from "../../hooks/taskService";

function PendingApplication() {
  const { state } = useContext(WalletContext);
  const [pendingApplication, setPendingApplication] = useState();
  const { fetchTaskIds, fetchTasks, getProposal } = useTaskManager();
  const data = JSON.parse(localStorage.getItem("walletState"));
  if (!data) {
    return <Navigate to="/" replace={true} />;
  }

  useEffect(() => {
    const contract = state.taskManagerContract;
    if (!contract) return;
    const loadData = async () => {
      const Id = await fetchTaskIds();
      const tasks = await Promise.all(Id.map((id) => fetchTasks(id)));
      const allPropsals = [];
      console.log(tasks)
      for (let id of Id) {
        const proposal = await getProposal(id);
        allPropsals.push(...proposal);
      }

      const result = tasks
        .filter(
          (task) =>
            !task.accepted &&
            allPropsals.some(
              (proposal) => proposal.id === task.id && proposal.requested
            ),
        )
        .map((task) => ({
          id: task.id,
          title: task.title,
          client: task.client,
          reward: task.reward,
        }));
        console.log(result)
      setPendingApplication(result);
    };

    loadData();
    const TaskHandler = async (args) => {
      console.log("EVENT RECEIVED");
      console.log(args);
      loadData();
    };
    contract.on("TaskRequested", TaskHandler);
    contract.on("TaskAccepted", TaskHandler);

    return () => {
      console.log("REMOVING LISTENER");
      contract.off("TaskRequested", TaskHandler);
      contract.off("TaskAccepted", TaskHandler);
    };
  }, [state.taskManagerContract]);
  console.log(pendingApplication)
  
  return (
    <div className="min-h-screen bg-[#F5F1E8] p-6">
      <div className="max-w-5xl mx-auto">
        <NavLink
          to="/dashboard"
          className="inline-flex items-center mb-6 text-green-800 font-medium hover:text-green-900 transition"
        >
          Back to Dashboard
        </NavLink>
        <h1 className="text-3xl font-bold text-[#556B2F] mb-6">
          Pending Applications
        </h1>

        {pendingApplication?.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-black/50">
            <div className="grid grid-cols-4 rounded-tl-lg rounded-tr-lg bg-[#556B2F] text-white font-semibold p-4">
              <p>Task</p>
              <p>Reward</p>
              <p>Client</p>
              <p>Status</p>
              <p></p>
            </div>

            {pendingApplication.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-4 items-center rounded-lg  p-4   hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-gray-800">{task.title}</p>
                  <p className="text-sm text-gray-500">Task #{task.id}</p>
                </div>

                <p className="font-semibold text-green-700">
                  {task.reward} STK
                </p>

                <p className="text-sm text-gray-600 break-all">
                  {task.client.slice(0, 8)}...
                  {task.client.slice(-6)}
                </p>

                <span className="w-fit bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Pending
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Pending Applications
            </h2>

            <p className="text-gray-500 mt-2">
              You haven't applied for any open tasks yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PendingApplication;
