import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { NotifierGateway } from '../notifier/notifier.gateway';
import { PartyDto, PartyUserDto } from './dto/partyUser.dto';

@Controller('party')
export class PartyController {

  constructor(
    private notifierGateway: NotifierGateway
  ) {}


  @MessagePattern('party-deleted')
  public async partyDeleted(
    @Payload() partyDto: PartyDto,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    await this.notifierGateway.partyDeleted(partyDto);
    channel.ack(originalMessage);
  }

  @MessagePattern('party-joined')
  public async partyJoined(
    @Payload() partyUserDto: PartyUserDto,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    await this.notifierGateway.partyJoined(partyUserDto);
    channel.ack(originalMessage);
  }

  @MessagePattern('party-leaved')
  public async partyLeaved(
    @Payload() partyUserDto: PartyUserDto,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    await this.notifierGateway.partyLeaved(partyUserDto);
    channel.ack(originalMessage);
  }

  @MessagePattern('party-updated')
  public async partyUpdated(
    @Payload() partyDto: PartyDto,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    await this.notifierGateway.partyUpdated(partyDto);
    channel.ack(originalMessage);
  }
}
