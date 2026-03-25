import PageHeader from '@/components/layout/PageHeader'
import React from 'react'
import StudentTable from './components/studentTable'
import Pagination from '@/components/layout/Pagination'

export default function StudentMain() {
  const [studentDetails,setStudentDetails]=React.useState({
    fullname:"",
    rollNo:'',
    class:'',
    section:''
  })
  
  return (
    <>
    <PageHeader value={studentDetails} setValue={setStudentDetails} title={"Student Management"} type={'student'}/>
    <StudentTable />
    <Pagination />
    </>
  )
}
