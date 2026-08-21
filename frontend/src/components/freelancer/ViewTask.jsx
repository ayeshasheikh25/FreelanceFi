import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useTaskManager } from "../../hooks/taskService";
import { WalletContext } from "../../context/WalletContext";

function ViewTask() {
  const { id } = useParams();
  const taskId = Number(atob(id));
  const [task, setTask] = useState();
  const { fetchTasks, acceptTasks } = useTaskManager();
  const { state } = useContext(WalletContext);
  const [msg, setMsg] = useState("");

useEffect(()=>{
    const data = JSON.parse(localStorage.getItem('walletState'))
    if(!data){
       navigate('/')
    }
  },[])

  useEffect(() => {
    const contract = state.taskManagerContract;
    if (!contract) return;
    const loadData = async () => {
      const tx = await fetchTasks(taskId);
      setTask(tx);
    };
    loadData();

    const taskHandler = (taskId, freelancer) => {
      console.log(taskId, freelancer);
      loadData();
    };

    contract.on("TaskAccepted", taskHandler);

    return () => {
      contract.off("TaskAccepted", taskHandler);
    };
  }, [state.taskManagerContract]);


  return (
    <div className="min-h-screen bg-[#F5F1E8] p-6">
      <div className="max-w-4xl mx-auto">
        <NavLink
          to={-1}
          className="inline-flex items-center mb-6 text-green-800 font-medium hover:text-green-900 transition"
        >
          Back 
        </NavLink>
        {!task ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-gray-500">Loading Task...</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-green-100 p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-green-800">
                  {task.title}
                </h1>

                <p className="text-gray-500 mt-2">Task #{task.id}</p>
              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  task.approved
                    ? "bg-green-100 text-green-700"
                    : task.completed
                      ? "bg-blue-100 text-blue-700"
                      : task.freelancer !==
                          "0x0000000000000000000000000000000000000000"
                        ? "border-pink-50 text-pink-700"
                        : "bg-amber-100 text-amber-700"
                }`}
              >
                {task.approved
                  ? "Approved"
                  : task.completed
                    ? "Submitted"
                    : task.freelancer !==
                        "0x0000000000000000000000000000000000000000"
                      ? "Accepted"
                      : "Open"}
              </span>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-green-800 mb-3">
                Description
              </h2>

              <p className="text-gray-700 leading-relaxed">
                {task.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-[#F5F1E8] rounded-2xl p-5">
                <p className="text-sm text-gray-500">Reward</p>

                <h3 className="text-2xl font-bold text-green-700">
                  {task.reward} SKT
                </h3>
              </div>

              <div className="bg-[#F5F1E8] rounded-2xl p-5">
                <p className="text-sm text-gray-500">Client Address</p>

                <p className="font-mono text-sm break-all">{task.client}</p>
              </div>

              <div className="bg-[#F5F1E8] rounded-2xl p-5 md:col-span-2">
                <p className="text-sm text-gray-500">Freelancer</p>

                <p className="font-mono text-sm break-all">
                  {task.freelancer ===
                  "0x0000000000000000000000000000000000000000"
                    ? "Not Assigned Yet"
                    : task.freelancer}
                </p>
              </div>
            </div>
            {msg && (
              <div className="mt-3">
                <p className="text-red-400 font-semibold">{msg}</p>
              </div>
            )}
            {/* Actions */}
            <div className="mt-8 flex gap-3">
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewTask;
