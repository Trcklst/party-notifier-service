export class PartyDto  {
  _id: string;
  members: number[];
  ownerId: number;
  limited: boolean;
  name: string;
  tracks: string[];
}

export class PartyUserDto {
  userId: number;
  party: PartyDto;
}



