'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IncidentWizard } from '@/components/IncidentWizard/IncidentWizard';
import { FactTable } from '@/components/FactTable/FactTable';
import { SeverityGauge } from '@/components/SeverityGauge/SeverityGauge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface IncidentData {
  title: string;
  type: string;
  description: string;
  affectedUsers: number;
  dataTypes: string[];
  jurisdictions: string[];
  detectedAt: string;
}

interface Fact {
  id: string;
  label: string;
  value: string;
  confidence: 'low' | 'medium' | 'high';
  source: string;
  is_unknown: boolean;
  updated_at: string;
}

export default function NewIncidentPage() {
  const router = useRouter();
  const [step, setStep] = useState<'wizard' | 'facts'>('wizard');
  const [incidentData, setIncidentData] = useState<IncidentData | null>(null);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateSeverity = (data: IncidentData): 'low' | 'medium' | 'high' | 'critical' => {
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

  const handleWizardSubmit = async (data: IncidentData) => {
    setLoading(true);
    setError(null);

    try {
      // Create incident via API
      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          type: data.type,
          severity: calculateSeverity(data),
          detected_at: data.detectedAt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create incident');
      }

      const incident = await response.json();
      setIncidentData(data);
      setStep('facts');
      
      // Add initial facts from wizard data
      const initialFacts: Omit<Fact, 'id' | 'updated_at'>[] = [
        {
          label: 'affected_users',
          value: data.affectedUsers.toString(),
          confidence: 'medium',
          source: 'wizard_input',
          is_unknown: false,
        },
        {
          label: 'data_types',
          value: data.dataTypes.join(', '),
          confidence: 'high',
          source: 'wizard_input',
          is_unknown: false,
        },
        {
          label: 'jurisdictions',
          value: data.jurisdictions.join(', '),
          confidence: 'medium',
          source: 'wizard_input',
          is_unknown: false,
        },
        {
          label: 'description',
          value: data.description,
          confidence: 'high',
          source: 'wizard_input',
          is_unknown: false,
        },
      ];

      setFacts(initialFacts.map((fact, index) => ({
        ...fact,
        id: `temp-${index}`,
        updated_at: new Date().toISOString(),
      })));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFact = (fact: Omit<Fact, 'id' | 'updated_at'>) => {
    const newFact: Fact = {
      ...fact,
      id: `fact-${Date.now()}`,
      updated_at: new Date().toISOString(),
    };
    setFacts(prev => [...prev, newFact]);
  };

  const handleUpdateFact = (id: string, updates: Partial<Fact>) => {
    setFacts(prev => prev.map(fact => 
      fact.id === id ? { ...fact, ...updates, updated_at: new Date().toISOString() } : fact
    ));
  };

  const handleDeleteFact = (id: string) => {
    setFacts(prev => prev.filter(fact => fact.id !== id));
  };

  const handleInsertFact = (fact: Fact) => {
    // This would typically insert the fact into an editor
    console.log('Inserting fact into editor:', fact);
  };

  const handleCompleteIntake = async () => {
    setLoading(true);
    setError(null);

    try {
      // Save facts to the incident
      // This would typically call the API to save facts
      console.log('Saving facts:', facts);
      
      // Navigate to the incident page
      router.push('/incidents');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'wizard') {
    return (
      <div className="container mx-auto py-8">
        <IncidentWizard onSubmit={handleWizardSubmit} loading={loading} />
        {error && (
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  if (!incidentData) {
    return <div>No incident data found</div>;
  }

  const severity = calculateSeverity(incidentData);
  const timeSinceDetection = Math.floor(
    (Date.now() - new Date(incidentData.detectedAt).getTime()) / (1000 * 60)
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Incident Intake: {incidentData.title}</h1>
        <Button onClick={handleCompleteIntake} disabled={loading}>
          {loading ? 'Completing...' : 'Complete Intake'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FactTable
            facts={facts}
            onAddFact={handleAddFact}
            onUpdateFact={handleUpdateFact}
            onDeleteFact={handleDeleteFact}
            onInsertFact={handleInsertFact}
          />
        </div>

        <div className="space-y-6">
          <SeverityGauge
            severity={severity}
            affectedUsers={incidentData.affectedUsers}
            dataTypes={incidentData.dataTypes}
            jurisdictions={incidentData.jurisdictions}
            timeSinceDetection={timeSinceDetection}
          />

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Incident Created</p>
                  <p className="text-xs text-gray-600">Basic information captured</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Facts Collection</p>
                  <p className="text-xs text-gray-600">Add and organize incident facts</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Plan Generation</p>
                  <p className="text-xs text-gray-600">Generate timeline and tasks</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Content Drafting</p>
                  <p className="text-xs text-gray-600">Create communications</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {error && (
        <Alert className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
