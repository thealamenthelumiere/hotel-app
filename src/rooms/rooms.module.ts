import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { RoomsApiController } from './rooms.api.controller';
import { RoomsResolver } from './rooms.resolver';
import { Room } from './entities/room.entity';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), StorageModule],
  controllers: [RoomsController, RoomsApiController],
  providers: [RoomsService, RoomsResolver],
  exports: [RoomsService],
})
export class RoomsModule {}
