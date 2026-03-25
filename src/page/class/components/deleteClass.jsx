import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { AlertDialogCancel } from '@/components/ui/alert-dialog'

import { Plus, Trash } from 'lucide-react'

import { AlertDialogDescription } from '@/components/ui/alert-dialog'
export default function DeleteClass() {
  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>
      <Button className={'bg-red-500'}>
        <Trash />
      </Button>
    </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className={"mb-4 text-center  w-full"}>
          Are you sure you want to delete?
                </AlertDialogTitle>
           <AlertDialogDescription className={"w-full"}>
           <p>
            Delete this class and the section all the student linked to it will be deleted?
           </p>
           </AlertDialogDescription>
    
    
            </AlertDialogHeader>
             <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
    
              <AlertDialogAction className={'bg-red-500'}>Delete</AlertDialogAction>
            </AlertDialogFooter>
    
        </AlertDialogContent>
    
    
      </AlertDialog>
  )
}
