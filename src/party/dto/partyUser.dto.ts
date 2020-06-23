export class PartyDto  {
  _id: string;
  members: number[];
  ownerId: number;
  limited: boolean;
  name: string;
  tracks: string[];
}

export enum RoleEnum {
  ROLE_ADMIN,
  ROLE_USER
}

export enum SubscriptionEnum {
  PRO,
  PREMIUM
}

export class UserDto {
  userId: number;
  email: string;
  authorities: RoleEnum[];
  subscription: SubscriptionEnum;
}


export class PartyUserDto {
  user: UserDto;
  party: PartyDto;
}



