"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CrisisCrewClient } from '@crisis-crew/sdk/dist/client';

export function ExportHub() {
  const client = new CrisisCrewClient(process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:3001/v1');
  const [exportType, setExportType] = useState<'pdf'|'csv'|'mdx'|'zip'>('pdf');
  const [filename, setFilename] = useState('crisis-packet');
  const [content, setContent] = useState('# Crisis Packet');
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onExport = async () => {
    setLoading(true);
    try {
      const res = await client.createExport(exportType, filename, content, undefined);
      setUrl(res.url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Hub</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Type</Label>
            <Select value={exportType} onValueChange={(v: any) => setExportType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="mdx">MDX</SelectItem>
                <SelectItem value="zip">ZIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Filename</Label>
            <Input value={filename} onChange={(e) => setFilename(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button onClick={onExport} disabled={loading} className="w-full">
              {loading ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <Label>Content</Label>
          <Input value={content} onChange={(e) => setContent(e.target.value)} />
        </div>

        {url && (
          <div className="mt-4">
            <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline">Download</a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
