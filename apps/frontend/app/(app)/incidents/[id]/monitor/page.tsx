'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SentimentChart } from '@/components/SentimentChart/SentimentChart';
import { RumorLog } from '@/components/RumorLog/RumorLog';
import { CrisisCrewClient } from '@crisis-crew/sdk/dist/client';

export default function IncidentMonitorPage({ params }: { params: { id: string } }) {
  const client = new CrisisCrewClient(process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:3001/v1');
  const [mentions, setMentions] = useState<any[]>([]);
  const [rumors, setRumors] = useState<any[]>([]);
  const [sentiment, setSentiment] = useState<{ t: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const [m, r, s] = await Promise.all([
          client.getMentions(params.id),
          client.getRumors(params.id),
          client.getSentiment(params.id),
        ]);
        setMentions(m);
        setRumors(r);
        setSentiment(s);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Incident Monitor</h1>
        <div className="flex gap-2">
          <Badge variant="outline">{mentions.length} mentions</Badge>
          <Badge variant="outline">{rumors.length} rumors</Badge>
        </div>
      </div>

      <SentimentChart data={sentiment} />

      <Card>
        <CardHeader>
          <CardTitle>Mentions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mentions.map((m) => (
              <div key={m.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Source: {m.source}</span>
                  <span>Sentiment: {m.sentiment}</span>
                  <span>{new Date(m.created_at).toLocaleString()}</span>
                </div>
                <div className="mt-2 text-sm">{m.text}</div>
              </div>
            ))}
            {mentions.length === 0 && (
              <div className="text-gray-500 text-center py-8">No mentions found.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <RumorLog rumors={rumors} />
    </div>
  );
}
