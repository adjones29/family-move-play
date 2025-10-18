import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { mediaUrl, setMediaFields } from '@/lib/media';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminAttachMedia() {
  const [table, setTable] = useState<'challenges' | 'games' | 'rewards'>('challenges');
  const [rows, setRows] = useState<any[]>([]);
  const [bucket, setBucket] = useState('catalog-media');
  const [folder, setFolder] = useState('challenges');
  const [filename, setFilename] = useState('');
  const [rowId, setRowId] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    (async () => {
      const view = table === 'challenges' ? 'v_challenges_media' : 
                   table === 'games' ? 'v_games_media' : 'v_rewards_media';
      const { data } = await supabase
        .from(view)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      setRows(data || []);
    })();
  }, [table]);

  const attach = async () => {
    if (!rowId) {
      setStatus('Please enter a row ID');
      return;
    }
    
    setStatus('Updating...');
    const { error } = await setMediaFields(table, rowId, { bucket, folder, filename });
    
    if (error) {
      setStatus('Failed: ' + error.message);
      return;
    }
    
    setStatus('✓ Attached successfully');
    
    // Refresh the rows
    const view = table === 'challenges' ? 'v_challenges_media' : 
                 table === 'games' ? 'v_games_media' : 'v_rewards_media';
    const { data } = await supabase
      .from(view)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    setRows(data || []);
  };

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attach Media to Catalog Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Enter the Storage bucket, folder, and filename to attach media to catalog items.
              The app will compute public URLs from these values.
            </AlertDescription>
          </Alert>

          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Table</label>
              <Select value={table} onValueChange={(val: any) => setTable(val)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="challenges">Challenges</SelectItem>
                  <SelectItem value="games">Games</SelectItem>
                  <SelectItem value="rewards">Rewards</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Row ID</label>
              <Input
                value={rowId}
                onChange={(e) => setRowId(e.target.value)}
                placeholder="UUID or ID"
                className="w-64"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Bucket</label>
              <Input
                value={bucket}
                onChange={(e) => setBucket(e.target.value)}
                placeholder="catalog-media"
                className="w-40"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Folder</label>
              <Input
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                placeholder="challenges"
                className="w-40"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Filename</label>
              <Input
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="image.png"
                className="w-56"
              />
            </div>

            <Button onClick={attach} className="mb-0.5">
              Attach
            </Button>

            {status && (
              <span className="text-sm text-muted-foreground mb-0.5">{status}</span>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {rows.map((r) => {
          const url = mediaUrl(r);
          return (
            <Card key={r.id} className="overflow-hidden">
              <div className="aspect-[2/3] bg-muted">
                {url ? (
                  <img src={url} alt={r.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <CardContent className="p-3 space-y-1">
                <div className="text-sm font-medium line-clamp-2">{r.title}</div>
                <div className="text-xs text-muted-foreground break-all line-clamp-1">
                  ID: {r.id}
                </div>
                <div className="text-xs text-muted-foreground break-all line-clamp-1">
                  {r.storage_path || r.image_url || '—'}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
