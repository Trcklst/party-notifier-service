import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import configuration from '../config/configuration';
import { NotifierService } from './notifier.service';
import { Server, Socket } from 'socket.io';
import { PartyActionDto, PartyDto, PartyUserDto } from '../party/dto/partyUser.dto';
import { TrackDto } from '../upload/dto/track.dto';
import { UploadDto } from '../upload/dto/upload.dto';

@WebSocketGateway(configuration.app.wsPort)
export class NotifierGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server : Server;

  constructor(
    private notifierService : NotifierService
  ) {}


  async handleConnection(client: Socket): Promise<any> {
    const token = client.handshake.query.token;
    await this.notifierService.connection(token, client);
  }

  async handleDisconnect(client: Socket): Promise<any> {
    await this.notifierService.removeConnection(client["user"]);
  }

  public async uploadError(trackDto: TrackDto) {
    const connection = await this.notifierService.findSocketIdByUserId(trackDto.userId);
    connection && connection.socketId ? this.server.sockets.connected[connection.socketId].emit('upload-error') : null;
  }

  public async progressUpload(uploadDto: UploadDto) {
    const connection = await this.notifierService.findSocketIdByUserId(uploadDto.userId);
    connection && connection.socketId ? this.server.sockets.connected[connection.socketId].emit('progress-upload', uploadDto) : null;
  }

  public async uploaded(uploadDto: UploadDto) {
    const connection = await this.notifierService.findSocketIdByUserId(uploadDto.userId);
    connection && connection.socketId ? this.server.sockets.connected[connection.socketId].emit('uploaded', uploadDto) : null;
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
    const connection = await this.notifierService.findSocketIdByUserId(partyUserDto.user.userId);
    if(!connection || !connection.socketId) {
      return;
    }

    const userSocket = this.server.sockets.connected[connection.socketId];
    if(!userSocket.rooms[partyUserDto.party._id]) {
      userSocket.join(partyUserDto.party._id);
    }
    this.server.to(partyUserDto.party._id).emit('member-joined', {party: partyUserDto.party, user: partyUserDto.user})
  }

  public async partyLeaved(partyUserDto: PartyUserDto) {
    const connection = await this.notifierService.findSocketIdByUserId(partyUserDto.user.userId);
    if(!connection || !connection.socketId) {
      return;
    }

    const userSocket = this.server.sockets.connected[connection.socketId];
    if(userSocket.rooms[partyUserDto.party._id]) {
      userSocket.leave(partyUserDto.party._id);
    }
    this.server.to(partyUserDto.party._id).emit('member-leaved', {party: partyUserDto.party, user: partyUserDto.user})
  }

  public partyUpdated(partyActionDto: PartyActionDto) {
    console.log('party-updated');
    this.server.to(partyActionDto.updatedParty._id).emit('party-updated', {party: partyActionDto.updatedParty, action: partyActionDto.action});
  }
}
