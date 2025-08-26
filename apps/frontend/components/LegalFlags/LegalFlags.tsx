"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Wand2 } from 'lucide-react';

interface Redline {
  start: number;
  end: number;
  original: string;
  suggestion: string;
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface LegalFlagsProps {
  content: string;
  redlines: Redline[];
  onApplySuggestion: (start: number, end: number, suggestion: string) => void;
}

const severityColor: Record<Redline['severity'], string> = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-blue-100 text-blue-800',
};

export function LegalFlags({ content, redlines, onApplySuggestion }: LegalFlagsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Legal Flags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {redlines.length === 0 && (
            <div className="text-gray-500 text-center py-8">No legal issues found.</div>
          )}
          {redlines.map((r, idx) => (
            <div key={`${r.start}-${idx}`} className="border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={severityColor[r.severity]}>{r.severity.toUpperCase()}</Badge>
                  <span className="text-sm text-gray-600">{r.reason}</span>
                </div>
                <Button size="sm" onClick={() => onApplySuggestion(r.start, r.end, r.suggestion)}>
                  <Wand2 className="h-4 w-4 mr-1" /> Apply
                </Button>
              </div>
              <div className="mt-2 text-sm">
                <span className="line-through text-red-700">{r.original}</span>
                <span className="mx-2">→</span>
                <span className="text-green-700">{r.suggestion}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
