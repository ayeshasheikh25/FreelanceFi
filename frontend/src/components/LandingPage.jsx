import React, { useContext } from "react";
import Button from "./Button/Button";
import { WalletContext } from "../context/WalletContext";
import { useNavigate } from "react-router-dom";
import { api } from "../API/api";

function LandingPage() {
  const {handleWallet } = useContext(WalletContext);
  const navigate = useNavigate()
  const connectWallet = async()=>{
   try{
     const walletData = await handleWallet()
     console.log(walletData)
  
      const walletAddress = walletData.account
      const res = await api.post('/auth/connect-wallet/check-user',{walletAddress},{withCredentials:true})
      console.log(res)
      if(res.data.exists || res.status === 200){
        navigate('/dashboard')
      }
    
   }catch(err){
    console.log(err)
      if(err.response.data.exists === false){
        navigate('/role-section')
      }
      
   }
  }
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className=" bg-white shadow-lg rounded-2xl p-6 border border-green-100 transform transition-all duration-300 hover:-translate-y-3.5">
        <Button fun={connectWallet} label="Connect Wallet" />
      </div>
    </div>
  );
}

export default LandingPage;
