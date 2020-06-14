import { Connection } from 'mongoose';
import { DATABASE_CONNECTION, CONNECTION_MODEL } from '../../constants';
import { ConnectionSchema } from '../schema/connection.schema';
import { NotifierService } from '../notifier.service';

export const notifierProviders = [
  {
    provide: CONNECTION_MODEL,
    useFactory: (connection: Connection) => connection.model('Connection', ConnectionSchema),
    inject: [DATABASE_CONNECTION],
  },
  {
    provide: NotifierService,
    useClass: NotifierService
  }
];
