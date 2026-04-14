import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { parse } from 'pg-connection-string';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not defined');
    }

    const config = parse(databaseUrl);

    return {
      type: 'postgres',
      host: config.host ?? 'localhost',
      port: config.port ? parseInt(config.port, 10) : 5432,
      username: config.user ?? 'postgres',
      password: config.password ?? '',
      database: config.database ?? 'postgres',
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: true,
      migrationsRun: false,
      logging: true,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    };
  }
}
