import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "../../../components/ui/alert-dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Edit, Trash, Loader2 } from "lucide-react";
import SimpleComboBox from "../../../components/layout/ComboBox";
import { 
  useGetStudents, 
  useUpdateStudent, 
  useDeleteStudent 
} from "../../../hooks/students/getStudents";
import { toast } from "react-toastify";


function EditStudentModal({ student, onSave, classSectionData, classOptions }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  const handleOpen = () => {
    const sId = student.id || student.student_id;
    
    if (!sId) {
      console.error("Critical: Student object is missing an ID field", student);
    }

    setValue({
      fullname: student.full_name || "",
      rollNo: String(student.roll_no || ""),
      class: String(student.class_id || ""),
      section: String(student.section_id || ""),
    });
    setOpen(true);
  };

  const sectionOptions = useMemo(() => {
    if (!value?.class) return [];
    return classSectionData
      .filter((item) => String(item.class_id) === String(value.class))
      .map((item) => ({
        label: item.section_name,
        value: String(item.id), // This 'id' is the section_id
      }));
  }, [classSectionData, value?.class]);

  const handleSaveInternal = () => {
    const sId = student.id || student.student_id;
    
    if (!value?.fullname || !value?.rollNo || !value?.section) {
        alert("Please fill all fields");
        return;
    }

    const payload = {
      full_name: value.fullname,
      roll_no: Number(value.rollNo),
      section_id: Number(value.section),
    }

    onSave(sId, payload);
    setOpen(false);
  };

  return (
    <AlertDialog  open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="ghost" onClick={handleOpen}>
          <Edit size={16} className="" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full ">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-bold">
            Edit Student
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left py-4 w-full">
            {value && (
              <div className="space-y-4 w-full ">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={value.fullname}
                    onChange={(e) => setValue(p => ({ ...p, fullname: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Roll No</label>
                  <Input
                    type="number"
                    value={value.rollNo}
                    onChange={(e) => setValue(p => ({ ...p, rollNo: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Class</label>
                  <SimpleComboBox
                    options={classOptions}
                    value={value.class}
                    field="class"
                    setValue={setValue}
                    onSelect={() => setValue(p => ({ ...p, section: "" }))}
                    placeholder="Select Class"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Section</label>
                  <SimpleComboBox
                    options={sectionOptions}
                    value={value.section}
                    field="section"
                    setValue={setValue}
                    placeholder={value.class ? "Select Section" : "Choose class first"}
                    disabled={!value.class}
                  />
                </div>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleSaveInternal}>Update Student</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DeleteStudentModal({ student, onDelete }) {
  const sId = student.id || student.student_id;
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash size={16} className="text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Student?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <b>{student.full_name}</b>? This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={() => onDelete(sId)}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function StudentTable({ classSectionData, classOptions }) {
  const { data: response, isLoading, isError, error } = useGetStudents();
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-muted-foreground">Loading student records...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 my-10 bg-red-50 border border-red-200 text-red-700 rounded-md">
        <p className="font-bold">Error loading data:</p>
        <p className="text-sm">{error?.response?.data?.detail || error.message}</p>
      </div>
    );
  }

  const students = response?.data || [];

 const handleEditSave = (id, updatedData) => {
  updateMutation.mutate(
    { id, data: updatedData },
    {
      onSuccess: () => {
        toast.success("Student updated successfully ");
      },
      onError: (err) => {
        toast.error(err?.response?.data?.detail || "Update failed ");
      },
    }
  );
};
const handleDelete = (id) => {
  deleteMutation.mutate(id, {
    onSuccess: () => {
      toast.success("Student deleted successfully ");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.detail || "Delete failed ");
    },
  });
};
  return (
    <div className="mt-8 border rounded-lg overflow-hidden bg-white shadow-sm">
      <Table>
        <TableCaption className="pb-4">Registered Students List</TableCaption>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[100px] font-bold">Roll No</TableHead>
            <TableHead className="font-bold">Full Name</TableHead>
            <TableHead className="font-bold">Class</TableHead>
            <TableHead className="font-bold">Section</TableHead>
            <TableHead className="text-right font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                No students found in the database.
              </TableCell>
            </TableRow>
          ) : (
            students.map((s) => (
              <TableRow key={s.id || s.student_id}>
                <TableCell className="font-medium text-blue-700">#{s.roll_no}</TableCell>
                <TableCell className="font-semibold">{s.full_name}</TableCell>
                <TableCell>{s.class_name}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-slate-100 rounded text-xs border">
                    {s.section_name}
                  </span>
                </TableCell>
                <TableCell className="flex justify-end gap-1">
                  <EditStudentModal
                    student={s}
                    onSave={handleEditSave}
                    classSectionData={classSectionData}
                    classOptions={classOptions}
                  />
                  <DeleteStudentModal student={s} onDelete={handleDelete} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}