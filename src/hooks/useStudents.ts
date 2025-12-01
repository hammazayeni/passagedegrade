import { useState, useEffect } from "react";
import { Student, TestStatus } from "@/types";
import { toast } from "sonner";

const STORAGE_KEY = "taekwondo-sbeitla-data";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const loadData = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setStudents(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse students", e);
        }
      }
    };
    loadData();
    
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  const saveStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStudents));
    window.dispatchEvent(new Event("storage")); 
  };

  const addStudent = (student: Student) => {
    const newStudents = [...students, student];
    saveStudents(newStudents);
    toast.success("Élève ajouté avec succès");
  };
  
  const addMultipleStudents = (newStudentsList: Student[]) => {
    // Calculate new orders starting from the last existing order
    const startOrder = students.length > 0 ? Math.max(...students.map(s => s.order)) : 0;
    
    const preparedStudents = newStudentsList.map((s, index) => ({
      ...s,
      order: startOrder + index + 1
    }));
    
    const updatedList = [...students, ...preparedStudents];
    saveStudents(updatedList);
    // Toast handled in component
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    const newStudents = students.map((s) => (s.id === id ? { ...s, ...updates } : s));
    saveStudents(newStudents);
    toast.success("Élève mis à jour");
  };

  const deleteStudent = (id: string) => {
    const newStudents = students.filter((s) => s.id !== id);
    saveStudents(newStudents);
    toast.success("Élève supprimé");
  };

  const reorderStudents = (newOrder: Student[]) => {
    const reordered = newOrder.map((s, index) => ({ ...s, order: index + 1 }));
    saveStudents(reordered);
  };

  const setStatus = (id: string, status: TestStatus) => {
    updateStudent(id, { status });
  };

  return {
    students: students.sort((a, b) => a.order - b.order),
    addStudent,
    addMultipleStudents,
    updateStudent,
    deleteStudent,
    reorderStudents,
    setStatus,
  };
}