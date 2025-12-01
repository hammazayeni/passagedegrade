export type BeltLevel =
  | "BLANC" // Usually start with white, but user list starts at Demi-Jaune. I'll stick to user list + White as base if needed, but user was specific. I'll stick strictly to user list for "Testing For" but maybe allow a base belt.
  // User list: DEMI-JAUNE, JAUNE, DEMI-VERT, VERT, DEMI-BLEU, BLEU, ROUGE 3, ROUGE 2, ROUGE 1, 1ER DAN, 2EME DAN, 3EME DAN
  | "BLANC" // Added as a logical starting point
  | "DEMI-JAUNE"
  | "JAUNE"
  | "DEMI-VERT"
  | "VERT"
  | "DEMI-BLEU"
  | "BLEU"
  | "ROUGE 3"
  | "ROUGE 2"
  | "ROUGE 1"
  | "1ER DAN"
  | "2EME DAN"
  | "3EME DAN";

export type TestStatus = "PENDING" | "APPROVED" | "REFUSED";

export interface Student {
  id: string;
  fullName: string;
  photoUrl: string; // Base64 or URL
  currentBelt: BeltLevel;
  nextBelt: BeltLevel;
  order: number;
  status: TestStatus;
  notes?: string;
}

export interface AppState {
  students: Student[];
}