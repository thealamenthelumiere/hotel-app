import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';
import { GuestsApiController } from './guests.api.controller';
import { GuestsResolver } from './guests.resolver';
import { Guest } from './entities/guest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guest])],
  controllers: [GuestsController, GuestsApiController],
  providers: [GuestsService, GuestsResolver],
  exports: [GuestsService],
})
export class GuestsModule {}
