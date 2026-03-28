import { toast } from "react-toastify";
import { useDeleteClass } from "../../../hooks/classes/deleteClasses";
import React from "react";

export default function DeleteClassModal({
  deleteItem,
 
  onClose,
}) {
    const {mutate,isPending}=useDeleteClass()
    const handleDeleteClass =()=>{
        mutate(deleteItem?.id,{
            onSuccess:()=>{
                onClose()
                toast.success("Class deleted successfully")
            },
            onError:()=>{
                toast.error("Unable to delete class")
            }
        })
    }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-center text-red-600">
          Delete Class
        </h2>

        <p className="text-sm text-gray-700 mb-6 text-center">
          Are you sure you want to delete class{" "}
          <span className="font-semibold">"{deleteItem.class_name}"</span>?
          <br />
          This may also delete all sections under this class.
        </p>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 border rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={handleDeleteClass}
          >
            {isPending?"Deleting...":"Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}