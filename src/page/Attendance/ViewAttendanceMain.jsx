import React, { useState, useMemo } from "react";
import SimpleComboBox from "../../components/layout/ComboBox"; // adjust path if needed

const CLASS_OPTIONS = [
  { label: "Class 10", value: "10" },
  { label: "Class 11", value: "11" },
  { label: "Class 12", value: "12" },
];

const SECTION_OPTIONS = [
  { label: "Section A", value: "A" },
  { label: "Section B", value: "B" },
  { label: "Section C", value: "C" },
];

const DEMO_RECORDS = {
  "10-A": {
    "2026-03-17": [
      { id: 1, name: "Aarav Sharma",    roll: "10A-01", status: "P", note: "" },
      { id: 2, name: "Priya Thapa",     roll: "10A-02", status: "A", note: "Sick" },
      { id: 3, name: "Rohan Rai",       roll: "10A-03", status: "P", note: "" },
      { id: 4, name: "Sneha Gurung",    roll: "10A-04", status: "L", note: "Bus late" },
      { id: 5, name: "Bikash Limbu",    roll: "10A-05", status: "P", note: "" },
      { id: 6, name: "Anjali Karki",    roll: "10A-06", status: "P", note: "" },
      { id: 7, name: "Suman Basnet",    roll: "10A-07", status: "A", note: "No info" },
      { id: 8, name: "Nisha Adhikari",  roll: "10A-08", status: "P", note: "" },
    ],
    "2026-03-16": [
      { id: 1, name: "Aarav Sharma",    roll: "10A-01", status: "P", note: "" },
      { id: 2, name: "Priya Thapa",     roll: "10A-02", status: "P", note: "" },
      { id: 3, name: "Rohan Rai",       roll: "10A-03", status: "A", note: "Family event" },
      { id: 4, name: "Sneha Gurung",    roll: "10A-04", status: "P", note: "" },
      { id: 5, name: "Bikash Limbu",    roll: "10A-05", status: "L", note: "" },
      { id: 6, name: "Anjali Karki",    roll: "10A-06", status: "P", note: "" },
      { id: 7, name: "Suman Basnet",    roll: "10A-07", status: "P", note: "" },
      { id: 8, name: "Nisha Adhikari",  roll: "10A-08", status: "P", note: "" },
    ],
  },
  "10-B": {
    "2026-03-17": [
      { id: 9,  name: "Dipesh Magar",  roll: "10B-01", status: "P", note: "" },
      { id: 10, name: "Kabita Rai",    roll: "10B-02", status: "A", note: "Sick" },
      { id: 11, name: "Rabin Tamang",  roll: "10B-03", status: "P", note: "" },
      { id: 12, name: "Sunita Thapa",  roll: "10B-04", status: "L", note: "Late bus" },
    ],
  },
  "11-A": {
    "2026-03-17": [
      { id: 13, name: "Asmita Poudel",   roll: "11A-01", status: "P", note: "" },
      { id: 14, name: "Nabin Shrestha",  roll: "11A-02", status: "P", note: "" },
      { id: 15, name: "Manisha Koirala", roll: "11A-03", status: "A", note: "" },
      { id: 16, name: "Suraj Khatri",    roll: "11A-04", status: "P", note: "" },
      { id: 17, name: "Binita Yadav",    roll: "11A-05", status: "L", note: "Traffic" },
    ],
  },
};

function getInitials(name) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-teal-100 text-teal-700",
  "bg-rose-100 text-rose-700",
];

const STATUS_STYLES = {
  P: { badge: "bg-green-100 text-green-700 border-green-300", label: "Present" },
  A: { badge: "bg-red-100 text-red-600 border-red-300",       label: "Absent"  },
  L: { badge: "bg-amber-100 text-amber-600 border-amber-300", label: "Late"    },
};

