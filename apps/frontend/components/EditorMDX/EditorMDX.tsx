'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Send, 
  MessageSquare, 
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar
} from 'lucide-react';

interface Change {
  id: string;
  type: 'insert' | 'delete' | 'replace';
  position: number;
  oldText?: string;
  newText?: string;
  author: string;
  timestamp: Date;
  comment?: string;
}

interface Comment {
  id: string;
  position: number;
  text: string;
  author: string;
  timestamp: Date;
  resolved: boolean;
}

interface EditorMDXProps {
  content: string;
  title: string;
  contentType: string;
  onSave: (content: string, metadata: any) => void;
  onPublish?: (content: string) => void;
  readOnly?: boolean;
  showTrackChanges?: boolean;
  initialMetadata?: any;
}

export function EditorMDX({ 
  content: initialContent, 
  title: initialTitle,
  contentType,
  onSave, 
  onPublish,
  readOnly = false,
  showTrackChanges = true,
  initialMetadata = {}
}: EditorMDXProps) {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState(initialTitle);
  const [metadata, setMetadata] = useState(initialMetadata);
  const [changes, setChanges] = useState<Change[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showChanges, setShowChanges] = useState(showTrackChanges);
  const [selectedText, setSelectedText] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Track changes when content changes
  useEffect(() => {
    if (content !== initialContent) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [content, initialContent]);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    
    // Simple change tracking (in a real implementation, you'd use a diff library)
    if (showChanges && newContent !== content) {
      const change: Change = {
        id: Date.now().toString(),
        type: 'replace',
        position: 0,
        oldText: content,
        newText: newContent,
        author: 'Current User',
        timestamp: new Date(),
      };
      setChanges(prev => [...prev, change]);
    }
  }, [content, showChanges]);

  const handleSave = useCallback(() => {
    onSave(content, {
      ...metadata,
      lastModified: new Date(),
      version: (metadata.version || 0) + 1,
      changes: changes.length,
    });
    setLastSaved(new Date());
    setIsDirty(false);
  }, [content, metadata, changes, onSave]);

  const handlePublish = useCallback(() => {
    if (onPublish) {
      onPublish(content);
    }
  }, [content, onPublish]);

  const addComment = useCallback(() => {
    if (newComment.trim() && selectedText) {
      const comment: Comment = {
        id: Date.now().toString(),
        position: content.indexOf(selectedText),
        text: newComment,
        author: 'Current User',
        timestamp: new Date(),
        resolved: false,
      };
      setComments(prev => [...prev, comment]);
      setNewComment('');
      setSelectedText('');
    }
  }, [newComment, selectedText, content]);

  const resolveComment = useCallback((commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId ? { ...comment, resolved: true } : comment
    ));
  }, []);

  const revertChange = useCallback((changeId: string) => {
    const change = changes.find(c => c.id === changeId);
    if (change && change.oldText !== undefined) {
      setContent(change.oldText);
      setChanges(prev => prev.filter(c => c.id !== changeId));
    }
  }, [changes]);

  const renderContentWithChanges = () => {
    if (!showChanges) {
      return (
        <div className="prose max-w-none">
          <pre className="whitespace-pre-wrap font-mono text-sm">{content}</pre>
        </div>
      );
    }

    // Simple rendering with change indicators
    return (
      <div className="prose max-w-none">
        <pre className="whitespace-pre-wrap font-mono text-sm">
          {content.split('\n').map((line, index) => (
            <div key={index} className="relative">
              {line}
              {changes.some(change => 
                change.newText?.includes(line) && 
                change.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
              ) && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  Modified
                </Badge>
              )}
            </div>
          ))}
        </pre>
      </div>
    );
  };

  const renderPreview = () => {
    // Simple markdown-like preview
    const previewContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');

    return (
      <div 
        className="prose max-w-none p-4 border rounded-lg bg-gray-50"
        dangerouslySetInnerHTML={{ __html: previewContent }}
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Editor</h2>
          <p className="text-gray-600">{contentType} - {title}</p>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && (
            <Badge variant="outline" className="text-orange-600">
              Unsaved changes
            </Badge>
          )}
          {lastSaved && (
            <Badge variant="outline" className="text-green-600">
              Saved {lastSaved.toLocaleTimeString()}
            </Badge>
          )}
        </div>
      </div>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Document Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Document title..."
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="contentType">Content Type</Label>
              <Select value={contentType} disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="holding_statement">Holding Statement</SelectItem>
                  <SelectItem value="press_release">Press Release</SelectItem>
                  <SelectItem value="internal_memo">Internal Memo</SelectItem>
                  <SelectItem value="faq">FAQ</SelectItem>
                  <SelectItem value="social_media">Social Media</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                value={metadata.version || 1}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Editor */}
      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="changes" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Changes ({changes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Content</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowChanges(!showChanges)}
                    >
                      {showChanges ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {showChanges ? 'Hide' : 'Show'} Changes
                    </Button>
                  </div>
                </div>
                
                {showChanges ? (
                  renderContentWithChanges()
                ) : (
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Enter your content here..."
                    rows={20}
                    className="font-mono text-sm"
                    disabled={readOnly}
                    onSelect={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      setSelectedText(target.value.substring(target.selectionStart, target.selectionEnd));
                    }}
                  />
                )}

                {selectedText && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Label>Add Comment for Selected Text</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1"
                      />
                      <Button size="sm" onClick={addComment}>
                        Add Comment
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <Card>
            <CardContent className="p-4">
              {renderPreview()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="changes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Track Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {changes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No changes tracked yet.</p>
                ) : (
                  changes.map((change) => (
                    <div key={change.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{change.author}</span>
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm text-gray-600">
                            {change.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => revertChange(change.id)}
                        >
                          <RotateCcw className="h-4 w-4" />
                          Revert
                        </Button>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Type:</span> {change.type}
                        {change.comment && (
                          <div className="mt-1 text-gray-600">
                            <span className="font-medium">Comment:</span> {change.comment}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Comments */}
      {comments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comments ({comments.filter(c => !c.resolved).length} active)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className={`border rounded-lg p-4 ${comment.resolved ? 'bg-gray-50' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{comment.author}</span>
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm text-gray-600">
                        {comment.timestamp.toLocaleString()}
                      </span>
                    </div>
                    {!comment.resolved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resolveComment(comment.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Resolve
                      </Button>
                    )}
                  </div>
                  <p className="text-sm">{comment.text}</p>
                  {comment.resolved && (
                    <Badge variant="secondary" className="mt-2">
                      Resolved
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={!isDirty || readOnly}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
          {onPublish && (
            <Button
              onClick={handlePublish}
              disabled={readOnly}
              variant="default"
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Publish
            </Button>
          )}
        </div>
        
        <div className="text-sm text-gray-600">
          {content.length} characters, {content.split(' ').length} words
        </div>
      </div>
    </div>
  );
}
