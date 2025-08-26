'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface Fact {
  id: string;
  label: string;
  value: string;
  confidence: 'low' | 'medium' | 'high';
  source: string;
  is_unknown: boolean;
  updated_at: string;
}

interface FactTableProps {
  facts: Fact[];
  onAddFact: (fact: Omit<Fact, 'id' | 'updated_at'>) => void;
  onUpdateFact: (id: string, fact: Partial<Fact>) => void;
  onDeleteFact: (id: string) => void;
  onInsertFact: (fact: Fact) => void;
}

const CONFIDENCE_COLORS = {
  low: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-green-100 text-green-800',
};

const CONFIDENCE_ICONS = {
  low: AlertTriangle,
  medium: Clock,
  high: CheckCircle,
};

export function FactTable({ facts, onAddFact, onUpdateFact, onDeleteFact, onInsertFact }: FactTableProps) {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [newFact, setNewFact] = React.useState({
    label: '',
    value: '',
    confidence: 'medium' as const,
    source: '',
    is_unknown: false,
  });

  const handleAddFact = () => {
    if (newFact.label && newFact.value) {
      onAddFact(newFact);
      setNewFact({
        label: '',
        value: '',
        confidence: 'medium',
        source: '',
        is_unknown: false,
      });
    }
  };

  const handleInsertFact = (fact: Fact) => {
    onInsertFact(fact);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Incident Facts</span>
          <Badge variant="secondary">{facts.length} facts</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add new fact form */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <div>
              <Label htmlFor="fact-label" className="text-xs">Label</Label>
              <Input
                id="fact-label"
                value={newFact.label}
                onChange={(e) => setNewFact(prev => ({ ...prev, label: e.target.value }))}
                placeholder="e.g., affected_users"
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="fact-value" className="text-xs">Value</Label>
              <Input
                id="fact-value"
                value={newFact.value}
                onChange={(e) => setNewFact(prev => ({ ...prev, value: e.target.value }))}
                placeholder="e.g., 10,000"
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="fact-confidence" className="text-xs">Confidence</Label>
              <Select
                value={newFact.confidence}
                onValueChange={(value: 'low' | 'medium' | 'high') => 
                  setNewFact(prev => ({ ...prev, confidence: value }))
                }
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fact-source" className="text-xs">Source</Label>
              <Input
                id="fact-source"
                value={newFact.source}
                onChange={(e) => setNewFact(prev => ({ ...prev, source: e.target.value }))}
                placeholder="e.g., security_team"
                className="text-sm"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddFact} size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Facts table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Label</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="w-[100px]">Confidence</TableHead>
                  <TableHead className="w-[120px]">Source</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[120px]">Updated</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facts.map((fact) => {
                  const ConfidenceIcon = CONFIDENCE_ICONS[fact.confidence];
                  return (
                    <TableRow key={fact.id}>
                      <TableCell className="font-medium">
                        {editingId === fact.id ? (
                          <Input
                            value={fact.label}
                            onChange={(e) => onUpdateFact(fact.id, { label: e.target.value })}
                            className="text-sm"
                          />
                        ) : (
                          fact.label
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === fact.id ? (
                          <Input
                            value={fact.value}
                            onChange={(e) => onUpdateFact(fact.id, { value: e.target.value })}
                            className="text-sm"
                          />
                        ) : (
                          fact.value
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={CONFIDENCE_COLORS[fact.confidence]}>
                          <ConfidenceIcon className="h-3 w-3 mr-1" />
                          {fact.confidence}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {fact.source || '-'}
                      </TableCell>
                      <TableCell>
                        {fact.is_unknown ? (
                          <Badge variant="outline" className="text-orange-600">
                            Unknown
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-green-600">
                            Known
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500">
                        {formatDate(fact.updated_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleInsertFact(fact)}
                            title="Insert into editor"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingId(editingId === fact.id ? null : fact.id)}
                            title="Edit fact"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteFact(fact.id)}
                            title="Delete fact"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {facts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      No facts added yet. Add the first fact above.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="flex gap-4 text-sm text-gray-600">
            <div>High confidence: {facts.filter(f => f.confidence === 'high').length}</div>
            <div>Medium confidence: {facts.filter(f => f.confidence === 'medium').length}</div>
            <div>Low confidence: {facts.filter(f => f.confidence === 'low').length}</div>
            <div>Unknown facts: {facts.filter(f => f.is_unknown).length}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
