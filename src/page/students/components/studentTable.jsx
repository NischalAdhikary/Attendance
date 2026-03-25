import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash } from "lucide-react";
import SimpleComboBox from "@/components/layout/ComboBox";

// ── Options ────────────────────────────────────────────────
const sections = [
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "C", value: "C" },
];

const classes = [
  { label: "10", value: "10" },
  { label: "8",  value: "8"  },
];

// ── Demo students (in real app this comes from props/API) ──
const INITIAL_STUDENTS = [
  { id: 1, rollNo: 1, name: "Ram Sharma",  class: "10", section: "A" },
  { id: 2, rollNo: 2, name: "Sita Thapa",  class: "10", section: "A" },
  { id: 3, rollNo: 3, name: "Hari Lama",   class: "8",  section: "B" },
  { id: 4, rollNo: 4, name: "Nima Gurung", class: "8",  section: "B" },
];

// ── Edit Modal ─────────────────────────────────────────────
// Reuses the same form layout as your StudentForm
function EditStudentModal({ student, onSave }) {
  const [open, setOpen]     = useState(false);
  const [value, setValue]   = useState(null);

  const handleOpen = () => {
    // pre-fill form with current student data
    setValue({
      fullname: student.name,
      rollNo:   String(student.rollNo),
      class:    student.class,
      section:  student.section,
    });
    setOpen(true);
  };

  const handleSave = () => {
    if (!value.fullname || !value.rollNo || !value.class || !value.section) return;
    onSave({
      ...student,
      name:    value.fullname,
      rollNo:  Number(value.rollNo),
      class:   value.class,
      section: value.section,
    });
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="icon" onClick={handleOpen}>
          <Edit size={16} />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="mb-4 text-center w-full">
            Edit Student
          </AlertDialogTitle>

          <AlertDialogDescription className="w-full">
            {value && (
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

                <div className="flex flex-col gap-2">
                  <label className="text-lg font-semibold text-foreground">Full Name</label>
                  <Input
                    placeholder="Ram Shah..."
                    value={value.fullname}
                    onChange={(e) => setValue({ ...value, fullname: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-lg font-semibold text-foreground">Roll No</label>
                  <Input
                    placeholder="1"
                    type="number"
                    value={value.rollNo}
                    onChange={(e) => setValue({ ...value, rollNo: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-lg font-semibold text-foreground">Class</label>
                  <SimpleComboBox
                    options={classes}
                    value={value.class}
                    field="class"
                    setValue={setValue}
                    placeholder="Select Class"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-lg font-semibold text-foreground">Section</label>
                  <SimpleComboBox
                    options={sections}
                    value={value.section}
                    field="section"
                    setValue={setValue}
                    placeholder="Select Section"
                  />
                </div>

              </form>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleSave}>
            Save Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ── Delete Confirm Modal ───────────────────────────────────
function DeleteStudentModal({ student, onDelete }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-red-500 hover:bg-red-600" size="icon">
          <Trash size={16} />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Student</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{student.name}</span>?
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={() => onDelete(student.id)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ── Main Table ─────────────────────────────────────────────
export default function StudentTable() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  const handleEdit = (updated) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  };

  const handleDelete = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <Table className="mt-10">
      <TableCaption>List of Students</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead>Roll No</TableHead>
          <TableHead>Full Name</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Section</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {students.map((s) => (
          <TableRow key={s.id}>
            <TableCell>{s.rollNo}</TableCell>
            <TableCell>{s.name}</TableCell>
            <TableCell>{s.class}</TableCell>
            <TableCell>{s.section}</TableCell>
            <TableCell className="flex gap-2">

              {/* Edit — pre-fills form with current data */}
              <EditStudentModal student={s} onSave={handleEdit} />

              {/* Delete — asks for confirmation */}
              <DeleteStudentModal student={s} onDelete={handleDelete} />

            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}