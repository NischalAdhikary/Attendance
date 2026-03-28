import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { AlertDialogCancel } from '@/components/ui/alert-dialog'

import { Edit, Plus } from 'lucide-react'
import React from 'react'
import { AlertDialogDescription } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { useCreateClass } from '../../../hooks/classes/createClasses'
export default function ClassForm({ title, value, setValue, type = 'add' }) {
  const { mutate, isPending } = useCreateClass();

  const handleSubmit = (e) => {
    e?.preventDefault(); // Now this will be caught correctly
    
    if (!value.class_name.trim() || !value.section_name.trim()) {
      alert("Please add class and section");
      return;
    }

    mutate(value, {
      onSuccess: () => {
        setValue({ class_name: "", section_name: "" });
      },
      onError: (err) => {
        alert(err?.response?.data?.detail || "Something went wrong");
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>{type === 'edit' ? <Edit /> : <Plus />}</Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="mb-4 text-center w-full">{title}</AlertDialogTitle>
          <AlertDialogDescription className="w-full">
            {/* 1. Added an ID to the form */}
            <form id="class-form" className='space-y-8' onSubmit={handleSubmit}>
              <div className='flex flex-col gap-3'>
                <label htmlFor="class" className='text-xl text-black font-semibold'>Class</label>
                <Input 
                  placeholder='10' 
                  className='w-full border-black' 
                  id='class' 
                  onChange={(e) => setValue({ ...value, class_name: e.target.value })} 
                  value={value.class_name} 
                />
              </div>
              <div className='flex flex-col gap-3'>
                <label htmlFor="section" className='text-xl text-black font-semibold'>Section</label>
                <Input 
                  value={value.section_name} 
                  onChange={(e) => setValue({ ...value, section_name: e.target.value })} 
                  placeholder='A' 
                  className='w-full border-black' 
                  id='section'
                />
              </div>
            </form>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            type="submit" 
            form="class-form" 
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}