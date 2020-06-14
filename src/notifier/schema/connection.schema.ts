import * as mongoose from 'mongoose';

export const ConnectionSchema = new mongoose.Schema({
  userId: Number,
  socketId: String,
});
