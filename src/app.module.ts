import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ClickHouseModule } from "@oneralon/nestjs-clickhouse";
import * as process from "process";
import {StatsModule} from "./repositories/stats/stats.module";

@Module({
  imports: [
    StatsModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ClickHouseModule.forRoot({
      url: `${process.env.CLICKHOUSE_HOST}`,
      username: `${process.env.CLICKHOUSE_USER}`,
      password: `${process.env.CLICKHOUSE_PASSWORD}`,
      database: `${process.env.CLICKHOUSE_DB}`,
      debug: false,
      useGzip: true,
      format: 'json',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}