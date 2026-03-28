import { toast } from "react-toastify";
import { useDeleteSection } from "../../../hooks/classes/deleteSection";
import React from "react";

export default function DeleteSectionModal({
  deleteItem,
  onClose,
}) {
    const {mutate,isPending}=useDeleteSection()
    const handleDeleteSection = ()=>{
        mutate(deleteItem?.id,{
            onSuccess:()=>{
                onClose()
                toast.success("Section deleted successfully")
            },
            onError:()=>{
                toast.error("Unable to delete section")
            }
        })
    }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-center text-red-600">
          Delete Section
        </h2>

        <p className="text-sm text-gray-700 mb-6 text-center">
          Are you sure you want to delete section{" "}
          <span className="font-semibold">"{deleteItem.section_name}"</span>
          {" "}from class{" "}
          <span className="font-semibold">"{deleteItem.class_name}"</span>?
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
            onClick={handleDeleteSection}
          >
            {isPending?"Deleting...":"Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}