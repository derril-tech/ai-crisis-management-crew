"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface Approval {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedByUserId: string;
  actedByUserId?: string;
  notes?: string;
  createdAt: string;
  actedAt?: string;
}

interface ApprovalsPanelProps {
  approvals: Approval[];
  onRequest: (notes?: string) => void;
  onAct: (approvalId: string, action: 'approve' | 'reject', notes?: string) => void;
}

const statusColor: Record<Approval['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export function ApprovalsPanel({ approvals, onRequest, onAct }: ApprovalsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Approvals</span>
          <Button size="sm" onClick={() => onRequest()}>Request Approval</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {approvals.map((a) => (
            <div key={a.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={statusColor[a.status]}>{a.status.toUpperCase()}</Badge>
                  <span className="text-sm text-gray-600">Requested by {a.requestedByUserId}</span>
                  <span className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  {a.status === 'pending' && (
                    <>
                      <Button size="sm" onClick={() => onAct(a.id, 'approve')}>
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onAct(a.id, 'reject')}>
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
              {a.notes && <div className="text-sm text-gray-600 mt-1">Notes: {a.notes}</div>}
            </div>
          ))}
          {approvals.length === 0 && (
            <div className="text-gray-500 text-center py-8">No approvals yet.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
