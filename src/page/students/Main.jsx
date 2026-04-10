import React, { useMemo, useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
import StudentTable from "./components/studentTable";
import Pagination from "../../components/layout/Pagination";
import { useClasses } from "../../hooks/classes/useClass";

export default function StudentMain() {
  const [studentDetails, setStudentDetails] = useState({
    fullname: "",
    rollNo: "",
    class: "",
    section: "",
  });

  const { data: classesResponse, isLoading, isError } = useClasses();

  const classSectionData = classesResponse?.data || [];
  

  const classOptions = useMemo(() => {
    const map = new Map();

    classSectionData.forEach((item) => {
      if (!map.has(item.class_id)) {
        map.set(item.class_id, {
          label: item.class_name,
          value: String(item.class_id),
        });
      }
    });

    return Array.from(map.values());
  }, [classSectionData]);
console.log(classSectionData,classOptions)
  return (
    <>
      <PageHeader
        value={studentDetails}
        setValue={setStudentDetails}
        title={"Student Management"}
        type="student"
        classSectionData={classSectionData}
        classOptions={classOptions}
        isLoading={isLoading}
        isError={isError}
      />

      <StudentTable
        classSectionData={classSectionData}
        classOptions={classOptions}
        isLoading={isLoading}
        isError={isError}
      />

    </>
  );
}