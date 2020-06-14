import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import configuration from '../config/configuration';
import { NotifierService } from './notifier.service';
import { Server, Socket } from 'socket.io';
import { PartyDto, PartyUserDto } from '../party/dto/partyUser.dto';
import { TrackDto } from '../upload/dto/track.dto';
import { UploadDto } from '../upload/dto/upload.dto';

@WebSocketGateway(configuration.app.wsPort)
export class NotifierGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server : Server;

  constructor(
    private notifierService : NotifierService
  ) {}


  async handleConnection(client: Socket): Promise<any> {
    const userId = client.handshake.query.userId;
    await this.notifierService.connection(userId, client);
  }

  async handleDisconnect(client: Socket): Promise<any> {
    await this.notifierService.removeConnection(client["userId"]);
  }

  public async uploadError(trackDto: TrackDto) {
    const connection = await this.notifierService.findSocketIdByUserId(trackDto.userId);
    this.server.sockets.connected[connection.socketId].emit('upload-error');
  }

  public async progressUpload(uploadDto: UploadDto) {
    const connection = await this.notifierService.findSocketIdByUserId(uploadDto.userId);
    this.server.sockets.connected[connection.socketId].emit('progress-upload', uploadDto);
  }

  public async uploaded(uploadDto: UploadDto) {
    const connection = await this.notifierService.findSocketIdByUserId(uploadDto.userId);
    this.server.sockets.connected[connection.socketId].emit('uploaded', uploadDto);
  }

  public async partyDeleted(partyDto: PartyDto) {
    this.server.to(partyDto._id).emit('party-deleted', {partyId: partyDto._id});
    this.server.in(partyDto._id).clients((error, clients) => {
      if(error) return;
      clients.forEach((socketId) => {
        this.server.sockets.connected[socketId].leave(partyDto._id);
      });
    });
  }

  public async partyJoined(partyUserDto: PartyUserDto) {
    const connection = await this.notifierService.findSocketIdByUserId(partyUserDto.userId);
    const userSocket = this.server.sockets.connected[connection.socketId];
    userSocket.join(partyUserDto.party._id);
    this.server.to(partyUserDto.party._id).emit('members-updated', {count: partyUserDto.party.members.length})
  }

  public async partyLeaved(partyUserDto: PartyUserDto) {
    const connection = await this.notifierService.findSocketIdByUserId(partyUserDto.userId);
    const userSocket = this.server.sockets.connected[connection.socketId];
    userSocket.leave(partyUserDto.party._id);
    this.server.to(partyUserDto.party._id).emit('members-updated', {count: partyUserDto.party.members.length})
  }

  public partyUpdated(partyDto: PartyDto) {
    this.server.to(partyDto._id).emit('party-updated', {party: partyDto});
  }
}
