"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RumorLogProps {
  rumors: { id: string; text: string; confidence: number; severity: string; created_at: string }[];
}

export function RumorLog({ rumors }: RumorLogProps) {
  const sevColor: Record<string, string> = {
    critical: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rumor Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {rumors.map((r) => (
            <div key={r.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={sevColor[r.severity] || 'bg-gray-100 text-gray-800'}>{r.severity.toUpperCase()}</Badge>
                  <span className="text-sm text-gray-600">Conf: {Math.round(r.confidence * 100)}%</span>
                </div>
                <span className="text-xs text-gray-500">{new Date(r.created_at).toLocaleString()}</span>
              </div>
              <div className="mt-2 text-sm">{r.text}</div>
            </div>
          ))}
          {rumors.length === 0 && (
            <div className="text-gray-500 text-center py-8">No rumors detected.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
