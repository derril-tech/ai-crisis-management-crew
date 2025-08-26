'use client';

import React from 'react';
import { ExportHub } from '@/components/ExportHub/ExportHub';

export default function IncidentExportsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Exports</h1>
      <ExportHub />
    </div>
  );
}
