"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SentimentChartProps {
  data: { t: string; value: number }[];
}

export function SentimentChart({ data }: SentimentChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="t" tickFormatter={(v) => new Date(v).toLocaleTimeString()} minTickGap={32} />
              <YAxis domain={[-1, 1]} />
              <Tooltip labelFormatter={(v) => new Date(v as string).toLocaleString()} />
              <Line type="monotone" dataKey="value" stroke="#10b981" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
