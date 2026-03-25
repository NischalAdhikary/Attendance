import React from 'react'

export default function ClassEditForm({editingClass,setEditingClass,handleSave,onClose}) {
  return (
 
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-center">Edit Class</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 font-semibold">Class</label>
                <input 
                  type="number"
                  value={editingClass.class}
                  onChange={(e) => setEditingClass({ ...editingClass, class: e.target.value })}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Section</label>
                <input 
                  type="text"
                  value={editingClass.section}
                  onChange={(e) => setEditingClass({ ...editingClass, section: e.target.value })}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  className="px-4 py-2 border rounded"
                  onClick={() => onClose()}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={() => handleSave(editingClass)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      
  )
}
