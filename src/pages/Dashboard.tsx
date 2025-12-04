import { useStudents } from "@/hooks/useStudents";
import { StudentForm } from "@/components/StudentForm";
import { ImportStudents } from "@/components/ImportStudents";
import { BeltBadge } from "@/components/BeltBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUp, ArrowDown, Trash2, Edit, ExternalLink, Check, X, Users, Trophy, Eye } from "lucide-react";
import { ImageFromStore } from "@/components/ImageFromStore";
import { deleteImageForStudent } from "@/lib/imageStore";
import { logout } from "@/lib/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const { students, addStudent, addMultipleStudents, updateStudent, deleteStudent, reorderStudents, setStatus, syncStatus, setCurrent } = useStudents();

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
            <img
              src={`${import.meta.env.BASE_URL}assets/logos/kukkiwon.png`}
              alt="Logo"
              className="w-12 h-12 rounded-xl shadow-lg object-contain bg-white"
            />
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Taekwondo Sbeitla</h1>
              <p className="text-gray-500 font-medium">Tableau de Bord des Examens de Passage</p>
              <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full ${syncStatus === 'online' ? 'bg-green-100 text-green-700' : syncStatus === 'connecting' ? 'bg-yellow-100 text-yellow-700' : syncStatus === 'offline' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>Cloud Sync: {syncStatus}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Button asChild variant="outline" className="flex-1 md:flex-none w-full gap-2 border-gray-300 hover:bg-gray-50 hover:text-red-600 transition-colors">
              <a href={`${typeof window !== 'undefined' ? window.location.origin : ''}${import.meta.env.BASE_URL}projection`} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={18} /> Projection
              </a>
            </Button>
            <ImportStudents onImport={addMultipleStudents} />
            <div className="flex-1 md:flex-none">
              <StudentForm onSubmit={addStudent} />
            </div>
            <Button
              variant="destructive"
              className="md:flex-none"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Déconnexion
            </Button>
          </div>
        </div>

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
                            <ImageFromStore 
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
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-green-50 hover:text-green-600 rounded-full"
                            onClick={() => setCurrent(student.id)}
                            title="Afficher en projection"
                          >
                            <Eye size={16} />
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
                            onClick={async () => {
                              await deleteImageForStudent(student.photoUrl);
                              deleteStudent(student.id);
                            }}
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
