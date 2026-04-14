import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { ServicesApiController } from './services.api.controller';
import { Service } from './entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  controllers: [ServicesController, ServicesApiController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
