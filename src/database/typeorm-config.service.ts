import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { parse } from 'pg-connection-string';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const databaseUrl = process.env.DATABASE_URL;
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
      synchronize: false,
      migrationsRun: false,
      logging: true,
    };
  }
}