// ── Confirm Delete Modal ───────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
        <p className="text-sm text-gray-700 font-medium mb-1">Are you sure?</p>
        <p className="text-sm text-gray-400 mb-5">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ record, onSave, onCancel }) {
  const [status, setStatus] = useState(record.status);
  const [note, setNote]     = useState(record.note);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
        <p className="text-base font-semibold text-gray-800 mb-1">Edit Attendance</p>
        <p className="text-sm text-gray-400 mb-4">{record.name} — {record.roll}</p>

        {/* Status toggle */}
        <p className="text-xs font-semibold text-gray-500 mb-2">Status</p>
        <div className="flex gap-2 mb-4">
          {["P", "A", "L"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                status === s ? STATUS_STYLES[s].badge : "border-gray-200 text-gray-400 hover:border-gray-300"
              }`}
            >
              {STATUS_STYLES[s].label}
            </button>
          ))}
        </div>

       
        <p className="text-xs font-semibold text-gray-500 mb-2">Note <span className="font-normal text-gray-300">(optional)</span></p>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Sick, family event..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-300 mb-5"
        />

        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onSave({ ...record, status, note })}
            className="px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function StatPill({ label, count, color }) {
  return (
    <div className={`flex-1 min-w-[72px] rounded-xl p-3 text-center ${color}`}>
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-xs mt-0.5 font-medium opacity-70">{label}</p>
    </div>
  );
}

export default function ViewAttendancePage() {
  const [filters, setFilters] = useState({ class: "", section: "" });
  const [date, setDate]       = useState(() => new Date().toISOString().slice(0, 10));
  const [search, setSearch]   = useState("");

  const [records, setRecords] = useState(
    JSON.parse(JSON.stringify(DEMO_RECORDS)) 
  );

  const [editTarget,   setEditTarget]   = useState(null); 
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast]    = useState(null);

  const key = filters.class && filters.section
    ? `${filters.class}-${filters.section}`
    : null;

  const dayRecords = key ? (records[key]?.[date] ?? null) : null;

  const filtered = useMemo(() => {
    if (!dayRecords) return [];
    return dayRecords.filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.roll.toLowerCase().includes(search.toLowerCase())
    );
  }, [dayRecords, search]);

  const counts = useMemo(() => ({
    P: (dayRecords ?? []).filter((r) => r.status === "P").length,
    A: (dayRecords ?? []).filter((r) => r.status === "A").length,
    L: (dayRecords ?? []).filter((r) => r.status === "L").length,
    total: (dayRecords ?? []).length,
  }), [dayRecords]);

  // ── Helpers ───────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleFilter = (updater) => {
    setFilters(updater);
    setSearch("");
  };

  const handleSaveEdit = (updated) => {
    setRecords((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const list  = clone[key][date];
      const idx   = list.findIndex((r) => r.id === updated.id);
      if (idx !== -1) list[idx] = updated;
      return clone;
    });
    setEditTarget(null);
    showToast("✓  Record updated");
  };

  const confirmDelete = () => {
    if (deleteTarget.type === "row") {
      setRecords((prev) => {
        const clone = JSON.parse(JSON.stringify(prev));
        clone[key][date] = clone[key][date].filter((r) => r.id !== deleteTarget.id);
        if (clone[key][date].length === 0) delete clone[key][date];
        return clone;
      });
      showToast("Record deleted");
    } else {
      setRecords((prev) => {
        const clone = JSON.parse(JSON.stringify(prev));
        if (clone[key]) delete clone[key][date];
        return clone;
      });
      showToast("All records for this date deleted");
    }
    setDeleteTarget(null);
  };

  const noData = key && dayRecords === null;
  const hasData = key && dayRecords !== null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="w-full mx-auto space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">View Attendance</h1>
          <p className="text-sm text-gray-400 mt-0.5">Review, edit or delete attendance records</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SimpleComboBox
              label="Class"
              options={CLASS_OPTIONS}
              value={filters.class}
              setValue={handleFilter}
              field="class"
              placeholder="Select class"
            />
            <SimpleComboBox
              label="Section"
              options={SECTION_OPTIONS}
              value={filters.section}
              setValue={handleFilter}
              field="section"
              placeholder="Select section"
            />
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-black">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border rounded px-2 py-1 text-sm w-full outline-none focus:border-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Empty — no filter yet */}
        {!key && (
          <div className="text-center py-16 text-gray-300 text-sm">
            Select a class and section to view records
          </div>
        )}

        {/* No record for this date */}
        {noData && (
          <div className="text-center py-16 text-gray-300 text-sm">
            No attendance record found for this class/section/date
          </div>
        )}

        {/* Records loaded */}
        {hasData && (
          <>
            {/* Summary */}
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
                placeholder="Search by name or roll..."
                className="flex-1 min-w-[160px] border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-300 bg-white shadow-sm"
              />
              <button
                onClick={() =>
                  setDeleteTarget({ type: "all" })
                }
                className="px-4 py-2 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors"
              >
                Delete all
              </button>
            </div>

            {/* Student rows */}
            <div className="space-y-2">
              {filtered.length === 0 ? (
                <p className="text-center text-gray-300 text-sm py-8">No students match your search</p>
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
                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        AVATAR_COLORS[i % AVATAR_COLORS.length]
                      }`}
                    >
                      {getInitials(record.name)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{record.name}</p>
                      <p className="text-xs text-gray-400">
                        {record.roll}
                        {record.note && (
                          <span className="ml-2 text-gray-300">· {record.note}</span>
                        )}
                      </p>
                    </div>

                    {/* Status badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        STATUS_STYLES[record.status].badge
                      }`}
                    >
                      {STATUS_STYLES[record.status].label}
                    </span>

                    {/* Actions */}
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => setEditTarget(record)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors text-xs font-medium border border-transparent hover:border-blue-100"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: "row", id: record.id })}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors text-xs font-medium border border-transparent hover:border-red-100"
                        title="Delete"
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

      {/* Edit Modal */}
      {editTarget && (
        <EditModal
          record={editTarget}
          onSave={handleSaveEdit}
          onCancel={() => setEditTarget(null)}
        />
      )}

      {/* Confirm Delete Modal */}
      {deleteTarget && (
        <ConfirmModal
          message={
            deleteTarget.type === "row"
              ? "This will remove the attendance record for this student."
              : `This will delete all ${counts.total} records for Class ${filters.class}-${filters.section} on ${date}.`
          }
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}