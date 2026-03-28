// hooks/attendance/attendance.js
// Drop this file into your hooks/attendance/ folder.
// It replaces / extends your existing attendance hooks with full CRUD support.

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

// ─── Keys ────────────────────────────────────────────────────────────────────

const attendanceKey = (sectionId, date) => ["attendance", sectionId, date];

// ─── GET: attendance for a section + date ────────────────────────────────────

export function useGetDailyAttendance(sectionId, date) {
  return useQuery({
    queryKey: attendanceKey(sectionId, date),
    enabled: !!sectionId && !!date,
    queryFn: async () => {
      const { data } = await axios.get(
        `${API}/attendance/${sectionId}/${date}`
      );
      // Return the array directly so components can use data directly
      return data.data ?? [];
    },
  });
}

// ─── POST: bulk upsert (take attendance for whole section) ───────────────────

export function useSubmitAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      // payload = [{ student_id, status, note, date }, ...]
      const { data } = await axios.post(`${API}/attendance/bulk`, payload);
      return data;
    },
    onSuccess: () => {
      // Invalidate all attendance queries so View page refreshes automatically
      qc.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

// ─── PUT: edit a single attendance record ────────────────────────────────────

export function useUpdateAttendance() {
  const qc = useQueryClient();
  return useMutation({
    /**
     * @param {{ id: number, status: string, note: string }} variables
     */
    mutationFn: async ({ id, status, note }) => {
      const { data } = await axios.put(`${API}/attendance/${id}`, {
        status,
        note,
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

// ─── DELETE: single attendance record ────────────────────────────────────────

export function useDeleteAttendance() {
  const qc = useQueryClient();
  return useMutation({
    /**
     * @param {number} id  — the attendance record's primary key
     */
    mutationFn: async (id) => {
      const { data } = await axios.delete(`${API}/attendance/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

// ─── DELETE: all records for a section + date ────────────────────────────────

export function useDeleteSectionAttendance() {
  const qc = useQueryClient();
  return useMutation({
    /**
     * @param {{ sectionId: number, date: string }} variables
     */
    mutationFn: async ({ sectionId, date }) => {
      const { data } = await axios.delete(
        `${API}/attendance/section/${sectionId}/${date}`
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}