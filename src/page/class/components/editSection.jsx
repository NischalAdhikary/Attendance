import { toast } from "react-toastify";
import { useUpdateSection } from "../../../hooks/classes/updateSection";
import React from "react";

export default function EditSectionForm({
  editingClass,
  setEditingClass,

  onClose,
}) {
    console.log(editingClass)
    const {mutate,isPending}=useUpdateSection()
    const handleUpdateSection=()=>{
        if(!editingClass.section?.trim()){
            toast.error("Please add section name")
            return
        }
        mutate({
            id:editingClass?.id,
            data:{
                section_name:editingClass?.section
            }
        },
        {
            onSuccess:()=>{
                onClose()
                toast.success("Section updated successfully")
            },
            onError:()=>{
                toast.error("Unable to update section")
            }
        }
        )
    }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Edit Section</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-semibold">Section</label>
            <input
              type="text"
              value={editingClass.section || ""}
              onChange={(e) =>
                setEditingClass({
                  ...editingClass,
                  section: e.target.value,
                })
              }
              className="w-full border px-2 py-1 rounded"
              placeholder="Enter section name"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-2 border rounded"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleUpdateSection}
            >
              {isPending ? "Updating..." : "Update Section"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}