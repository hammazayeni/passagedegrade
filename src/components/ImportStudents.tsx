import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Student, BeltLevel } from "@/types";
import { toast } from "sonner";
import { BELT_ORDER } from "@/lib/constants";

interface ImportStudentsProps {
  onImport: (students: Student[]) => void;
}

export function ImportStudents({ onImport }: ImportStudentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [csvContent, setCsvContent] = useState("");

  const parseCSV = (content: string) => {
    const lines = content.trim().split("\n");
    const students: Student[] = [];
    
    // Skip header if it exists (simple check if first line contains "nom" or "name")
    const startIndex = lines[0].toLowerCase().includes("nom") || lines[0].toLowerCase().includes("name") ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Split by comma or tab
      const parts = line.split(/,|\t/);
      
      // Expected format: Full Name, Current Belt, Next Belt, Photo URL (optional)
      if (parts.length < 3) continue;

      const fullName = parts[0].trim();
      const currentBelt = parts[1].trim() as BeltLevel;
      const nextBelt = parts[2].trim() as BeltLevel;
      const photoUrl = parts[3]?.trim() || `${import.meta.env.BASE_URL}assets/default-avatar.png`;

      // Validate belts
      if (!BELT_ORDER.includes(currentBelt) || !BELT_ORDER.includes(nextBelt)) {
        console.warn(`Invalid belt for student ${fullName}: ${currentBelt} -> ${nextBelt}`);
        continue;
      }

      students.push({
        id: crypto.randomUUID(),
        fullName,
        currentBelt,
        nextBelt,
        photoUrl,
        status: "PENDING",
        order: 0, // Will be reordered by hook
      });
    }

    return students;
  };

  const handleImport = () => {
    try {
      const students = parseCSV(csvContent);
      if (students.length === 0) {
        toast.error("Aucun élève valide trouvé. Vérifiez le format.");
        return;
      }

      onImport(students);
      setIsOpen(false);
      setCsvContent("");
      toast.success(`${students.length} élèves importés avec succès !`);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'importation.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-green-200 hover:bg-green-50 hover:text-green-700">
          <FileSpreadsheet size={18} /> Importer (CSV)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Importer depuis Google Sheets</DialogTitle>
          <DialogDescription>
            Copiez et collez vos données ici. Le format doit être : <br />
            <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">Nom Complet, Ceinture Actuelle, Ceinture Suivante, URL Photo (Optionnel)</code>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-sm text-blue-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-bold mb-1">Instructions :</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Ouvrez votre Google Sheet</li>
                <li>Sélectionnez les colonnes (Nom, Grade Actuel, Grade Suivant, Photo)</li>
                <li>Copiez (Ctrl+C) et collez (Ctrl+V) ci-dessous</li>
              </ol>
            </div>
          </div>
          
          <Textarea
            placeholder={`Jean Dupont, Blanc, Jaune\nMarie Martin, Jaune, Orange, https://example.com/photo.jpg`}
            className="h-[200px] font-mono text-sm"
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
          <Button onClick={handleImport} className="bg-green-600 hover:bg-green-700">
            <Upload className="w-4 h-4 mr-2" /> Importer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
