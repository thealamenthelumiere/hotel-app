import { DataSource } from 'typeorm';
import { parse } from 'pg-connection-string';
import * as dotenv from 'dotenv';
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const config = parse(databaseUrl);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.host ?? undefined,
  port: config.port ? parseInt(config.port, 10) : undefined,
  username: config.user ?? undefined,
  password: config.password ?? undefined,
  database: config.database ?? undefined,
  entities: [__dirname + '/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
  logging: true,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 10000,
  },
});
