import { useContext } from "react";
import { WalletContext } from "../context/WalletContext";
import { ethers } from "ethers";

export const useTaskManager = () => {
  const { state } = useContext(WalletContext);

  const contract = state.taskManagerContract;

  const fetchTaskIds = async () => {
    const BigIntIds = await contract.getAllTaskIds();
    return BigIntIds.map((id) => Number(id));
  };

  const fetchTasks = async (id) => {
    const task = await contract.getTask(id);

    const taskObj = {
      id: Number(task[0]),
      title: task[1],
      description: task[2],
      reward: Number(ethers.formatEther(task[3])),
      rewardAfter: Number(ethers.formatEther(task[4])),
      client: task[5].toLowerCase(),
      freelancer: task[6].toLowerCase(),
      accepted: task[7],
      completed: task[8],
      approved: task[9],
      rejected: task[10],
      rejectMsg: task[11],
      githubLink: task[12],
    };

    return taskObj;
  };

  const applyRequest = async (id, msg) => {
    try {
      const tx = await contract.requestToAccept(id, msg);
      console.log("TX:", tx)

      const receipt = await tx.wait()

      console.log("Receipt:", receipt.logs)

    } catch (err) {
      const msg = err.reason || err.message || err;
      throw Error(msg);
    }
  };

  const acceptTasks = async (id) => {
    try {
      const tx = await contract.acceptTask(id);
      console.log("TX:", tx)

      const receipt = await tx.wait()

      console.log("Receipt:", receipt.logs)
      console.log(receipt.events)
    } catch (err) {
      const msg = err.reason || err.message || err;
      throw Error(msg);
    }
  };

  const submitTasks = async (id, link) => {
    try {
      const tx = await contract.submitTask(id, link);
          console.log("TX:", tx)

      const receipt = await tx.wait()

      console.log("Receipt:", receipt.logs)
      console.log(receipt.events)
    } catch (err) {
      const msg = err.reason || err.message || err;
      throw Error(msg);
    }
  };

  const deleteTasks = async (id) => {
    try {
      const tx = await contract.deleteTask(id);
      console.log("TX:", tx);

      const receipt = await tx.wait();

         console.log("Receipt:", receipt.logs)
      console.log(receipt.events)
    } catch (err) {
      const msg = err.reason || err.message || err;
      throw Error(msg);
    }
  };

  const getProposal = async (id) => {
    try {
      const data = await contract.getProposal(id);
      return data.map((d) => {
        return {
          id: id,
          freelancer: d.freelancer,
          message: d.message,
          requested: d.requested,
        };
      });
    } catch (err) {
      const msg = err.reason || err.message || err;
      throw Error(msg);
    }
  };

  const getAcceptTask = async (id, freelancer) => {
    try {
      const tx = await contract.acceptTask(id, freelancer);
      console.log("TX:", tx)

      const receipt = await tx.wait()

      console.log("Receipt:", receipt.logs)
      console.log(receipt.events)
    } catch (err) {
      const msg = err.reason || err.message || err;
      throw Error(msg);
    }
  };

  const approveTasks = async (id) => {
    try {
      const tx = await contract.approveTask(id);
      console.log("TX:", tx)

      const receipt = await tx.wait()

      console.log("Receipt:", receipt.logs)
      console.log(receipt.events)
    } catch (err) {
      const msg = err.reason || err.message || err;
      throw Error(msg);
    }
  };

  const rejectingTask = async(id , msg)=>{
    try{
       const tx = await contract.rejectTasks(id , msg)
       console.log(tx)
      const receipt = await tx.wait()

      console.log("Receipt:", receipt.logs)    
    }catch(err){
      const msg = err.reason || err.message || err;
      throw Error(msg);   
    }
  }
  return {
    fetchTaskIds,
    fetchTasks,
    acceptTasks,
    submitTasks,
    deleteTasks,
    applyRequest,
    getProposal,
    getAcceptTask,
    approveTasks,
    rejectingTask
  };
};
