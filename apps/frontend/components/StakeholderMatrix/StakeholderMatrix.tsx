'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Users, MessageSquare, AlertTriangle } from 'lucide-react';

interface Stakeholder {
  id: string;
  segment: string;
  size_estimate: number;
  priority: number;
  notes: string;
  channels: string[];
}

interface StakeholderMatrixProps {
  stakeholders: Stakeholder[];
  onAddStakeholder: (stakeholder: Omit<Stakeholder, 'id'>) => void;
  onUpdateStakeholder: (id: string, updates: Partial<Stakeholder>) => void;
  onDeleteStakeholder: (id: string) => void;
}

const SEGMENTS = [
  'consumers',
  'enterprise',
  'employees',
  'partners',
  'regulators',
  'media',
  'investors',
  'vendors',
];

const PRIORITY_LEVELS = [
  { value: 1, label: 'Critical', color: 'bg-red-100 text-red-800' },
  { value: 2, label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 3, label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 4, label: 'Low', color: 'bg-blue-100 text-blue-800' },
  { value: 5, label: 'Monitor', color: 'bg-gray-100 text-gray-800' },
];

const CHANNELS = [
  'press_release',
  'newsroom',
  'email',
  'inapp',
  'helpcenter',
  'social_x',
  'social_linkedin',
  'slack',
  'statuspage',
];

export function StakeholderMatrix({ 
  stakeholders, 
  onAddStakeholder, 
  onUpdateStakeholder, 
  onDeleteStakeholder 
}: StakeholderMatrixProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStakeholder, setNewStakeholder] = useState({
    segment: '',
    size_estimate: 0,
    priority: 3,
    notes: '',
    channels: [] as string[],
  });

  const handleAddStakeholder = () => {
    if (newStakeholder.segment) {
      onAddStakeholder(newStakeholder);
      setNewStakeholder({
        segment: '',
        size_estimate: 0,
        priority: 3,
        notes: '',
        channels: [],
      });
    }
  };

  const toggleChannel = (channel: string) => {
    setNewStakeholder(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const formatSize = (size: number) => {
    if (size >= 1000000) return `${(size / 1000000).toFixed(1)}M`;
    if (size >= 1000) return `${(size / 1000).toFixed(1)}K`;
    return size.toString();
  };

  const getPriorityColor = (priority: number) => {
    const level = PRIORITY_LEVELS.find(p => p.value === priority);
    return level?.color || 'bg-gray-100 text-gray-800';
  };

  const getPriorityLabel = (priority: number) => {
    const level = PRIORITY_LEVELS.find(p => p.value === priority);
    return level?.label || 'Unknown';
  };

  const getSegmentIcon = (segment: string) => {
    switch (segment) {
      case 'consumers':
      case 'enterprise':
        return <Users className="h-4 w-4" />;
      case 'media':
        return <MessageSquare className="h-4 w-4" />;
      case 'regulators':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Stakeholder Matrix</h2>
        <Badge variant="outline">{stakeholders.length} stakeholders</Badge>
      </div>

      {/* Add new stakeholder form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Stakeholder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="segment">Segment</Label>
              <Select value={newStakeholder.segment} onValueChange={(value) => setNewStakeholder(prev => ({ ...prev, segment: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select segment" />
                </SelectTrigger>
                <SelectContent>
                  {SEGMENTS.map((segment) => (
                    <SelectItem key={segment} value={segment}>
                      {segment.charAt(0).toUpperCase() + segment.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="size">Size Estimate</Label>
              <Input
                id="size"
                type="number"
                value={newStakeholder.size_estimate}
                onChange={(e) => setNewStakeholder(prev => ({ ...prev, size_estimate: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={newStakeholder.priority.toString()} onValueChange={(value) => setNewStakeholder(prev => ({ ...prev, priority: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value.toString()}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddStakeholder} className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <Label>Notes</Label>
            <Input
              value={newStakeholder.notes}
              onChange={(e) => setNewStakeholder(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this stakeholder..."
            />
          </div>
          
          <div className="mt-4">
            <Label>Communication Channels</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {CHANNELS.map((channel) => (
                <Badge
                  key={channel}
                  variant={newStakeholder.channels.includes(channel) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleChannel(channel)}
                >
                  {channel.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stakeholders table */}
      <Card>
        <CardHeader>
          <CardTitle>Stakeholder List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Segment</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stakeholders.map((stakeholder) => (
                <TableRow key={stakeholder.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getSegmentIcon(stakeholder.segment)}
                      <span className="font-medium">
                        {stakeholder.segment.charAt(0).toUpperCase() + stakeholder.segment.slice(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatSize(stakeholder.size_estimate)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(stakeholder.priority)}>
                      {getPriorityLabel(stakeholder.priority)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {stakeholder.channels.slice(0, 3).map((channel) => (
                        <Badge key={channel} variant="secondary" className="text-xs">
                          {channel.replace('_', ' ')}
                        </Badge>
                      ))}
                      {stakeholder.channels.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{stakeholder.channels.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600 truncate max-w-xs block">
                      {stakeholder.notes || '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(editingId === stakeholder.id ? null : stakeholder.id)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteStakeholder(stakeholder.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {stakeholders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No stakeholders added yet. Add the first stakeholder above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Priority Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PRIORITY_LEVELS.map((level) => {
              const levelStakeholders = stakeholders.filter(s => s.priority === level.value);
              return (
                <div key={level.value} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={level.color}>
                      {level.label}
                    </Badge>
                    <span className="text-sm text-gray-600">{levelStakeholders.length}</span>
                  </div>
                  <div className="space-y-2">
                    {levelStakeholders.map((stakeholder) => (
                      <div key={stakeholder.id} className="text-sm p-2 bg-gray-50 rounded">
                        <div className="font-medium">{stakeholder.segment}</div>
                        <div className="text-gray-600">{formatSize(stakeholder.size_estimate)}</div>
                      </div>
                    ))}
                    {levelStakeholders.length === 0 && (
                      <div className="text-sm text-gray-500 text-center py-4">
                        None
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
