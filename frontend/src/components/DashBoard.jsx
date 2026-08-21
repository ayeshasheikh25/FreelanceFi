import React, { useContext, useEffect, useMemo, useState } from "react";
import { api } from "../API/api";
import { NavLink, useNavigate } from "react-router-dom";
import { useTaskManager } from "../hooks/taskService";
import { WalletContext } from "../context/WalletContext";
import { ethers } from "ethers";

function DashBoard() {
  const { state, setState } = useContext(WalletContext);

  const [user, setUser] = useState({});
  const [taskIds, setTaskIds] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [pendingTask, setPendingTask] = useState([]);
  const [totalEarning, setTotalEarning] = useState(0);
  const { fetchTaskIds, fetchTasks, getProposal } = useTaskManager();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedState = localStorage.getItem("walletState");
        const state = JSON.parse(savedState);

        const res = await api.get(`/auth/connect-wallet/${state.account}`, {
          withCredentials: true,
        });

        const { role, name } = res.data;
        setUser({ role, name });
      } catch (err) {
        navigate("/");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!state.taskManagerContract) return;
      const Ids = await fetchTaskIds();
      setTaskIds(Ids);
      const task = await Promise.all(Ids.map((id) => fetchTasks(id)));
      setTasks(task);
      const propsal = await Promise.all(Ids.map((id) => getProposal(id)));
      setPendingTask(propsal.flat());
    };
    loadData();
  }, [state.taskManagerContract]);

  useEffect(() => {
    const contract = state.SkillTokenContract;
    if (!contract) return;

    const getBalance = async () => {
      const balance = await contract.balanceOf(state.account);
      setTotalEarning(ethers.formatEther(balance));
    };

    getBalance();
  }, [state.SkillTokenContract]);

  const disconnectWalllet = async () => {
    try {
      const res = await api.get("/auth/connect-wallet/logout", {
        withCredentials: true,
      });
      console.log(res);
      console.log(res.data.message);
      localStorage.removeItem("walletState");

      setState({
        provider: null,
        acount: null,
        taskManagerContract: null,
        StakingContract: null,
        SkillTokenContract: null,
        chainID: null,
      });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const totalSpent = tasks
    .filter((task) => task.client.toLowerCase() === state.account.toLowerCase())
    .reduce((sum, num) => (sum += num.reward), 0)
    .toFixed(2);

  return (
    <div className="min-h-screen bg-[#F5F1E8] p-6">
      <div className="bg-[#556B2F] text-white rounded-2xl p-5 md:p-8 shadow-lg hover:bg-[#324414] flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>

          <p className="mt-2 text-green-100">
            Manage your freelance activities from one place.
          </p>
        </div>

        <button
          onClick={disconnectWalllet}
          className="bg-[#F5F1E8] text-[#556B2F] hover:bg-[#E8E0D0] px-5 py-2 rounded-xl font-semibold transition border border-[#556B2F]"
        >
          Disconnect Wallet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-green-100">
          <h2 className="text-xl font-semibold text-[#556B2F]">Profile</h2>

          <p className="mt-3 text-gray-600">
            Name: <span className="font-medium">{user.name}</span>
          </p>

          <p className="mt-1 text-gray-600">
            Role:
            <span className="font-medium capitalize">{user.role}</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-green-100">
          <h2 className="text-xl font-semibold text-[#556B2F]">Statistics</h2>

          {user.role === "freelancer" && (
            <div className="mt-4 space-y-2">
              <p>
                Total Tasks:
                {
                  tasks.filter(
                    (task) =>
                      task.freelancer.toLowerCase() ===
                      state.account.toLowerCase(),
                  ).length
                }
              </p>
              <p>
                Active Tasks:
                {
                  tasks.filter(
                    (task) =>
                      task.freelancer.toLowerCase() ===
                        state.account.toLowerCase() && task.accepted,
                  ).length
                }
              </p>
              <p>
                Completed Tasks:
                {
                  tasks.filter(
                    (task) =>
                      task.freelancer.toLowerCase() ===
                        state.account.toLowerCase() && task.approved,
                  ).length
                }
              </p>
              <p>
                Pending Task:
                {
                  pendingTask.filter(
                    (pending) =>
                      pending.freelancer.toLowerCase() ===
                        state.account.toLowerCase() &&
                      tasks.some(
                        (task) => task.id === pending.id && !task.accepted,
                      ),
                  ).length
                }
              </p>
              <p>
                {user.role == "client" ? "Total Spent: " : "Total Earning: "}
                <span>{user.role == "client" ? totalSpent : totalEarning}</span>
              </p>
            </div>
          )}

          {user.role === "client" && (
            <div className="mt-4 space-y-2">
              <p>
                Total Tasks:
                {
                  tasks.filter(
                    (task) =>
                      task.client.toLowerCase() === state.account.toLowerCase(),
                  ).length
                }
              </p>
              <p>
                Active Tasks:
                {
                  tasks.filter(
                    (task) =>
                      task.client.toLowerCase() ===
                        state.account.toLowerCase() && task.accepted,
                  ).length
                }
              </p>
              <p>
                Completed Tasks:
                {
                  tasks.filter(
                    (task) =>
                      task.client.toLowerCase() ===
                        state.account.toLowerCase() && task.approved,
                  ).length
                }
              </p>
              <p>
                {user.role == "client" ? "Total Spent: " : "Total Earning: "}
                <span>{user.role == "client" ? totalSpent : totalEarning}</span>
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-green-100">
          <h2 className="text-xl font-semibold text-[#556B2F]">Wallet</h2>

          <p className="mt-3 text-gray-600 break-all">Connected via MetaMask</p>
        </div>
      </div>

      {user.role === "client" && (
        <div className="mt-8 bg-white rounded-2xl shadow-md p-6 border border-green-100">
          <h2 className="text-2xl font-bold text-[#556B2F] mb-4">
            Client Actions
          </h2>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-5 lg:gap-20 ">
            <NavLink
              to="/create-task"
              className="inline-block bg-[#556B2F] hover:bg-[#445624] text-white px-6 py-3  rounded-xl font-medium transition"
            >
              + Create New Task
            </NavLink>
            <NavLink
              to="/my-task"
              className="inline-block bg-[#556B2F] hover:bg-[#445624] text-white px-6 py-3  rounded-xl font-medium transition"
            >
              My Tasks
            </NavLink>
            <NavLink
              to="/view-propsals"
              className="inline-block bg-[#556B2F] hover:bg-[#445624] text-white px-6 py-3 rounded-xl font-medium transition"
            >
              View Proposals
            </NavLink>
            <NavLink
              to="/current-hires-freelancers"
              className="inline-block bg-[#556B2F] hover:bg-[#445624] text-white px-6 py-3 rounded-xl font-medium transition"
            >
              Current Hires
            </NavLink>
            <NavLink
              to="/submitted-tasks"
              className="inline-block bg-[#556B2F] hover:bg-[#445624] text-white px-6 py-3 rounded-xl font-medium transition"
            >
              Submitted Work
            </NavLink>

            <NavLink
              to="/freelancer-history"
              className="inline-block bg-[#556B2F] hover:bg-[#445624] text-white px-6 py-3 rounded-xl font-medium transition"
            >
              Freelancer History
            </NavLink>
          </div>
        </div>
      )}

      {user.role === "freelancer" && (
        <div className="mt-8 bg-white rounded-2xl shadow-md p-6 border border-green-100">
          <h2 className="text-2xl font-bold text-[#556B2F] mb-4">
            Freelancer Actions
          </h2>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-5 lg:gap-28">
            <NavLink
              to="/browse-task"
              className="bg-[#556B2F] hover:bg-[#445624] text-white px-6 py-3 rounded-xl font-medium transition"
            >
              Browse Tasks
            </NavLink>
            <NavLink
              to="/active-tasks"
              className="bg-[#556B2F] hover:bg-[#445624] text-white px-6 py-3 rounded-xl font-medium transition"
            >
              Active Tasks
            </NavLink>
            <NavLink
              to="/pending-applications"
              className="bg-[#556B2F] hover:bg-[#445624] text-white px-6 py-3 rounded-xl font-medium transition"
            >
              Pending Applications
            </NavLink>

            <NavLink
              to="/completed-tasks"
              className="bg-[#556B2F] hover:bg-[#445624] text-white px-6 py-3 rounded-xl font-medium transition"
            >
              Completed Tasks
            </NavLink>
            <NavLink
              to="/client-history"
              className="bg-[#556B2F] hover:bg-[#445624] text-white px-6 py-3 rounded-xl font-medium transition"
            >
              Client History
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashBoard;
