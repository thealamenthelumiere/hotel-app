import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { AuthApiController } from './auth.api.controller';

export interface AuthModuleOptions {
  jwtSecret: string;
  jwtExpiresIn?: string;
}

// Динамический модуль: конфигурация вычитывается из переменных среды при старте
// и передаётся через AuthModule.forRoot(options)
@Module({})
export class AuthModule {
  static forRoot(options: AuthModuleOptions): DynamicModule {
    return {
      module: AuthModule,
      global: true,
      imports: [
        UsersModule,
        JwtModule.register({
          secret: options.jwtSecret,
          signOptions: { expiresIn: (options.jwtExpiresIn ?? '1d') as JwtModuleOptions['signOptions'] extends { expiresIn?: infer E } ? E : string },
        } as JwtModuleOptions),
      ],
      controllers: [AuthApiController],
      providers: [AuthService, AuthGuard, RolesGuard],
      exports: [AuthService, AuthGuard, RolesGuard],
    };
  }
}
