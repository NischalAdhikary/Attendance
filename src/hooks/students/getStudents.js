import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/api";


export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/students/", data);
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries(["students"]);
      console.log(res.message); 
    },
  });
}


export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
        console.log(id,data,"checking")
    
      const res = await api.put(`/students/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
    },
  });
}


export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (studentId) => {
      const res = await api.delete(`/students/${studentId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
    },
  });
}
export function useGetStudents(){
    return useQuery({
        queryKey:["students"],
        queryFn:async()=>{
            const res=await api.get("/students/");
            return res.data;

        }
    })
}
export function useGetStudentsBySection(sectionId) {
  return useQuery({
    queryKey: ["students", "section", sectionId],
    queryFn: async () => {
      // Don't call API if no section is selected
      if (!sectionId) return { data: [] };

      // Make sure this matches your FastAPI route: @app.get("/students/{section_id}")
      const res = await api.get(`/students/section/${sectionId}`);
      
      // If your API returns the list directly, use: return res.data;
      // If it returns { "data": [...] }, use: return res.data;
      return res.data; 
    },
    enabled: !!sectionId, // Only runs when sectionId is truthy
  });
}