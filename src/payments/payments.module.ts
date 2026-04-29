import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaymentsApiController } from './payments.api.controller';
import { PaymentsResolver } from './payments.resolver';
import { Payment } from './entities/payment.entity';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), BookingsModule],
  controllers: [PaymentsController, PaymentsApiController],
  providers: [PaymentsService, PaymentsResolver],
})
export class PaymentsModule {}
