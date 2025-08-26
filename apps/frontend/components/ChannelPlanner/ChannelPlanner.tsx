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
  MessageSquare, 
  Mail, 
  Globe, 
  Smartphone, 
  HelpCircle, 
  Twitter, 
  Linkedin, 
  Slack, 
  Activity,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

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

interface ChannelPlannerProps {
  channels: Channel[];
  onAddChannel: (channel: Omit<Channel, 'id'>) => void;
  onUpdateChannel: (id: string, updates: Partial<Channel>) => void;
  onDeleteChannel: (id: string) => void;
  onSendChannel: (id: string) => void;
}

const CHANNEL_TYPES = [
  { value: 'primary', label: 'Primary', icon: MessageSquare, color: 'bg-blue-100 text-blue-800' },
  { value: 'secondary', label: 'Secondary', icon: Mail, color: 'bg-green-100 text-green-800' },
  { value: 'monitoring', label: 'Monitoring', icon: Activity, color: 'bg-gray-100 text-gray-800' },
];

const CHANNEL_STATUSES = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'ready', label: 'Ready', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  { value: 'sent', label: 'Sent', icon: CheckCircle, color: 'bg-blue-100 text-blue-800' },
  { value: 'failed', label: 'Failed', icon: XCircle, color: 'bg-red-100 text-red-800' },
];

const AUDIENCE_OPTIONS = [
  'consumers',
  'enterprise',
  'employees',
  'partners',
  'regulators',
  'media',
  'investors',
  'vendors',
];

const TIMING_OPTIONS = [
  'immediate',
  't+1h',
  't+4h',
  't+24h',
  't+72h',
  'custom',
];

const CONTENT_TEMPLATES = {
  holding_statement: `We are aware of [INCIDENT_DESCRIPTION] and are actively investigating the situation. We will provide updates as more information becomes available.`,
  press_release: `FOR IMMEDIATE RELEASE

[COMPANY_NAME] Responds to [INCIDENT_TYPE]

[LOCATION] - [DATE] - [COMPANY_NAME] today announced that it has identified and is addressing [INCIDENT_DESCRIPTION].

What Happened:
[WHAT_HAPPENED]

What We're Doing:
[WHAT_WERE_DOING]

What This Means for You:
[WHAT_THIS_MEANS]

For more information, please contact [CONTACT_INFO].`,
  internal_memo: `Subject: [INCIDENT_TITLE] - Internal Update

Team,

We have identified [INCIDENT_DESCRIPTION] that affects [AFFECTED_SYSTEMS].

Current Status: [STATUS]
Impact: [IMPACT]
Next Steps: [NEXT_STEPS]

Please direct any questions to [CONTACT_PERSON].

Best regards,
[YOUR_NAME]`,
  status_page: `[SERVICE_NAME] is currently experiencing [ISSUE_TYPE]. Our team is actively working to resolve this issue. We will provide updates as they become available.`,
  social_media: `We're aware of [INCIDENT_DESCRIPTION] and are working to resolve it. We'll keep you updated here. Thank you for your patience.`,
};

