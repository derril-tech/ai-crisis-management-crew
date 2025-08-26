import { Controller, Post, Body } from '@nestjs/common';
import * as AWS from 'aws-sdk';

class ExportDto {
  export_type!: 'pdf' | 'csv' | 'mdx' | 'zip';
  filename!: string;
  content?: string;
  rows?: any[];
}

@Controller('v1/exports')
export class ExportsController {
  private s3: AWS.S3;
  private bucket: string;

  constructor() {
    const endpoint = process.env.MINIO_ENDPOINT || 'http://localhost:9000';
    const accessKeyId = process.env.MINIO_ACCESS_KEY || 'minioadmin';
    const secretAccessKey = process.env.MINIO_SECRET_KEY || 'minioadmin';
    this.bucket = process.env.MINIO_BUCKET || 'crisis-crew';
    this.s3 = new AWS.S3({
      endpoint,
      accessKeyId,
      secretAccessKey,
      s3ForcePathStyle: true,
      sslEnabled: endpoint.startsWith('https'),
      signatureVersion: 'v4',
      region: process.env.AWS_REGION || 'us-east-1',
    } as any);
  }

  @Post()
  async createExport(@Body() dto: ExportDto) {
    // For MVP: accept raw content and rows; in future, call exporter task
    let body: Buffer;
    let contentType = 'application/octet-stream';
    let key = `exports/${dto.filename}`;

    if (dto.export_type === 'csv') {
      const rows = dto.rows || [];
      const csv = rows.length
        ? [Object.keys(rows[0]).join(','), ...rows.map(r => Object.values(r).join(','))].join('\n')
        : 'id,title\n1,Sample';
      body = Buffer.from(csv, 'utf-8');
      contentType = 'text/csv';
      if (!key.endsWith('.csv')) key += '.csv';
    } else if (dto.export_type === 'mdx') {
      body = Buffer.from(dto.content || '# Export', 'utf-8');
      contentType = 'text/mdx';
      if (!key.endsWith('.mdx')) key += '.mdx';
    } else if (dto.export_type === 'pdf') {
      body = Buffer.from(dto.content || 'PDF EXPORT', 'utf-8');
      contentType = 'application/pdf';
      if (!key.endsWith('.pdf')) key += '.pdf';
    } else if (dto.export_type === 'zip') {
      body = Buffer.from(dto.content || 'ZIP EXPORT', 'utf-8');
      contentType = 'application/zip';
      if (!key.endsWith('.zip')) key += '.zip';
    } else {
      throw new Error('Unsupported export type');
    }

    await this.s3.putObject({ Bucket: this.bucket, Key: key, Body: body, ContentType: contentType, ACL: 'public-read' }).promise();
    const endpoint = (this.s3.config.endpoint as any)?.href || process.env.MINIO_PUBLIC_ENDPOINT || '';
    const base = endpoint.replace(/\/$/, '');
    const url = `${base}/${this.bucket}/${key}`;
    return { url };
  }
}
