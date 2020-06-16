import { HttpService, Inject, Injectable } from '@nestjs/common';
import { CONNECTION_MODEL } from '../constants';
import { Connection } from './interface/connection.interface';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import configuration from '../config/configuration';

@Injectable()
export class NotifierService {
  constructor(
    private httpService: HttpService,
    @Inject(CONNECTION_MODEL) private connectionModel: Model<Connection>
  ) {}

  async findSocketIdByUserId(userId): Promise<Connection> {
    return this.connectionModel.findOne({userId: userId});
  }

  async removeConnection(user): Promise<Connection> {
    if(!user?.userId) {
      return null;
    }
    return this.connectionModel.findOneAndRemove({userId: user.userId});
  }

  async connection(token: string, client : Socket) {
    if(!token) {
      client.disconnect(true);
      return;
    }

    try {
      const response = await this.httpService.post(configuration.services.authService + `check_token?token=${token}`).toPromise();
      const user = response.data;
      client["user"] = user;

      const update = {userId: user.userId, socketId: client.id};
      const options = {upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false};
      return this.connectionModel.findOneAndUpdate({ userId: user.userId }, update, options);
    } catch (e) {
      client.disconnect(true);
      return;
    }
  }
}
