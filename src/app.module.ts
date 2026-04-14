import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { AppController } from './app.controller';
import { AppService } from './app.service';

const MAX_COMPLEXITY = 50;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
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
          // Проверка сложности запроса перед выполнением
          async requestDidStart() {
            return {
              async didResolveOperation({ request, document, schema }: any) {
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
    GuestsModule,
    BookingsModule,
    PaymentsModule,
    RoomsModule,
    ServicesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
