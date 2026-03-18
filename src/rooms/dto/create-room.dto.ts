export class CreateRoomDto {
  number: string;
  type: string;
  pricePerNight: number;
  capacity: number;
  description?: string;
}
