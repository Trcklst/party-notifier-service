import { HttpService, Inject, Injectable } from '@nestjs/common';
import { CONNECTION_MODEL } from '../constants';
import { Connection } from './interface/connection.interface';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';

@Injectable()
export class NotifierService {
  constructor(
    private httpService: HttpService,
    @Inject(CONNECTION_MODEL) private connectionModel: Model<Connection>
  ) {}

  async findSocketIdByUserId(userId): Promise<Connection> {
    return this.connectionModel.findOne({userId: userId});
  }

  async removeConnection(userId): Promise<Connection> {
    return this.connectionModel.findOneAndRemove({userId: userId});
  }

  async connection(userId, client : Socket) {
/*    if(!token) {
      client.disconnect(true);
    }*/

    /*
    todo: check validity token
    const response = await this.httpService.post(configuration.services.authService + `check_token?token=${token}`).toPromise();
    const userId = response.data.client_id;

    if(!userId) {
      client.disconnect(true);
    }*/
    client["userId"] = userId;
    const update = {userId: userId, socketId: client.id};
    const options = {upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false};
    return this.connectionModel.findOneAndUpdate({ userId: userId }, update, options);
  }
}
