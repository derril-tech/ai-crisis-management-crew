'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Twitter, 
  Linkedin, 
  MessageSquare, 
  Send, 
  Copy, 
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Hash,
  Image,
  Link,
  Calendar,
  Users,
  Edit
} from 'lucide-react';

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

interface SocialComposerProps {
  posts: SocialPost[];
  onAddPost: (post: Omit<SocialPost, 'id' | 'created_at'>) => void;
  onUpdatePost: (id: string, updates: Partial<SocialPost>) => void;
  onDeletePost: (id: string) => void;
  onSchedulePost: (id: string, scheduledTime: Date) => void;
  onSendPost: (id: string) => void;
}

const PLATFORMS = [
  { value: 'twitter', label: 'Twitter/X', icon: Twitter, maxChars: 280, color: 'bg-blue-100 text-blue-800' },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, maxChars: 3000, color: 'bg-blue-100 text-blue-800' },
  { value: 'facebook', label: 'Facebook', icon: MessageSquare, maxChars: 63206, color: 'bg-blue-100 text-blue-800' },
  { value: 'instagram', label: 'Instagram', icon: Image, maxChars: 2200, color: 'bg-pink-100 text-pink-800' },
];

const TONES = [
  'professional',
  'empathetic',
  'transparent',
  'urgent',
  'reassuring',
  'informative',
];

const AUDIENCE_OPTIONS = [
  'customers',
  'partners',
  'employees',
  'media',
  'investors',
  'general',
];

const SUGGESTED_HASHTAGS = [
  '#ServiceUpdate',
  '#CustomerFirst',
  '#IncidentResponse',
  '#Transparency',
  '#ThankYou',
  '#Update',
  '#Status',
  '#Support',
];

