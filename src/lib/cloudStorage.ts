import { getBucket, ensureAuth } from './firebase';
import { ref, uploadString, getDownloadURL, deleteObject, ref as storageRef } from 'firebase/storage';

export async function uploadStudentPhotoToCloud(studentId: string, dataUrl: string): Promise<string | null> {
  const storage = getBucket();
  if (!storage) return null;
  const ok = await ensureAuth();
  if (!ok) return null;
  const r = ref(storage, `students/${studentId}.jpg`);
  await uploadString(r, dataUrl, 'data_url');
  return await getDownloadURL(r);
}

export async function deleteStudentPhotoFromCloudByUrl(url: string): Promise<boolean> {
  const storage = getBucket();
  if (!storage) return false;
  try {
    const parsed = new URL(url);
    const pathMatch = /\/o\/(.+)\?/.exec(parsed.pathname + parsed.search);
    const objectPath = pathMatch ? decodeURIComponent(pathMatch[1]) : '';
    if (!objectPath) return false;
    const r = storageRef(storage, objectPath);
    await deleteObject(r);
    return true;
  } catch {
    return false;
  }
}

