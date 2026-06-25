import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GraphQLError } from 'graphql';
import {
  fieldExtensionsEstimator,
  getComplexity,
  simpleEstimator,
} from 'graphql-query-complexity';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { GuestsModule } from './guests/guests.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { RoomsModule } from './rooms/rooms.module';
import { ServicesModule } from './services/services.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { AuthSessionMiddleware } from './auth/auth-session.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TimingInterceptor } from './common/interceptors/timing.interceptor';
import { EtagInterceptor } from './common/interceptors/etag.interceptor';

const MAX_COMPLEXITY = 50;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 5000,
      max: 100,
    }),
    // Динамический модуль аутентификации: конфигурация вычитывается при старте
    AuthModule.forRoot({
      jwtSecret: process.env.JWT_SECRET || 'hotel-jwt-secret-change-in-production',
      jwtExpiresIn: '1d',
    }),
    GuestsModule,
    BookingsModule,
    PaymentsModule,
    RoomsModule,
    ServicesModule,
    UsersModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: false,
      introspection: true,
      csrfPrevention: false,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
        {
          async requestDidStart() {
            return {
              async didResolveOperation({ request, document, schema }: any) {
                if (request.operationName === 'IntrospectionQuery') return;

                const complexity = getComplexity({
                  schema,
                  operationName: request.operationName,
                  query: document,
                  variables: request.variables,
                  estimators: [
                    fieldExtensionsEstimator(),
                    simpleEstimator({ defaultComplexity: 1 }),
                  ],
                });
                if (complexity > MAX_COMPLEXITY) {
                  throw new GraphQLError(
                    `Сложность запроса (${complexity}) превышает максимально допустимую (${MAX_COMPLEXITY})`,
                  );
                }
              },
            };
          },
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Глобальный guard аутентификации: GET /api/* публичны, мутации требуют JWT
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_INTERCEPTOR, useClass: TimingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: EtagInterceptor },
  ],
})
export class AppModule implements NestModule {
  // Middleware для MVC-маршрутов: перенаправляет неаутентифицированных пользователей
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthSessionMiddleware)
      .forRoutes('constructor', 'bookings');
  }
}
