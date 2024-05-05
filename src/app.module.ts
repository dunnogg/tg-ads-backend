import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {ClickHouseConnectionProtocol, ClickHouseModule} from '@depyronick/nestjs-clickhouse';
import * as process from 'process';
import {StatsController} from "./repositories/stats/stats.controller";
import {StatsService} from "./repositories/stats/stats.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ClickHouseModule.register([{
      host: `${process.env.CLICKHOUSE_HOST}`,
      port: 8443,
      username: `${process.env.CLICKHOUSE_USER}`,
      password: `${process.env.CLICKHOUSE_PASSWORD}`,
      name: `${process.env.CLICKHOUSE_DB}`,
      httpConfig: {
        protocol: ClickHouseConnectionProtocol.HTTPS,
      },
    }]),
  ],
  controllers: [AppController, StatsController],
  providers: [AppService, StatsService],
})
export class AppModule {}
