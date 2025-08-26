'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Calendar,
  Flag,
  MessageSquare,
  FileText,
  Shield,
  Globe,
  Smartphone
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string;
  due_time: string;
  category: string;
  dependencies: string[];
  notes: string;
}

interface TaskListProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onCompleteTask: (id: string) => void;
}

const TASK_STATUSES = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'in_progress', label: 'In Progress', icon: AlertTriangle, color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  { value: 'blocked', label: 'Blocked', icon: XCircle, color: 'bg-red-100 text-red-800' },
];

const TASK_PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' },
];

const TASK_CATEGORIES = [
  'communication',
  'investigation',
  'technical',
  'legal',
  'public_relations',
  'customer_support',
  'security',
  'compliance',
];

const TIMING_OPTIONS = [
  't0',
  't+1h',
  't+4h',
  't+24h',
  't+72h',
  'custom',
];

export function TaskList({ 
  tasks, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask, 
  onCompleteTask 
}: TaskListProps) {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending' as const,
    priority: 'medium' as const,
    assignee: '',
    due_time: 't+4h',
    category: 'communication',
    dependencies: [] as string[],
    notes: '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddTask = () => {
    if (newTask.title && newTask.description) {
      onAddTask(newTask);
      setNewTask({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        assignee: '',
        due_time: 't+4h',
        category: 'communication',
        dependencies: [],
        notes: '',
      });
    }
  };

  const getStatusColor = (status: string) => {
    const statusConfig = TASK_STATUSES.find(s => s.value === status);
    return statusConfig?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const statusConfig = TASK_STATUSES.find(s => s.value === status);
    return statusConfig?.icon || Clock;
  };

  const getPriorityColor = (priority: string) => {
    const priorityConfig = TASK_PRIORITIES.find(p => p.value === priority);
    return priorityConfig?.color || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'communication':
        return <MessageSquare className="h-4 w-4" />;
      case 'investigation':
        return <FileText className="h-4 w-4" />;
      case 'technical':
        return <Smartphone className="h-4 w-4" />;
      case 'legal':
        return <Shield className="h-4 w-4" />;
      case 'public_relations':
        return <Globe className="h-4 w-4" />;
      case 'customer_support':
        return <User className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'compliance':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const tasksByStatus = {
    pending: tasks.filter(t => t.status === 'pending'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed'),
    blocked: tasks.filter(t => t.status === 'blocked'),
  };

  const tasksByPriority = {
    critical: tasks.filter(t => t.priority === 'critical'),
    high: tasks.filter(t => t.priority === 'high'),
    medium: tasks.filter(t => t.priority === 'medium'),
    low: tasks.filter(t => t.priority === 'low'),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Task Management</h2>
        <div className="flex gap-2">
          <Badge variant="outline">{tasks.length} tasks</Badge>
          <Badge variant="outline">
            {tasks.filter(t => t.status === 'completed').length} completed
          </Badge>
        </div>
      </div>

      {/* Add new task form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title..."
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={newTask.category} onValueChange={(value) => setNewTask(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the task..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={newTask.priority} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITIES.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assignee">Assignee</Label>
              <Input
                id="assignee"
                value={newTask.assignee}
                onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                placeholder="Who should do this?"
              />
            </div>
            <div>
              <Label htmlFor="due_time">Due Time</Label>
              <Select value={newTask.due_time} onValueChange={(value) => setNewTask(prev => ({ ...prev, due_time: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMING_OPTIONS.map((timing) => (
                    <SelectItem key={timing} value={timing}>
                      {timing.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddTask} className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={newTask.notes}
              onChange={(e) => setNewTask(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Tasks by status */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Pending ({tasksByStatus.pending.length})
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            In Progress ({tasksByStatus.in_progress.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({tasksByStatus.completed.length})
          </TabsTrigger>
          <TabsTrigger value="blocked">
            Blocked ({tasksByStatus.blocked.length})
          </TabsTrigger>
        </TabsList>

        {TASK_STATUSES.map((status) => (
          <TabsContent key={status.value} value={status.value}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <status.icon className="h-5 w-5" />
                  {status.label} Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasksByStatus[status.value as keyof typeof tasksByStatus].map((task) => {
                    const StatusIcon = getStatusIcon(task.status);
                    return (
                      <div key={task.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(task.category)}
                            <h3 className="font-medium">{task.title}</h3>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(task.status)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                            {task.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => onCompleteTask(task.id)}
                              >
                                Start
                              </Button>
                            )}
                            {task.status === 'in_progress' && (
                              <Button
                                size="sm"
                                onClick={() => onCompleteTask(task.id)}
                              >
                                Complete
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Assignee:</span> {task.assignee || 'Unassigned'}
                          </div>
                          <div>
                            <span className="font-medium">Due:</span> {task.due_time.toUpperCase()}
                          </div>
                          <div>
                            <span className="font-medium">Category:</span> {task.category.replace('_', ' ')}
                          </div>
                          <div>
                            <span className="font-medium">Dependencies:</span> {task.dependencies.length}
                          </div>
                        </div>

                        {task.notes && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Notes:</span> {task.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {tasksByStatus[status.value as keyof typeof tasksByStatus].length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No {status.label.toLowerCase()} tasks.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Priority overview */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TASK_PRIORITIES.map((priority) => {
              const count = tasksByPriority[priority.value as keyof typeof tasksByPriority].length;
              const completed = tasksByPriority[priority.value as keyof typeof tasksByPriority].filter(t => t.status === 'completed').length;
              return (
                <div key={priority.value} className="text-center p-4 border rounded-lg">
                  <Flag className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-gray-600">{priority.label}</div>
                  {count > 0 && (
                    <div className="text-xs text-green-600 mt-1">
                      {completed}/{count} completed
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
