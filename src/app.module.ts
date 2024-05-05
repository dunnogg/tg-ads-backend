import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {ClickHouseConnectionProtocol, ClickHouseModule} from '@depyronick/nestjs-clickhouse';
import * as process from 'process';
import { StatsModule } from './repositories/stats/stats.module';

@Module({
  imports: [
    StatsModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ClickHouseModule.register([{
      host: `${process.env.CLICKHOUSE_HOST}`,
      username: `${process.env.CLICKHOUSE_USER}`,
      password: `${process.env.CLICKHOUSE_PASSWORD}`,
      name: `${process.env.CLICKHOUSE_DB}`,
      httpConfig: {
        protocol: ClickHouseConnectionProtocol.HTTPS,
      },
    }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
