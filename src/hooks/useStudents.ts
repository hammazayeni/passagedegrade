import { useState, useEffect } from "react";
import { Student, TestStatus } from "@/types";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, query, orderBy, setDoc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";

const STORAGE_KEY = "taekwondo-sbeitla-data";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [cloudConnected, setCloudConnected] = useState(false);

  useEffect(() => {
    if (db) {
      const q = query(collection(db, "students"), orderBy("order"));
      const unsub = onSnapshot(q, (snapshot) => {
        setCloudConnected(true);
        const list: Student[] = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        setStudents(list);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
        if (snapshot.size === 0) {
          try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
              const parsed: Student[] = JSON.parse(saved);
              if (Array.isArray(parsed) && parsed.length > 0) {
                const batch = writeBatch(db);
                parsed.forEach((s) => {
                  batch.set(doc(db, "students", s.id), s);
                });
                batch.commit().catch(() => {});
              }
            }
          } catch {}
        }
      }, () => {
        setCloudConnected(false);
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed: Student[] = JSON.parse(saved);
            setStudents(parsed);
          }
        } catch {}
      });
      return () => unsub();
    } else {
      setCloudConnected(false);
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
    }
  }, []);

  const saveStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStudents));
    window.dispatchEvent(new Event("storage")); 
  };

  const addStudent = (student: Student) => {
    const nextOrder = students.length > 0 ? Math.max(...students.map(s => s.order)) + 1 : 1;
    const prepared = { ...student, order: nextOrder } as Student;
    const newStudents = [...students, prepared];
    saveStudents(newStudents);
    if (db) {
      setDoc(doc(db, "students", prepared.id), prepared).catch(() => {});
    }
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
    if (db) {
      const batch = writeBatch(db);
      preparedStudents.forEach((s) => {
        batch.set(doc(db, "students", s.id), s);
      });
      batch.commit().catch(() => {});
    }
    // Toast handled in component
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    const newStudents = students.map((s) => (s.id === id ? { ...s, ...updates } : s));
    saveStudents(newStudents);
    if (db) {
      updateDoc(doc(db, "students", id), updates as any).catch(() => {});
    }
    toast.success("Élève mis à jour");
  };

  const deleteStudent = (id: string) => {
    const newStudents = students.filter((s) => s.id !== id);
    saveStudents(newStudents);
    if (db) {
      deleteDoc(doc(db, "students", id)).catch(() => {});
    }
    toast.success("Élève supprimé");
  };

  const reorderStudents = (newOrder: Student[]) => {
    const reordered = newOrder.map((s, index) => ({ ...s, order: index + 1 }));
    saveStudents(reordered);
    if (db) {
      const batch = writeBatch(db);
      reordered.forEach((s) => batch.update(doc(db, "students", s.id), { order: s.order }));
      batch.commit().catch(() => {});
    }
  };

  const setStatus = (id: string, status: TestStatus) => {
    updateStudent(id, { status });
  };

  return {
    students: [...students].sort((a, b) => a.order - b.order),
    cloudConnected,
    addStudent,
    addMultipleStudents,
    updateStudent,
    deleteStudent,
    reorderStudents,
    setStatus,
  };
}
