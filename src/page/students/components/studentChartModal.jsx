import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "../../../components/ui/alert-dialog";
import { Button } from "../../../components/ui/button";
import { Loader2, BarChart3 } from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StudentAttendanceChartModal({ student, open, onOpenChange }) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !student?.id) return;

    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(
          `http://127.0.0.1:8000/students/${student.id}/attendance-summary`
        );
        setSummary(res.data?.data || null);
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
            "Failed to load student attendance summary"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [open, student]);

  const chartData = {
    labels: ["Present", "Absent", "Late"],
    datasets: [
      {
        data: [
          summary?.present || 0,
          summary?.absent || 0,
          summary?.late || 0,
        ],
        backgroundColor: ["#22c55e", "#ef4444", "#f59e0b"],
        borderColor: ["#16a34a", "#dc2626", "#d97706"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl w-full">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-xl font-bold">
            <BarChart3 size={20} />
            Student Attendance Summary
            


          </AlertDialogTitle>

          <AlertDialogDescription asChild>
            <div className="pt-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="animate-spin text-primary" size={30} />
                  <p>Loading attendance chart...</p>
                </div>
              ) : error ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
                  {error}
                </div>
              ) : summary ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="rounded-lg border p-3 bg-slate-50">
                      <p className="text-xs text-muted-foreground">Student</p>
                      <p className="font-semibold">{summary.full_name}</p>
                    </div>

                    <div className="rounded-lg border p-3 bg-slate-50">
                      <p className="text-xs text-muted-foreground">Roll No</p>
                      <p className="font-semibold">#{summary.roll_no}</p>
                    </div>

                    <div className="rounded-lg border p-3 bg-green-50">
                      <p className="text-xs text-muted-foreground">Present</p>
                      <p className="font-bold text-green-600">{summary.present}</p>
                    </div>

                    <div className="rounded-lg border p-3 bg-red-50">
                      <p className="text-xs text-muted-foreground">Absent</p>
                      <p className="font-bold text-red-600">{summary.absent}</p>
                    </div>

                    <div className="rounded-lg border p-3 bg-yellow-50">
                      <p className="text-xs text-muted-foreground">Late</p>
                      <p className="font-bold text-yellow-600">{summary.late}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border p-4 bg-white">
                    <div className="h-[320px]">
                      <Doughnut data={chartData} options={chartOptions} />
                    </div>
                  </div>

                  <div className="rounded-lg border p-3 bg-blue-50">
                    <p className="text-sm text-muted-foreground">Total Records</p>
                    <p className="text-xl font-bold text-blue-700">{summary.total}</p>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center text-muted-foreground">
                  No attendance data found
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end pt-4">
  <Button variant="outline" onClick={() => onOpenChange(false)}>
    Close
  </Button>
</div>
      </AlertDialogContent>
    </AlertDialog>
  );
}