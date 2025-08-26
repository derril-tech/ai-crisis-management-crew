'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  HelpCircle, 
  MessageSquare, 
  Shield, 
  Clock,
  AlertTriangle,
  CheckCircle,
  MoveUp,
  MoveDown,
  Copy,
  Eye
} from 'lucide-react';

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

interface FAQBuilderProps {
  faqItems: FAQItem[];
  onAddFAQ: (faq: Omit<FAQItem, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateFAQ: (id: string, updates: Partial<FAQItem>) => void;
  onDeleteFAQ: (id: string) => void;
  onReorderFAQ: (fromIndex: number, toIndex: number) => void;
  onPublishFAQ: (items: FAQItem[]) => void;
}

const FAQ_CATEGORIES = [
  'general',
  'timeline',
  'security',
  'services',
  'support',
  'compensation',
  'technical',
  'legal',
];

const FAQ_PRIORITIES = [
  { value: 1, label: 'Critical', color: 'bg-red-100 text-red-800' },
  { value: 2, label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 3, label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 4, label: 'Low', color: 'bg-blue-100 text-blue-800' },
  { value: 5, label: 'Info', color: 'bg-gray-100 text-gray-800' },
];

const FAQ_STATUSES = [
  { value: 'draft', label: 'Draft', icon: Edit, color: 'bg-gray-100 text-gray-800' },
  { value: 'review', label: 'In Review', icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'approved', label: 'Approved', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  { value: 'published', label: 'Published', icon: Eye, color: 'bg-blue-100 text-blue-800' },
];

const SUGGESTED_QUESTIONS = [
  {
    question: "What happened?",
    answer: "We experienced a technical issue that affected some of our services. Our team is actively working to resolve this.",
    category: "general",
    priority: 1
  },
  {
    question: "When will this be fixed?",
    answer: "Our technical teams are working as quickly as possible to resolve this issue. We will provide updates as soon as we have more information about the timeline for resolution.",
    category: "timeline",
    priority: 1
  },
  {
    question: "Is my data safe?",
    answer: "We have no indication that any customer data has been compromised. Our security teams are monitoring the situation closely and will notify affected customers immediately if this changes.",
    category: "security",
    priority: 2
  },
  {
    question: "Which services are affected?",
    answer: "The following services may be experiencing issues: [LIST_SERVICES]. We're working to restore all services as quickly as possible.",
    category: "services",
    priority: 2
  },
  {
    question: "What should I do if I'm experiencing issues?",
    answer: "If you're experiencing urgent problems, please contact our emergency support line. For non-urgent issues, our regular support channels remain available.",
    category: "support",
    priority: 2
  },
  {
    question: "Will I be compensated for this downtime?",
    answer: "We are evaluating the impact of this incident and will communicate any compensation or credits to affected customers once our investigation is complete.",
    category: "compensation",
    priority: 3
  }
];

export function FAQBuilder({ 
  faqItems, 
  onAddFAQ, 
  onUpdateFAQ, 
  onDeleteFAQ, 
  onReorderFAQ,
  onPublishFAQ
}: FAQBuilderProps) {
  const [newFAQ, setNewFAQ] = useState({
    question: '',
    answer: '',
    category: 'general',
    priority: 3,
    status: 'draft' as const,
    tags: [] as string[],
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddFAQ = () => {
    if (newFAQ.question && newFAQ.answer) {
      onAddFAQ(newFAQ);
      setNewFAQ({
        question: '',
        answer: '',
        category: 'general',
        priority: 3,
        status: 'draft',
        tags: [],
      });
    }
  };

  const handleAddSuggestion = (suggestion: any) => {
    setNewFAQ({
      question: suggestion.question,
      answer: suggestion.answer,
      category: suggestion.category,
      priority: suggestion.priority,
      status: 'draft',
      tags: [],
    });
    setShowSuggestions(false);
  };

  const getPriorityColor = (priority: number) => {
    const priorityConfig = FAQ_PRIORITIES.find(p => p.value === priority);
    return priorityConfig?.color || 'bg-gray-100 text-gray-800';
  };

  const getPriorityLabel = (priority: number) => {
    const priorityConfig = FAQ_PRIORITIES.find(p => p.value === priority);
    return priorityConfig?.label || 'Unknown';
  };

  const getStatusColor = (status: string) => {
    const statusConfig = FAQ_STATUSES.find(s => s.value === status);
    return statusConfig?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const statusConfig = FAQ_STATUSES.find(s => s.value === status);
    return statusConfig?.icon || Edit;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general':
        return <HelpCircle className="h-4 w-4" />;
      case 'timeline':
        return <Clock className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'services':
        return <MessageSquare className="h-4 w-4" />;
      case 'support':
        return <HelpCircle className="h-4 w-4" />;
      case 'compensation':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  const filteredFAQItems = selectedCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === selectedCategory);

  const approvedItems = faqItems.filter(item => item.status === 'approved');
  const publishedItems = faqItems.filter(item => item.status === 'published');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">FAQ Builder</h2>
        <div className="flex gap-2">
          <Badge variant="outline">{faqItems.length} questions</Badge>
          <Badge variant="outline">{approvedItems.length} approved</Badge>
          <Badge variant="outline">{publishedItems.length} published</Badge>
        </div>
      </div>

      {/* Add new FAQ form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New FAQ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Question & Answer</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSuggestions(!showSuggestions)}
              >
                {showSuggestions ? 'Hide' : 'Show'} Suggestions
              </Button>
            </div>

            {showSuggestions && (
              <div className="p-4 border rounded-lg bg-gray-50">
                <Label className="mb-2 block">Suggested Questions</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {SUGGESTED_QUESTIONS.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto p-2"
                      onClick={() => handleAddSuggestion(suggestion)}
                    >
                      <div>
                        <div className="font-medium text-sm">{suggestion.question}</div>
                        <div className="text-xs text-gray-600 truncate">{suggestion.answer}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={newFAQ.question}
                onChange={(e) => setNewFAQ(prev => ({ ...prev, question: e.target.value }))}
                placeholder="What is the most common question about this incident?"
              />
            </div>

            <div>
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={newFAQ.answer}
                onChange={(e) => setNewFAQ(prev => ({ ...prev, answer: e.target.value }))}
                placeholder="Provide a clear, helpful answer..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newFAQ.category} onValueChange={(value) => setNewFAQ(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FAQ_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newFAQ.priority.toString()} onValueChange={(value) => setNewFAQ(prev => ({ ...prev, priority: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FAQ_PRIORITIES.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value.toString()}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddFAQ} className="w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  Add FAQ
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Management */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({faqItems.length})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({faqItems.filter(f => f.status === 'draft').length})</TabsTrigger>
          <TabsTrigger value="review">Review ({faqItems.filter(f => f.status === 'review').length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedItems.length})</TabsTrigger>
          <TabsTrigger value="published">Published ({publishedItems.length})</TabsTrigger>
        </TabsList>

        {['all', 'draft', 'review', 'approved', 'published'].map((status) => (
          <TabsContent key={status} value={status} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{status.charAt(0).toUpperCase() + status.slice(1)} FAQs</span>
                  {status === 'approved' && approvedItems.length > 0 && (
                    <Button
                      onClick={() => onPublishFAQ(approvedItems)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Publish All
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqItems
                    .filter(item => status === 'all' || item.status === status)
                    .sort((a, b) => a.priority - b.priority)
                    .map((item, index) => {
                      const StatusIcon = getStatusIcon(item.status);
                      return (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(item.category)}
                              <h3 className="font-medium">{item.question}</h3>
                              <Badge className={getPriorityColor(item.priority)}>
                                {getPriorityLabel(item.priority)}
                              </Badge>
                              <Badge className={getStatusColor(item.status)}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteFAQ(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{item.answer}</p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                              <span>Category: {item.category}</span>
                              <span>Updated: {item.updated_at.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {index > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onReorderFAQ(index, index - 1)}
                                >
                                  <MoveUp className="h-3 w-3" />
                                </Button>
                              )}
                              {index < faqItems.length - 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onReorderFAQ(index, index + 1)}
                                >
                                  <MoveDown className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  
                  {faqItems.filter(item => status === 'all' || item.status === status).length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No {status} FAQs found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </Button>
            {FAQ_CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {getCategoryIcon(category)}
                {category.charAt(0).toUpperCase() + category.slice(1)}
                <Badge variant="secondary" className="ml-1">
                  {faqItems.filter(item => item.category === category).length}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
