'use client';

import React, { useState, useEffect } from 'react';
import { EditorMDX } from '@/components/EditorMDX/EditorMDX';
import { FAQBuilder } from '@/components/FAQBuilder/FAQBuilder';
import { SocialComposer } from '@/components/SocialComposer/SocialComposer';
import { LegalFlags } from '@/components/LegalFlags/LegalFlags';
import { ApprovalsPanel } from '@/components/ApprovalsPanel/ApprovalsPanel';
import { PublishConsole } from '@/components/PublishConsole/PublishConsole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  HelpCircle, 
  MessageSquare, 
  Send, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { CrisisCrewClient } from '@crisis-crew/sdk/dist/client';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  contentType: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  version: number;
  created_at: Date;
  updated_at: Date;
  metadata: any;
  artifactId?: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  priority: number;
  status: 'draft' | 'review' | 'approved' | 'published';
  tags: string[];
  created_at: Date;
  updated_at: Date;
}

interface SocialPost {
  id: string;
  platform: string;
  content: string;
  hashtags: string[];
  character_count: number;
  includes_media: boolean;
  media_url?: string;
  scheduled_time?: Date;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  target_audience: string[];
  tone: string;
  created_at: Date;
}

interface Redline { start: number; end: number; original: string; suggestion: string; reason: string; severity: 'low'|'medium'|'high'|'critical' }
interface Approval { id: string; status: 'pending'|'approved'|'rejected'; requestedByUserId: string; actedByUserId?: string; notes?: string; createdAt: string; actedAt?: string; }

