import React, { useMemo } from "react";
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
} from "../../../components/ui/alert-dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Plus, Loader2 } from "lucide-react";
import SimpleComboBox from "../../../components/layout/ComboBox";
import { useCreateStudent } from "../../../hooks/students/getStudents";
import { toast } from "react-toastify";

const initialState = {
  fullname: "",
  rollNo: "",
  class: "",
  section: "",
};

export default function StudentForm({
  title,
  value,
  setValue,
  classSectionData,
  classOptions,
  isLoading,
  isError,
}) {
  const { mutate, isPending } = useCreateStudent();

  const sectionOptions = useMemo(() => {
    if (!value.class) return [];

    return classSectionData
      .filter((item) => String(item.class_id) === String(value.class))
      .map((item) => ({
        label: item.section_name,
        value: String(item.id), 
      }));
  }, [classSectionData, value.class]);

  const handleSave = () => {
    // 1. Basic validation
    if (!value.fullname || !value.rollNo || !value.section) {
      alert("Please fill in all fields");
      return;
    }

    
    const payload = {
      full_name: value.fullname,
      roll_no: Number(value.rollNo),
      section_id: Number(value.section), 
    };

    
    mutate(payload, {
      onSuccess: () => {
        setValue(initialState); 
        toast.success("Student added successfully");
      },
      onError: (err) => {
       toast.error("Unable to add student");
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Student
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="mb-4 text-center w-full">
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription className="w-full">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">Fullname</label>
                <Input
                  placeholder="Ram Shah..."
                  value={value.fullname}
                  onChange={(e) =>
                    setValue((prev) => ({ ...prev, fullname: e.target.value }))
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">Roll No</label>
                <Input
                  placeholder="1"
                  type="number"
                  value={value.rollNo}
                  onChange={(e) =>
                    setValue((prev) => ({ ...prev, rollNo: e.target.value }))
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">Class</label>
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading classes...</p>
                ) : isError ? (
                  <p className="text-sm text-destructive">Failed to load classes</p>
                ) : (
                  <SimpleComboBox
                    options={classOptions}
                    value={value.class}
                    field="class"
                    setValue={setValue}
                    onSelect={() => {
                      setValue((prev) => ({ ...prev, section: "" }));
                    }}
                    placeholder="Select Class"
                  />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">Section</label>
                <SimpleComboBox
                  field="section"
                  options={sectionOptions}
                  value={value.section}
                  setValue={setValue}
                  placeholder={value.class ? "Select Section" : "Select a class first"}
                  disabled={!value.class}
                />
              </div>
            </form>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setValue(initialState)}>
            Cancel
          </AlertDialogCancel>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}