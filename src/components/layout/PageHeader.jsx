import React from "react";
import ClassForm from "@/page/class/components/classForm";
import StudentForm from "../../page/students/components/studentForm";

export default function PageHeader({
  title,
  type,
  value,
  setValue,
  classSectionData,
  classOptions,
  isLoading,
  isError,
}) {
  return (
    <div className="w-full h-20 p-2 relative rounded-xl bg-blue-500 flex justify-between items-center">
      <h1 className="text-white text-3xl">{title}</h1>

      {type === "class" ? (
        <ClassForm value={value} setValue={setValue} title={"Add Class"} />
      ) : (
        <StudentForm
          value={value}
          setValue={setValue}
          title={"Add Student"}
          classSectionData={classSectionData}
          classOptions={classOptions}
          isLoading={isLoading}
          isError={isError}
        />
      )}
    </div>
  );
}