import React, { useContext, useEffect, useState } from "react";
import { useTaskManager } from "../../hooks/taskService";
import { NavLink, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { WalletContext } from "../../context/WalletContext";

function BrowseTask() {
  const [Ids, setIds] = useState([]);
  const [tasks, settasks] = useState([]);
  const [data, setData] = useState([]);
  const [propsalMsg, setProposalMsg] = useState({});
  const { state } = useContext(WalletContext);
  const { fetchTaskIds, fetchTasks, applyRequest, getProposal } =
    useTaskManager();

  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("walletState"));
    if (!data) {
      navigate("/");
    }
  }, []);
  useEffect(() => {
    const contract = state.taskManagerContract;
    if (!contract) return;
    const loadData = async () => {
      try {
        const Id = await fetchTaskIds();
        setIds(Id);
        const task = await Promise.all(Id.map((id) => fetchTasks(id)));
        const filteredTask = task.filter((t) => t.id != 0);
        settasks(filteredTask);

        // const result = await Promise.all(Id.map((id)=>getProposal(id)))
        // setData(result.flat())
        const allPropsal = [];
        for (let id of Id) {
          const result = await getProposal(id);
          console.log(result);
          allPropsal.push(result);
        }
        setData(allPropsal.flat());
      } catch (err) {
        console.log(err);
      }
    };
    loadData();

    contract.on("TaskRequested", (...args) => {
      console.log("EVENT RECEIVED");
      console.log(args);
      loadData();
    });

    return () => {
      contract.off("TaskRequested");
    };
  }, [state.taskManagerContract]);

  console.log(data);

  const applyTaskBtn = async (id) => {
    try {
      const msg = propsalMsg[id];
      if (!msg) {
        alert(
          "Propsal Message is important for client why they should hire you",
        );
        return;
      }

      await applyRequest(id, msg);
      console.log("Request send to client");
      setProposalMsg({});
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] p-6">
      <div className="max-w-6xl mx-auto">
        {!tasks && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-gray-500">Loading Task...</p>
          </div>
        )}
        <NavLink
          to="/dashboard"
          className="inline-flex items-center mb-6 text-green-800 font-medium hover:text-green-900 transition"
        >
          Back to Dashboard
        </NavLink>
        <h1 className="text-3xl font-bold text-[#556B2F] mb-6">Browse Tasks</h1>
        {tasks.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-5 bg-[#556B2F] text-white font-semibold p-4">
              <p>Task</p>
              <p>Budget</p>
              <p>Status</p>
              <p>View</p>
              <p>Apply</p>
            </div>

            {tasks.map((task) => {
              const alreadyApplied = data.some(
                (d) =>
                  d.freelancer.toLowerCase() === state.account.toLowerCase() &&
                  d.id === task.id &&
                  d.requested,
              );

              return (
                <div
                  key={task.id}
                  className="grid grid-cols-5 items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <p className="font-medium text-gray-700">{task.title}</p>

                  <p className="font-semibold text-green-700">
                    {task.reward} STK
                  </p>

                  <span
                    className={`w-fit px-3 py-1 rounded-full text-sm font-medium ${
                      task.approved
                        ? "bg-green-100 text-green-700"
                        : task.completed
                          ? "bg-blue-100 text-blue-700"
                          : task.freelancer !==
                              "0x0000000000000000000000000000000000000000"
                            ? "bg-pink-50 text-pink-700"
                            : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {task.approved
                      ? "Approved"
                      : task.completed
                        ? "Completed"
                        : task.freelancer !==
                            "0x0000000000000000000000000000000000000000"
                          ? "Accepted"
                          : "Open"}
                  </span>

                  <NavLink
                    to={`/view-task/${btoa(task.id.toString())}`}
                    className="w-fit bg-[#F5F1E8] hover:bg-[#e5dfcf] text-[#556B2F] font-semibold px-4 py-2 rounded-lg transition"
                  >
                    View Task
                  </NavLink>

                  <div className="px-2">
                    {!alreadyApplied ? (
                      <textarea
                        rows={3}
                        value={propsalMsg[task.id]}
                        onChange={(e) =>
                          setProposalMsg((prev) => ({
                            ...prev,
                            [task.id]: e.target.value,
                          }))
                        }
                        placeholder="Tell the client why you're the best fit for this task..."
                        className="w-full border border-gray-300 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#556B2F] focus:border-[#556B2F]"
                      />
                    ) : (
                      ""
                    )}
                    <button
                      onClick={() => applyTaskBtn(task.id)}
                      className={`w-full mt-3 py-2 rounded-xl font-semibold ${
                        alreadyApplied
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#556B2F] hover:bg-[#445624] text-white"
                      }`}
                    >
                      {alreadyApplied ? "Proposal Sent" : "Send Proposal"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Tasks Available
            </h2>

            <p className="text-gray-500 mt-2">
              There are currently no tasks to browse.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowseTask;
