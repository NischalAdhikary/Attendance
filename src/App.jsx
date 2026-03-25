import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminLayout from './route/adminlayout'
import DashboardMain from './page/dashboard/Main'
import StudentMain from './page/students/Main'
import ClassMain from './page/class/ClassMain'
import AttendancePage from './page/Attendance/AttendanceMain'
import ViewAttendancePage from './page/Attendance/ViewAttendanceMain'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<DashboardMain />} />
        <Route path='/students' element={<StudentMain />} />
         <Route path='/attendance' element={<AttendancePage />} />
         <Route  path='/viewattendance' element={<ViewAttendancePage />} />
          <Route path='/classes' element={<ClassMain />} />
      </Route>
    </Routes>
  )
}
