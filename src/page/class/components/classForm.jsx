import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { AlertDialogCancel } from '@/components/ui/alert-dialog'

import { Edit, Plus } from 'lucide-react'
import React from 'react'
import { AlertDialogDescription } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'

export default function ClassForm({title,value,setValue,type='add'}) {
  console.log('hello')
   
  return (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      {
         type==='edit' ? <Button>
          <Edit />
        </Button> :
         <Button>
    <Plus />
  </Button>
      }
 
</AlertDialogTrigger>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle className={"mb-4 text-center w-full"}>
                {title}
            </AlertDialogTitle>
       <AlertDialogDescription className={"w-full"}>
        <form className='space-y-8'>
            <div className='flex flex-col gap-3'>
                <label htmlFor="class" className='text-xl text-black font-semibold'>
                    Class
                    </label>
                    <Input  placeholder={'10'} className={'w-full border-black'} id={'class'} onChange={(e)=>setValue({...value,class:e.target.value})} value={value.class} />
               
            </div>
             <div  className='flex flex-col gap-3'>
                <label htmlFor="section" className='text-xl text-black font-semibold'>
                    Section
                    </label>
                    <Input value={value.section} onChange={(e)=>setValue({...value,section:e.target.value})} placeholder={'A'} className={'w-full border-black'} id={'section'}/>
               
            </div>
                
                

        </form>
       </AlertDialogDescription>
        </AlertDialogHeader>
         <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>

    </AlertDialogContent>


  </AlertDialog>
  )
}
