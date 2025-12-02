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
import { storage } from "@/lib/firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

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
  const BASE = import.meta.env.BASE_URL || "/";
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl || `${BASE}assets/default-avatar_variant_2.png`);
  const [processingImage, setProcessingImage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (processingImage) return;
    const id = initialData?.id || uuidv4();
    let finalPhotoUrl = photoUrl;
    if (finalPhotoUrl && finalPhotoUrl.startsWith("data:")) {
      if (storage) {
        try {
          const objectRef = ref(storage, `students/${id}.jpg`);
          await uploadString(objectRef, finalPhotoUrl, "data_url");
          finalPhotoUrl = await getDownloadURL(objectRef);
        } catch {
          finalPhotoUrl = `${BASE}assets/default-avatar_variant_2.png`;
        }
      } else {
        finalPhotoUrl = `${BASE}assets/default-avatar_variant_2.png`;
      }
    }
    const student: Student = {
      id,
      fullName,
      currentBelt,
      nextBelt,
      photoUrl: finalPhotoUrl,
      order: initialData?.order || 999,
      status: initialData?.status || "PENDING",
    };
    onSubmit(student);
    setOpen(false);
    if (!initialData) {
      setFullName("");
      setPhotoUrl(`${BASE}assets/default-avatar_variant_3.png`);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessingImage(true);
    const readAsDataURL = (f: File) => new Promise<string>((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(r.result as string); r.onerror = reject; r.readAsDataURL(f); });
    const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = src; });
    const dataURLSize = (d: string) => { const base64 = d.split(',')[1] || ''; return Math.ceil((base64.length * 3) / 4); };
    const compress = async (f: File, maxBytes: number) => {
      const original = await readAsDataURL(f);
      let img = await loadImage(original);
      let width = Math.min(img.width, 1024);
      let height = Math.round(img.height * (width / img.width));
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let best = original;
      for (let i = 0; i < 6; i++) {
        canvas.width = width;
        canvas.height = height;
        ctx?.clearRect(0, 0, width, height);
        ctx?.drawImage(img, 0, 0, width, height);
        for (let q = 0.92; q >= 0.4; q -= 0.12) {
          const out = canvas.toDataURL('image/jpeg', q);
          best = out;
          if (dataURLSize(out) <= maxBytes) return out;
        }
        width = Math.round(width * 0.85);
        height = Math.round(height * 0.85);
        if (width < 300 || height < 300) break;
      }
      return best;
    };
    compress(file, 500 * 1024)
      .then((d) => setPhotoUrl(d))
      .catch(() => setPhotoUrl(`${BASE}assets/default-avatar_variant_2.png`))
      .finally(() => setProcessingImage(false));
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
              <img src={photoUrl} alt="Aperçu" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" />
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

          <Button type="submit" disabled={processingImage} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            <Save className="mr-2 h-5 w-5" /> {initialData ? "Enregistrer les Modifications" : "Enregistrer l'Élève"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
