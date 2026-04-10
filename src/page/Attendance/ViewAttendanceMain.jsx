
import React, { useState, useMemo } from "react";
import SimpleComboBox from "../../components/layout/ComboBox";
import { useClasses } from "../../hooks/classes/useClass";
import {
  useGetDailyAttendance,
  useUpdateAttendance,
  useDeleteAttendance,
  useDeleteSectionAttendance,
} from "../../hooks/attendance/attendance";
import { toast } from "react-toastify";


const STATUS_STYLES = {
  P: { badge: "bg-green-100 text-green-700 border-green-300", label: "Present" },
  A: { badge: "bg-red-100 text-red-600 border-red-300",       label: "Absent"  },
  L: { badge: "bg-amber-100 text-amber-600 border-amber-300", label: "Late"    },
};

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-teal-100 text-teal-700",
  "bg-rose-100 text-rose-700",
];

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}


function StatPill({ label, count, color }) {
  return (
    <div className={`flex-1 min-w-[72px] rounded-xl p-3 text-center ${color}`}>
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-xs mt-0.5 font-medium opacity-70">{label}</p>
    </div>
  );
}


function ConfirmModal({ message, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
        <p className="text-sm text-gray-700 font-medium mb-1">Are you sure?</p>
        <p className="text-sm text-gray-400 mb-5">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}


function EditModal({ record, onSave, onCancel, loading }) {
  const [editStatus, setEditStatus] = useState(record.status);
  const [editNote,   setEditNote]   = useState(record.note ?? "");

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
        <p className="text-base font-semibold text-gray-800 mb-1">Edit Attendance</p>
        <p className="text-sm text-gray-400 mb-4">
          {record.full_name} — Roll {record.roll_no}
        </p>

        <p className="text-xs font-semibold text-gray-500 mb-2">Status</p>
        <div className="flex gap-2 mb-4">
          {["P", "A", "L"].map((s) => (
            <button
              key={s}
              onClick={() => setEditStatus(s)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                editStatus === s
                  ? STATUS_STYLES[s].badge
                  : "border-gray-200 text-gray-400 hover:border-gray-300"
              }`}
            >
              {STATUS_STYLES[s].label}
            </button>
          ))}
        </div>

        <p className="text-xs font-semibold text-gray-500 mb-2">
          Note <span className="font-normal text-gray-300">(optional)</span>
        </p>
        <input
          type="text"
          value={editNote}
          onChange={(e) => setEditNote(e.target.value)}
          placeholder="e.g. Sick, family event…"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-300 mb-5"
        />

        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ id: record.attendance_id, status: editStatus, note: editNote })}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}


export default function ViewAttendancePage() {
  const [filters, setFilters] = useState({ class: "", section: "" });
  const [date, setDate]       = useState(() => new Date().toISOString().slice(0, 10));
  const [search, setSearch]   = useState("");
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: classesResponse, isLoading: classesLoading } = useClasses();
  const classSectionData = classesResponse?.data ?? [];

  const classOptions = useMemo(() => {
    const map = new Map();
    classSectionData.forEach((item) => {
      if (!map.has(item.class_id))
        map.set(item.class_id, { label: item.class_name, value: String(item.class_id) });
    });
    return Array.from(map.values());
  }, [classSectionData]);

  const sectionOptions = useMemo(() => {
    if (!filters.class) return [];
    return classSectionData
      .filter((item) => String(item.class_id) === String(filters.class))
      .map((item) => ({ label: item.section_name, value: String(item.id) }));
  }, [classSectionData, filters.class]);

  // ── Attendance data ──
  const {
    data: records = [],
    isFetching,
    isLoading,
  } = useGetDailyAttendance(filters.section, date);

  // ── Mutations ──
  const { mutate: updateRecord, isPending: isUpdating } = useUpdateAttendance();
  const { mutate: deleteRecord, isPending: isDeletingRow } = useDeleteAttendance();
  const { mutate: deleteAll,    isPending: isDeletingAll } = useDeleteSectionAttendance();

  // ── Derived state ──
  const filtered = useMemo(
    () =>
      records.filter(
        (r) =>
          (r.student_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
          String(r.roll_no).includes(search)
      ),
    [records, search]
  );

  const counts = useMemo(() => ({
    P:     records.filter((r) => r.status === "P").length,
    A:     records.filter((r) => r.status === "A").length,
    L:     records.filter((r) => r.status === "L").length,
    total: records.length,
  }), [records]);

  const hasFilters = !!filters.section;
  const hasData    = hasFilters && records.length > 0;
  const noData     = hasFilters && !isLoading && records.length === 0;

  // ── Handlers ──
  const handleSaveEdit = ({ id, status, note }) => {
    console.log("checking id", id, "status", status, "note", note);
    updateRecord(
      { id, status, note },
      {
        onSuccess: () => { toast.success("Record updated"); setEditTarget(null); },
        onError:   () => toast.error("Failed to update record"),
      }
    );
  };

  const handleConfirmDelete = () => {
    if (deleteTarget.type === "row") {
      deleteRecord(deleteTarget.id, {
        onSuccess: () => { toast.success("Record deleted"); setDeleteTarget(null); },
        onError:   () => toast.error("Failed to delete record"),
      });
    } else {
      deleteAll(
        { sectionId: filters.section, date },
        {
          onSuccess: () => { toast.success("All records deleted"); setDeleteTarget(null); },
          onError:   () => toast.error("Failed to delete records"),
        }
      );
    }
  };

  const isDeleteLoading = isDeletingRow || isDeletingAll;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="w-full mx-auto space-y-5">

     
        <div>
          <h1 className="text-2xl font-bold text-gray-900">View Attendance</h1>
          <p className="text-sm text-gray-400 mt-0.5">Review, edit or delete attendance records</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SimpleComboBox
              label="Class"
              options={classOptions}
              value={filters.class}
              setValue={setFilters}
              field="class"
              placeholder={classesLoading ? "Loading…" : "Select class"}
              onSelect={() => setFilters((prev) => ({ ...prev, section: "" }))}
            />
            <SimpleComboBox
              label="Section"
              options={sectionOptions}
              value={filters.section}
              setValue={setFilters}
              field="section"
              placeholder={filters.class ? "Select section" : "Select class first"}
              disabled={!filters.class}
            />
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-black text-sm">Date</label>
              <input
                type="date"
                value={date}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDate(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-blue-400"
              />
            </div>
          </div>
        </div>

        {!hasFilters && (
          <div className="text-center py-16 text-gray-300 text-sm">
            Select a class and section to view records
          </div>
        )}

        {(isLoading || isFetching) && hasFilters && (
          <div className="flex flex-col items-center py-20 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2" />
            <p className="text-sm">Loading records…</p>
          </div>
        )}

        {noData && !isFetching && (
          <div className="text-center py-16 text-gray-300 text-sm">
            No attendance record found for this class / section / date
          </div>
        )}


        {hasData && !isLoading && (
          <>
          
            <div className="flex gap-2">
              <StatPill label="Total"   count={counts.total} color="bg-gray-100 text-gray-600"  />
              <StatPill label="Present" count={counts.P}     color="bg-green-50 text-green-700" />
              <StatPill label="Absent"  count={counts.A}     color="bg-red-50 text-red-600"     />
              <StatPill label="Late"    count={counts.L}     color="bg-amber-50 text-amber-600" />
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or roll number…"
                className="flex-1 min-w-[160px] border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-300 bg-white shadow-sm"
              />
              <button
                onClick={() => setDeleteTarget({ type: "all" })}
                className="px-4 py-2 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors"
              >
                Delete all
              </button>
            </div>

           
            <div className="space-y-2">
              {filtered.length === 0 ? (
                <p className="text-center text-gray-300 text-sm py-8">
                  No students match your search
                </p>
              ) : (
                filtered.map((record, i) => (
                  <div
                    key={record.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border bg-white transition-colors hover:border-gray-200 ${
                      record.status === "A"
                        ? "border-red-100"
                        : record.status === "L"
                        ? "border-amber-100"
                        : "border-gray-100"
                    }`}
                  >
                
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        AVATAR_COLORS[i % AVATAR_COLORS.length]
                      }`}
                    >
                      {getInitials(record.full_name)}
                    </div>

                 
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {record.full_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Roll {record.roll_no}
                        {record.note && (
                          <span className="ml-2 text-gray-300">· {record.note}</span>
                        )}
                      </p>
                    </div>

                 
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        STATUS_STYLES[record.status]?.badge ?? ""
                      }`}
                    >
                      {STATUS_STYLES[record.status]?.label ?? record.status}
                    </span>

                 
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => setEditTarget(record)}
                        title="Edit"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: "row", id: record.id })}
                        title="Delete"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

     
      {editTarget && (
        <EditModal
          record={editTarget}
          onSave={handleSaveEdit}
          onCancel={() => setEditTarget(null)}
          loading={isUpdating}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          message={
            deleteTarget.type === "row"
              ? "This will permanently remove the attendance record for this student."
              : `This will delete all ${counts.total} records for the selected section on ${date}.`
          }
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={isDeleteLoading}
        />
      )}
    </div>
  );
}