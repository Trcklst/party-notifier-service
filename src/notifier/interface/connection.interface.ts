import { Document } from 'mongoose';

export interface Connection extends Document {
  userId: number;
  socketId: string;
}
