import React from 'react'
import  { ethers , BrowserProvider } from 'ethers'
import { SkillTokenAddress, TaskManagerAddress } from '../ethers/contractAdresses'
import TaskManagerABI from '../ethers/ABI/TaskManagerABI.json'
import SkillsTokenABI from '../ethers/ABI/SkillsTokenABI.json'

async function ConnectWallet() {
   try{
      if(!window.ethereum){
        throw new Error('Meta Mask is not installed')
      }
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      
      const account = accounts[0]
      const chainIDHex = await window.ethereum.request({
        method: 'eth_chainId'
      })

      const chainID = parseInt(chainIDHex)

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      const taskManagerContract = new ethers.Contract(TaskManagerAddress, TaskManagerABI, signer)


      const SkillTokenContract = new ethers.Contract(SkillTokenAddress , SkillsTokenABI , signer)

      return ({provider , account , taskManagerContract  , SkillTokenContract , chainID})
   }catch(err){
     throw err
   }
}

export default ConnectWallet