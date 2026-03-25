import React from 'react'

export default function DashboardMain() {

  const totalClasses = 20
  const totalStudents = 350
  const todayAttendanceMarked = true

  return (
    <div className='w-full relative p-4'>

      <div className='grid sm:grid-cols-2 max-w-6xl mx-auto grid-cols-1 gap-10 md:grid-cols-3'>

        
        <div className='h-40 rounded-2xl shadow-md bg-white border flex flex-col justify-center items-center'>
          <h2 className='text-lg font-semibold text-gray-600'>Total Classes</h2>
          <p className='text-3xl font-bold mt-2'>{totalClasses}</p>
        </div>

       
        <div className='h-40 rounded-2xl shadow-md bg-white border flex flex-col justify-center items-center'>
          <h2 className='text-lg font-semibold text-gray-600'>Total Students</h2>
          <p className='text-3xl font-bold mt-2'>{totalStudents}</p>
        </div>

     
        <div className='h-40 rounded-2xl shadow-md bg-white border flex flex-col justify-center items-center'>
          <h2 className='text-lg font-semibold text-gray-600'>Today's Attendance</h2>
          <p className='text-2xl font-bold mt-2'>
            {todayAttendanceMarked ? "Marked ✅" : "Not Marked ❌"}
          </p>
        </div>

      </div>

    </div>
  )
}
