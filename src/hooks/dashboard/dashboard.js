import { useQuery } from "@tanstack/react-query";
import axios from "axios";
 
const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
 
export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const { data } = await axios.get(`${API}/dashboard/summary`);
      return data.data; 
    },
    refetchInterval: 60_000,
  });
}
 