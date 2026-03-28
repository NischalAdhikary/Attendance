import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/classes/create-with-section", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["classes"]);
    },
  });
}