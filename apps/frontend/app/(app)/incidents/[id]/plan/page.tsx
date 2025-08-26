'use client';

import React, { useState, useEffect } from 'react';
import { TimelineBoard } from '@/components/TimelineBoard/TimelineBoard';
import { TaskList } from '@/components/TaskList/TaskList';
import { StakeholderMatrix } from '@/components/StakeholderMatrix/StakeholderMatrix';
import { ChannelPlanner } from '@/components/ChannelPlanner/ChannelPlanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  CheckSquare, 
  TrendingUp,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface TimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
  tasks: Task[];
}

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

interface Stakeholder {
  id: string;
  segment: string;
  size_estimate: number;
  priority: number;
  notes: string;
  channels: string[];
}

interface Channel {
  id: string;
  name: string;
  type: 'primary' | 'secondary' | 'monitoring';
  status: 'pending' | 'ready' | 'sent' | 'failed';
  target_audience: string[];
  content_template: string;
  timing: string;
  owner: string;
  notes: string;
}

export default function IncidentPlanPage({ params }: { params: { id: string } }) {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setTimeline([
        {
          id: '1',
          time: 'T0',
          title: 'Immediate Response',
          description: 'Initial assessment and containment',
          tasks: [
            {
              id: '1',
              title: 'Activate incident response team',
              description: 'Notify key stakeholders and assemble response team',
              status: 'completed',
              priority: 'critical',
              assignee: 'Incident Commander',
              due_time: 't0',
              category: 'communication',
              dependencies: [],
              notes: 'Team assembled and briefed'
            },
            {
              id: '2',
              title: 'Assess initial impact',
              description: 'Determine scope and severity of the incident',
              status: 'in_progress',
              priority: 'critical',
              assignee: 'Technical Lead',
              due_time: 't0',
              category: 'investigation',
              dependencies: [],
              notes: 'Initial assessment in progress'
            }
          ]
        },
        {
          id: '2',
          time: 'T+1h',
          title: 'Containment Phase',
          description: 'Stop the spread and minimize damage',
          tasks: [
            {
              id: '3',
              title: 'Implement containment measures',
              description: 'Apply technical controls to limit incident scope',
              status: 'pending',
              priority: 'high',
              assignee: 'Security Team',
              due_time: 't+1h',
              category: 'technical',
              dependencies: ['2'],
              notes: 'Waiting for impact assessment'
            }
          ]
        }
      ]);

      setTasks([
        {
          id: '1',
          title: 'Activate incident response team',
          description: 'Notify key stakeholders and assemble response team',
          status: 'completed',
          priority: 'critical',
          assignee: 'Incident Commander',
          due_time: 't0',
          category: 'communication',
          dependencies: [],
          notes: 'Team assembled and briefed'
        },
        {
          id: '2',
          title: 'Assess initial impact',
          description: 'Determine scope and severity of the incident',
          status: 'in_progress',
          priority: 'critical',
          assignee: 'Technical Lead',
          due_time: 't0',
          category: 'investigation',
          dependencies: [],
          notes: 'Initial assessment in progress'
        },
        {
          id: '3',
          title: 'Implement containment measures',
          description: 'Apply technical controls to limit incident scope',
          status: 'pending',
          priority: 'high',
          assignee: 'Security Team',
          due_time: 't+1h',
          category: 'technical',
          dependencies: ['2'],
          notes: 'Waiting for impact assessment'
        }
      ]);

      setStakeholders([
        {
          id: '1',
          segment: 'consumers',
          size_estimate: 1000000,
          priority: 1,
          notes: 'Primary customer base affected',
          channels: ['email', 'inapp', 'statuspage']
        },
        {
          id: '2',
          segment: 'media',
          size_estimate: 50,
          priority: 2,
          notes: 'Press inquiries expected',
          channels: ['press_release', 'newsroom']
        },
        {
          id: '3',
          segment: 'regulators',
          size_estimate: 5,
          priority: 1,
          notes: 'Regulatory notification required',
          channels: ['email']
        }
      ]);

      setChannels([
        {
          id: '1',
          name: 'Customer Email Alert',
          type: 'primary',
          status: 'sent',
          target_audience: ['consumers'],
          content_template: 'We are aware of [INCIDENT_DESCRIPTION] and are actively investigating the situation.',
          timing: 'immediate',
          owner: 'Communications Team',
          notes: 'Sent to all affected customers'
        },
        {
          id: '2',
          name: 'Press Release',
          type: 'primary',
          status: 'ready',
          target_audience: ['media'],
          content_template: 'FOR IMMEDIATE RELEASE\n\n[COMPANY_NAME] Responds to [INCIDENT_TYPE]',
          timing: 't+4h',
          owner: 'PR Team',
          notes: 'Ready for legal review'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleCompleteTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, status: task.status === 'pending' ? 'in_progress' : 'completed' }
        : task
    ));
  };

  const handleAddStakeholder = (stakeholder: Omit<Stakeholder, 'id'>) => {
    const newStakeholder = {
      ...stakeholder,
      id: Date.now().toString(),
    };
    setStakeholders(prev => [...prev, newStakeholder]);
  };

  const handleUpdateStakeholder = (id: string, updates: Partial<Stakeholder>) => {
    setStakeholders(prev => prev.map(stakeholder => 
      stakeholder.id === id ? { ...stakeholder, ...updates } : stakeholder
    ));
  };

  const handleDeleteStakeholder = (id: string) => {
    setStakeholders(prev => prev.filter(stakeholder => stakeholder.id !== id));
  };

  const handleAddChannel = (channel: Omit<Channel, 'id'>) => {
    const newChannel = {
      ...channel,
      id: Date.now().toString(),
    };
    setChannels(prev => [...prev, newChannel]);
  };

  const handleUpdateChannel = (id: string, updates: Partial<Channel>) => {
    setChannels(prev => prev.map(channel => 
      channel.id === id ? { ...channel, ...updates } : channel
    ));
  };

  const handleDeleteChannel = (id: string) => {
    setChannels(prev => prev.filter(channel => channel.id !== id));
  };

  const handleSendChannel = (id: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === id ? { ...channel, status: 'sent' } : channel
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading incident plan...</p>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Incident Plan</h1>
          <p className="text-gray-600">Incident ID: {params.id}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-600">Progress</div>
            <div className="text-2xl font-bold">{completedTasks}/{totalTasks}</div>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeDasharray={`${progressPercentage}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">Timeline Items</div>
                <div className="text-2xl font-bold">{timeline.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm text-gray-600">Tasks</div>
                <div className="text-2xl font-bold">{tasks.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-sm text-gray-600">Stakeholders</div>
                <div className="text-2xl font-bold">{stakeholders.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-sm text-gray-600">Channels</div>
                <div className="text-2xl font-bold">{channels.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="stakeholders" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Stakeholders
          </TabsTrigger>
          <TabsTrigger value="channels" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Channels
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          <TimelineBoard 
            timeline={timeline}
            onUpdateTimeline={setTimeline}
          />
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <TaskList 
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onCompleteTask={handleCompleteTask}
          />
        </TabsContent>

        <TabsContent value="stakeholders" className="mt-6">
          <StakeholderMatrix 
            stakeholders={stakeholders}
            onAddStakeholder={handleAddStakeholder}
            onUpdateStakeholder={handleUpdateStakeholder}
            onDeleteStakeholder={handleDeleteStakeholder}
          />
        </TabsContent>

        <TabsContent value="channels" className="mt-6">
          <ChannelPlanner 
            channels={channels}
            onAddChannel={handleAddChannel}
            onUpdateChannel={handleUpdateChannel}
            onDeleteChannel={handleDeleteChannel}
            onSendChannel={handleSendChannel}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
