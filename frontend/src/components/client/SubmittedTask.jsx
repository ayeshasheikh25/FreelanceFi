import React, { useContext, useEffect, useState } from "react";
import { WalletContext } from "../../context/WalletContext";
import { useTaskManager } from "../../hooks/taskService";
import { NavLink } from "react-router-dom";
import Rating from "../Rating";
import axios from "axios";
import { api } from "../../API/api";

function SubmittedTask() {
  const data = JSON.parse(localStorage.getItem("walletState"));
  if (!data) {
    return <Navigate to="/" replace={true} />;
  }

  const { state } = useContext(WalletContext);
  const { fetchTaskIds, fetchTasks, approveTasks, rejectingTask } = useTaskManager();
  const [submittedTasks, setSubmittedTasks] = useState([]);
  const [showRatings, setShowRatings] = useState(false);
  const [ratings, setRatings] = useState(0);
  const [option, setOption] = useState({});
  const [rejectMsg , setRejectMsg] = useState({})
  useEffect(() => {
    const contract = state.taskManagerContract;
    if (!contract) return;

    const loadData = async () => {
      const Ids = await fetchTaskIds();
      const tasks = await Promise.all(Ids.map((id) => fetchTasks(id)));

      const newTasks = tasks.filter(
        (task) =>
          task.client.toLowerCase() === state.account.toLowerCase() &&
          task.freelancer !== "0x0000000000000000000000000000000000000000" ||
          task.completed &&
          task.accepted &&
          !task.rejected 
      );

      setSubmittedTasks(newTasks);
    };
    loadData();

  const handler = (...args) => {
    console.log("EVENT RECEIVED");
    console.log(args);
    loadData();
  };
    contract.on("TaskRejected", handler)
    contract.on("TaskApproved", handler);
    return () => {
      console.log("REMOVING LISTENER")
      contract.off("TaskRejected", handler)
      contract.off("TaskApproved", handler);
    };
  }, [state.taskManagerContract]);

  const aprroveTaskPropsal = async (id) => {
    try {
      console.log(id);
      await approveTasks(id);
      setShowRatings(true);
    } catch (err) {
      console.log(err);
    }
  };

  const ratingBtn = async (freelancer) => {
    console.log(freelancer);
    const walletAddress = freelancer;
    const tx = api.patch(
      `/auth/connect-wallet/${walletAddress}`,
      { ratings },
      { withCredentials: true },
    );
    setShowRatings(false);
  };
  
  const rejectBtn = async(id )=>{
    try{
      console.log(id , rejectMsg[id])
    await rejectingTask(id , rejectMsg[id])
    }catch(err){
      console.log(err)
    }
  }
  console.log(ratings);
  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className={`max-w-6xl mx-auto `}>
        <NavLink
          to="/dashboard"
          className="flex items-center mb-6 text-green-800 font-medium hover:text-green-900"
        >
          ← Back to Dashboard
        </NavLink>

        <h1 className="text-3xl font-bold text-[#556B2F] mb-8">
          Submitted Tasks
        </h1>

        {submittedTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {submittedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl shadow border border-gray-200 p-5 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-[#556B2F]">
                      {task.title}
                    </h2>

                    <p className="text-xs text-gray-500 mt-1">
                      Task #{task.id}
                    </p>
                  </div>

                  <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                    Submitted
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-gray-500">Reward</p>

                  <p className="text-green-700 font-semibold">
                    {task.reward ?? task.rewardAfter} STK
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-gray-500">Submitted By</p>

                  <p className="text-sm break-all font-medium">
                    {task.freelancer}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-1">
                    GitHub Repository
                  </p>

                  <a
                    href={task.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline break-all text-sm whitespace-nowrap"
                  >
                    {task.githubLink}
                  </a>
                </div>

                <button
                  onClick={() => aprroveTaskPropsal(task.id)}
                  disabled={task.approved}
                  className={`w-full mt-5 py-2 cursor-pointer rounded-lg font-medium transition hover:-translate-y-0.5 ${
                    !task.approved
                      ? "bg-[#556B2F] hover:bg-[#445624] text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  d4f699
                >
                  {task.approved ? "Task Approved" : "Approve Task"}
                </button>

                {!option[task.id] && (
                  <div
                    className="text-blue-600 font-semibold text-sm cursor-pointer m-2"
                    onClick={() => setOption(prev=> ({...prev , [task.id]: true}))}
                  >
                    more options....
                  </div>
                )}

                {option[task.id] && (
                  <div className="flex flex-col m-2">
                    <textarea
                      rows={2}
                      className="m-2 border-2 border-green-800 rounded focus:ring-2 focus:ring-green-900 outline-none"
                      placeholder="Rejection Reason"
                      value={rejectMsg[task.id]}
                      onChange={(e)=> setRejectMsg(prev=> ({...prev , [task.id]: e.target.value}))}
                    ></textarea>
                    <button
                      disabled={task.rejected}
                      onClick={()=> rejectBtn(task.id)}
                      className={`w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:-translate-y-0.5 text-white`}
                    >
                      Reject Task
                    </button>
                    <div
                      className="text-blue-600 font-semibold text-sm cursor-pointer m-2"
                      onClick={() => setOption(prev=> ({...prev , [task.id]: false}))}
                    >
                      less options....
                    </div>
                  </div>
                )}
                {showRatings && (
                  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[360px] shadow-xl">
                      <h2 className="text-xl font-semibold text-center mb-4">
                        Rate Freelancer
                      </h2>

                      <Rating ratings={ratings} setRatings={setRatings} />

                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          onClick={() => ratingBtn(task.freelancer)}
                          className="px-4 py-2 border rounded-lg"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Submitted Tasks
            </h2>

            <p className="text-gray-500 mt-2">
              Freelancers haven't submitted any completed work yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubmittedTask;
