import React, { useContext, useEffect, useState } from "react";
import { WalletContext } from "../../context/WalletContext";
import { useTaskManager } from "../../hooks/taskService";
import { NavLink } from "react-router-dom";

function ClientTasks() {
  const { state, handleWallet } = useContext(WalletContext);
  const [clientTasks, setClientTasks] = useState([]);
  const [taskIds, setTaskIds] = useState([]);
  const { fetchTaskIds, fetchTasks, deleteTasks } = useTaskManager();
  const [msg , setMsg] = useState("")
  useEffect(()=>{
    const data = JSON.parse(localStorage.getItem('walletState'))
    if(!data){
       navigate('/')
    }
  },[])
  useEffect(() => {
    const contract = state.taskManagerContract;
    if(!contract) return
    const loadData = async () => {
      const Ids = await fetchTaskIds();
      setTaskIds(Ids);
      const task = await Promise.all(Ids.map((id) => fetchTasks(id)));
      console.log(task)
      const myTask = task.filter(
        (t) => String(t.client) === String(state.account),
      );
      setClientTasks(myTask);
    };
    loadData();

    const TaskHandler = (...args) => {
      console.log("EVENT OCCUR")
      console.log(args)
      loadData();
    };

    contract.on("TaskCreated", TaskHandler);
    contract.on("TaskDeleted", (...args)=>{
          console.log("EVENT RECEIVED");
    console.log(args);
    loadData()

    })
    return () => {
      contract.off("TaskCreated", TaskHandler);
      contract.off("TaskDeleted")
    };
  }, [state.taskManagerContract]);

  const deletebtn = async(id)=>{
    try{
       await deleteTasks(id)
       console.log("task deleted")
    }catch(err){
      console.log(err)
    }
  }
return (
  <div className="min-h-screen bg-amber-50 p-6">
    <div className="max-w-7xl mx-auto">
      <NavLink
        to="/dashboard"
        className="inline-flex items-center mb-6 text-green-800 font-medium hover:text-green-900"
      >
         Back to Dashboard
      </NavLink>

      <h1 className="text-3xl font-bold text-green-800 mb-6">My Tasks</h1>
   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-gray-500 text-sm">Total Tasks</p>
          <h2 className="text-2xl font-bold text-green-700">
            {clientTasks.length}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-gray-500 text-sm">Completed</p>
          <h2 className="text-2xl font-bold text-blue-700">
            {clientTasks.filter((task) => task.completed).length}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-gray-500 text-sm">Pending</p>
          <h2 className="text-2xl font-bold text-amber-700">
            {clientTasks.filter((task) => !task.completed).length}
          </h2>
        </div>
      </div>

      {clientTasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h2 className="text-2xl font-semibold">No Tasks Found</h2>
          <p className="text-gray-500 mt-2">
            You haven't created any tasks yet.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {clientTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-2xl shadow-md border border-green-100 p-4 hover:shadow-lg transition"
            >
            
              <div className="flex justify-between items-start">
                <h2 className="font-bold text-lg text-green-800 line-clamp-1">
                  {task.title}
                </h2>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    task.approved
                      ? "bg-green-100 text-green-700"
                      : task.completed
                      ? "bg-blue-100 text-blue-700"
                      : task.freelancer !==
                        "0x0000000000000000000000000000000000000000"
                      ? "bg-pink-100 text-pink-700"
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
              </div>

             
              <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                {task.description}
              </p>

         
              <div className="mt-4">
                <p className="text-xs text-gray-500">Reward</p>
                <h3 className="font-bold text-green-700 text-lg">
                  {task.reward} SKT
                </h3>
              </div>

          
              <div className="mt-3">
                <p className="text-xs text-gray-500">Freelancer</p>

                <p className="text-xs font-mono break-all">
                  {task.freelancer ===
                  "0x0000000000000000000000000000000000000000"
                    ? "Not Assigned"
                    : `${task.freelancer.slice(
                        0,
                        8
                      )}...${task.freelancer.slice(-6)}`}
                </p>
              </div>

              {task.githubLink && (
                <a
                  href={task.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="block mt-3 text-sm text-blue-600 hover:underline"
                >
                  View Submission
                </a>
              )}

              <div className="mt-5 pt-3 border-t flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Task #{task.id}
                </span>

                <button onClick={()=> deletebtn(task.id)}
                  className={`hover:bg-red-700 text-white text-sm px-3 py-1 rounded-lg transition ${task.freelancer !== '0x0000000000000000000000000000000000000000' ? ("bg-red-400 cursor-not-allowed") : "bg-red-600"}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}

export default ClientTasks;
