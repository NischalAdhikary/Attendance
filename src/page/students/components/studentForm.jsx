import React, { useState } from "react";
import { 
  AlertDialog, 
  AlertDialogTrigger, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogCancel, 
  AlertDialogAction 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

import SimpleComboBox from "@/components/layout/ComboBox";

const sections = [
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "C", value: "C" },
];

const classes = [
  { label: "10", value: "10" },
  { label: "8", value: "8" },
];
const initialState={
  fullname:"",
  rollNo:'',
  class:'',
  section:''
}

export default function StudentForm({ title,value,setValue }) {

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Plus /> Add Student
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="mb-4 text-center w-full">{title}</AlertDialogTitle>
          <AlertDialogDescription className="w-full">
            <form className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold">Fullname</label>
                <Input 
                  placeholder="Ram Shah..." 
                  value={value.fullname} 
                 onChange={(e)=>setValue({...value,fullname:e.target.value})}  
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold">Roll No</label>
                <Input 
                  placeholder="1" 
                  value={value.rollNo} 
              onChange={(e)=>setValue({...value,rollNo:e.target.value})} 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold">Class</label>
             <SimpleComboBox 
                  options={classes} 
                  value={value.class} 
                   field={'class'}
                  setValue={setValue}
                  placeholder="Select Class"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold">Section</label>
               <SimpleComboBox 
               field={'section'}
                  options={sections} 
                  value={value.section} 
            setValue={setValue}
                  placeholder="Select Section"
                />
              </div>
            </form>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={()=>setValue(initialState)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={()=>console.log('hello')}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
