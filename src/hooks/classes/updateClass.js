import { api } from "../../../src/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/classes/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["classes"]);
    },
  });
}