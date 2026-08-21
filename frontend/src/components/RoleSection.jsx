import React, { useContext, useState } from "react";
import { WalletContext } from "../context/WalletContext";
import { api } from "../API/api";
import {useNavigate} from 'react-router-dom'
function RoleSection() {
  const { state } = useContext(WalletContext);
  const navigate = useNavigate()
  const [user, setUser] = useState({
    role: "client",
    name: "",
    bio: "",
    skills: [],
    profileCompleted: false,
  });
  const [message, setMessage] = useState("");
  const changeEvent = (e) => {
    console.log(e.target.value);
    if (e.target.name === "skills") {
      const arr = e.target.value.split(",");
      return setUser((prev) => ({ ...prev, skills: arr }));
    }
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage("");
  };

  const handleForm = async (e) => {
   try{
    e.preventDefault();
    setMessage("");

    if (!state.account) {
      return setMessage("Wallet not connected");
    }

    if(!user.name && !user.bio){
        return setMessage("All fields are required")
    }
    
    if(user.role === "freelancer" && user.skills.length === 0){
        return setMessage("Skills required for freelancer");
    }
    const finalUser = {
        ...user,
        walletAddress: state.account , 
        profileCompleted: true
    }
    setUser(finalUser)
    const res = await api.post("/auth/connect-wallet/create-profile", finalUser, {
      withCredentials: true,
    });
    console.log(res.data);
    navigate('/dashboard')
   }catch(err){
    console.log(err.response?.data?.message)
   }
  };
  console.log(user);
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 border border-green-100">
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
          Complete Your Profile
        </h2>

        <form onSubmit={handleForm} className="space-y-4">
          <div>
            <label
              htmlFor="role"
              className="block mb-2 text-sm font-medium text-green-800"
            >
              Select Role
            </label>

            <select
              id="role"
              name="role"
              value={user.role}
              onChange={changeEvent}
              className="w-full border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="client">Client</option>
              <option value="freelancer">Freelancer</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-green-800"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={user.name}
              placeholder="Enter your full name"
              onChange={changeEvent}
              className="w-full border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {user.role === "freelancer" && (
            <div>
              <label
                htmlFor="skills"
                className="block mb-2 text-sm font-medium text-green-800"
              >
                Skills
              </label>

              <input
                id="skills"
                type="text"
                name="skills"
                value={user.skills.join(",")}
                placeholder="React, Node.js, MongoDB"
                onChange={changeEvent}
                className="w-full border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

              <p className="text-xs text-gray-500 mt-1">
                Separate skills with commas.
              </p>
            </div>
          )}

          <div>
            <label
              htmlFor="bio"
              className="block mb-2 text-sm font-medium text-green-800"
            >
              Bio
            </label>

            <textarea
              id="bio"
              rows={4}
              name="bio"
              value={user.bio}
              placeholder="Tell us about yourself..."
              onChange={changeEvent}
              className="w-full border border-green-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {message && (
            <p className="text-red-500 text-sm font-medium">{message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold transition duration-300"
          >
            Complete Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default RoleSection;
