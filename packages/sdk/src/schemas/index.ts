// Created automatically by Cursor AI (2024-12-19)
import { z } from 'zod';

export const IncidentSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  type: z.string().min(1),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['created', 'triage', 'drafting', 'legal_review', 'approvals', 'ready', 'published', 'monitoring', 'resolved', 'exported', 'archived']),
  detected_at: z.string().datetime().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const CreateIncidentSchema = z.object({
  title: z.string().min(1),
  type: z.string().min(1),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('high'),
  detected_at: z.string().datetime().optional(),
});

export const IncidentFactSchema = z.object({
  id: z.string().uuid(),
  incident_id: z.string().uuid(),
  label: z.string().min(1),
  value: z.string(),
  confidence: z.enum(['low', 'medium', 'high']),
  source: z.string(),
  is_unknown: z.boolean(),
  updated_at: z.string().datetime(),
});

export const ArtifactSchema = z.object({
  id: z.string().uuid(),
  incident_id: z.string().uuid(),
  kind: z.enum(['holding', 'press_release', 'internal', 'faq', 'talking_points', 'social_pack', 'status_update']),
  version: z.number().int().positive(),
  author_id: z.string().uuid(),
  text: z.string(),
  mdx: z.string().optional(),
  meta: z.record(z.any()).optional(),
  created_at: z.string().datetime(),
});

export const TaskSchema = z.object({
  id: z.string().uuid(),
  incident_id: z.string().uuid(),
  title: z.string().min(1),
  owner_id: z.string().uuid().optional(),
  due_at: z.string().datetime().optional(),
  depends_on: z.string().uuid().optional(),
  status: z.enum(['todo', 'doing', 'blocked', 'done']),
  priority: z.number().int().min(1).max(5),
  channel_hint: z.string().optional(),
});

export const ApprovalSchema = z.object({
  id: z.string().uuid(),
  incident_id: z.string().uuid(),
  artifact_kind: z.string(),
  order_idx: z.number().int().positive(),
  role_required: z.string(),
  user_id: z.string().uuid().optional(),
  status: z.enum(['pending', 'approved', 'rejected']),
  comment: z.string().optional(),
  acted_at: z.string().datetime().optional(),
});

export const RedlineSchema = z.object({
  id: z.string().uuid(),
  artifact_id: z.string().uuid(),
  agent: z.string(),
  start_pos: z.number().int().nonnegative(),
  end_pos: z.number().int().nonnegative(),
  suggestion: z.string(),
  risk_tag: z.string(),
  applied: z.boolean(),
});
