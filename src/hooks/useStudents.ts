import { useState, useEffect } from "react";
import { Student, TestStatus } from "@/types";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, query, orderBy, setDoc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [cloudConnected, setCloudConnected] = useState(false);

  

  useEffect(() => {
    if (!db) { setCloudConnected(false); return; }
    const q = query(collection(db, "students"), orderBy("order"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list: Student[] = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      setStudents(list);
      setCloudConnected(!snapshot.metadata.fromCache);
    }, () => {
      setCloudConnected(false);
    });
    return () => unsub();
  }, []);

  const saveStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
  };

  const addStudent = async (student: Student) => {
    const nextOrder = students.length > 0 ? Math.max(...students.map(s => s.order)) + 1 : 1;
    const prepared = { ...student, order: nextOrder } as Student;
    const newStudents = [...students, prepared];
    saveStudents(newStudents);
    try {
      if (db) { await setDoc(doc(db, "students", prepared.id), prepared); }
      toast.success("Élève ajouté avec succès");
    } catch (e) {
      toast.error("Échec de la synchronisation Cloud. Vérifiez la connexion/règles.");
    }
  };
  
  const addMultipleStudents = async (newStudentsList: Student[]) => {
    // Calculate new orders starting from the last existing order
    const startOrder = students.length > 0 ? Math.max(...students.map(s => s.order)) : 0;
    
    const preparedStudents = newStudentsList.map((s, index) => ({
      ...s,
      order: startOrder + index + 1
    }));
    
    const updatedList = [...students, ...preparedStudents];
    saveStudents(updatedList);
    try {
      if (db) {
        const batch = writeBatch(db);
        preparedStudents.forEach((s) => { batch.set(doc(db, "students", s.id), s); });
        await batch.commit();
      }
    } catch (e) {
      toast.error("Import non synchronisé. Vérifiez la connexion/règles.");
    }
    // Toast handled in component
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    const newStudents = students.map((s) => (s.id === id ? { ...s, ...updates } : s));
    saveStudents(newStudents);
    try {
      if (db) { await updateDoc(doc(db, "students", id), updates as any); }
      toast.success("Élève mis à jour");
    } catch (e) {
      toast.error("Mise à jour non synchronisée. Vérifiez la connexion/règles.");
    }
  };

  const deleteStudent = async (id: string) => {
    const newStudents = students.filter((s) => s.id !== id);
    saveStudents(newStudents);
    try {
      if (db) { await deleteDoc(doc(db, "students", id)); }
      toast.success("Élève supprimé");
    } catch (e) {
      toast.error("Suppression non synchronisée. Vérifiez la connexion/règles.");
    }
  };

  const reorderStudents = async (newOrder: Student[]) => {
    const reordered = newOrder.map((s, index) => ({ ...s, order: index + 1 }));
    saveStudents(reordered);
    try {
      if (db) {
        const batch = writeBatch(db);
        reordered.forEach((s) => batch.update(doc(db, "students", s.id), { order: s.order }));
        await batch.commit();
      }
    } catch (e) {
      toast.error("Réorganisation non synchronisée. Vérifiez la connexion/règles.");
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
