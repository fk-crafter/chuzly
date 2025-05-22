export class CreateEventDto {
  eventName: string;
  options: {
    name: string;
    price?: string;
    datetime?: string;
  }[];
  guests: string[];
}
