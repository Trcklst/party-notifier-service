import { Controller } from '@nestjs/common';
import { NotifierGateway } from '../notifier/notifier.gateway';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { UploadDto } from './dto/upload.dto';
import { TrackDto } from './dto/track.dto';

@Controller('upload')
export class UploadController {

  constructor(
    private notifierGateway: NotifierGateway
  ) {}

  @MessagePattern('upload-error')
  public async partyDeleted(
    @Payload() trackDto: TrackDto,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    await this.notifierGateway.uploadError(trackDto);
    channel.ack(originalMessage);
  }

  @MessagePattern('progress-upload')
  public async progressUpload(
    @Payload() uploadDto: UploadDto,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    await this.notifierGateway.progressUpload(uploadDto);
    channel.ack(originalMessage);
  }

  @MessagePattern('uploaded')
  public async uploaded(
    @Payload() uploadDto: UploadDto,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    await this.notifierGateway.uploaded(uploadDto);
    channel.ack(originalMessage);
  }
}
