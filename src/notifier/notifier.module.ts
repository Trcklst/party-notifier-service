import { HttpModule, Module } from '@nestjs/common';
import { notifierProviders } from './provider/notifier.provider';
import { DatabaseModule } from '../database/database.module';
import { NotifierService } from './notifier.service';
import { NotifierGateway } from './notifier.gateway';

@Module({
  imports: [HttpModule, DatabaseModule],
  providers: [...notifierProviders, NotifierGateway],
  exports: [NotifierService, NotifierGateway]
})
export class NotifierModule {}
