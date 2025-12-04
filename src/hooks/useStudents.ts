import { useState, useEffect, useRef } from "react";
import { Student, TestStatus } from "@/types";
import { toast } from "sonner";
import { getDb, ensureAuth } from "@/lib/firebase";
import { collection, onSnapshot, doc, setDoc, deleteDoc, writeBatch } from "firebase/firestore";

const STORAGE_KEY = "taekwondo-sbeitla-data";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [syncStatus, setSyncStatus] = useState<"connecting" | "online" | "error" | "offline">("connecting");
  const [currentId, setCurrentId] = useState<string | null>(null);
  const migratedRef = useRef(false);

  useEffect(() => {
    const db = getDb();
    if (!db) {
      const saved = localStorage.getItem(STORAGE_KEY);
      const localList: Student[] = saved ? (() => { try { return JSON.parse(saved) as Student[]; } catch { return []; } })() : [];
      setStudents(localList);
      setSyncStatus("offline");
      return;
    }

    const init = async () => {
      const ok = await ensureAuth();
      if (!ok) {
        setSyncStatus("error");
        return () => {};
      }
      const unsubStudents = onSnapshot(
        collection(db, "students"),
        async (snap) => {
          const list: Student[] = snap.docs
            .map((d) => d.data() as Student)
            .sort((a, b) => a.order - b.order);
          setStudents(list);
          setSyncStatus("online");

          if (!migratedRef.current && list.length === 0) {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
              try {
                const existing = JSON.parse(saved) as Student[];
                if (existing.length > 0) {
                  const batch = writeBatch(db);
                  existing.forEach((s) => batch.set(doc(db, "students", s.id), s));
                  await batch.commit();
                }
              } catch (_e) { void 0; }
            }
            migratedRef.current = true;
          }
        },
        () => setSyncStatus("error")
      );
      const unsubCurrent = onSnapshot(
        doc(db, "presentation", "current"),
        (snap) => {
          const data = snap.data() as { id?: string } | undefined;
          setCurrentId(data?.id ?? null);
        },
        () => setCurrentId(null)
      );
      return () => {
        unsubStudents();
        unsubCurrent();
      };
    };
    let unsubscribe: (() => void) | undefined;
    init().then((unsub) => {
      unsubscribe = unsub;
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const saveStudents = async (newStudents: Student[]) => {
    setStudents(newStudents);
    const db = getDb();
    if (!db) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStudents));
      setSyncStatus("offline");
      toast.success("Données enregistrées en local (mode hors-ligne)");
      return;
    }
    const batch = writeBatch(db);
    newStudents.forEach((s) => {
      batch.set(doc(db, "students", s.id), s);
    });
    await batch.commit();
    setSyncStatus("online");
  };

  const addStudent = async (student: Student) => {
    const nextOrder = students.length > 0 ? Math.max(...students.map((s) => s.order)) + 1 : 1;
    const prepared = { ...student, order: nextOrder };
    const newStudents = [...students, prepared];
    await saveStudents(newStudents);
    toast.success("Élève ajouté avec succès");
  };
  
  const addMultipleStudents = async (newStudentsList: Student[]) => {
    // Calculate new orders starting from the last existing order
    const startOrder = students.length > 0 ? Math.max(...students.map(s => s.order)) : 0;
    
    const preparedStudents = newStudentsList.map((s, index) => ({
      ...s,
      order: startOrder + index + 1
    }));
    
    const updatedList = [...students, ...preparedStudents];
    await saveStudents(updatedList);
    // Toast handled in component
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    const newStudents = students.map((s) => (s.id === id ? { ...s, ...updates } : s));
    await saveStudents(newStudents);
    toast.success("Élève mis à jour");
  };

  const deleteStudent = async (id: string) => {
    const newStudents = students.filter((s) => s.id !== id);
    await saveStudents(newStudents);
    const db = getDb();
    if (db) {
      await deleteDoc(doc(db, "students", id));
    }
    toast.success("Élève supprimé");
  };

  const reorderStudents = async (newOrder: Student[]) => {
    const reordered = newOrder.map((s, index) => ({ ...s, order: index + 1 }));
    await saveStudents(reordered);
  };

  const setStatus = (id: string, status: TestStatus) => {
    updateStudent(id, { status });
  };

  const setCurrent = async (id: string) => {
    const db = getDb();
    if (!db) return;
    await setDoc(doc(db, "presentation", "current"), { id, ts: Date.now() });
    setCurrentId(id);
  };

  return {
    students: students.slice().sort((a, b) => a.order - b.order),
    syncStatus,
    currentId,
    addStudent,
    addMultipleStudents,
    updateStudent,
    deleteStudent,
    reorderStudents,
    setStatus,
    setCurrent,
  };
}
