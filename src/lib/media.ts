import { supabase } from '@/integrations/supabase/client';

export type MediaRow = {
  image_url?: string | null;
  image_bucket?: string | null;
  image_folder?: string | null;
  image_filename?: string | null;
  storage_path?: string | null; // from views
};

/**
 * Return a browser-usable public URL. Priority:
 * 1) explicit image_url
 * 2) storage_path (bucket/folder/filename combined via view)
 * 3) bucket+folder+filename
 */
export function mediaUrl(row: MediaRow): string | undefined {
  if (row?.image_url) return row.image_url;
  
  const path = row?.storage_path || (row?.image_bucket && row?.image_folder && row?.image_filename
    ? `${row.image_bucket}/${row.image_folder}/${row.image_filename}`
    : undefined);
  
  if (!path) return undefined;
  
  const [bucket, ...rest] = path.split('/');
  const objectPath = rest.join('/');
  
  // URL-encode the filename to handle spaces and special characters
  const pathParts = objectPath.split('/');
  const encodedPath = pathParts.map((part, idx) => 
    idx === pathParts.length - 1 ? encodeURIComponent(part) : part
  ).join('/');
  
  return supabase.storage.from(bucket).getPublicUrl(encodedPath).data.publicUrl;
}

export function setMediaFields(
  table: 'challenges' | 'games' | 'rewards',
  id: string,
  { bucket, folder, filename, imageUrl }: { 
    bucket?: string; 
    folder?: string; 
    filename?: string; 
    imageUrl?: string 
  }
) {
  const payload: any = {};
  if (bucket) payload.image_bucket = bucket;
  if (folder) payload.image_folder = folder;
  if (filename) payload.image_filename = filename;
  if (imageUrl) payload.image_url = imageUrl;
  
  return supabase.from(table).update(payload).eq('id', id);
}
