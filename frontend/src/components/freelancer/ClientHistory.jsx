import React, { useContext, useEffect, useState } from "react";
import { Navigate, NavLink } from "react-router-dom";
import { WalletContext } from "../../context/WalletContext";
import { useTaskManager } from "../../hooks/taskService";
import { api } from "../../API/api";
import { ethers } from "ethers";

function ClientHistory() {
  const data = JSON.parse(localStorage.getItem("walletState"));

  if (!data) {
    return <Navigate to="/" replace={true} />;
  }

  const { state } = useContext(WalletContext);
  const { fetchTaskIds, fetchTasks } = useTaskManager();
  const [clientHistoryTask, setClientHistoryTask] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const contract = state.taskManagerContract;
    if (!contract) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const Ids = await fetchTaskIds();
        const tasks = await Promise.all(Ids.map((id) => fetchTasks(id)));
        const filterTasks = tasks.filter(
          (task) =>
            task.freelancer.toLowerCase() === state.account.toLowerCase() &&
            task.client &&
            task.approved,
        );
        const apiData = [];
        let balance;
        for (let task of filterTasks) {
          const res = await api.get(
            `/auth/connect-wallet/freelancers/${task.client}`,
            { withCredentials: true },
          );
          apiData.push(...res.data);
        }

        const finalData = filterTasks.map((task) => {
          const dataApi = apiData.find(
            (data) => data.walletAddress === task.client,
          );
          return {
            name: dataApi.name,
            rating: dataApi.avgRating,
            walletAddress: dataApi.walletAddress,
            title: task.title,
            price: task.reward ===0 ? task.rewardAfter : task.reward,
          };
        });
        setClientHistoryTask(finalData);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    
    const TaskHandler = (...args)=>{
            console.log("EVENT RECEIVED");
    console.log(args);
        loadData()
    }
    contract.on("TaskApproved", TaskHandler)

    return ()=>{
        contract.off("TaskApproved", TaskHandler)
    }
  }, [state.taskManagerContract]);

  console.log(clientHistoryTask);
  if (loading) {
    return (
      <div className="min-h-screen bg-white rounded-2xl shadow-lg p-8 text-center m-auto">
        <p className="text-gray-500">Loading Task...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] p-6">
      <div className="max-w-7xl mx-auto">
        <NavLink
          to="/dashboard"
          className="text-green-700 text-md font-semibold"
        >
          Back to Dashboard
        </NavLink>
        <h1 className="text-3xl font-bold text-[#556B2F] mb-8">
          Client History
        </h1>

        {clientHistoryTask.length > 0 ? (
          <div>
            <div className="bg-white rounded-2xl shadow-lg shadow-black/50 overflow-hidden hidden sm:block">
              <div className="grid grid-cols-5 bg-[#556B2F] text-white font-semibold px-6 py-4">
                <p>Wallet Address</p>
                <p>Client</p>
                <p>Project</p>
                <p>Earned</p>
                <p>Profile</p>
              </div>

              {clientHistoryTask.map((task, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5  items-center px-6 py-4 border-b-2 border-green-800 transition"
                >
                  <p className="font-mono text-sm text-gray-700">
                    {task.walletAddress.slice(0, 8)}...
                    {task.walletAddress.slice(-4)}
                  </p>

                  <div>
                    <p className="font-semibold text-[#556B2F]">{task.name}</p>
                  </div>


                  <p className="text-gray-700">{task.title}</p>

                  <p className="font-bold text-green-700">
                    {task.price.toFixed(2)} SKT
                  </p>

                  <NavLink
                    to={`/view-profile/${btoa(task.walletAddress.toString())}`}
                    className="w-fit px-4 py-2 rounded-full bg-[#769540] hover:bg-[#637d34] text-white font-semibold text-sm"
                  >
                    View Profile
                  </NavLink>
                </div>
              ))}
            </div>

            <div className="sm:hidden space-y-4">
              {clientHistoryTask.map((task, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow p-4 border"
                >
                  <p>
                    <b>Name:</b> {task.name}
                  </p>
                  <p>
                    <b>Wallet:</b> {task.walletAddress.slice(0, 8)}...
                    {task.walletAddress.slice(-4)}
                  </p>
                  <p>
                    <b>Project:</b> {task.title}
                  </p>
                  <p>
                    <b>Earned:</b> {task.price.toFixed(2)} SKT
                  </p>

                  <NavLink
                    to={`/view-profile/${btoa(task.walletAddress)}`}
                    className="mt-3 inline-block bg-[#556B2F] text-white px-4 py-2 rounded-lg"
                  >
                    View Profile
                  </NavLink>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Client History
            </h2>

            <p className="text-gray-500 mt-3">
              No completed client found yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientHistory