import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PaymentsService } from './payments.service';
import { PaymentType } from './graphql/payment.type';
import { BookingType } from '../bookings/graphql/booking.type';
import { CreatePaymentInput, UpdatePaymentInput } from './graphql/payment.input';
import { Payment } from './entities/payment.entity';

@Resolver(() => PaymentType)
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Query(() => [PaymentType], {
    name: 'payments',
    description: 'Получить список всех платежей',
    complexity: 2,
  })
  findAll() {
    return this.paymentsService.findAll();
  }

  @Query(() => PaymentType, {
    name: 'payment',
    description: 'Получить платёж по ID',
    complexity: 1,
  })
  findOne(@Args('id', { type: () => ID, description: 'UUID платежа' }) id: string) {
    return this.paymentsService.findOne(id);
  }

  @ResolveField(() => BookingType, { nullable: true, description: 'Бронирование', complexity: 3 })
  async booking(@Parent() payment: Payment): Promise<BookingType | null> {
    if (payment.booking) return payment.booking as any;
    const full = await this.paymentsService.findOne(payment.id);
    return full.booking as any;
  }

  @Mutation(() => PaymentType, { description: 'Создать платёж' })
  createPayment(@Args('input') input: CreatePaymentInput) {
    return this.paymentsService.create(input as any);
  }

  @Mutation(() => PaymentType, { description: 'Обновить платёж' })
  updatePayment(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdatePaymentInput,
  ) {
    return this.paymentsService.update(id, input as any);
  }

  @Mutation(() => PaymentType, {
    description: 'Подтвердить оплату (статус → paid)',
  })
  confirmPayment(@Args('id', { type: () => ID }) id: string) {
    return this.paymentsService.update(id, { status: 'paid' } as any);
  }

  @Mutation(() => PaymentType, {
    description: 'Вернуть средства (статус → refunded)',
  })
  refundPayment(@Args('id', { type: () => ID }) id: string) {
    return this.paymentsService.update(id, { status: 'refunded' } as any);
  }

  @Mutation(() => Boolean, { description: 'Удалить платёж' })
  async deletePayment(@Args('id', { type: () => ID }) id: string) {
    await this.paymentsService.remove(id);
    return true;
  }
}
