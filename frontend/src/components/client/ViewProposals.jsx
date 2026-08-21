import React, { useContext, useEffect, useState } from "react";
import { Navigate, NavLink } from "react-router-dom";
import { WalletContext } from "../../context/WalletContext";
import { useTaskManager } from "../../hooks/taskService";

function ViewProposals() {
  const { state } = useContext(WalletContext);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchTaskIds, fetchTasks, getProposal, getAcceptTask } =
    useTaskManager();

  const data = JSON.parse(localStorage.getItem("walletState"));
  if (!data) {
    return <Navigate to="/" replace={true} />;
  }

  const loadData = async () => {
    try {
      setLoading(true);
      const Ids = await fetchTaskIds();

      const tasks = [];
      for (let id of Ids) {
        const task = await fetchTasks(id);
        tasks.push(task);
      }

      const allPropsals = [];
      for (let id of Ids) {
        const proposal = await getProposal(id);
        allPropsals.push(...proposal);
      }

      const TaskResult = tasks
        .filter(
          (task) =>
            !task.accepted &&
            allPropsals.some((proposal) => task.id === proposal.id),
        )
        .map((task) => ({
          client: task.client,
          title: task.title,
          id: task.id,
        }));

      const ProposalResult = allPropsals
        .filter(
          (propsal) =>
            propsal.requested &&
            tasks.some((task) => task.id === propsal.id && !task.accepted),
        )
        .map((propsal) => ({
          id: propsal.id,
          freelancer: propsal.freelancer,
          message: propsal.message,
          requested: propsal.requested,
        }));

      const result = ProposalResult.map((proposal) => {
        const task = TaskResult.find((t) => t.id === proposal.id);

        return {
          ...proposal,
          ...task,
        };
      });
  
      setProposals(result);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const contract = state.taskManagerContract;
    if (!contract) return;

    loadData();

    contract.on("TaskRequested", (...args) => {
      console.log("EVENT RECEIVED");
      console.log(args);
      loadData();
    });
    contract.on("TaskAccepted", (...args) => {
      console.log("EVENT RECEIVED");
      console.log(args);
      loadData();
    });
    console.log(contract.listeners("TaskRequested"));
    console.log(state.taskManagerContract.target);
    return () => {
      contract.off("TaskRequested");
      contract.off("TaskAccepted");
    };
  }, [state.taskManagerContract]);



  const acceptTask = async (id, freelancer) => {
    try {
      await getAcceptTask(id, freelancer);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <p className="text-gray-500">Loading Task...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#F5F1E8] p-6">
      <div className="max-w-5xl mx-auto">
        <NavLink
          to="/dashboard"
          className="inline-flex items-center mb-6 text-green-800 font-medium hover:text-green-900 transition"
        >
          Back to Dashboard
        </NavLink>
        <h1 className="text-3xl font-bold text-[#556B2F] mb-8">
          View Proposals
        </h1>

        {proposals.filter(
          (proposal) =>
            proposal.client.toLowerCase() === state.account.toLowerCase(),
        ).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {proposals
              .filter(
                (proposal) =>
                  proposal.client.toLowerCase() === state.account.toLowerCase(),
              )
              .map((proposal) => (
                <div
                  key={`${proposal.id}-${proposal.freelancer}`}
                  className="bg-white rounded-xl shadow border border-gray-200 p-4 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="font-semibold text-base text-[#556B2F] ">
                        {proposal.title}
                      </h2>
                      <p className="font-light text-sm text-gray-500">
                        Task#{proposal.id}{" "}
                      </p>
                    </div>

                    <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      Pending
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500">Freelancer</p>
                    <p className="text-xs break-all font-medium text-gray-700">
                      {proposal.freelancer}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Proposal</p>

                    <div className="bg-gray-50 rounded-lg p-2 text-sm text-gray-700 h-20 overflow-y-auto">
                      {proposal.message}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <NavLink
                      to={`/view-profile/${btoa(proposal.freelancer.toString())}`}
                      className="w-full text-center bg-[#556B2F] hover:bg-[#445624] text-white py-2 rounded-lg text-sm font-medium transition"
                    >
                      View Profile
                    </NavLink>

                    <button
                      onClick={() =>
                        acceptTask(proposal.id, proposal.freelancer)
                      }
                      className="w-full bg-[#556B2F] hover:bg-[#445624] text-white py-2 rounded-lg text-sm font-medium transition"
                    >
                      Accept Proposal
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-700">
              No Proposals Yet
            </h2>

            <p className="text-gray-500 mt-2">
              Freelancers haven't submitted any proposals for your tasks.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewProposals;
