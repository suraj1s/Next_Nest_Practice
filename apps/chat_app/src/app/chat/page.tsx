import React from 'react'

const page = () => {
  return (
    <div className='h-screen'>
    <div>Contacts</div>
    <div className='relative container max-h-[90%] h-full border-4 border-gray-300 rounded-3xl p-20 max-w-[55%] '>
      <h1 className='absolute top-5 font-bold text-2xl text-gray-300  '>
      Chat 
      </h1>
      <div>

      </div>

      <div className= 'absolute bottom-5 flex gap-x-2  items-center justify-center'>
        <input type="text" className=' border-2 border-gray-400 w-[600px] rounded-lg h-10 bg-slate-900 text-gray-200 font-medium  outline-slate-800 px-3' />
        <button className='px-2 py-1 bg-slate-900 border-2 border-gray-400 rounded-md '>Send</button>

      </div>
    </div>
    </div>
  )
}

export default page