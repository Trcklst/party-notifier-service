import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { NotifierModule } from '../notifier/notifier.module';

@Module({
  imports: [NotifierModule],
  controllers: [UploadController]
})
export class UploadModule {}