export function SocialComposer({ 
  posts, 
  onAddPost, 
  onUpdatePost, 
  onDeletePost, 
  onSchedulePost,
  onSendPost
}: SocialComposerProps) {
  const [newPost, setNewPost] = useState({
    platform: 'twitter',
    content: '',
    hashtags: [] as string[],
    character_count: 0,
    includes_media: false,
    media_url: '',
    scheduled_time: undefined as Date | undefined,
    status: 'draft' as const,
    target_audience: [] as string[],
    tone: 'professional',
  });

  const [selectedPlatform, setSelectedPlatform] = useState('twitter');
  const [showPreview, setShowPreview] = useState(false);

  // Update character count when content changes
  useEffect(() => {
    const count = newPost.content.length;
    setNewPost(prev => ({ ...prev, character_count: count }));
  }, [newPost.content]);

  const handleAddPost = () => {
    if (newPost.content.trim()) {
      onAddPost(newPost);
      setNewPost({
        platform: 'twitter',
        content: '',
        hashtags: [],
        character_count: 0,
        includes_media: false,
        media_url: '',
        scheduled_time: undefined,
        status: 'draft',
        target_audience: [],
        tone: 'professional',
      });
    }
  };

  const handleAddHashtag = (hashtag: string) => {
    if (!newPost.hashtags.includes(hashtag)) {
      setNewPost(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtag]
      }));
    }
  };

  const handleRemoveHashtag = (hashtag: string) => {
    setNewPost(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(h => h !== hashtag)
    }));
  };

  const toggleAudience = (audience: string) => {
    setNewPost(prev => ({
      ...prev,
      target_audience: prev.target_audience.includes(audience)
        ? prev.target_audience.filter(a => a !== audience)
        : [...prev.target_audience, audience]
    }));
  };

  const getPlatformConfig = (platform: string) => {
    return PLATFORMS.find(p => p.value === platform) || PLATFORMS[0];
  };

  const getCharacterLimit = (platform: string) => {
    return getPlatformConfig(platform).maxChars;
  };

  const getCharacterCountColor = (count: number, limit: number) => {
    const percentage = (count / limit) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 80) return 'text-orange-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const renderPreview = (post: SocialPost) => {
    const platformConfig = getPlatformConfig(post.platform);
    const PlatformIcon = platformConfig.icon;

    return (
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <PlatformIcon className="h-5 w-5" />
          <span className="font-medium">{platformConfig.label}</span>
          <Badge className={platformConfig.color}>
            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
          </Badge>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-sm">{post.content}</p>
          {post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {post.hashtags.map((hashtag) => (
                <span key={hashtag} className="text-blue-600 text-sm">{hashtag}</span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <span>{post.character_count}/{getCharacterLimit(post.platform)} characters</span>
          {post.scheduled_time && (
            <span>Scheduled: {post.scheduled_time.toLocaleString()}</span>
          )}
        </div>
      </div>
    );
  };

  const postsByStatus = {
    draft: posts.filter(p => p.status === 'draft'),
    scheduled: posts.filter(p => p.status === 'scheduled'),
    sent: posts.filter(p => p.status === 'sent'),
    failed: posts.filter(p => p.status === 'failed'),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Social Media Composer</h2>
        <div className="flex gap-2">
          <Badge variant="outline">{posts.length} posts</Badge>
          <Badge variant="outline">{posts.filter(p => p.status === 'sent').length} sent</Badge>
          <Badge variant="outline">{posts.filter(p => p.status === 'scheduled').length} scheduled</Badge>
        </div>
      </div>

      {/* Compose new post */}
      <Card>
        <CardHeader>
          <CardTitle>Compose New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Platform selection */}
            <div>
              <Label>Platform</Label>
              <div className="flex gap-2 mt-2">
                {PLATFORMS.map((platform) => {
                  const PlatformIcon = platform.icon;
                  return (
                    <Button
                      key={platform.value}
                      variant={newPost.platform === platform.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setNewPost(prev => ({ ...prev, platform: platform.value }))}
                      className="flex items-center gap-2"
                    >
                      <PlatformIcon className="h-4 w-4" />
                      {platform.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                placeholder="What would you like to share?"
                rows={4}
                maxLength={getCharacterLimit(newPost.platform)}
              />
              <div className="flex items-center justify-between mt-1">
                <span className={`text-sm ${getCharacterCountColor(newPost.character_count, getCharacterLimit(newPost.platform))}`}>
                  {newPost.character_count}/{getCharacterLimit(newPost.platform)} characters
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {showPreview ? 'Hide' : 'Show'} Preview
                </Button>
              </div>
            </div>

            {/* Hashtags */}
            <div>
              <Label>Hashtags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {SUGGESTED_HASHTAGS.map((hashtag) => (
                  <Button
                    key={hashtag}
                    variant={newPost.hashtags.includes(hashtag) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleAddHashtag(hashtag)}
                  >
                    <Hash className="h-3 w-3 mr-1" />
                    {hashtag}
                  </Button>
                ))}
              </div>
              {newPost.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {newPost.hashtags.map((hashtag) => (
                    <Badge
                      key={hashtag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveHashtag(hashtag)}
                    >
                      {hashtag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Additional options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Tone</Label>
                <Select value={newPost.tone} onValueChange={(value) => setNewPost(prev => ({ ...prev, tone: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((tone) => (
                      <SelectItem key={tone} value={tone}>
                        {tone.charAt(0).toUpperCase() + tone.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Target Audience</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {AUDIENCE_OPTIONS.map((audience) => (
                    <div key={audience} className="flex items-center space-x-1">
                      <Checkbox
                        id={audience}
                        checked={newPost.target_audience.includes(audience)}
                        onCheckedChange={() => toggleAudience(audience)}
                      />
                      <Label htmlFor={audience} className="text-sm">
                        {audience.charAt(0).toUpperCase() + audience.slice(1)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleAddPost} className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Save Draft
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="mt-4">
                <Label>Preview</Label>
                <div className="mt-2">
                  {renderPreview({
                    id: 'preview',
                    ...newPost,
                    created_at: new Date(),
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Posts by status */}
      <Tabs defaultValue="draft" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="draft">
            Draft ({postsByStatus.draft.length})
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            Scheduled ({postsByStatus.scheduled.length})
          </TabsTrigger>
          <TabsTrigger value="sent">
            Sent ({postsByStatus.sent.length})
          </TabsTrigger>
          <TabsTrigger value="failed">
            Failed ({postsByStatus.failed.length})
          </TabsTrigger>
        </TabsList>

        {['draft', 'scheduled', 'sent', 'failed'].map((status) => (
          <TabsContent key={status} value={status} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {status === 'draft' && <Edit className="h-5 w-5" />}
                  {status === 'scheduled' && <Clock className="h-5 w-5" />}
                  {status === 'sent' && <CheckCircle className="h-5 w-5" />}
                  {status === 'failed' && <AlertTriangle className="h-5 w-5" />}
                  {status.charAt(0).toUpperCase() + status.slice(1)} Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {postsByStatus[status as keyof typeof postsByStatus].map((post) => (
                    <div key={post.id} className="border rounded-lg p-4">
                      {renderPreview(post)}
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{post.target_audience.join(', ') || 'General audience'}</span>
                          <span>•</span>
                          <span>Tone: {post.tone}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {status === 'draft' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => onSendPost(post.id)}
                              >
                                <Send className="h-4 w-4 mr-1" />
                                Send Now
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onSchedulePost(post.id, new Date(Date.now() + 30 * 60 * 1000))}
                              >
                                <Calendar className="h-4 w-4 mr-1" />
                                Schedule
                              </Button>
                            </>
                          )}
                          {status === 'scheduled' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onSendPost(post.id)}
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Send Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {postsByStatus[status as keyof typeof postsByStatus].length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No {status} posts found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
