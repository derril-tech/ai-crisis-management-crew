'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';

interface IncidentData {
  title: string;
  type: string;
  description: string;
  affectedUsers: number;
  dataTypes: string[];
  jurisdictions: string[];
  detectedAt: string;
}

interface IncidentWizardProps {
  onSubmit: (data: IncidentData) => void;
  loading?: boolean;
}

const DATA_TYPES = [
  'email',
  'password_hash',
  'payment',
  'health',
  'personal_info',
  'financial',
  'other'
];

const JURISDICTIONS = [
  'US-CA',
  'US-NY',
  'US-TX',
  'EU',
  'UK',
  'CA',
  'AU',
  'other'
];

export function IncidentWizard({ onSubmit, loading = false }: IncidentWizardProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<IncidentData>({
    title: '',
    type: '',
    description: '',
    affectedUsers: 0,
    dataTypes: [],
    jurisdictions: [],
    detectedAt: new Date().toISOString().slice(0, 16),
  });

  const updateData = (field: keyof IncidentData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const addDataType = (type: string) => {
    if (!data.dataTypes.includes(type)) {
      updateData('dataTypes', [...data.dataTypes, type]);
    }
  };

  const removeDataType = (type: string) => {
    updateData('dataTypes', data.dataTypes.filter(t => t !== type));
  };

  const addJurisdiction = (jurisdiction: string) => {
    if (!data.jurisdictions.includes(jurisdiction)) {
      updateData('jurisdictions', [...data.jurisdictions, jurisdiction]);
    }
  };

  const removeJurisdiction = (jurisdiction: string) => {
    updateData('jurisdictions', data.jurisdictions.filter(j => j !== jurisdiction));
  };

  const calculateSeverity = () => {
    if (data.affectedUsers > 100000 || data.dataTypes.includes('health') || data.dataTypes.includes('payment')) {
      return 'critical';
    }
    if (data.affectedUsers > 10000 || data.dataTypes.includes('password_hash')) {
      return 'high';
    }
    if (data.affectedUsers > 1000) {
      return 'medium';
    }
    return 'low';
  };

  const severity = calculateSeverity();
  const severityColor = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  };

  const handleSubmit = () => {
    onSubmit(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Incident Intake Wizard</h1>
        <Badge className={severityColor[severity as keyof typeof severityColor]}>
          Severity: {severity.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Incident Title</Label>
                  <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => updateData('title', e.target.value)}
                    placeholder="e.g., Customer data breach detected"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Incident Type</Label>
                  <Select value={data.type} onValueChange={(value) => updateData('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breach">Data Breach</SelectItem>
                      <SelectItem value="outage">Service Outage</SelectItem>
                      <SelectItem value="product">Product Issue</SelectItem>
                      <SelectItem value="exec">Executive Issue</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => updateData('description', e.target.value)}
                    placeholder="Describe what happened..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="detectedAt">Detected At</Label>
                  <Input
                    id="detectedAt"
                    type="datetime-local"
                    value={data.detectedAt}
                    onChange={(e) => updateData('detectedAt', e.target.value)}
                  />
                </div>
                <Button onClick={() => setStep(2)} disabled={!data.title || !data.type}>
                  Next: Scope & Impact
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Scope & Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="affectedUsers">Number of Affected Users</Label>
                  <Input
                    id="affectedUsers"
                    type="number"
                    value={data.affectedUsers}
                    onChange={(e) => updateData('affectedUsers', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Data Types Involved</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {DATA_TYPES.map((type) => (
                      <Badge
                        key={type}
                        variant={data.dataTypes.includes(type) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => data.dataTypes.includes(type) ? removeDataType(type) : addDataType(type)}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Affected Jurisdictions</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {JURISDICTIONS.map((jurisdiction) => (
                      <Badge
                        key={jurisdiction}
                        variant={data.jurisdictions.includes(jurisdiction) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => data.jurisdictions.includes(jurisdiction) ? removeJurisdiction(jurisdiction) : addJurisdiction(jurisdiction)}
                      >
                        {jurisdiction}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)}>
                    Next: Review & Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Review & Submit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Title</Label>
                    <p className="text-sm text-gray-600">{data.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <p className="text-sm text-gray-600">{data.type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Affected Users</Label>
                    <p className="text-sm text-gray-600">{data.affectedUsers.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Severity</Label>
                    <Badge className={severityColor[severity as keyof typeof severityColor]}>
                      {severity.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-gray-600">{data.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Data Types</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.dataTypes.map((type) => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Jurisdictions</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.jurisdictions.map((jurisdiction) => (
                      <Badge key={jurisdiction} variant="secondary" className="text-xs">
                        {jurisdiction}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Creating Incident...' : 'Create Incident'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Severity Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Affected Users: {data.affectedUsers.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">Data Types: {data.dataTypes.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Detected: {new Date(data.detectedAt).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {severity === 'critical' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Critical incident detected. Immediate response required. 
                Holding statement due within 1 hour.
              </AlertDescription>
            </Alert>
          )}

          {severity === 'high' && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                High severity incident. Holding statement due within 1 hour.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
