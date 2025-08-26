// Created automatically by Cursor AI (2024-12-19)
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  Incident, 
  IncidentFact, 
  Artifact, 
  Task, 
  Approval, 
  Redline 
} from '../types';
import { 
  CreateIncidentSchema,
  IncidentSchema,
  IncidentFactSchema,
  ArtifactSchema,
  TaskSchema,
  ApprovalSchema,
  RedlineSchema
} from '../schemas';

export class CrisisCrewClient {
  private client: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:3001/v1', token?: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  }

  // Incidents
  async createIncident(data: any): Promise<Incident> {
    const validated = CreateIncidentSchema.parse(data);
    const response: AxiosResponse<Incident> = await this.client.post('/incidents', validated);
    return IncidentSchema.parse(response.data);
  }

  async getIncident(id: string): Promise<Incident> {
    const response: AxiosResponse<Incident> = await this.client.get(`/incidents/${id}`);
    return IncidentSchema.parse(response.data);
  }

  // Artifacts
  async createArtifact(incidentId: string, data: any): Promise<Artifact> {
    const response: AxiosResponse<Artifact> = await this.client.post(`/incidents/${incidentId}/artifacts`, data);
    return ArtifactSchema.parse(response.data);
  }

  async getArtifacts(incidentId: string, kind?: string): Promise<Artifact[]> {
    const params = kind ? { kind } : {};
    const response: AxiosResponse<Artifact[]> = await this.client.get(`/incidents/${incidentId}/artifacts`, { params });
    return response.data.map(artifact => ArtifactSchema.parse(artifact));
  }

  // Tasks
  async createTask(incidentId: string, data: any): Promise<Task> {
    const response: AxiosResponse<Task> = await this.client.post(`/incidents/${incidentId}/tasks`, data);
    return TaskSchema.parse(response.data);
  }

  async getTasks(incidentId: string): Promise<Task[]> {
    const response: AxiosResponse<Task[]> = await this.client.get(`/incidents/${incidentId}/tasks`);
    return response.data.map(task => TaskSchema.parse(task));
  }

  // Approvals (artifact-scoped)
  async listApprovalsForArtifact(artifactId: string): Promise<Approval[]> {
    const response: AxiosResponse<Approval[]> = await this.client.get(`/approvals/artifact/${artifactId}`);
    return response.data.map(approval => ApprovalSchema.parse(approval));
  }

  async requestApprovalForArtifact(artifactId: string, notes?: string): Promise<Approval> {
    const response: AxiosResponse<Approval> = await this.client.post(`/approvals/artifact/${artifactId}/request`, { notes });
    return ApprovalSchema.parse(response.data);
  }

  async actOnApproval(approvalId: string, action: 'approve' | 'reject', notes?: string): Promise<Approval> {
    const response: AxiosResponse<Approval> = await this.client.post(`/approvals/${approvalId}/act`, { action, notes });
    return ApprovalSchema.parse(response.data);
  }

  // Legal Lint
  async lintArtifact(artifactId: string): Promise<Redline[]> {
    const response: AxiosResponse<Redline[]> = await this.client.post(`/artifacts/${artifactId}/legal/lint`);
    return response.data.map(redline => RedlineSchema.parse(redline));
  }

  // Publish
  async publishArtifact(artifactId: string, title: string, mdx: string, formats: Array<'mdx'|'html'> = ['mdx','html']): Promise<{ mdxUrl?: string; htmlUrl?: string; }> {
    const response: AxiosResponse<{ artifactId: string; mdxUrl?: string; htmlUrl?: string; }> = await this.client.post(`/publish/artifact`, { artifactId, title, mdx, formats });
    return { mdxUrl: response.data.mdxUrl, htmlUrl: response.data.htmlUrl };
  }

  // Monitor
  async getMentions(incidentId: string): Promise<any[]> {
    const response: AxiosResponse<{ mentions: any[] }> = await this.client.get(`/monitor/mentions`, { params: { incidentId } });
    return response.data.mentions;
  }

  async getRumors(incidentId: string): Promise<any[]> {
    const response: AxiosResponse<{ rumors: any[] }> = await this.client.get(`/monitor/rumors`, { params: { incidentId } });
    return response.data.rumors;
  }

  async getSentiment(incidentId: string): Promise<{ t: string; value: number }[]> {
    const response: AxiosResponse<{ series: { t: string; value: number }[] }> = await this.client.get(`/monitor/sentiment`, { params: { incidentId } });
    return response.data.series;
  }

  // Exports
  async createExport(export_type: 'pdf'|'csv'|'mdx'|'zip', filename: string, content?: string, rows?: any[]): Promise<{ url: string }> {
    const response: AxiosResponse<{ url: string }> = await this.client.post(`/exports`, { export_type, filename, content, rows });
    return response.data;
  }
}