export function ChannelPlanner({ 
  channels, 
  onAddChannel, 
  onUpdateChannel, 
  onDeleteChannel, 
  onSendChannel 
}: ChannelPlannerProps) {
  const [newChannel, setNewChannel] = useState({
    name: '',
    type: 'primary' as const,
    status: 'pending' as const,
    target_audience: [] as string[],
    content_template: '',
    timing: 'immediate',
    owner: '',
    notes: '',
  });

  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleAddChannel = () => {
    if (newChannel.name && newChannel.content_template) {
      onAddChannel(newChannel);
      setNewChannel({
        name: '',
        type: 'primary',
        status: 'pending',
        target_audience: [],
        content_template: '',
        timing: 'immediate',
        owner: '',
        notes: '',
      });
      setSelectedTemplate('');
    }
  };

  const toggleAudience = (audience: string) => {
    setNewChannel(prev => ({
      ...prev,
      target_audience: prev.target_audience.includes(audience)
        ? prev.target_audience.filter(a => a !== audience)
        : [...prev.target_audience, audience]
    }));
  };

  const getChannelIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('email')) return <Mail className="h-4 w-4" />;
    if (lowerName.includes('press')) return <Globe className="h-4 w-4" />;
    if (lowerName.includes('app') || lowerName.includes('mobile')) return <Smartphone className="h-4 w-4" />;
    if (lowerName.includes('help') || lowerName.includes('support')) return <HelpCircle className="h-4 w-4" />;
    if (lowerName.includes('twitter') || lowerName.includes('x')) return <Twitter className="h-4 w-4" />;
    if (lowerName.includes('linkedin')) return <Linkedin className="h-4 w-4" />;
    if (lowerName.includes('slack')) return <Slack className="h-4 w-4" />;
    if (lowerName.includes('status')) return <Activity className="h-4 w-4" />;
    return <MessageSquare className="h-4 w-4" />;
  };

  const getTypeColor = (type: string) => {
    const typeConfig = CHANNEL_TYPES.find(t => t.value === type);
    return typeConfig?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const statusConfig = CHANNEL_STATUSES.find(s => s.value === status);
    return statusConfig?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const statusConfig = CHANNEL_STATUSES.find(s => s.value === status);
    return statusConfig?.icon || Clock;
  };

  const applyTemplate = (templateKey: string) => {
    const template = CONTENT_TEMPLATES[templateKey as keyof typeof CONTENT_TEMPLATES];
    if (template) {
      setNewChannel(prev => ({ ...prev, content_template: template }));
      setSelectedTemplate(templateKey);
    }
  };

  const channelsByType = {
    primary: channels.filter(c => c.type === 'primary'),
    secondary: channels.filter(c => c.type === 'secondary'),
    monitoring: channels.filter(c => c.type === 'monitoring'),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Channel Planner</h2>
        <div className="flex gap-2">
          <Badge variant="outline">{channels.length} channels</Badge>
          <Badge variant="outline">
            {channels.filter(c => c.status === 'sent').length} sent
          </Badge>
        </div>
      </div>

      {/* Add new channel form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Communication Channel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Channel Name</Label>
              <Input
                id="name"
                value={newChannel.name}
                onChange={(e) => setNewChannel(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Press Release, Email Alert"
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={newChannel.type} onValueChange={(value: any) => setNewChannel(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHANNEL_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timing">Timing</Label>
              <Select value={newChannel.timing} onValueChange={(value) => setNewChannel(prev => ({ ...prev, timing: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMING_OPTIONS.map((timing) => (
                    <SelectItem key={timing} value={timing}>
                      {timing.charAt(0).toUpperCase() + timing.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Label>Target Audience</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {AUDIENCE_OPTIONS.map((audience) => (
                <div key={audience} className="flex items-center space-x-2">
                  <Checkbox
                    id={audience}
                    checked={newChannel.target_audience.includes(audience)}
                    onCheckedChange={() => toggleAudience(audience)}
                  />
                  <Label htmlFor={audience} className="text-sm">
                    {audience.charAt(0).toUpperCase() + audience.slice(1)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <Label>Content Template</Label>
            <div className="flex flex-wrap gap-2 mt-2 mb-4">
              {Object.keys(CONTENT_TEMPLATES).map((templateKey) => (
                <Button
                  key={templateKey}
                  variant={selectedTemplate === templateKey ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => applyTemplate(templateKey)}
                >
                  {templateKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Button>
              ))}
            </div>
            <Textarea
              value={newChannel.content_template}
              onChange={(e) => setNewChannel(prev => ({ ...prev, content_template: e.target.value }))}
              placeholder="Enter your message content here..."
              rows={6}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="owner">Owner</Label>
              <Input
                id="owner"
                value={newChannel.owner}
                onChange={(e) => setNewChannel(prev => ({ ...prev, owner: e.target.value }))}
                placeholder="Who is responsible for this channel?"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={newChannel.notes}
                onChange={(e) => setNewChannel(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes..."
              />
            </div>
          </div>

          <div className="mt-4">
            <Button onClick={handleAddChannel} className="w-full">
              Add Channel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Channels by type */}
      <Tabs defaultValue="primary" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="primary">
            Primary ({channelsByType.primary.length})
          </TabsTrigger>
          <TabsTrigger value="secondary">
            Secondary ({channelsByType.secondary.length})
          </TabsTrigger>
          <TabsTrigger value="monitoring">
            Monitoring ({channelsByType.monitoring.length})
          </TabsTrigger>
        </TabsList>

        {CHANNEL_TYPES.map((type) => (
          <TabsContent key={type.value} value={type.value}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <type.icon className="h-5 w-5" />
                  {type.label} Channels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channelsByType[type.value as keyof typeof channelsByType].map((channel) => {
                    const StatusIcon = getStatusIcon(channel.status);
                    return (
                      <div key={channel.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getChannelIcon(channel.name)}
                            <h3 className="font-medium">{channel.name}</h3>
                            <Badge className={getTypeColor(channel.type)}>
                              {type.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(channel.status)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {channel.status.charAt(0).toUpperCase() + channel.status.slice(1)}
                            </Badge>
                            {channel.status === 'ready' && (
                              <Button
                                size="sm"
                                onClick={() => onSendChannel(channel.id)}
                              >
                                Send
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Timing:</span> {channel.timing}
                          </div>
                          <div>
                            <span className="font-medium">Owner:</span> {channel.owner || 'Unassigned'}
                          </div>
                          <div>
                            <span className="font-medium">Audience:</span> {channel.target_audience.length} segments
                          </div>
                        </div>

                        {channel.target_audience.length > 0 && (
                          <div className="mt-2">
                            <span className="text-sm font-medium">Target:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {channel.target_audience.map((audience) => (
                                <Badge key={audience} variant="secondary" className="text-xs">
                                  {audience}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {channel.notes && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Notes:</span> {channel.notes}
                          </div>
                        )}

                        <div className="mt-3 text-sm text-gray-500">
                          {channel.content_template.substring(0, 100)}
                          {channel.content_template.length > 100 && '...'}
                        </div>
                      </div>
                    );
                  })}
                  
                  {channelsByType[type.value as keyof typeof channelsByType].length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No {type.label.toLowerCase()} channels added yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Channel status overview */}
      <Card>
        <CardHeader>
          <CardTitle>Channel Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CHANNEL_STATUSES.map((status) => {
              const StatusIcon = status.icon;
              const count = channels.filter(c => c.status === status.value).length;
              return (
                <div key={status.value} className="text-center p-4 border rounded-lg">
                  <StatusIcon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-gray-600">{status.label}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
