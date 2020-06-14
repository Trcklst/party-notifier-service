import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { PartyModule } from './party/party.module';
import { DatabaseModule } from './database/database.module';
import { NotifierModule } from './notifier/notifier.module';
import { NotifierGateway } from './notifier/notifier.gateway';

@Module({
  imports: [UploadModule, PartyModule, DatabaseModule, NotifierModule],
  providers: [NotifierGateway]
})
export class AppModule {}
