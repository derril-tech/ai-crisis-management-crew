'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface SeverityGaugeProps {
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedUsers: number;
  dataTypes: string[];
  jurisdictions: string[];
  timeSinceDetection: number; // in minutes
}

const SEVERITY_CONFIG = {
  low: {
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: CheckCircle,
    description: 'Minor incident with limited impact',
    sla: '24 hours',
    urgency: 'Low',
  },
  medium: {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: Clock,
    description: 'Moderate incident requiring attention',
    sla: '4 hours',
    urgency: 'Medium',
  },
  high: {
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: AlertTriangle,
    description: 'Serious incident requiring immediate response',
    sla: '1 hour',
    urgency: 'High',
  },
  critical: {
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: AlertCircle,
    description: 'Critical incident requiring emergency response',
    sla: '15 minutes',
    urgency: 'Critical',
  },
};

export function SeverityGauge({ 
  severity, 
  affectedUsers, 
  dataTypes, 
  jurisdictions, 
  timeSinceDetection 
}: SeverityGaugeProps) {
  const config = SEVERITY_CONFIG[severity];
  const Icon = config.icon;

  const calculateRiskScore = () => {
    let score = 0;
    
    // Base score from severity
    const severityScores = { low: 25, medium: 50, high: 75, critical: 100 };
    score += severityScores[severity];
    
    // Add points for affected users
    if (affectedUsers > 100000) score += 20;
    else if (affectedUsers > 10000) score += 15;
    else if (affectedUsers > 1000) score += 10;
    else if (affectedUsers > 100) score += 5;
    
    // Add points for sensitive data types
    const sensitiveTypes = ['health', 'payment', 'password_hash', 'financial'];
    const sensitiveCount = dataTypes.filter(type => sensitiveTypes.includes(type)).length;
    score += sensitiveCount * 10;
    
    // Add points for multiple jurisdictions
    if (jurisdictions.length > 3) score += 15;
    else if (jurisdictions.length > 1) score += 10;
    
    return Math.min(score, 100);
  };

  const riskScore = calculateRiskScore();
  const slaMinutes = { low: 1440, medium: 240, high: 60, critical: 15 }[severity];
  const timeRemaining = Math.max(0, slaMinutes - timeSinceDetection);
  const slaProgress = Math.max(0, Math.min(100, (timeSinceDetection / slaMinutes) * 100));

  const getSlaStatus = () => {
    if (timeRemaining <= 0) return { status: 'overdue', color: 'text-red-600' };
    if (timeRemaining <= slaMinutes * 0.25) return { status: 'urgent', color: 'text-orange-600' };
    if (timeRemaining <= slaMinutes * 0.5) return { status: 'warning', color: 'text-yellow-600' };
    return { status: 'on-track', color: 'text-green-600' };
  };

  const slaStatus = getSlaStatus();

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border-2`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${config.color}`}>
          <Icon className="h-5 w-5" />
          Severity Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Severity Badge */}
        <div className="flex items-center justify-between">
          <Badge className={`${config.color} ${config.bgColor} border ${config.borderColor}`}>
            {severity.toUpperCase()}
          </Badge>
          <span className="text-sm text-gray-600">{config.urgency} Urgency</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700">{config.description}</p>

        {/* Risk Score */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Risk Score</span>
            <span className="font-medium">{riskScore}/100</span>
          </div>
          <Progress value={riskScore} className="h-2" />
        </div>

        {/* SLA Timer */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>SLA Progress</span>
            <span className={`font-medium ${slaStatus.color}`}>
              {slaStatus.status === 'overdue' ? 'OVERDUE' : formatTime(timeRemaining)} remaining
            </span>
          </div>
          <Progress 
            value={slaProgress} 
            className={`h-2 ${slaStatus.status === 'overdue' ? 'bg-red-200' : ''}`}
          />
          <p className="text-xs text-gray-500 mt-1">
            Target: {config.sla} • Status: {slaStatus.status.replace('-', ' ')}
          </p>
        </div>

        {/* Risk Factors */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Risk Factors</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span>Affected Users:</span>
              <span className="font-medium">{affectedUsers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Data Types:</span>
              <span className="font-medium">{dataTypes.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Jurisdictions:</span>
              <span className="font-medium">{jurisdictions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Time Since Detection:</span>
              <span className="font-medium">{formatTime(timeSinceDetection)}</span>
            </div>
          </div>
        </div>

        {/* Sensitive Data Warning */}
        {dataTypes.some(type => ['health', 'payment', 'password_hash'].includes(type)) && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            ⚠️ Sensitive data types detected. Additional compliance requirements may apply.
          </div>
        )}

        {/* Multi-jurisdiction Warning */}
        {jurisdictions.length > 1 && (
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
            🌍 Multiple jurisdictions affected. Consider regional compliance requirements.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
