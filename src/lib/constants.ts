import { BeltLevel } from "@/types";

export const BELT_ORDER: BeltLevel[] = [
  "BLANC",
  "DEMI-JAUNE",
  "JAUNE",
  "DEMI-VERT",
  "VERT",
  "DEMI-BLEU",
  "BLEU",
  "ROUGE 3",
  "ROUGE 2",
  "ROUGE 1",
  "1ER DAN",
  "2EME DAN",
  "3EME DAN",
];

export const BELT_COLORS: Record<BeltLevel, { bg: string; text: string; border: string }> = {
  "BLANC": { bg: "bg-white", text: "text-gray-900", border: "border-gray-200" },
  "DEMI-JAUNE": { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" }, // Simplified visual for "Demi" usually involves a stripe, will handle in UI component
  "JAUNE": { bg: "bg-yellow-400", text: "text-yellow-900", border: "border-yellow-500" },
  "DEMI-VERT": { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
  "VERT": { bg: "bg-green-500", text: "text-white", border: "border-green-600" },
  "DEMI-BLEU": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
  "BLEU": { bg: "bg-blue-500", text: "text-white", border: "border-blue-600" },
  "ROUGE 3": { bg: "bg-red-500", text: "text-white", border: "border-red-600" }, // Differentiating reds might need subtle shades or text
  "ROUGE 2": { bg: "bg-red-600", text: "text-white", border: "border-red-700" },
  "ROUGE 1": { bg: "bg-red-700", text: "text-white", border: "border-red-800" },
  "1ER DAN": { bg: "bg-black", text: "text-white", border: "border-gray-800" },
  "2EME DAN": { bg: "bg-black", text: "text-white", border: "border-gray-800" },
  "3EME DAN": { bg: "bg-black", text: "text-white", border: "border-gray-800" },
};