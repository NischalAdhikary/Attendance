import SimpleComboBox from "../../components/layout/ComboBox";
import React, { useState, useMemo } from "react";
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

const DEMO_STUDENTS = {
  "10-A": [
    { id: 1, name: "Aarav Sharma",   roll: "10A-01" },
    { id: 2, name: "Priya Thapa",    roll: "10A-02" },
    { id: 3, name: "Rohan Rai",      roll: "10A-03" },
    { id: 4, name: "Sneha Gurung",   roll: "10A-04" },
    { id: 5, name: "Bikash Limbu",   roll: "10A-05" },
    { id: 6, name: "Anjali Karki",   roll: "10A-06" },
    { id: 7, name: "Suman Basnet",   roll: "10A-07" },
    { id: 8, name: "Nisha Adhikari", roll: "10A-08" },
  ],
  "10-B": [
    { id: 9,  name: "Dipesh Magar",  roll: "10B-01" },
    { id: 10, name: "Kabita Rai",    roll: "10B-02" },
    { id: 11, name: "Rabin Tamang",  roll: "10B-03" },
    { id: 12, name: "Sunita Thapa",  roll: "10B-04" },
  ],
  "11-A": [
    { id: 13, name: "Asmita Poudel",  roll: "11A-01" },
    { id: 14, name: "Nabin Shrestha", roll: "11A-02" },
    { id: 15, name: "Manisha Koirala",roll: "11A-03" },
    { id: 16, name: "Suraj Khatri",   roll: "11A-04" },
    { id: 17, name: "Binita Yadav",   roll: "11A-05" },
  ],
  "12-B": [
    { id: 18, name: "Kritika Bhandari", roll: "12B-01" },
    { id: 19, name: "Raj Pandey",       roll: "12B-02" },
    { id: 20, name: "Puja Chaudhary",   roll: "12B-03" },
  ],
};

// ── Helpers ────────────────────────────────────────────────
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

// ── Sub-components ─────────────────────────────────────────

