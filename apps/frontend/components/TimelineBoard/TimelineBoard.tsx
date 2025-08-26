'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertTriangle, CheckCircle, User } from 'lucide-react';

interface TimelineItem {
  id: string;
  label: string;
  at: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
}

interface Task {
  id: string;
  title: string;
  owner_role: string;
  due_at: string;
  depends_on?: string;
  priority: number;
  channel_hint?: string;
  status: 'todo' | 'doing' | 'blocked' | 'done';
}

interface TimelineBoardProps {
  timeline: TimelineItem[];
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskMove: (taskId: string, newTimeline: string) => void;
}

const TIMELINE_COLUMNS = [
  { key: 'T0', label: 'T0 (Now)', color: 'bg-blue-50 border-blue-200' },
  { key: 'T+1h', label: 'T+1h', color: 'bg-orange-50 border-orange-200' },
  { key: 'T+4h', label: 'T+4h', color: 'bg-yellow-50 border-yellow-200' },
  { key: 'T+24h', label: 'T+24h', color: 'bg-green-50 border-green-200' },
  { key: 'T+72h', label: 'T+72h', color: 'bg-purple-50 border-purple-200' },
];

const PRIORITY_COLORS = {
  1: 'bg-red-100 text-red-800',
  2: 'bg-orange-100 text-orange-800',
  3: 'bg-yellow-100 text-yellow-800',
  4: 'bg-blue-100 text-blue-800',
  5: 'bg-gray-100 text-gray-800',
};

const STATUS_COLORS = {
  todo: 'bg-gray-100 text-gray-800',
  doing: 'bg-blue-100 text-blue-800',
  blocked: 'bg-red-100 text-red-800',
  done: 'bg-green-100 text-green-800',
};

const ROLE_COLORS = {
  pr: 'bg-purple-100 text-purple-800',
  legal: 'bg-blue-100 text-blue-800',
  social: 'bg-green-100 text-green-800',
  exec: 'bg-red-100 text-red-800',
  support: 'bg-yellow-100 text-yellow-800',
};

export function TimelineBoard({ timeline, tasks, onTaskUpdate, onTaskMove }: TimelineBoardProps) {
  const getTasksForTimeline = (timelineKey: string) => {
    return tasks.filter(task => {
      const taskTime = new Date(task.due_at);
      const timelineTime = getTimelineTime(timelineKey);
      const nextTimelineTime = getNextTimelineTime(timelineKey);
      
      return taskTime >= timelineTime && (!nextTimelineTime || taskTime < nextTimelineTime);
    });
  };

  const getTimelineTime = (timelineKey: string) => {
    const now = new Date();
    switch (timelineKey) {
      case 'T0': return now;
      case 'T+1h': return new Date(now.getTime() + 60 * 60 * 1000);
      case 'T+4h': return new Date(now.getTime() + 4 * 60 * 60 * 1000);
      case 'T+24h': new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'T+72h': return new Date(now.getTime() + 72 * 60 * 60 * 1000);
      default: return now;
    }
  };

  const getNextTimelineTime = (timelineKey: string) => {
    switch (timelineKey) {
      case 'T0': return new Date(Date.now() + 60 * 60 * 1000);
      case 'T+1h': return new Date(Date.now() + 4 * 60 * 60 * 1000);
      case 'T+4h': return new Date(Date.now() + 24 * 60 * 60 * 1000);
      case 'T+24h': return new Date(Date.now() + 72 * 60 * 60 * 1000);
      case 'T+72h': return null;
      default: return null;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 0) {
      return `${Math.abs(diffMins)}m overdue`;
    } else if (diffMins < 60) {
      return `${diffMins}m remaining`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m remaining`;
    }
  };

  const getTimeStatus = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 0) return 'overdue';
    if (diffMins < 30) return 'urgent';
    if (diffMins < 60) return 'warning';
    return 'ok';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Timeline & Tasks</h2>
        <div className="flex gap-2">
          <Badge variant="outline">{tasks.length} tasks</Badge>
          <Badge variant="outline">
            {tasks.filter(t => t.status === 'done').length} completed
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {TIMELINE_COLUMNS.map((column) => {
          const columnTasks = getTasksForTimeline(column.key);
          const completedTasks = columnTasks.filter(t => t.status === 'done').length;
          const progress = columnTasks.length > 0 ? (completedTasks / columnTasks.length) * 100 : 0;
          
          return (
            <div key={column.key} className={`rounded-lg border-2 ${column.color} p-4`}>
              <div className="mb-4">
                <h3 className="font-semibold text-sm mb-2">{column.label}</h3>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span>{completedTasks}/{columnTasks.length} done</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1" />
              </div>

              <div className="space-y-2">
                {columnTasks.map((task) => {
                  const timeStatus = getTimeStatus(task.due_at);
                  const timeStatusColors = {
                    overdue: 'text-red-600',
                    urgent: 'text-orange-600',
                    warning: 'text-yellow-600',
                    ok: 'text-gray-600',
                  };

                  return (
                    <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="text-sm font-medium line-clamp-2">{task.title}</h4>
                            <Badge className={`text-xs ${PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS]}`}>
                              P{task.priority}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-gray-500" />
                            <Badge className={`text-xs ${ROLE_COLORS[task.owner_role as keyof typeof ROLE_COLORS] || 'bg-gray-100 text-gray-800'}`}>
                              {task.owner_role}
                            </Badge>
                            <Badge className={`text-xs ${STATUS_COLORS[task.status]}`}>
                              {task.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs">
                            <Clock className="h-3 w-3" />
                            <span className={timeStatusColors[timeStatus as keyof typeof timeStatusColors]}>
                              {formatTime(task.due_at)}
                            </span>
                          </div>
                          
                          {task.channel_hint && (
                            <div className="text-xs text-gray-500">
                              📢 {task.channel_hint}
                            </div>
                          )}
                          
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-6"
                              onClick={() => onTaskUpdate(task.id, { status: task.status === 'done' ? 'todo' : 'done' })}
                            >
                              {task.status === 'done' ? 'Undo' : 'Complete'}
                            </Button>
                            {task.status === 'blocked' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-6"
                                onClick={() => onTaskUpdate(task.id, { status: 'todo' })}
                              >
                                Unblock
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                {columnTasks.length === 0 && (
                  <div className="text-center text-gray-500 text-sm py-8">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeline.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {item.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {item.status === 'in-progress' && <Clock className="h-4 w-4 text-blue-600" />}
                  {item.status === 'overdue' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                  {item.status === 'pending' && <div className="h-4 w-4 rounded-full border-2 border-gray-300" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(item.at).toLocaleString()}
                </div>
                <Badge className={STATUS_COLORS[item.status as keyof typeof STATUS_COLORS]}>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
