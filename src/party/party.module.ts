import { Module } from '@nestjs/common';
import { PartyController } from './party.controller';
import { NotifierModule } from '../notifier/notifier.module';

@Module({
  imports: [NotifierModule],
  controllers: [PartyController]
})
export class PartyModule {}
