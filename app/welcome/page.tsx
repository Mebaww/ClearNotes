"use client"

import { useRouter } from "next/navigation"
const Welcome = () => {
    const router = useRouter()
  return (
    <div className='h-screen w-full items-center justify-center flex'>
          <button className="bg-white text-black px-4 py-1 rounded-lg" onClick={()=> router.push("/workspace")}>
        Go to my workspace
    </button>
    </div>

  

  )
}

export default Welcome