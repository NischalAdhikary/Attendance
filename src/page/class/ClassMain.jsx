import PageHeader from '@/components/layout/PageHeader'
import React, { useState } from 'react'
import ClassTable from './components/classTable'
import StudentForm from '../students/components/studentForm';
import ClassForm from './components/classForm';

export default function ClassMain() {
  
  const [classDetails,setClassDetails]=useState({
    class:'',
    section:''
  })
  console.log("class details",classDetails)
  
  return (
 <>
 <PageHeader value={classDetails} setValue={setClassDetails} title={'Class Management'} type={'class'}/>
 <ClassTable  value={classDetails}  setValue={setClassDetails}/>

 </>
  )
}
