import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { api } from '../../API/api'

function ViewProfile() {
    const {address} = useParams()  
    const walletAddress = String(atob(address))
    
    const [data , setData] = useState()
useEffect(()=>{
    const fetchFreelancer = async()=>{
       const res = await api.get(`/auth/connect-wallet/freelancers/${walletAddress}`, {withCredentials: true,}) 
       console.log(res)
       setData(res.data[0])
    }
    fetchFreelancer()
},[])

  if (!data) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] py-10 px-4">
      <div className="max-w-5xl mx-auto">

        <NavLink
          to={-1}
          className="text-[#556B2F] font-semibold hover:underline"
        >
           Back
        </NavLink>

        <div className="mt-5 bg-white rounded-3xl shadow-xl overflow-hidden">

          <div className="bg-[#556B2F] h-36 relative">

            <div className="absolute left-8 bottom-[-30px]">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-white flex justify-center items-center text-4xl font-bold text-[#556B2F]">
                {data.name?.charAt(0).toUpperCase()}
              </div>
            </div>

          </div>

    
          <div className="pt-16 pb-8 px-8">

            <div className="flex justify-between items-center flex-wrap gap-4">

              <div>
                <h1 className="text-3xl font-bold">
                  {data.name}
                </h1>

                <p className="text-gray-500 capitalize mt-1">
                  {data.role}
                </p>
              </div>

              <div className="bg-yellow-100 px-5 py-3 rounded-xl text-center">
                <p className="text-gray-500 text-sm">
                  Average Rating
                </p>

                <h2 className="text-xl font-bold text-yellow-600">
                  &#11088; {data.avgRating.toFixed(1) ?? 0}
                </h2>
              </div>

            </div>


            <div className="mt-8">
              <h2 className="text-xl font-semibold text-[#556B2F] mb-2">
                About
              </h2>

              <p className="text-gray-700 leading-7">
                {data.bio}
              </p>
            </div>

  

            <div className="mt-8">

              <h2 className="text-xl font-semibold text-[#556B2F] mb-3">
                {data.role === "client" ? "Recruiter" : "Skills"}
              </h2>

                {data.role === 'freelancer' && <div className="flex flex-wrap gap-3">
                {data?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-[#556B2F] text-white px-4 py-2 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>}

            </div>


            <div className="mt-8">

              <h2 className="text-xl font-semibold text-[#556B2F] mb-2">
                Wallet Address
              </h2>

              <div className="bg-gray-100 p-4 rounded-xl break-all text-gray-700">
                {data.walletAddress}
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">

              <div className="bg-green-50 p-5 rounded-xl border">
                <h3 className="text-gray-500">
                  Role
                </h3>

                <p className="font-bold capitalize text-lg">
                  {data.role}
                </p>
              </div>

              <div className="bg-yellow-50 p-5 rounded-xl border">
                <h3 className="text-gray-500">
                  Rating
                </h3>

                <p className="font-bold text-lg">
                  &#11088; {data.avgRating.toFixed(1) ?? 0}
                </p>
              </div>

              <div className="bg-blue-50 p-5 rounded-xl border">
                <h3 className="text-gray-500">
                  {data.role === 'client' ? "Company" : "Skills"}
                </h3>

                <p className="font-bold text-lg">
                  {data.role === 'client' ? data.bio : data.skills.length}
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default ViewProfile