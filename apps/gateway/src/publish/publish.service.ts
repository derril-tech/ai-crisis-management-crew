import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class PublishService {
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

  async uploadObject(key: string, body: Buffer | string, contentType: string): Promise<string> {
    await this.s3
      .putObject({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        ACL: 'public-read',
      })
      .promise();

    const endpoint = (this.s3.config.endpoint as any)?.href || process.env.MINIO_PUBLIC_ENDPOINT || '';
    const base = endpoint.replace(/\/$/, '');
    return `${base}/${this.bucket}/${key}`;
  }

  renderHtmlFromMdx(title: string, mdx: string): string {
    return `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<title>${title}</title><meta name="viewport" content="width=device-width, initial-scale=1" />
<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;max-width:740px;margin:40px auto;padding:0 16px;line-height:1.6}</style>
</head><body><pre>${mdx.replace(/</g, '&lt;')}</pre></body></html>`;
  }

  async publishArtifactContent(artifactId: string, title: string, mdx: string, formats: Array<'mdx' | 'html'> = ['mdx','html']) {
    const results: Record<string, string> = {};

    if (formats.includes('mdx')) {
      const key = `artifacts/${artifactId}.mdx`;
      results.mdxUrl = await this.uploadObject(key, mdx, 'text/mdx');
    }

    if (formats.includes('html')) {
      const html = this.renderHtmlFromMdx(title, mdx);
      const key = `artifacts/${artifactId}.html`;
      results.htmlUrl = await this.uploadObject(key, html, 'text/html');
    }

    return results;
  }
}
