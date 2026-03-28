import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api";

export function useClasses() {
  return useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const res = await api.get("/classes/");
      return res.data;
    },
  });
}