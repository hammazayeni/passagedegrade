import { useStudents } from "@/hooks/useStudents";
import { useState } from "react";
import { StudentForm } from "@/components/StudentForm";
import { ImportStudents } from "@/components/ImportStudents";
import { BeltBadge } from "@/components/BeltBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link, useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ArrowUp, ArrowDown, Trash2, Edit, ExternalLink, Check, X, Users, Trophy, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function Dashboard() {
  const { students, addStudent, addMultipleStudents, updateStudent, deleteStudent, reorderStudents, setStatus } = useStudents();
  const navigate = useNavigate();
  const [firebaseOpen, setFirebaseOpen] = useState(false as any);
  const [firebaseText, setFirebaseText] = useState<string>(() => {
    try { const raw = localStorage.getItem("firebaseConfigJSON"); return raw || ""; } catch { return ""; }
  });
  const sampleConfig = `{
  "apiKey": "AIzaSyCTf1Lj_Rklig_3eKUCTXJQty2i16rjKGk",
  "authDomain": "promotion--test.firebaseapp.com",
  "projectId": "promotion--test",
  "storageBucket": "promotion--test.firebasestorage.app",
  "messagingSenderId": "904598948378",
  "appId": "1:904598948378:web:661759bd8f8b858a24dfa3",
  "measurementId": "G-29GYQVBD8Q"
}`;

  const setProjectionCurrent = (id: string) => {
    const payload = { currentId: id, ts: Date.now() };
    if (db) {
      setDoc(doc(db, "projection", "current"), payload).catch(() => {});
    } else {
      localStorage.setItem("projection-current-id", JSON.stringify(payload));
      window.dispatchEvent(new Event("storage"));
    }
  };

  const moveStudent = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === students.length - 1) return;

    const newStudents = [...students];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newStudents[index], newStudents[swapIndex]] = [newStudents[swapIndex], newStudents[index]];
    reorderStudents(newStudents);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            {(() => { const BASE = import.meta.env.BASE_URL || '/'; return (
              <img src={`${BASE}assets/logos/kukkiwon.png`} alt="Site Logo" className="h-10 md:h-12 w-auto object-contain" />
            ); })()}
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Taekwondo Sbeitla</h1>
              <p className="text-gray-500 font-medium">Tableau de Bord des Examens de Passage</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Link to="/projection" target="_blank" className="flex-1 md:flex-none">
              <Button variant="outline" className="w-full gap-2 border-gray-300 hover:bg-gray-50 hover:text-red-600 transition-colors">
                <ExternalLink size={18} /> Projection
              </Button>
            </Link>
            <ImportStudents onImport={addMultipleStudents} />
            <div className="flex-1 md:flex-none">
              <StudentForm onSubmit={addStudent} />
            </div>
            <Button variant="outline" onClick={() => setFirebaseOpen(true)} className="flex-1 md:flex-none">Configurer Firebase</Button>
            <Button
              variant="destructive"
              className="flex-1 md:flex-none"
              onClick={() => {
                localStorage.removeItem("dashboardAuth");
                localStorage.removeItem("dashboardUser");
                navigate("/login", { replace: true });
              }}
            >
              Déconnexion
            </Button>
          </div>
        </div>

        <Dialog open={firebaseOpen} onOpenChange={setFirebaseOpen as any}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Configuration Firebase</DialogTitle>
              <DialogDescription>Collez l'objet de configuration JSON fourni par Firebase.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Textarea placeholder={sampleConfig} value={firebaseText} onChange={(e) => setFirebaseText(e.target.value)} className="h-[220px] font-mono text-sm" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFirebaseOpen(false)}>Annuler</Button>
              <Button onClick={() => {
                try {
                  const obj = JSON.parse(firebaseText);
                  if (obj && obj.apiKey && obj.projectId) {
                    localStorage.setItem("firebaseConfigJSON", JSON.stringify(obj));
                    setFirebaseOpen(false);
                    location.reload();
                  }
                } catch {}
              }}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Stats Overview (Optional simple stats) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Users size={24} /></div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Candidats</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-full"><Check size={24} /></div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Admis</p>
                <p className="text-2xl font-bold text-gray-900">{students.filter(s => s.status === "APPROVED").length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full"><Trophy size={24} /></div>
              <div>
                <p className="text-sm text-gray-500 font-medium">En Attente</p>
                <p className="text-2xl font-bold text-gray-900">{students.filter(s => s.status === "PENDING").length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main List */}
        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="bg-gray-50 border-b border-gray-100 py-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="w-5 h-5 text-gray-400" />
              Liste des Candidats
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                  <TableHead className="w-[80px] text-center font-bold text-gray-600">Ordre</TableHead>
                  <TableHead className="font-bold text-gray-600">Candidat</TableHead>
                  <TableHead className="font-bold text-gray-600">Ceinture Actuelle</TableHead>
                  <TableHead className="font-bold text-gray-600">Test Pour</TableHead>
                  <TableHead className="font-bold text-gray-600 text-center">Résultat</TableHead>
                  <TableHead className="text-right font-bold text-gray-600 pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Users className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium text-gray-500">Aucun élève ajouté pour le moment</p>
                        <p className="text-sm">Cliquez sur "Ajouter un Élève" ou "Importer" pour commencer</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student, index) => (
                    <TableRow key={student.id} className="hover:bg-gray-50/80 transition-colors group">
                      <TableCell className="text-center font-bold text-gray-500 text-lg">
                        #{index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img 
                              src={student.photoUrl} 
                              alt={student.fullName} 
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-110 transition-transform duration-300"
                            />
                            {student.status === "APPROVED" && (
                              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5 border-2 border-white">
                                <Check size={10} strokeWidth={4} />
                              </div>
                            )}
                          </div>
                          <span className="font-bold text-gray-900 text-base">{student.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell><BeltBadge belt={student.currentBelt} size="sm" /></TableCell>
                      <TableCell><BeltBadge belt={student.nextBelt} size="sm" /></TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button 
                            size="sm" 
                            variant={student.status === "APPROVED" ? "default" : "outline"}
                            className={`rounded-full px-4 transition-all duration-300 ${
                              student.status === "APPROVED" 
                                ? "bg-green-600 hover:bg-green-700 text-white shadow-md scale-105" 
                                : "text-gray-400 hover:text-green-600 hover:border-green-200"
                            }`}
                            onClick={() => setStatus(student.id, "APPROVED")}
                            title="Admis"
                          >
                            <Check size={16} className="mr-1" /> {student.status === "APPROVED" ? "Admis" : "Admettre"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant={student.status === "REFUSED" ? "destructive" : "outline"}
                            className={`rounded-full px-4 transition-all duration-300 ${
                              student.status === "REFUSED" 
                                ? "bg-red-600 hover:bg-red-700 text-white shadow-md scale-105" 
                                : "text-gray-400 hover:text-red-600 hover:border-red-200"
                            }`}
                            onClick={() => setStatus(student.id, "REFUSED")}
                            title="Refusé"
                          >
                            <X size={16} className="mr-1" /> {student.status === "REFUSED" ? "Refusé" : "Refuser"}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-green-50 hover:text-green-600 rounded-full"
                            onClick={() => setProjectionCurrent(student.id)}
                            title="Afficher sur Projection"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-gray-200 rounded-full"
                            onClick={() => moveStudent(index, "up")}
                            disabled={index === 0}
                          >
                            <ArrowUp size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-gray-200 rounded-full"
                            onClick={() => moveStudent(index, "down")}
                            disabled={index === students.length - 1}
                          >
                            <ArrowDown size={16} />
                          </Button>
                          <StudentForm 
                            initialData={student} 
                            onSubmit={(updated) => updateStudent(student.id, updated)}
                            trigger={
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 rounded-full">
                                <Edit size={16} />
                              </Button>
                            }
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                            onClick={() => deleteStudent(student.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