/** Single student row */
function StudentRow({ student, index, status, note, onMark, onNote }) {
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

  const btnBase =
    "px-3 py-1 rounded text-xs font-semibold border transition-all duration-100 cursor-pointer";
  const states = {
    P: {
      active: "bg-green-100 text-green-700 border-green-400",
      idle:   "bg-white text-gray-400 border-gray-200 hover:border-green-300 hover:text-green-600",
    },
    A: {
      active: "bg-red-100 text-red-700 border-red-400",
      idle:   "bg-white text-gray-400 border-gray-200 hover:border-red-300 hover:text-red-500",
    },
    L: {
      active: "bg-amber-100 text-amber-700 border-amber-400",
      idle:   "bg-white text-gray-400 border-gray-200 hover:border-amber-300 hover:text-amber-600",
    },
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
        status === "A"
          ? "border-red-200 bg-red-50/40"
          : status === "L"
          ? "border-amber-200 bg-amber-50/40"
          : status === "P"
          ? "border-green-200 bg-green-50/20"
          : "border-gray-100 bg-white hover:border-gray-200"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarColor}`}
      >
        {getInitials(student.name)}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{student.name}</p>
        <p className="text-xs text-gray-400">{student.roll}</p>
      </div>

      
      {(status === "A" || status === "L") && (
        <input
          type="text"
          value={note}
          onChange={(e) => onNote(student.id, e.target.value)}
          placeholder="Add note..."
          className="hidden sm:block text-xs border border-gray-200 rounded px-2 py-1 w-28 outline-none focus:border-blue-300 bg-white text-gray-600"
        />
      )}

      {/* P / A / L buttons */}
      <div className="flex gap-1 flex-shrink-0">
        {["P", "A", "L"].map((s) => (
          <button
            key={s}
            onClick={() => onMark(student.id, s)}
            className={`${btnBase} ${
              status === s ? states[s].active : states[s].idle
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatPill({ label, count, color }) {
  return (
    <div className={`flex-1 min-w-[80px] rounded-xl p-3 text-center ${color}`}>
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-xs mt-0.5 font-medium opacity-70">{label}</p>
    </div>
  );
}

export default function AttendancePage() {
  const [filters, setFilters] = useState({ class: "", section: "" });
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [attendance, setAttendance] = useState({}); 
  const [notes, setNotes] = useState({});           
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  // ── Derived ──────────────────────────────────────────────
  const key = filters.class && filters.section
    ? `${filters.class}-${filters.section}`
    : null;

  const allStudents = key ? (DEMO_STUDENTS[key] ?? []) : [];

  const filtered = useMemo(
    () =>
      allStudents.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.roll.toLowerCase().includes(search.toLowerCase())
      ),
    [allStudents, search]
  );

  const counts = useMemo(() => {
    const vals = allStudents.map((s) => attendance[s.id] ?? null);
    return {
      P: vals.filter((v) => v === "P").length,
      A: vals.filter((v) => v === "A").length,
      L: vals.filter((v) => v === "L").length,
      U: vals.filter((v) => v === null).length,
    };
  }, [attendance, allStudents]);

  
  const handleFilter = (updater) => {
    setFilters(updater);
    setAttendance({});
    setNotes({});
    setSearch("");
  };

  const markStudent = (id, status) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: prev[id] === status ? null : status, 
    }));
  };

  const markAll = (status) => {
    const next = {};
    allStudents.forEach((s) => (next[s.id] = status));
    setAttendance(next);
  };

  const setNote = (id, text) => {
    setNotes((prev) => ({ ...prev, [id]: text }));
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    if (counts.U > 0) {
      showToast(` ${counts.U} student(s) still unmarked.`);
      return;
    }
   
    const payload = allStudents.map((s) => ({
      studentId: s.id,
      roll: s.roll,
      status: attendance[s.id],
      note: notes[s.id] ?? "",
      date,
      class: filters.class,
      section: filters.section,
    }));
    console.log("Saving attendance:", payload);
    showToast(`✓  Attendance saved for Class ${filters.class}-${filters.section}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="w-full mx-auto space-y-5">

      
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
          <p className="text-sm text-gray-400 mt-0.5">Select class and section to begin</p>
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

        {!key ? (
          <div className="text-center py-16 text-gray-300 text-sm">
            Select a class and section to load students
          </div>
        ) : allStudents.length === 0 ? (
          <div className="text-center py-16 text-gray-300 text-sm">
            No students found for this class/section
          </div>
        ) : (
          <>
           
            <div className="flex gap-2">
              <StatPill label="Present"  count={counts.P} color="bg-green-50 text-green-700" />
              <StatPill label="Absent"   count={counts.A} color="bg-red-50 text-red-600"     />
              <StatPill label="Late"     count={counts.L} color="bg-amber-50 text-amber-600" />
              <StatPill label="Unmarked" count={counts.U} color="bg-gray-100 text-gray-500"  />
            </div>

            {/* Bulk actions */}
            <div className="flex flex-wrap items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
              <span className="text-xs text-gray-400 mr-1">Mark all:</span>
              <button
                onClick={() => markAll("P")}
                className="px-3 py-1 rounded text-xs font-semibold border border-green-300 text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
              >
                All Present
              </button>
              <button
                onClick={() => markAll("A")}
                className="px-3 py-1 rounded text-xs font-semibold border border-red-300 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                All Absent
              </button>
              <button
                onClick={() => markAll("L")}
                className="px-3 py-1 rounded text-xs font-semibold border border-amber-300 text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors"
              >
                All Late
              </button>
              <button
                onClick={() => {
                  const next = {};
                  allStudents.forEach((s) => (next[s.id] = null));
                  setAttendance(next);
                }}
                className="ml-auto px-3 py-1 rounded text-xs font-semibold border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Clear all
              </button>
            </div>

  
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or roll..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-300 bg-white shadow-sm"
            />

        
            <div className="space-y-2">
              {filtered.length === 0 ? (
                <p className="text-center text-gray-300 text-sm py-8">No students match your search</p>
              ) : (
                filtered.map((s, i) => (
                  <StudentRow
                    key={s.id}
                    student={s}
                    index={i}
                    status={attendance[s.id] ?? null}
                    note={notes[s.id] ?? ""}
                    onMark={markStudent}
                    onNote={setNote}
                  />
                ))
              )}
            </div>

           
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setAttendance({});
                  setNotes({});
                }}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
              >
                Save Attendance
              </button>
            </div>
          </>
        )}
      </div>


      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-lg z-50 animate-bounce-in">
          {toast}
        </div>
      )}
    </div>
  );
}