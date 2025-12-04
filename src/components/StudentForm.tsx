import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BELT_ORDER } from "@/lib/constants";
import { Student, BeltLevel } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Plus, Save, Upload } from "lucide-react";
import { saveImageForStudent } from "@/lib/imageStore";
import { uploadStudentPhotoToCloud } from "@/lib/cloudStorage";
import { ImageFromStore } from "@/components/ImageFromStore";

interface StudentFormProps {
  onSubmit: (student: Student) => void;
  trigger?: React.ReactNode;
  initialData?: Student;
}

export function StudentForm({ onSubmit, trigger, initialData }: StudentFormProps) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState(initialData?.fullName || "");
  const [currentBelt, setCurrentBelt] = useState<BeltLevel>(initialData?.currentBelt || "BLANC");
  const [nextBelt, setNextBelt] = useState<BeltLevel>(initialData?.nextBelt || "DEMI-JAUNE");
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl || `${import.meta.env.BASE_URL}assets/default-avatar_variant_2.png`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = initialData?.id || uuidv4();
    let finalPhoto = photoUrl;
    if (finalPhoto.startsWith("data:")) {
      try {
        const cloudUrl = await uploadStudentPhotoToCloud(id, finalPhoto);
        if (cloudUrl) {
          finalPhoto = cloudUrl;
        } else {
          finalPhoto = await saveImageForStudent(id, finalPhoto);
        }
      } catch (err) {
        try {
          finalPhoto = await saveImageForStudent(id, finalPhoto);
        } catch (_e) {
          // leave data URL as last resort
        }
      }
    }
    const student: Student = {
      id,
      fullName,
      currentBelt,
      nextBelt,
      photoUrl: finalPhoto,
      order: initialData?.order || 999,
      status: initialData?.status || "PENDING",
    };
    onSubmit(student);
    setOpen(false);
    if (!initialData) {
      setFullName("");
      setPhotoUrl(`${import.meta.env.BASE_URL}assets/default-avatar_variant_3.png`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const compressImage = (file: File, maxSize = 512, quality = 0.8): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("Canvas context not available"));
              return;
            }
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/jpeg", quality);
            resolve(dataUrl);
          };
          img.onerror = reject;
          img.src = reader.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    try {
      const dataUrl = await compressImage(file);
      setPhotoUrl(dataUrl);
    } catch (err) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un Élève
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-t-4 border-red-600">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {initialData ? "Modifier l'Élève" : "Ajouter un Nouvel Élève"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">Nom et Prénom</Label>
            <Input 
              id="name" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
              className="border-gray-300 focus:border-red-500 focus:ring-red-500"
              placeholder="Ex: Ahmed Ben Ali"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Ceinture Actuelle</Label>
              <Select value={currentBelt} onValueChange={(v) => setCurrentBelt(v as BeltLevel)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BELT_ORDER.map((belt) => (
                    <SelectItem key={belt} value={belt}>{belt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Test Pour</Label>
              <Select value={nextBelt} onValueChange={(v) => setNextBelt(v as BeltLevel)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BELT_ORDER.map((belt) => (
                    <SelectItem key={belt} value={belt}>{belt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-700 font-medium">Photo de Profil</Label>
            <div className="flex items-center gap-6 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            <ImageFromStore src={photoUrl} alt="Aperçu" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" />
              <div className="flex-1">
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Choisir une image
                  </div>
                </Label>
                <Input id="photo-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-lg shadow-md transition-all">
            <Save className="mr-2 h-5 w-5" /> {initialData ? "Enregistrer les Modifications" : "Enregistrer l'Élève"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
