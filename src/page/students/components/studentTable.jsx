import React, { useEffect, useMemo, useState } from "react";
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
import { Edit, Trash, Loader2, BarChart3 } from "lucide-react";
import SimpleComboBox from "../../../components/layout/ComboBox";
import {
  useGetStudents,
  useUpdateStudent,
  useDeleteStudent,
} from "../../../hooks/students/getStudents";
import { toast } from "react-toastify";
import Pagination from "../../../components/layout/Pagination";
import StudentAttendanceChartModal from "./studentChartModal";
import { DeletePassWord } from "../../../lib/config";

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
        value: String(item.id),
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
    };

    onSave(sId, payload);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="ghost" onClick={handleOpen}>
          <Edit size={16} />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl font-bold">
            Edit Student
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left py-4 w-full">
            {value && (
              <div className="space-y-4 w-full">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={value.fullname}
                    onChange={(e) =>
                      setValue((p) => ({ ...p, fullname: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Roll No</label>
                  <Input
                    type="number"
                    value={value.rollNo}
                    onChange={(e) =>
                      setValue((p) => ({ ...p, rollNo: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Class</label>
                  <SimpleComboBox
                    options={classOptions}
                    value={value.class}
                    field="class"
                    setValue={setValue}
                    onSelect={() => setValue((p) => ({ ...p, section: "" }))}
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
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  

  const handleConfirmDelete = () => {
    if (!password.trim()) {
      setError("Please enter password");
      return;
    }

    if (password !== DeletePassWord) {
      setError("Incorrect password");
      return;
    }

    setError("");
    onDelete(sId);
    setPassword("");
  };

  return (
    <AlertDialog
      onOpenChange={(open) => {
        if (!open) {
          setPassword("");
          setError("");
        }
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash size={16} className="text-red-500" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Student?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Are you sure you want to remove <b>{student.full_name}</b>? This cannot be undone.
            </p>

            <div className="space-y-1">
              <label className="text-sm font-medium text-black">
                Enter password to confirm
              </label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
              />
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setPassword("");
              setError("");
            }}
          >
            Cancel
          </AlertDialogCancel>

          <Button variant="destructive" onClick={handleConfirmDelete}>
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
  const [selectedStudent, setSelectedStudent] = useState(null);
const [chartModalOpen, setChartModalOpen] = useState(false);

const handleOpenChart = (student) => {
  setSelectedStudent(student);
  setChartModalOpen(true);
};
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 10;

  const students = response?.data || [];

  const filteredAndSortedStudents = useMemo(() => {
    const filtered = students.filter((student) =>
      (student.full_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      const nameA = (a.full_name || "").toLowerCase();
      const nameB = (b.full_name || "").toLowerCase();

      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      }

      return nameB.localeCompare(nameA);
    });

    return sorted;
  }, [students, searchTerm, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedStudents.length / itemsPerPage);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedStudents.slice(startIndex, endIndex);
  }, [filteredAndSortedStudents, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOrder]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleEditSave = (id, updatedData) => {
    updateMutation.mutate(
      { id, data: updatedData },
      {
        onSuccess: () => {
          toast.success("Student updated successfully");
        },
        onError: (err) => {
          toast.error(err?.response?.data?.detail || "Update failed");
        },
      }
    );
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Student deleted successfully");
      },
      onError: (err) => {
        toast.error(err?.response?.data?.detail || "Delete failed");
      },
    });
  };

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

  return (
    <div className="mt-8 border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b bg-slate-50">
        <div className="w-full sm:max-w-sm">
          <Input
            placeholder="Search by student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium whitespace-nowrap">Sort by name</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="asc">A to Z</option>
            <option value="desc">Z to A</option>
          </select>
        </div>
      </div>

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
          {filteredAndSortedStudents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                No students found.
              </TableCell>
            </TableRow>
          ) : (
            paginatedStudents.map((s) => (
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
                   <Button
    size="icon"
    variant="ghost"
    onClick={() => handleOpenChart(s)}
    title="View Attendance Chart"
  >
    <BarChart3 size={16} className="text-blue-600" />
  </Button>
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

      <div className="flex justify-center py-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <StudentAttendanceChartModal
  student={selectedStudent}
  open={chartModalOpen}
  onOpenChange={setChartModalOpen}
/>
    </div>
  );
}