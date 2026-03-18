export class CreatePaymentDto {
  amount: number;
  method: string; // 'cash', 'card', 'transfer'
  status?: string;
  bookingId: string;
}
