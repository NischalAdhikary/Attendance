import { toast } from "react-toastify";
import { useUpdateClass } from "../../../hooks/classes/updateClass";
import React from "react";

export default function EditClassForm({
  editingClass,
  setEditingClass,
  onClose,
}) {
console.log(editingClass.class)
    const {mutate,isPending}=useUpdateClass();
    const handleSaveClass = ()=>{
        if(!editingClass.class?.trim()){
            toast.error("Please add class name")
            return
        }
        console.log(editingClass?.class)
        mutate({
            id:editingClass?.class_id,
            data:{
                class_name:editingClass?.class
            }
        },
        {
            onSuccess:()=>{
                onClose()
                toast.success("Class updated successfully")
            },
            onError:()=>{
                toast.error("Unable to update class")
            }
        }
    )
    }


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Edit Class</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-semibold">Class</label>
            <input
              type="text"
              value={editingClass.class || ""}
              onChange={(e) =>
                setEditingClass({
                  ...editingClass,
                  class: e.target.value,
                })
              }
              className="w-full border px-2 py-1 rounded"
              placeholder="Enter class name"
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
              onClick={handleSaveClass}
            >
              {isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}