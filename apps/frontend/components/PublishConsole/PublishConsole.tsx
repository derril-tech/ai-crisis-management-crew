"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { CrisisCrewClient } from '@crisis-crew/sdk/dist/client';

interface PublishConsoleProps {
  artifactId: string;
  title: string;
  mdx: string;
}

export function PublishConsole({ artifactId, title, mdx }: PublishConsoleProps) {
  const client = new CrisisCrewClient(process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:3001/v1');
  const [includeMDX, setIncludeMDX] = useState(true);
  const [includeHTML, setIncludeHTML] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<{ mdxUrl?: string; htmlUrl?: string } | null>(null);

  const onPublish = async () => {
    setPublishing(true);
    try {
      const formats: Array<'mdx'|'html'> = [
        ...(includeMDX ? ['mdx'] as const : []),
        ...(includeHTML ? ['html'] as const : []),
      ] as any;
      const res = await client.publishArtifact(artifactId, title, mdx, formats);
      setResult(res);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Publish Console</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="mdx" checked={includeMDX} onCheckedChange={() => setIncludeMDX(!includeMDX)} />
              <Label htmlFor="mdx">Publish MDX</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="html" checked={includeHTML} onCheckedChange={() => setIncludeHTML(!includeHTML)} />
              <Label htmlFor="html">Publish HTML</Label>
            </div>
            <div className="text-right">
              <Button onClick={onPublish} disabled={publishing}>
                {publishing ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>

          {result && (
            <div className="space-y-2">
              {result.mdxUrl && (
                <div>
                  <Badge variant="secondary" className="mr-2">MDX</Badge>
                  <a className="text-blue-600 underline" href={result.mdxUrl} target="_blank" rel="noreferrer">{result.mdxUrl}</a>
                </div>
              )}
              {result.htmlUrl && (
                <div>
                  <Badge variant="secondary" className="mr-2">HTML</Badge>
                  <a className="text-blue-600 underline" href={result.htmlUrl} target="_blank" rel="noreferrer">{result.htmlUrl}</a>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
