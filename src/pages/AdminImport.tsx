import React, { useState } from 'react';
import Papa from 'papaparse';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload } from 'lucide-react';

export default function AdminImport() {
  const [csv, setCsv] = useState('');
  const [target, setTarget] = useState<'challenges' | 'games' | 'rewards'>('challenges');
  const [log, setLog] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const onImport = async () => {
    if (!csv.trim()) {
      setLog('Please paste CSV content');
      return;
    }

    setLoading(true);
    try {
      const parsed = Papa.parse(csv.trim(), { header: true, skipEmptyLines: true });
      
      if (parsed.errors.length) {
        setLog('CSV parse error: ' + parsed.errors[0].message);
        setLoading(false);
        return;
      }

      const rows = parsed.data as any[];
      
      // Map CSV columns to table schema
      const mapRow = (r: any) => {
        if (target === 'challenges') {
          return {
            id: r.id || undefined,
            title: r.title,
            description: r.description,
            image_url: r.image_url,
            difficulty: (r.difficulty || '').toLowerCase(),
            points: Number(r.points || 0),
            is_active: r.is_active?.toString().toLowerCase() !== 'false'
          };
        }
        
        if (target === 'games') {
          return {
            id: r.id || undefined,
            title: r.title,
            description: r.description,
            image_url: r.image_url,
            category: (r.category || '').toLowerCase(),
            is_active: r.is_active?.toString().toLowerCase() !== 'false'
          };
        }
        
        return {
          id: r.id || undefined,
          title: r.title,
          description: r.description,
          image_url: r.image_url,
          type: (r.type || '').toLowerCase(),
          cost: Number(r.cost || 0),
          is_active: r.is_active?.toString().toLowerCase() !== 'false'
        };
      };

      const payload = rows.map(mapRow);
      const { error } = await supabase
        .from(target)
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        setLog('Import failed: ' + error.message);
      } else {
        setLog(`✓ Successfully imported ${payload.length} ${target}`);
        setCsv('');
      }
    } catch (err) {
      setLog('Import error: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-6 h-6" />
            Admin Catalog Import
          </CardTitle>
          <CardDescription>
            Import or update challenges, games, and rewards from CSV. Re-importing with the same ID will update existing records.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription className="text-sm">
              <strong>Expected CSV Headers:</strong>
              <br />
              <strong>Challenges:</strong> id, title, description, image_url, difficulty (easy|medium|hard), points, is_active
              <br />
              <strong>Games:</strong> id, title, description, image_url, category (exercise|fun|adventure), is_active
              <br />
              <strong>Rewards:</strong> id, title, description, image_url, type (family|individual|special), cost, is_active
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Target Table:</label>
              <Select value={target} onValueChange={(val: any) => setTarget(val)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="challenges">Challenges</SelectItem>
                  <SelectItem value="games">Games</SelectItem>
                  <SelectItem value="rewards">Rewards</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={onImport} disabled={loading} className="mt-6">
              {loading ? 'Importing...' : 'Import CSV'}
            </Button>
          </div>

          <div>
            <label className="text-sm font-medium">CSV Content:</label>
            <Textarea
              value={csv}
              onChange={(e) => setCsv(e.target.value)}
              className="mt-1 font-mono text-xs h-96"
              placeholder="Paste your CSV content here..."
            />
          </div>

          {log && (
            <Alert>
              <AlertDescription>
                <pre className="text-xs whitespace-pre-wrap">{log}</pre>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
