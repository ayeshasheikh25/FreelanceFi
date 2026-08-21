import { parseEther } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { WalletContext } from "../../context/WalletContext";

function CreateTask() {
  const {state , handleWallet} = useContext(WalletContext)
  const navigate = useNavigate()
    const data = JSON.parse(localStorage.getItem('walletState'))
    if(!data){
       navigate('/')
    }
 
  

  console.log(state)
  const [task, setTask] = useState({
    title: "",
    description: "",
    reward: "",
  });

  const [msg, setMsg] = useState("");

  const ChangeEvent = (e) => {
    setTask((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTask = async (e) => {
    e.preventDefault();

    if (!task.title || !task.description || !task.reward) {
      return setMsg("Please fill all fields");
    }

    try {
      const {SkillTokenContract} = state
      const contract = state.taskManagerContract;
      
      console.log(typeof(SkillTokenContract.approve) , contract)
      const tx1 = await SkillTokenContract.approve('0xF2214deDFF9E7518919661742c9e7041F3D40Db5' , parseEther(task.reward))
       
      await tx1.wait()

      const tx2 = await contract.createTask(
        task.title,
        task.description,
        parseEther(task.reward)
      );
      await tx2.wait()

      setMsg("Task Created Successfully");

      setTask({
        title: "",
        description: "",
        reward: "",
      });

    } catch (err) {
      console.log(err);
      setMsg("Error creating task");
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex justify-center items-center p-6">
      <div className="w-full max-w-2xl">

  
        <NavLink
          to="/dashboard"
          className="inline-flex items-center mb-6 text-green-800 font-medium hover:text-green-900 transition"
        >
           Back to Dashboard
        </NavLink>

        <div className="bg-white rounded-3xl shadow-xl border border-green-100 p-8">

          <h1 className="text-3xl font-bold text-center text-green-800 mb-2">
            Create New Task
          </h1>

          <p className="text-center text-gray-500 mb-8">
            Create a blockchain task for freelancers.
          </p>

          <form onSubmit={handleTask} className="space-y-5">

          
            <div>
              <label className="block mb-2 text-sm font-semibold text-green-800">
                Task Title
              </label>

              <input
                type="text"
                name="title"
                value={task.title}
                onChange={ChangeEvent}
                placeholder="Build React Landing Page"
                className="w-full border border-green-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

         
            <div>
              <label className="block mb-2 text-sm font-semibold text-green-800">
                Task Description
              </label>

              <textarea
                rows={5}
                name="description"
                value={task.description}
                onChange={ChangeEvent}
                placeholder="Describe the task requirements..."
                className="w-full border border-green-300 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

     
            <div>
              <label className="block mb-2 text-sm font-semibold text-green-800">
                Reward (SKT)
              </label>

              <input
                type="number"
                name="reward"
                value={task.reward}
                onChange={ChangeEvent}
                placeholder="100"
                className="w-full border border-green-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

   
            {msg && (
              <div className="bg-amber-100 border border-amber-300 text-amber-800 rounded-xl p-3 text-sm">
                {msg}
              </div>
            )}

          
            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold transition duration-300 shadow-md"
            >
              Create Task
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTask;