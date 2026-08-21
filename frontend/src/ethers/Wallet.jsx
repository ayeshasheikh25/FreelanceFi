import React, { useEffect, useState } from "react";
import ConnectWallet from "../utils/ConnectWallet";
import Loader from "../components/Loader";
import { WalletContext } from "../context/WalletContext";
import Button from "../components/Button/Button";
import { api } from "../API/api";
import {useNavigate} from 'react-router-dom'
function Wallet({children}) {
  


  const [state, setState] = useState({
    provider: null,
    acount: null,
    taskManagerContract: null,
    SkillTokenContract: null,
    chainID: null,
  });

  const [loader, setLoader] = useState(false);
  const navigate = useNavigate()
  const handleWallet = async () => {
    try {
      setLoader(true);
      const {
        provider,
        account,
        taskManagerContract,
        SkillTokenContract,
        chainID,
      } = await ConnectWallet();
      const walletState = {
        provider,
        account,
        taskManagerContract,
        SkillTokenContract,
        chainID,
      }
      setState(walletState);

      localStorage.setItem('walletState', JSON.stringify({
        account ,
        chainID
      }))
      return walletState

    } catch (err) {
      console.log(err)
    } finally {
      setLoader(false);
    }
  };
  
  useEffect(()=>{
    const reconnect = async ()=>{
      const savedData= localStorage.getItem('walletState')
      console.log(savedData)
      if(savedData){
        await handleWallet()
      }
    }
    reconnect()
  },[])

  if(loader){
    return <Loader />
  }
  return <div>
    <WalletContext.Provider value={{state , setState , handleWallet }}>
       <div className="w-full"> {children}</div>
    </WalletContext.Provider>
  </div>;
}

export default Wallet;
