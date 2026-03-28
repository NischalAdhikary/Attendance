import { api } from "../../api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/classes/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["classes"]);
    },
  });
}   