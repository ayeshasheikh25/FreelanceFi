import React, { useState } from 'react'

function Rating({ratings , setRatings}) {
    const arr = new Array(5).fill(0)
    const [hover , setHover] = useState()
  return (
 <div className='flex p-6'>
      <div className='w-fit flex gap-2 bg-yellow-50 rounded shadow-black/50 px-4 py-2 border border-amber-300 '>
       {
        arr.map((currVal, index)=>{
          return <span className={`text-5xl cursor-pointer ${index < ratings || index < hover? "text-yellow-500" : ""}`}
           onMouseEnter={()=>setHover(index+1)}
           onMouseLeave={()=>setHover(0)}
           onClick={()=>setRatings(index+1)} key={index}>&#9734;</span>
        })
       }
       
    </div>
 </div>
  )
}

export default Rating