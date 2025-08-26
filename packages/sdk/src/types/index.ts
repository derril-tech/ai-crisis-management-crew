// Created automatically by Cursor AI (2024-12-19)

export interface Incident {
  id: string;
  title: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'created' | 'triage' | 'drafting' | 'legal_review' | 'approvals' | 'ready' | 'published' | 'monitoring' | 'resolved' | 'exported' | 'archived';
  detected_at?: string;
  created_at: string;
  updated_at: string;
}

export interface IncidentFact {
  id: string;
  incident_id: string;
  label: string;
  value: string;
  confidence: 'low' | 'medium' | 'high';
  source: string;
  is_unknown: boolean;
  updated_at: string;
}

export interface Artifact {
  id: string;
  incident_id: string;
  kind: 'holding' | 'press_release' | 'internal' | 'faq' | 'talking_points' | 'social_pack' | 'status_update';
  version: number;
  author_id: string;
  text: string;
  mdx?: string;
  meta?: Record<string, any>;
  created_at: string;
}

export interface Task {
  id: string;
  incident_id: string;
  title: string;
  owner_id?: string;
  due_at?: string;
  depends_on?: string;
  status: 'todo' | 'doing' | 'blocked' | 'done';
  priority: number;
  channel_hint?: string;
}

export interface Approval {
  id: string;
  incident_id: string;
  artifact_kind: string;
  order_idx: number;
  role_required: string;
  user_id?: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  acted_at?: string;
}

export interface Redline {
  id: string;
  artifact_id: string;
  agent: string;
  start_pos: number;
  end_pos: number;
  suggestion: string;
  risk_tag: string;
  applied: boolean;
}
