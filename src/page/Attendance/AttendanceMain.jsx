// pages/attendance/AttendancePage.jsx
// Fixed version — section ComboBox resets when class changes,
// and section value is always derived from sectionOptions correctly.

import React, { useState, useMemo, useEffect } from "react";
import SimpleComboBox from "../../components/layout/ComboBox";
import { useGetDailyAttendance, useSubmitAttendance } from "../../hooks/attendance/attendance";
import { useGetStudentsBySection } from "../../hooks/students/getStudents";
import { useClasses } from "../../hooks/classes/useClass";
import { toast } from "react-toastify";

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_STYLES = {
  P: { active: "bg-green-100 text-green-700 border-green-500 ring-2 ring-green-100" },
  A: { active: "bg-red-100 text-red-700 border-red-500 ring-2 ring-red-100" },
  L: { active: "bg-yellow-100 text-yellow-700 border-yellow-500 ring-2 ring-yellow-100" },
};

function getStatusStyle(btnStatus, currentStatus) {
  if (currentStatus === btnStatus) return STATUS_STYLES[btnStatus].active;
  return "bg-gray-50 text-gray-400 border-transparent hover:border-gray-200";
}

// ─── Student row ─────────────────────────────────────────────────────────────

function StudentRow({ student, status, note, onMark, onNote, disabled }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md">
      {/* Avatar + name */}
      <div className="flex items-center gap-4 min-w-[200px]">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
          {student.roll_no}
        </div>
        <div>
          <h3 className="font-bold text-gray-800">{student.full_name}</h3>
          <p className="text-xs text-gray-400 font-medium">ID: #{student.id}</p>
        </div>
      </div>

      {/* Note input */}
      <div className="flex-1 px-2">
        <input
          type="text"
          placeholder="Optional note…"
          value={note}
          onChange={(e) => onNote(student.id, e.target.value)}
          disabled={disabled}
          className="w-full text-sm border-b border-gray-100 focus:border-blue-400 outline-none py-1 bg-transparent transition-all italic"
        />
      </div>

      {/* P / A / L buttons */}
      <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl">
        {["P", "A", "L"].map((val) => (
          <button
            key={val}
            onClick={() => onMark(student.id, val)}
            disabled={disabled}
            className={`w-11 h-11 rounded-lg font-black text-sm border transition-all ${getStatusStyle(val, status)}`}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AttendancePage() {
  // filters.class  → class_id  (string)
  // filters.section → section_id (string) — this is what the API needs
  const [filters,    setFilters]    = useState({ class: "", section: "" });
  const [date,       setDate]       = useState(() => new Date().toISOString().slice(0, 10));
  const [attendance, setAttendance] = useState({});
  const [notes,      setNotes]      = useState({});
  const [search,     setSearch]     = useState("");

  // ── Remote data ──
  const { data: classesResponse, isLoading: classesLoading } = useClasses();
  const classSectionData = classesResponse?.data ?? [];

  const { data: studentsRes, isLoading: loadingStudents } = useGetStudentsBySection(
    filters.section   // section_id — already the right value from sectionOptions
  );

  const { data: existingRecords, isFetching: loadingHistory } = useGetDailyAttendance(
    filters.section,
    date
  );

  const { mutate: saveAttendance, isPending: isSaving } = useSubmitAttendance();

  const allStudents = studentsRes?.data ?? [];

  // ── Build dropdown options ──

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
      .map((item) => ({
        label: item.section_name,
        value: String(item.id), // ← section.id, not class_id
      }));
  }, [classSectionData, filters.class]);

  // ── When class changes, clear section ──
  const handleClassChange = (updater) => {
    setFilters((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      // If class changed, wipe section so stale data isn't fetched
      if (next.class !== prev.class) {
        return { ...next, section: "" };
      }
      return next;
    });
    setSearch("");
  };

  // ── Pre-fill attendance from existing records when section/date changes ──
  useEffect(() => {
    if (existingRecords && existingRecords.length > 0) {
      const savedStatus = {};
      const savedNotes  = {};
      existingRecords.forEach((rec) => {
        savedStatus[rec.student_id] = rec.status;
        savedNotes[rec.student_id]  = rec.note ?? "";
      });
      setAttendance(savedStatus);
      setNotes(savedNotes);
    } else {
      setAttendance({});
      setNotes({});
    }
  }, [existingRecords, date, filters.section]);

  // ── Mark all ──
  const markAll = (s) => {
    const next = {};
    allStudents.forEach((stu) => (next[stu.id] = s));
    setAttendance(next);
  };

  // ── Save ──
  const handleSave = () => {
    if (!filters.section) {
      toast.error("Please select a section first");
      return;
    }
    if (allStudents.length === 0) {
      toast.error("No students found for this section");
      return;
    }

    const payload = allStudents.map((s) => ({
      student_id: s.id,
      status:     attendance[s.id] ?? "P",
      note:       notes[s.id]      ?? "",
      date:       date,
    }));

    saveAttendance(payload, {
      onSuccess: () => toast.success("Attendance saved successfully"),
      onError:   () => toast.error("Failed to save attendance"),
    });
  };

  // ── Filter students by search ──
  const filtered = useMemo(
    () =>
      allStudents.filter((s) =>
        s.full_name.toLowerCase().includes(search.toLowerCase())
      ),
    [allStudents, search]
  );

  const isLoading = loadingStudents || loadingHistory;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Student Attendance</h1>
            <p className="text-gray-500 text-sm mt-1">Manage daily presence records</p>
          </div>
          <input
            type="date"
            value={date}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDate(e.target.value)}
            className="border-2 border-white bg-white shadow-sm rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Class + Section selectors */}
        <div className="bg-white rounded-2xl border p-5 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SimpleComboBox
            label="Select Class"
            options={classOptions}
            value={filters.class}
            setValue={handleClassChange}   // ← uses the reset-aware handler
            field="class"
            placeholder={classesLoading ? "Loading…" : "Choose a class…"}
          />
          <SimpleComboBox
            label="Select Section"
            options={sectionOptions}
            value={filters.section}
            setValue={setFilters}          // plain setter — no class reset needed
            field="section"
            placeholder={filters.class ? "Choose a section…" : "Select class first"}
            disabled={!filters.class}
          />
        </div>

        {/* Body */}
        {filters.section ? (
          <div className="space-y-4">

            {/* Toolbar */}
            <div className="bg-white rounded-2xl border p-4 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => markAll("P")}
                    className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700"
                  >
                    All Present
                  </button>
                  <button
                    onClick={() => markAll("A")}
                    className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700"
                  >
                    All Absent
                  </button>
                  <button
                    onClick={() => markAll("L")}
                    className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-bold rounded-lg hover:bg-yellow-600"
                  >
                    All Late
                  </button>
                </div>
                <span className="text-xs font-medium text-gray-400">
                  Total Students: {allStudents.length}
                </span>
              </div>

              <input
                type="text"
                placeholder="Search by student name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:bg-white transition-all outline-none"
              />
            </div>

            {/* Student rows */}
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex flex-col items-center py-20 text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2" />
                  <p>Fetching records…</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12 text-gray-300 text-sm">
                  No students found
                </div>
              ) : (
                filtered.map((s) => (
                  <StudentRow
                    key={s.id}
                    student={s}
                    status={attendance[s.id]}
                    note={notes[s.id] ?? ""}
                    onMark={(id, stat) =>
                      setAttendance((prev) => ({ ...prev, [id]: stat }))
                    }
                    onNote={(id, txt) =>
                      setNotes((prev) => ({ ...prev, [id]: txt }))
                    }
                    disabled={isSaving}
                  />
                ))
              )}
            </div>

            {/* Floating save button */}
            <div className="sticky bottom-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving || allStudents.length === 0}
                className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl hover:bg-blue-700 disabled:bg-gray-300 active:scale-95 transition-all flex items-center gap-2"
              >
                {isSaving ? "Processing…" : "Submit Attendance"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-gray-500 font-medium">
              Please select a class and section to begin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}