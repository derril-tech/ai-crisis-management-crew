import { Controller, Post, Param } from '@nestjs/common';

interface Redline {
  start: number;
  end: number;
  original: string;
  suggestion: string;
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const RISKY_TERMS: Record<string, { suggestion: string; severity: Redline['severity'] }> = {
  breach: { suggestion: 'security incident', severity: 'high' },
  hack: { suggestion: 'unauthorized access', severity: 'high' },
  stolen: { suggestion: 'accessed', severity: 'high' },
  guarantee: { suggestion: 'aim to', severity: 'medium' },
  promise: { suggestion: 'intend to', severity: 'medium' },
  never: { suggestion: 'do not typically', severity: 'low' },
};

function lintText(text: string): Redline[] {
  const lowered = text.toLowerCase();
  const results: Redline[] = [];
  Object.entries(RISKY_TERMS).forEach(([term, cfg]) => {
    let start = 0;
    while (true) {
      const idx = lowered.indexOf(term, start);
      if (idx === -1) break;
      const end = idx + term.length;
      results.push({
        start: idx,
        end,
        original: text.slice(idx, end),
        suggestion: cfg.suggestion,
        reason: `Replace '${term}' with '${cfg.suggestion}' to reduce liability/exposure.`,
        severity: cfg.severity,
      });
      start = end;
    }
  });
  return results;
}

@Controller('v1/artifacts')
export class LegalController {
  @Post(':artifactId/legal/lint')
  async lintArtifact(): Promise<Redline[]> {
    // Stub: In a real implementation, fetch artifact content by ID.
    const sample = 'We discovered a data breach and hackers stole data. We guarantee this will never happen again.';
    return lintText(sample);
  }
}
