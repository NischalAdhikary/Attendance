import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit,Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteClass from "./deleteClass";
import ClassForm from "./classForm";
import { useState } from "react";
import EditClassForm from "./classEditForm";
import ClassEditForm from "./classEditForm";
const classes = [
  { class: 1, section: 'A' },
  { class: 1, section: 'B' },

  { class: 2, section: 'A' },
  { class: 2, section: 'B' },

  { class: 3, section: 'A' },
  { class: 3, section: 'B' },

  { class: 4, section: 'A' },
  { class: 4, section: 'B' },

  { class: 5, section: 'A' },
  { class: 5, section: 'B' },

  { class: 6, section: 'A' },
  { class: 6, section: 'B' },

  { class: 7, section: 'A' },
  { class: 7, section: 'B' },

  { class: 8, section: 'A' },
  { class: 8, section: 'B' },

  { class: 9, section: 'A' },
  { class: 9, section: 'B' },

  { class: 10, section: 'A' },
  { class: 10, section: 'B' }
];


export default function ClassTable({setValue,value}) {
  const [modal,setModal]=useState(false)
  
  
  return (
   <Table>
    <TableCaption>
    List of Classes 
    </TableCaption>
    <TableHeader >
        <TableRow>
            <TableHead>Class</TableHead>
             <TableHead>Section</TableHead>
              <TableHead>Action</TableHead>

        </TableRow>
          
    </TableHeader>
    <TableBody>
{classes.map((c,i)=>
<TableRow key={i}>
    <TableCell >{c.class}</TableCell>
    <TableCell>{c.section}</TableCell>
    <TableCell className={'flex gap-2'}>

       <Button onClick={()=>{setValue({class:c.class,section:c.section})
      setModal(true)}}><Edit /></Button>
           <DeleteClass />
    </TableCell>
</TableRow>

)}
    </TableBody>
    <TableBody>
      <TableRow>
        <TableCell>
             {
      modal && <ClassEditForm onClose={()=>{setModal(false)
        setValue({class:"",section:""})
      }} editingClass={value} setEditingClass={setValue}/>
    }

        </TableCell>
   
      </TableRow>
    

    </TableBody>
   

   </Table>
  )
}