export default function IncidentContentPage({ params }: { params: { id: string } }) {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  const [redlines, setRedlines] = useState<Redline[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);

  const client = new CrisisCrewClient(process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:3001/v1');

  // Mock data for demonstration
  useEffect(() => {
    setTimeout(() => {
      setContentItems([
        {
          id: '1',
          title: 'Holding Statement - Data Breach',
          content: `We are aware of a data breach that may be affecting some of our users. Our team is immediately investigating the situation and working to resolve any issues.

We will provide updates as more information becomes available. We apologize for any inconvenience this may cause.

For the latest status updates, please visit our status page or contact our support team.

If you are experiencing urgent issues, please contact our emergency support line.

Affected systems: User authentication, payment processing`,
          contentType: 'holding_statement',
          status: 'approved',
          version: 2,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
          updated_at: new Date(Date.now() - 30 * 60 * 1000),
          metadata: {
            severity: 'high',
            tone: 'urgent',
            target_audience: ['customers', 'media'],
            word_count: 89,
            estimated_read_time: '30 seconds'
          },
          artifactId: 'artifact-1'
        },
        {
          id: '2',
          title: 'Press Release - Data Breach Response',
          content: `FOR IMMEDIATE RELEASE

COMPANY_NAME Responds to Data Breach

LOCATION - DATE - COMPANY_NAME today announced that it has identified and is addressing a data breach affecting some users.

What Happened:
Our monitoring systems detected unauthorized access to our systems affecting user authentication and payment processing.

What We're Doing:
Our technical teams are working around the clock to resolve this issue. We have implemented containment measures and are systematically restoring affected services.

What This Means for You:
We understand this data breach is causing significant disruption for affected users. We are prioritizing the restoration of critical services.

For more information, please contact our media relations team.`,
          contentType: 'press_release',
          status: 'draft',
          version: 1,
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
          updated_at: new Date(Date.now() - 15 * 60 * 1000),
          metadata: {
            severity: 'high',
            tone: 'formal',
            target_audience: ['media', 'customers'],
            word_count: 156,
            estimated_read_time: '1 minute'
          },
          artifactId: 'artifact-2'
        }
      ]);

      setFaqItems([
        {
          id: '1',
          question: 'What happened?',
          answer: 'We experienced a data breach that affected some of our services. Our team is actively working to resolve this.',
          category: 'general',
          priority: 1,
          status: 'approved',
          tags: ['incident', 'breach'],
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
          updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
        },
        {
          id: '2',
          question: 'When will this be fixed?',
          answer: 'Our technical teams are working as quickly as possible to resolve this issue. We will provide updates as soon as we have more information about the timeline for resolution.',
          category: 'timeline',
          priority: 1,
          status: 'approved',
          tags: ['timeline', 'resolution'],
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
          updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
        },
        {
          id: '3',
          question: 'Is my data safe?',
          answer: 'We have no indication that any customer data has been compromised. Our security teams are monitoring the situation closely and will notify affected customers immediately if this changes.',
          category: 'security',
          priority: 2,
          status: 'draft',
          tags: ['security', 'data'],
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
          updated_at: new Date(Date.now() - 30 * 60 * 1000),
        }
      ]);

      setSocialPosts([
        {
          id: '1',
          platform: 'twitter',
          content: 'We\'re aware of a data breach and are working to resolve it. We\'ll keep you updated here. Thank you for your patience.',
          hashtags: ['#ServiceUpdate', '#CustomerFirst'],
          character_count: 140,
          includes_media: false,
          status: 'sent',
          target_audience: ['customers'],
          tone: 'transparent',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: '2',
          platform: 'linkedin',
          content: 'We\'re experiencing a data breach and our team is actively working to resolve it. We\'ll provide updates as we have more information. Thank you for your patience.',
          hashtags: ['#ServiceUpdate', '#CustomerService'],
          character_count: 300,
          includes_media: false,
          status: 'draft',
          target_audience: ['customers', 'partners'],
          tone: 'professional',
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  // Fetch redlines and approvals when selected content changes
  useEffect(() => {
    const run = async () => {
      if (!selectedContent?.artifactId) {
        setRedlines([]);
        setApprovals([]);
        return;
      }
      try {
        const [rs, aps] = await Promise.all([
          client.lintArtifact(selectedContent.artifactId),
          client.listApprovalsForArtifact(selectedContent.artifactId),
        ]);
        setRedlines(rs as any);
        setApprovals(aps as any);
      } catch (e) {
        setRedlines([]);
        setApprovals([]);
      }
    };
    run();
  }, [selectedContent?.artifactId]);

  const handleApplySuggestion = (start: number, end: number, suggestion: string) => {
    if (!selectedContent) return;
    const before = selectedContent.content.slice(0, start);
    const after = selectedContent.content.slice(end);
    const updated = before + suggestion + after;
    handleSaveContent(updated, selectedContent.metadata);
  };

  const handleRequestApproval = async (notes?: string) => {
    if (!selectedContent?.artifactId) return;
    const created = await client.requestApprovalForArtifact(selectedContent.artifactId, notes);
    setApprovals(prev => [created as any, ...prev]);
  };

  const handleActApproval = async (approvalId: string, action: 'approve' | 'reject', notes?: string) => {
    const updated = await client.actOnApproval(approvalId, action, notes);
    setApprovals(prev => prev.map(a => a.id === (updated as any).id ? (updated as any) : a));
  };

  const handleSaveContent = (content: string, metadata: any) => {
    if (selectedContent) {
      setContentItems(prev => prev.map(item => 
        item.id === selectedContent.id 
          ? { 
              ...item, 
              content, 
              metadata: { ...item.metadata, ...metadata },
              updated_at: new Date(),
              version: item.version + 1
            }
          : item
      ));
    }
  };

  const handlePublishContent = (content: string) => {
    if (selectedContent) {
      setContentItems(prev => prev.map(item => 
        item.id === selectedContent.id 
          ? { ...item, content, status: 'published', updated_at: new Date() }
          : item
      ));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  const publishedContent = contentItems.filter(c => c.status === 'published').length;
  const approvedContent = contentItems.filter(c => c.status === 'approved').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-gray-600">Incident ID: {params.id}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">{contentItems.length} documents</Badge>
          <Badge variant="outline">{publishedContent} published</Badge>
          <Badge variant="outline">{approvedContent} approved</Badge>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Social Media
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Document List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {contentItems.map((item) => {
                      const statusColors = {
                        draft: 'bg-gray-100 text-gray-800',
                        review: 'bg-yellow-100 text-yellow-800',
                        approved: 'bg-green-100 text-green-800',
                        published: 'bg-blue-100 text-blue-800',
                      };
                      
                      return (
                        <div
                          key={item.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedContent?.id === item.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedContent(item)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-sm">{item.title}</h3>
                            <Badge className={statusColors[item.status]}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600">
                            <div>Type: {item.contentType.replace('_', ' ')}</div>
                            <div>Version: {item.version}</div>
                            <div>Updated: {item.updated_at.toLocaleTimeString()}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Document Editor and Legal/Approvals */}
            <div className="lg:col-span-2 space-y-4">
              {selectedContent ? (
                <>
                  <EditorMDX
                    content={selectedContent.content}
                    title={selectedContent.title}
                    contentType={selectedContent.contentType}
                    onSave={handleSaveContent}
                    onPublish={handlePublishContent}
                    readOnly={selectedContent.status === 'published'}
                    showTrackChanges={true}
                    initialMetadata={selectedContent.metadata}
                  />

                  {selectedContent.artifactId && (
                    <PublishConsole
                      artifactId={selectedContent.artifactId}
                      title={selectedContent.title}
                      mdx={selectedContent.content}
                    />
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LegalFlags
                      content={selectedContent.content}
                      redlines={redlines}
                      onApplySuggestion={handleApplySuggestion}
                    />
                    <ApprovalsPanel
                      approvals={approvals}
                      onRequest={handleRequestApproval}
                      onAct={handleActApproval}
                    />
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Document</h3>
                    <p className="text-gray-600">Choose a document from the list to start editing.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="mt-6">
          <FAQBuilder
            faqItems={faqItems}
            onAddFAQ={setFaqItems as any}
            onUpdateFAQ={() => {}}
            onDeleteFAQ={() => {}}
            onReorderFAQ={() => {}}
            onPublishFAQ={() => {}}
          />
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <SocialComposer
            posts={socialPosts}
            onAddPost={() => {}}
            onUpdatePost={() => {}}
            onDeletePost={() => {}}
            onSchedulePost={() => {}}
            onSendPost={() => {}}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
