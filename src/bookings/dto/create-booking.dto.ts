export class CreateBookingDto {
  checkInDate: string; // формат YYYY-MM-DD
  checkOutDate: string;
  guestId: string;
  roomId: string;
  serviceIds?: string[]; // массив ID услуг
  status?: string; // по умолчанию 'pending'
  // totalPrice будет вычислен на сервере
}
