import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { IncidentsModule } from './incidents/incidents.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { LegalModule } from './legal/legal.module';
import { PublishModule } from './publish/publish.module';
import { MonitorModule } from './monitor/monitor.module';
import { ExportsModule } from './exports/exports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    AuthModule,
    IncidentsModule,
    ApprovalsModule,
    LegalModule,
    PublishModule,
    MonitorModule,
    ExportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
