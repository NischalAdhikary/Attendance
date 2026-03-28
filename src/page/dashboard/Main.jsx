import React, { useMemo } from "react";
import { useDashboardSummary } from "../../hooks/dashboard/dashboard";


function StatCard({ label, value, icon, sub }) {
  return (
    <div className="h-40 rounded-2xl shadow-md bg-white border flex flex-col justify-center items-center gap-1 px-4">
      <span className="text-2xl">{icon}</span>
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </h2>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}


function SectionRow({ className, sectionName, marked, recordCount }) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
        marked
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
            marked
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {sectionName}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700">
            {className} — Section {sectionName}
          </p>
          <p className="text-xs text-gray-400">
            {marked ? `${recordCount} students recorded` : "Not marked yet"}
          </p>
        </div>
      </div>

      <span className="text-lg">{marked ? "✅" : "❌"}</span>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function DashboardMain() {
  const { data, isLoading, isError } = useDashboardSummary();

  // How many sections have attendance marked today
  const markedCount = useMemo(
    () => (data?.sections_status ?? []).filter((s) => s.marked).length,
    [data]
  );
  const totalSections = data?.sections_status?.length ?? 0;
  const allMarked = totalSections > 0 && markedCount === totalSections;

  return (
    <div className="w-full p-4 space-y-6 max-w-6xl mx-auto">

    
      <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <StatCard
          icon="🏫"
        
          label="Total Classes"
          value={isLoading ? "—" : (data?.total_classes ?? 0)}
        />
        <StatCard
          icon="👩‍🎓"
          label="Total Students"
          value={isLoading ? "—" : (data?.total_students ?? 0)}
        />
        <StatCard
          icon={allMarked ? "✅" : "⏳"}
          label="Today's Attendance"
          value={isLoading ? "—" : `${markedCount}/${totalSections}`}
          sub={
            isLoading
              ? "Loading…"
              : allMarked
              ? "All sections marked"
              : `${totalSections - markedCount} section(s) pending`
          }
        />
      </div>

      {/* ── Per-section attendance status ── */}
      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-800">
              Today's Attendance Status
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{data?.today}</p>
          </div>
          {!isLoading && (
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                allMarked
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-amber-50 text-amber-600 border-amber-200"
              }`}
            >
              {markedCount}/{totalSections} marked
            </span>
          )}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
            <span className="text-sm">Loading sections…</span>
          </div>
        )}

        {isError && (
          <p className="text-center text-sm text-red-400 py-6">
            Failed to load dashboard data
          </p>
        )}

        {!isLoading && !isError && totalSections === 0 && (
          <p className="text-center text-sm text-gray-300 py-6">
            No sections found
          </p>
        )}

        {!isLoading && !isError && totalSections > 0 && (
          <div className="space-y-2">
            {data.sections_status.map((s) => (
              <SectionRow
                key={s.section_id}
                className={s.class_name}
                sectionName={s.section_name}
                marked={s.marked}
                recordCount={s.record_count}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}