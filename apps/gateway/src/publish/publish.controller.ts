import { Controller, Post, Body } from '@nestjs/common';
import { PublishService } from './publish.service';

class PublishDto {
  artifactId!: string;
  title!: string;
  mdx!: string;
  formats?: Array<'mdx' | 'html'>;
}

@Controller('v1/publish')
export class PublishController {
  constructor(private readonly publishService: PublishService) {}

  @Post('artifact')
  async publishArtifact(@Body() dto: PublishDto) {
    const urls = await this.publishService.publishArtifactContent(dto.artifactId, dto.title, dto.mdx, dto.formats || ['mdx', 'html']);
    return { artifactId: dto.artifactId, ...urls };
  }
}
